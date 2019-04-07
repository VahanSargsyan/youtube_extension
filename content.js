console.log("yeeeeehhhh!!!");
window.onload = function() {
  const title = document.querySelector("title");
  const vi = document.querySelector("video");

  window.yControlPanel = (function() {
    const duration = vi.duration;

    function secToMin(sec) {
      const secs = Math.floor(sec % 60);
      const mins = Math.floor(sec / 60);
      return mins + ":" + secs;
    }
    function play() {
      vi.play();
    }
    function pause() {
      vi.pause();
    }
    function getMiniPlayer() {
      return;
    }
    function seekTo(sec) {
      if (sec <= duration && sec >= 0) {
        vi.currentTime = sec;
      } else {
        throw new Error("seeked range unavalible");
      }
    }
    function getVolume() {
      return vi.volume;
    }
    function getDuration() {
      return duration;
    }
    function getTimer() {
      return [secToMin(vi.currentTime), secToMin(duration)];
    }

    return {
      play: play,
      pause: pause,
      seekTo: seekTo,
      getTimer: getTimer,
      getVolume: getVolume,
      getDuration: getDuration
    };
  })();

  const videoData = {
    type: "init",
    title: title ? title.innerHTML : "some-random song",
    duration: window.yControlPanel.getDuration(),
    volume: window.yControlPanel.getVolume()
  };
  chrome.runtime.sendMessage(videoData);

  chrome.runtime.onMessage.addListener(messageHendler);
  function messageHendler(msg, sender, sendRespnce) {
    if (msg.command === "play") {
      window.yControlPanel.play();
    }
  }
  updater(vi, function(data) {
    chrome.runtime.sendMessage(data);
  });
};
function updater(video, cB) {
  const updateMsg = {
    type: "update",
    state: null,
    volume: null,
    currentTime: null,
    timer: []
  };
  let sender = setInterval(cB, 1000, updateMsg);
  let timer = setInterval(function() {
    updateMsg.currentTime = video.currentTime;
    updateMsg.timer = yControlPanel.getTimer();
  }, 1000);
  video.addEventListener("seeked", function name(e) {
    updateMsg.currentTime = e.target.currentTime;
  });
  video.addEventListener("volumechange", function name(e) {
    updateMsg.volume = e.target.volume;
  });
  video.addEventListener("play", function name(e) {
    updateMsg.state = "play";
    cB(updateMsg);
    sender = setInterval(cB, 1000, updateMsg);
  });
  video.addEventListener("pause", function name(e) {
    clearInterval(sender);
    updateMsg.state = "pause";
    cB(updateMsg);
  });
  video.addEventListener("event", function name(e) {
    console.log("event");
  });
}
