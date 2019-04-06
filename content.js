  console.log("yeeeeehhhh!!!");

  window.yControlPanel = (function() {
    const vi = document.querySelector("video");
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
    function getTimer() {
      return [secToMin(vi.currentTime), secToMin(duration)];
    }

    return {
      play: play,
      pause: pause,
      seekTo: seekTo,
      getTimer: getTimer
    };
  })();

chrome.runtime.onMessage.addListener(messageHendler)
function messageHendler(msg, sender, sendRespnce) {
  if(msg.command === "play") {
    window.yControlPanel.play();
  }
}