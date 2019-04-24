window.yCPQueue = [];
chrome.runtime.onMessage.addListener(function(msg, sender, resp) {
  if (msg.type === "init") {
    msg.tabId = sender.tab.id;
    yCPQueue.push(msg);
    chrome.runtime.sendMessage({ type: "reInit" });
  } else if (msg.type === "remove") {
    const tabId = sender.tab.id;
    for (let i = 0; i < yCPQueue.length; i++) {
      if (yCPQueue[i] && yCPQueue[i].tabId == tabId) {
        yCPQueue[i] = null;
        chrome.runtime.sendMessage({ type: "reInit" });
        break;
      }
    }
  } else if(msg.type === 'change') {
    const tabId = sender.tab.id;
    for (let i = 0; i < yCPQueue.length; i++) {
      if (yCPQueue[i] && yCPQueue[i].tabId == tabId) {
        msg.tabId = sender.tab.id;
        yCPQueue[i] = msg;
        chrome.runtime.sendMessage({ type: "reInit" });
        break;
      }
    }
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // console.log('\n====>tabId<==== \n', tabId, '\n====>changeInfo<==== \n', changeInfo, '\n====>tab<==== \n', tab);
  if(changeInfo.title) {
    console.log('title change to : ', changeInfo.title);
    
    chrome.tabs.sendMessage(+tabId, { command: "resendData"});
  }
});

