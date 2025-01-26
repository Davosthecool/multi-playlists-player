export class PlaylistObject{
    public constructor(
        public id: string,
        public name: string,
        public owner: string,
        public imageUrl: string,
    ){}
}


export function getUserPlaylistsFromBackground() {
    return new Promise<Array<PlaylistObject>>( (resolve, reject) => {
        chrome.runtime.sendMessage({ action: "user_playlists"}, ( response ) => {
            if (chrome.runtime.lastError) {
                console.error("Erreur chrome.runtime:", chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message)
                return
            }
            if (!response || response.success==false) {
                console.error("Erreur à la récupération des playlists: " + response?.error);
                reject(response?.error)
                return
            }
            const playlists = (response.result as PlaylistObject[]).map(
                (item) => new PlaylistObject(item.id, item.name, item.owner, item.imageUrl ?? "")
            );
            resolve(playlists);

        });
    });
}
