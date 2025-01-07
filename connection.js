document.getElementById("spotify-button").addEventListener("click", connect_to_spotify);

async function connect_to_spotify() {
    try {
      const token = await authenticateFromBackground();
      console.log("Access token received:", token);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
}

function authenticateFromBackground() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "authenticate" }, (response) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError.message);
        }
        if (response.success) {
          resolve(response.token);
        } else {
          reject(response.error);
        }
      });
    });
}