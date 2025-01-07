const CLIENT_ID = "dff841289c504ae68da0e96bccf3e7e0";
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`;
const AUTH_URL = `https://accounts.spotify.com/authorize`;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

async function authenticate() {
  const authParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "token",
    redirect_uri: REDIRECT_URI,
    scope: "user-read-private user-read-email playlist-read-private"
  });

  const url = `${AUTH_URL}?${authParams.toString()}`;
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: url,
        interactive: true
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          const token = new URL(redirectUrl).hash
            .substring(1)
            .split("&")
            .find((param) => param.startsWith("access_token"))
            ?.split("=")[1];
          resolve(token);
        }
      }
    );
  });
}

function getStoredToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("accessToken", (data) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(data.accessToken || null);
        });
    });
}

function saveToken(token) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ accessToken: token }, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}



chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Message received:", message);

    if (message.action === "authenticate") {
        try {
            const token = await getStoredToken();

            if (token) {
                console.log("Token found:", token);
                sendResponse({ success: true, token: token });
            } else {
                console.log("No token found. Authenticating...");
                const newToken = await authenticate();
                sendResponse({ success: true, token: newToken });
            }
        } catch (error) {
            console.error("Error during authentication:", error);
            sendResponse({ success: false, error: error.message });
        }

        return true;
    }
});
