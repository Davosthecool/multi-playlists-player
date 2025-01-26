import { DAOFactory } from "../DAOs/factoryDAO";

class MessageObject {
    public constructor(
        public action: string,
    ){}
}

export function dataListener(message: MessageObject, _sender: any, sendResponse : (response?: any) => void ) {

    if (message.action === "user_playlists") {
        DAOFactory.getDaoFromStorage()
        .then( (dao) => {
            dao.getUserPlaylists()
            .then( (playlists) => {
                console.log(`[dataListener] ${playlists.length} playlists founded`);
                sendResponse({ success: true, result: playlists });
            })
            .catch( (error) => {
                console.log(`[dataListener] error on getting playlists: ${error}`)
                sendResponse({ success: false, error: error });
            })
            
        })
        .catch( (err) => {
            console.log(`[dataListener] error on getting DAO: ${err}`)
            sendResponse({ success: false, error: err });
        });

    }

    return true;   
}