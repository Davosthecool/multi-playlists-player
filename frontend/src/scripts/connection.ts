export function authenticateFromBackground(serviceName: string) {
  return new Promise((_resolve, _reject) => {
    chrome.runtime.sendMessage({ action: "authenticate", service: serviceName }, (_) => {
      if (chrome.runtime.lastError) {
        console.error("Erreur chrome.runtime:", chrome.runtime.lastError.message);
      }
    });
  });
}

export function disconnectFromBackground() {
  return new Promise((_resolve, _reject) => {
    chrome.runtime.sendMessage({ action: "disconnect"}, (_) => {
      if (chrome.runtime.lastError) {
        console.error("Erreur chrome.runtime:", chrome.runtime.lastError.message);
      }
    });
  });
}