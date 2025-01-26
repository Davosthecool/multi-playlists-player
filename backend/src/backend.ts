import { BaseDAO } from "./DAOs/baseDAO";
import { authListener } from "./Listeners/authListener";
import { dataListener } from "./Listeners/dataListener";
import { eventsListener } from "./Listeners/eventsListener";
import { storageListener } from "./Listeners/storageListener";


var dao : BaseDAO | null

chrome.runtime.onInstalled.addListener(() => {
  console.log("[ServiceWorker] Extension installed!");
});

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
	console.log("[ServiceWorker] Message received :", message);
});

chrome.runtime.onMessage.addListener(authListener);

chrome.runtime.onMessage.addListener(dataListener);

chrome.runtime.onMessage.addListener(eventsListener);

chrome.storage.onChanged.addListener(storageListener);