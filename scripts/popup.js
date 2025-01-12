


document.getElementById("disconnect-button").addEventListener("click", function() { disconnectFromBackground() } );


function disconnectFromBackground() {
  chrome.runtime.sendMessage({ action: "disconnect"});
}

document.addEventListener("DOMContentLoaded", () => {

});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Message received:", message);

  if (message.action === "changePopup") {
    window.location.href = chrome.runtime.getURL(`pages/${message.popupName}.html`)
  }

  return true;   
});