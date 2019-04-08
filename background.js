window.yCPQueue = [];
chrome.runtime.onMessage.addListener(function(msg, sender, resp) {
  console.log(sender);
  
  if (msg.type === "init") {
    console.log(sender);
    msg.tabId = sender.tab.id;
    window.yCPQueue.push(msg);
  } else if (msg.type === "update") {
    console.log("bg update", msg);

    const tabId = sender.tab.id;
    for (let i = 0; i < yCPQueue.length; i++) {
      if (yCPQueue[i].tabId == tabId) {
        yCPQueue[i] = Object.assign(yCPQueue[i], msg);
        console.log(yCPQueue);
      }
    }
  }
});
