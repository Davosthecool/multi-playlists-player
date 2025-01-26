import { BaseDAO, TokenObject } from "../DAOs/baseDAO";
import { DAOFactory } from "../DAOs/factoryDAO";

class MessageObject {
    public constructor(
        public action: string,
        public service: string
    ){}
}

export async function authListener(message: MessageObject, _sender: any, sendResponse : (response?: any) => void ) {

    if (message.action === "connect") {
        await BaseDAO.getStoredToken()
            .then( (tokenObject) => {
                var object = tokenObject as TokenObject;
                console.log("[authListener] Found token already stored", object);
                sendResponse({ success: true, result: {token: object.access_token, service: object.service } })
                chrome.runtime.sendMessage({ action: 'changePopup', popupName: "popup"});
            })
            .catch( (err) => {
                console.log("[authListener] Connection error: " + err)
                sendResponse({ success: false, error: err });
                chrome.runtime.sendMessage({ action: 'changePopup', popupName: "connection"});
            });
    }

    if (message.action === "authenticate") {
        const dao = DAOFactory.getDaoFromServiceName(message.service);
        if (!dao) { 
            return sendResponse({ success: false, error: "No service found with the given service name: " + message.service });
        }

        await dao.authenticate()
            .then((tokenObject) => {
                var object = tokenObject as TokenObject;
                console.log("[authListener] Authentication successful", object);
                
                BaseDAO.saveToken(object, message.service)
                    .then( () => console.log("[authListener] Token saved", object))
                    .catch( (error) => console.log("[authListener] Error while saving token: " + error));

                sendResponse({ success: true, result: object.access_token });
            })
            .catch((error) => {
                console.log("[authListener] Error on Authentication:", error);
                sendResponse({ success: false, error: error });
            });
    }

    if (message.action === "disconnect") {
        await BaseDAO.deleteStoredToken()
    }

    return true;   
}