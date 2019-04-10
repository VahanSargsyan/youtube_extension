
window.yCPQueue = [];
chrome.runtime.onMessage.addListener(function(msg, sender, resp) {
    if (msg.type === "init") {
      console.log('==========>Initialization message<===========', msg);
      msg.tabId = sender.tab.id;
      yCPQueue.push(msg);
      chrome.runtime.sendMessage({type: 'reInit'});
      console.log(yCPQueue);
      
    } else if (msg.type === "remove") {
      const tabId = sender.tab.id;
      for (let i = 0; i < yCPQueue.length; i++) {
        if (yCPQueue[i].tabId == tabId) {
          yCPQueue[i] = null
          break;
        }
      }
    }
  });