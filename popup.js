window.yCPQueue = chrome.extension.getBackgroundPage().yCPQueue;
window.updates = true;
const container = document.querySelector("#card-container");

function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
function playHandeler(e) {
  const parent = e.target.parentElement;
  const tabId = parent.id;
  chrome.tabs.sendMessage(+tabId, { command: "play" });
}

function pauseHandeler(e) {
  const parent = e.target.parentElement;
  const tabId = parent.id;
  chrome.tabs.sendMessage(+tabId, { command: "pause" });
}

function seekHandler(e) {
  const parent = e.target.parentElement;
  const tabId = parent.id;
  const value = e.target.value;
  console.log('===>seeked<===');
  
  chrome.tabs.sendMessage(+tabId, { command: "seekTo", value: +value });
}
function volumeHandler(e) {
  const parent = e.target.parentElement;
  const tabId = parent.id;
  const value = e.target.value;
  chrome.tabs.sendMessage(+tabId, { command: "setVolume", value: +value });
}
function cardMaker(vdData) {
  if (vdData === null) {
    return;
  }
  const card = document.createElement("div");
  setAttributes(card, {
    class: "card",
    id: vdData.tabId
  });

  const title = document.createElement("h3");
  title.innerText = vdData.title.slice(0, -10);

  const seek = document.createElement("input");
  setAttributes(seek, {
    min: 0,
    max: vdData.duration,
    value: vdData.currentTime,
    type: "range",
    class: "seek"
  });
  seek.addEventListener("change", seekHandler);

  const play = document.createElement("input");
  setAttributes(play, {
    type: "button",
    value: "|>",
    class: "control-btn play"
  });
  play.addEventListener("click", playHandeler);

  const pause = document.createElement("input");
  setAttributes(pause, {
    type: "button",
    value: "| |",
    class: "control-btn pause"
  });
  pause.addEventListener("click", pauseHandeler);

  const volume = document.createElement("input");
  setAttributes(volume, {
    min: 0,
    max: 100,
    value: Math.floor(vdData.volume * 100),
    type: "range",
    class: "volume"
  });
  volume.addEventListener("change", volumeHandler);
  const timer = document.createElement("span");
  timer.innerText = vdData.timer.join("/");

  card.appendChild(title);
  card.appendChild(seek);
  card.appendChild(play);
  card.appendChild(pause);
  card.appendChild(volume);
  card.appendChild(timer);

  container.appendChild(card);
}
function init() {
  container.innerHTML = "";
  yCPQueue.forEach(video => {
    cardMaker(video);
  });
}
chrome.runtime.onMessage.addListener(function(msg, sender, resp) {
  if (msg.type === "update") {
    updates = true;
    const tabId = sender.tab.id;
    for (let i = 0; i < yCPQueue.length; i++) {
      if (yCPQueue[i].tabId == tabId) {
        yCPQueue[i] = Object.assign(yCPQueue[i], msg);
        init();
        break;
      }
    }
  } else if (msg.type === "reInit") {
    yCPQueue = chrome.extension.getBackgroundPage().yCPQueue;
    init();
  }
});
init();





