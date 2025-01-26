export function storageListener(changes: any, areaName: string){
    if (areaName === 'local') {
      for (const key in changes) {
        const change = changes[key];
        console.log(`[storageListener] La clé ${key} a changé dans chrome.storage.`);
  
        if (key === 'accessTokenObject') {
          var popupName = change.newValue ? "popup" : "connection";
          console.log("[storageListener] Send message to change popup for page: " + popupName)
          chrome.runtime.sendMessage({ action: 'changePopup', popupName: popupName});
        }
      }
    }
};