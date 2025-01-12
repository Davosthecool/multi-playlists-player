document.getElementById("connection-spotify-button").addEventListener("click", function() { authenticateFromBackground("spotify")} );
document.getElementById("connection-deezer-button").addEventListener("click", function() { authenticateFromBackground("deezer")} );
document.getElementById("connection-apple-button").addEventListener("click", function() { authenticateFromBackground("apple")} );
document.getElementById("connection-youtube-button").addEventListener("click", function() { authenticateFromBackground("youtube")} );



function connectFromBackground() {
    chrome.runtime.sendMessage({ action: "connect"});
}

function authenticateFromBackground(serviceName) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "authenticate", service: serviceName }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Erreur chrome.runtime:", chrome.runtime.lastError.message);
      }
    });
  });
}




document.addEventListener("DOMContentLoaded", () => {
  connectFromBackground();
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Message received:", message);

  if (message.action === "changePopup") {
    window.location.href = chrome.runtime.getURL(`pages/${message.popupName}.html`)
  }

  return true;   
});