console.log("background", chrome);

chrome.browserAction.onClicked.addListener(clickHandler);
function clickHandler(tab) {
  chrome.tabs.sendMessage(tab.id, {command: "play"})
}
