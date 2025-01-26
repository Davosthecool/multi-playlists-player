export class TokenObject {

	public constructor( 
		public access_token: string,
        public service: string
	){}
}

export class PlaylistObject{
    
    public constructor(
        public id: string,
        public name: string,
        public owner: string,
        public imageUrl?: string,
    ){}
}

export class PlaylistTrack {
    public constructor(
        public id: string,
        public name: string,
        public duration: number,
        public artists?: string[],
    ) {}
}

export abstract class BaseDAO {
    static serviceName: string

    static saveToken(token: TokenObject, serviceName: string) : Promise<void> {
      token.service = serviceName;
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ accessTokenObject: token }, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    }
    
    static getStoredToken() : Promise<TokenObject> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get("accessTokenObject", (data) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                if (!data || !data.accessTokenObject) {
                  return reject("No access token found.")
                }
                resolve(data.accessTokenObject);
            });
        });
    }
    
    static deleteStoredToken() : Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove("accessTokenObject", () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    }

    public abstract authenticate() : Promise<TokenObject>
    public abstract getUserPlaylists() : Promise<PlaylistObject[]>

    public abstract getPlaylistTracks(playlist_id: string) : Promise<PlaylistTrack[]>
}