import { BaseDAO } from "./baseDAO"
import { SpotifyDAO } from "./spotifyDAO"



export class DAOFactory {
    static getDaoFromServiceName(name: string): BaseDAO | null {
        switch (name){
            case "spotify": return new SpotifyDAO
            default : {
                console.log("No Service found for this service name: " + name)
                return null
            } 
        }
    }

    static async getDaoFromStorage() : Promise<BaseDAO>{
        return new Promise((resolve, reject) => {
            BaseDAO.getStoredToken()
            .then((token) => {
                const dao = this.getDaoFromServiceName(token.service)
                if (dao) { resolve(dao) }
                else {reject(" No dao found for this service name: " + token.service)}
            })
            .catch((err) => {
                reject("No Token found in storage")
            })
        })
    }
}