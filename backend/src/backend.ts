const CLIENT_ID = "dff841289c504ae68da0e96bccf3e7e0";
const RESPONSE_TYPE = "token";
const STATE = "test";
const SCOPE = "user-read-private user-read-email playlist-read-private";
const SHOW_DIALOG = "true"

const AUTH_URLS : { [service: string] : string } = {
  spotify: `https://accounts.spotify.com/authorize`,
}

class TokenObject {

	public constructor( 
		public access_token: string,
		public token_type: string,
		public expires_in: number,
		public state?: string,
		public service?: string,
	){}
}







function getAuthUrlData(url: string) {
  const params: { [key:string] : string } = {};
  const dataString = new URL(url).hash.replace("#", "")
  const data = new URLSearchParams(dataString);
  data.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

async function authenticate(serviceName: string) {
	var redirect_uri = chrome.identity.getRedirectURL(`${serviceName}/`)
	console.log("Service name: " + serviceName);
	console.log("Redirect to: " + redirect_uri);
	const authParams = new URLSearchParams({
		client_id: CLIENT_ID,
		response_type: RESPONSE_TYPE,
		redirect_uri: redirect_uri,
		scope: SCOPE,
		state: STATE,
		show_dialog: SHOW_DIALOG,
	});

	const url = `${AUTH_URLS[serviceName]}?${authParams.toString()}`;
	console.log("Service Authentication url: " + url);
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
				if (redirectUrl.includes(`${serviceName}/?error=access_denied`)) {
					return reject("Access denied by user.");
				}
				resolve(getAuthUrlData(redirectUrl));
			}
		);
	});

}

function saveToken(token: TokenObject, serviceName: string) : Promise<void> {
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

function getStoredToken() {
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

function deleteStoredToken() : Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove("accessTokenObject", () => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        resolve();
    });
});
}






chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	console.log("Message received:", message);

	if (message.action === "connect") {
		await getStoredToken()
			.then( (tokenObject) => {
				var object = tokenObject as TokenObject;
				console.log("Found token already stored", object);
				sendResponse({ success: true, result: {token: object.access_token, service: object.service } })
				chrome.runtime.sendMessage({ action: 'changePopup', popupName: "popup"});
			})
			.catch( (err) => {
				console.log("Connection error: " + err)
				sendResponse({ success: false, error: err });
				chrome.runtime.sendMessage({ action: 'changePopup', popupName: "connection"});
			});
	}

	if (message.action === "authenticate") {

		await authenticate(message.service)
			.then((tokenObject) => {
				var object = tokenObject as TokenObject;
				console.log("Authentication successful", object);
				saveToken(object, message.service)
					.then( () => console.log("Token saved", object))
					.catch( (error) => console.log("Error while saving token: " + error));

				sendResponse({ success: true, result: object.access_token });
			})
			.catch((error) => {
				console.log("Error on Authentication:", error);
				sendResponse({ success: false, error: error });
			});
	}

	if (message.action === "disconnect") {
		await deleteStoredToken()
	}

	return true;   
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    for (const key in changes) {
      const change = changes[key];
      console.log(`La clé ${key} a changé dans chrome.storage.`);

      if (key === 'accessTokenObject') {
        var popupName = change.newValue ? "popup" : "connection";
        console.log("Send message to change popup for page: " + popupName)
        chrome.runtime.sendMessage({ action: 'changePopup', popupName: popupName});
      }
    }
  }
});