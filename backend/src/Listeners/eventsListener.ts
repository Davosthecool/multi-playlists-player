import { DAOFactory } from "../DAOs/factoryDAO";

class MessageObject {
    public constructor(
        public action: string,
        public playlist_id: string
    ){}
}

export async function eventsListener(message: MessageObject, _sender: any, sendResponse : (response?: any) => void ) {

    if (message.action === "playlist_clicked") {
        await DAOFactory.getDaoFromStorage()
        .then( async (dao) => {
            var tracks = await dao.getPlaylistTracks(message.playlist_id)
            console.log(`[eventsListener] ${tracks.length} tracks founded`);
            chrome.runtime.sendMessage({action: "show_playlist_tracks", tracks:tracks})
        })
        

    }

    return true;   
}