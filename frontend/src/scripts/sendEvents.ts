export function sendPlaylistClickedEvent(playlist_id: string) {
    chrome.runtime.sendMessage({ action: "playlist_clicked", playlist_id:playlist_id});
}
