function initialize() {
  window.yCPTitle = document.querySelector("title");
  let vi = document.querySelector("video");
  const videoWaiter = setInterval(function(){
    vi = document.querySelector("video");
    if (vi) {
      clearInterval(videoWaiter)
      window.yControlPanel = yCP(vi);
      sendInitMessage();
    } 
  }, 200)
  
}


window.yCP = function(video) {
  return (function(vi) {
    let duration = vi.duration;

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
    function setVolume(num) {
      if (num >= 0 && num <= 100) {
        vi.volume = num / 100;
      } else {
        throw new Error("invalid volume value");
      }
    }
    function getVolume() {
      return Math.floor(vi.volume * 100);
    }
    function getDuration() {
      return duration;
    }
    function getTimer() {
      if (duration) {
        return [secToMin(vi.currentTime), secToMin(duration)];
      } else {
        duration = vi.duration;
        return [secToMin(vi.currentTime), secToMin(vi.duration)];
      }
    }

    return {
      play: play,
      pause: pause,
      seekTo: seekTo,
      getTimer: getTimer,
      getVolume: getVolume,
      setVolume: setVolume,
      getDuration: getDuration
    };
  })(video);
};

function sendInitMessage(type) {
  const videoData = {
    type: type || "init",
    title: window.yCPTitle ? window.yCPTitle : "some-random song",
    duration: window.yControlPanel.getDuration(),
    volume: window.yControlPanel.getVolume(),
    timer: yControlPanel.getTimer()
  };
  chrome.runtime.sendMessage(videoData);
}