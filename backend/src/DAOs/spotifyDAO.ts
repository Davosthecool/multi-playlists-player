import { BaseDAO, TokenObject, PlaylistObject } from "./baseDAO"

class SpotifyTokenObject extends TokenObject{

    public constructor( 
        public access_token: string,
        public expires_in: number,
        public token_type?: string,
        public state?: string,
    ){
        super(access_token,"spotify");
    }
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

export class SpotifyDAO extends BaseDAO{

    static serviceName = "spotify";
    
    private API_ENDPOINT = "https://api.spotify.com/v1/"
    private AUTH_URL = `https://accounts.spotify.com/authorize`
    private authParameters : {[k: string]: string} = {
        client_id : "dff841289c504ae68da0e96bccf3e7e0",
        response_type : "token",
        state : "test",
        scope : "user-read-private user-read-email playlist-read-private",
        show_dialog : "true",
    }
    

    private getAuthUrlData(url: string) {
        const params: { [key:string] : string } = {};
        const dataString = new URL(url).hash.replace("#", "")
        const data = new URLSearchParams(dataString);
        data.forEach((value, key) => {
            params[key] = value;
        });

        const access_token = params["access_token"];
        const token_type = params["token_type"];
        const expires_in = parseInt(params["expires_in"], 10);
        const state = params["state"];

        return new SpotifyTokenObject(access_token, expires_in, token_type, state);

    }

    public async authenticate(): Promise<SpotifyTokenObject> {
        this.authParameters['redirect_uri'] = chrome.identity.getRedirectURL(`spotify/`);
        var params = this.authParameters
        const authParams = new URLSearchParams(params);
        console.log("[SpotifyDAO] Params for Authentication: " + params.toString())
        const url = `${this.AUTH_URL}?${authParams.toString()}`;
        console.log("[SpotifyDAO] Service Authentication url: " + url);
        return new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow(
                { url: url, interactive: true },
                (redirectUrl) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError.message);
                    }
                    if (!redirectUrl) {
                        return reject("No redirect URL received.");
                    }
                    if (redirectUrl.includes(`spotify/?error=access_denied`)) {
                        return reject("Access denied by user.");
                    }
                    resolve(this.getAuthUrlData(redirectUrl));
                }
            );
        });
    }


    private async fetchApiRequest(sub_url: string) : Promise<any>{
        return new Promise( async (resolve, reject) => {
            await BaseDAO.getStoredToken()
            .then( async (accessToken) => { 
                await fetch(this.API_ENDPOINT+sub_url, {
                    headers: { 'Authorization': 'Bearer ' + accessToken.access_token  },
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





}