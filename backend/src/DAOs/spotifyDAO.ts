import { BaseDAO, TokenObject, PlaylistObject, PlaylistTrack } from "./baseDAO"

class SpotifyTokenObject extends TokenObject{

    expire_date : number
    public constructor( 
        public access_token: string,
        public refresh_token: string,
        expires_in: number,
        public token_type?: string,
        public state?: string,
    ){
        super(access_token,"spotify");
        this.expire_date = Date.now() + (expires_in*1000)
    }
}

class SpotifyAuthCodeObject{

    public constructor( 
        public auth_code: string,
        public state: string
    ){}
}

class SpotifyPlaylistObject extends PlaylistObject{
    
    public constructor(
        public id: string,
        public name: string,
        public owner: string,
        public imageUrl?: string,
    ){
        super(id,name,owner,imageUrl)
    }
}

class SpotifyPlaylistTrack extends PlaylistTrack {
    public constructor(
        public id: string,
        public name: string,
        public addedBy: string,
        public duration: number,
        public popularity: number,
        public explicit: boolean,
        public album: string,
        public imageUrl?: string,
        public artists?: string[],
    ) {
        super(id, name, duration, artists);
    }
}

export class SpotifyDAO extends BaseDAO{

    static serviceName = "spotify";
    
    private CLIENT_ID = "dff841289c504ae68da0e96bccf3e7e0";
    private CLIENT_SECRET = "c109999f2eef4460b1f5b6d1ff7ad653";

    private API_ENDPOINT = "https://api.spotify.com/v1/"
    private AUTH_URL = `https://accounts.spotify.com/authorize`
    private REDIRECT_URL = chrome.identity.getRedirectURL(`spotify/`)

    private authParameters : {[k: string]: string} = {
        client_id : this.CLIENT_ID,
        redirect_uri : this.REDIRECT_URL,
        response_type : "code",
        state : "test",
        scope : "user-read-private user-read-email playlist-read-private",
        show_dialog : "true",
    }

    private getAuthCodeFromUrlData(url: string) {
        const params = new URL(url).searchParams
        const auth_code = params.get("code") ?? "";
        const state = params.get("state") ?? "";

        return new SpotifyAuthCodeObject(auth_code, state);
    }


    private async getAuthTokenFromResponse(response: Response): Promise<SpotifyTokenObject | null> {
        if (!response.body) { return null; }
    
        try {
            const data = await response.json();
    
            if (!data.access_token || !data.token_type || !data.expires_in) {
                return null;
            }
    
            const access_token = data["access_token"];
            const refresh_token = data["refresh_token"];
            const token_type = data["token_type"];
            const expires_in = parseInt(data["expires_in"], 10);
            const state = data["state"] || "";
    
            return new SpotifyTokenObject(access_token, refresh_token, expires_in, token_type, state);
    
        } catch (error) {
            throw error;
        }
    }

    public async authenticate(): Promise<SpotifyTokenObject> {
        const authParams = new URLSearchParams(this.authParameters);
        console.log("[SpotifyDAO] Params for Authentication: ", this.authParameters)
        const url = `${this.AUTH_URL}?${authParams.toString()}`;
        console.log("[SpotifyDAO] Service Authentication url: " + url);
        return new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow(
                { url: url, interactive: true },
                async (redirectUrl) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError.message);
                    }
                    if (!redirectUrl) {
                        return reject("No redirect URL received.");
                    }
                    if (redirectUrl.includes(`spotify/?error=access_denied`)) {
                        return reject("Access denied by user.");
                    }
                    console.log("[SpotifyDAO] redirectUrl: ", redirectUrl);
                    var codeObject = this.getAuthCodeFromUrlData(redirectUrl);
                    console.log("[SpotifyDAO] Auth code getted: ", codeObject);
                    var bodyParams = new URLSearchParams({
                        code: codeObject.auth_code,
                        redirect_uri: this.REDIRECT_URL,
                        grant_type: 'authorization_code'
                    })
                    var encodeddata = btoa(this.CLIENT_ID + ':' + this.CLIENT_SECRET)
                    var response = await fetch(`https://accounts.spotify.com/api/token?${bodyParams.toString()}`, {
                        method: 'POST',
                        headers: { 
                            'Authorization': `Basic ${encodeddata}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                    })

                    var tokenObject = await this.getAuthTokenFromResponse(response)
                    if (tokenObject == null) {
                        return reject("Error on getting auth token")
                    }
                    resolve(tokenObject);
                }
            );
        });
    }

    private async refreshToken(token: string) : Promise<SpotifyTokenObject> {
        var bodyParams = new URLSearchParams({
            refresh_token: token,
            grant_type: 'refresh_token'
        })
        var encodeddata = btoa(this.CLIENT_ID + ':' + this.CLIENT_SECRET)
        var response = await fetch(
            `https://accounts.spotify.com/api/token?${bodyParams.toString()}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodeddata}` },
        })

        var accessToken = await (response.json())
        var tokenObject = new SpotifyTokenObject(
            accessToken.access_token,
            accessToken.refresh_token,
            accessToken.expires_in,
            accessToken.token_type,
            accessToken.state
        )

        BaseDAO.saveToken(tokenObject,SpotifyDAO.serviceName)
        return accessToken
    }


    private async fetchApiRequest(sub_url: string) : Promise<any>{
        return new Promise( async (resolve, reject) => {
            await BaseDAO.getStoredToken()
            .then( async (accessToken) => {
                var token = accessToken as SpotifyTokenObject
                if ( !token.expire_date || Date.now() >= token.expire_date ){
                    console.log("[SpotifyDAO] Access token expired")
                    token = await this.refreshToken(token.refresh_token)
                    console.log("[SpotifyDAO] New token getted: ", token)
                }
                await fetch(this.API_ENDPOINT+sub_url, {
                    headers: { 'Authorization': 'Bearer ' + token.access_token  },
                })
                .then(response => { 
                    response.json()
                    .then( data => { 
                        resolve(data); 
                    }); 
                })
                .catch(error => { reject(error); });
            })
            .catch(error => { reject(error); });
        })
    
            

    }

    public async getUserPlaylists() : Promise<SpotifyPlaylistObject[]> {
        return new Promise( async (resolve, reject) => {
            await this.fetchApiRequest('me/playlists')
            .then(data => {
                if (!data || !data.items || !Array.isArray(data.items)) {
                    reject(`Error while fetching playlists`);
                }
            
        
                const playlists: SpotifyPlaylistObject[] = data.items.map((playlist: any) => {
                    const id = playlist.id;
                    const name = playlist.name;
                    const owner = playlist.owner.display_name;
                    const image = playlist.images?.[0]?.url;
            
                    return new SpotifyPlaylistObject(id, name, owner, image);
                });
            
                resolve(playlists);
            })
            .catch((err) => {
                reject(err)
            })


        })
    }

    public async getPlaylistTracks(playlist_id: string) : Promise<SpotifyPlaylistTrack[]> {
        return new Promise( async (resolve, reject) => {
            await this.fetchApiRequest(`playlists/${playlist_id}/tracks`)
            .then(data => {
                if (!data || !data.items || !Array.isArray(data.items)) {
                    reject(`Error while fetching playlist tracks`);
                }

                const tracks: SpotifyPlaylistTrack[] = data.items.map((trackData: any) => {
                    const id = trackData.track?.id;
                    const name = trackData.track?.name;
                    const addedBy = trackData.added_by?.external_urls?.spotify || "Unknown";
                    const duration = trackData.track?.duration_ms;
                    const popularity = trackData.track?.popularity;
                    const explicit = trackData.track?.explicit;
                    const albumName = trackData.track?.album?.name;
                    const image = trackData.track?.album?.images?.[0]?.url;
                    const artists = trackData.track?.artists?.map((artist: any) => artist.name);
                
                    return new SpotifyPlaylistTrack(id, name, addedBy, duration, popularity, explicit, albumName, image, artists);
                });

                resolve(tracks);
            })
            .catch((err) => {
                reject(err)
            })


        })
    }




}