import { createApp, type App, type Component } from 'vue'
import './style.css'
import Popup from './views/Popup.vue'
import Connection from './views/Connection.vue'

let appInstance: App<Element> | null;

function mountApp(appClass: Component) {
    unmountApp();
    appInstance = createApp(appClass);
    appInstance.mount('#app');
}

function unmountApp() {
    if (appInstance) {
        appInstance.unmount();
        appInstance = null;
    }
}

function connectFromBackground() {
    chrome.runtime.sendMessage({ action: "connect"});
}

document.addEventListener("DOMContentLoaded", () => {
    connectFromBackground();
  });

chrome.runtime.onMessage.addListener(async (message, _sender, _sendResponse) => {
    console.log("Message received:", message);
    if (message.action === "changePopup") {
      var appToMount = message.popupName=="connection" ? Connection : Popup
      mountApp(appToMount)
    }
  
    return true;   
  });