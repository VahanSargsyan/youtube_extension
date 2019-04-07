console.log("popup.js");
let bgPage = chrome.extension.getBackgroundPage();
const container = document.querySelector("#card-container");
const updateRequestSender = setInterval(function() {
  console.log("bgPage.haveupdate", bgPage.haveupdate);
  bgPage = chrome.extension.getBackgroundPage();
  // if (bgPage.haveupdate) {
  //   bgPage.haveupdate = false;
  container.innerHTML = "";
  bgPage.yCPQueue.forEach(video => {
    cardMaker(video);
  });
  // }
}, 500);

bgPage.yCPQueue.forEach(video => {
  cardMaker(video);
});

function cardMaker(vdData) {
  const card = document.createElement("div");
  setAttributes(card, {
    className: "card",
    id: vdData.tabId
  });

  const title = document.createElement("h3");
  title.innerText = vdData.title;

  const seek = document.createElement("input");
  setAttributes(seek, {
    min: 0,
    max: vdData.duration,
    value: vdData.currentTime,
    type: "range",
    class: "seek"
  });

  const play = document.createElement("input");
  setAttributes(play, {
    type: "button",
    value: "|>",
    class: "control-btn play"
  });

  const pause = document.createElement("input");
  setAttributes(pause, {
    type: "button",
    value: "| |",
    class: "control-btn pause"
  });

  const volume = document.createElement("input");
  setAttributes(volume, {
    min: 0,
    max: 100,
    value: vdData.volume,
    type: "range",
    class: "volume"
  });

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

function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
