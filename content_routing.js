const urlChangetracker = (function() {
  let url = window.location.href;
  let oldUrl = null;
  return function(callBack, event) {
    if (window.location.href !== url) {
      oldUrl = url;
      url = window.location.href;
      const title = document.querySelector("title").innerText;
      const reloadWaiter = setInterval(
        function(title) {
          if (title !== document.querySelector("title").innerText) {
            clearInterval(reloadWaiter);
            callBack(oldUrl, url);
          }
        },
        200,
        title
      );
    }
  };
})();

function urlChangeHandler(oldUrl, newUrl) {
  if (oldUrl.slice(24, 29) !== "watch") {
    if (newUrl.slice(24, 29) === "watch") {
      //initialize new card
      console.log("initialize new card");
      initialize();
    }
  } else {
    if (newUrl.slice(24, 29) === "watch") {
      //change existing card
      console.log("change existing card");
      initialize("change");
    } else {
      //remove existing card
      console.log("remove existing card");
      chrome.runtime.sendMessage({ type: "remove" });
    }
  }
}

function watchPageChecker() {
  if (window.location.href.slice(24, 29) === "watch") {
    initialize();
  }
}
function sendInitMessage(type) {
  const videoData = {
    type: type || "init",
    title: window.yCPTitle ? window.yCPTitle.innerHTML : "some-random song",
    duration: window.yControlPanel.getDuration(),
    volume: window.yControlPanel.getVolume(),
    timer: yControlPanel.getTimer()
  };
  chrome.runtime.sendMessage(videoData);
}

function initialize(messageType) {
  window.yCPTitle = document.querySelector("title");
  let vi = document.querySelector("video");
  const videoWaiter = setInterval(function() {
    console.log("videoWaiter");

    vi = document.querySelector("video");
    if (vi) {
      clearInterval(videoWaiter);
      window.yControlPanel = yCP(vi);
      sendInitMessage(messageType);
      console.log("vi is ok", yControlPanel);
      
      updater(vi, function(data) {
        chrome.runtime.sendMessage(data);
      });
    }
  }, 200);
}

window.addEventListener("click", urlChangetracker.bind(null, urlChangeHandler));
window.addEventListener("load", watchPageChecker);
window.addEventListener('beforeunload', function(e) {
  chrome.runtime.sendMessage({ type: "remove" });
});
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


chrome.runtime.onMessage.addListener(messageHendler);
function messageHendler(msg, sender, sendRespnce) {
  if (msg.command === "play") {
    window.yControlPanel.play();
  } else if (msg.command === "pause") {
    window.yControlPanel.pause();
  } else if (msg.command === "seekTo") {
    window.yControlPanel.seekTo(msg.value);
  } else if (msg.command === "setVolume") {
    window.yControlPanel.setVolume(msg.value);
  } else if (msg.command === "resendData") {
    console.log('resend data command');
    
    initialize("change");
  }
}
function updater(video, cB) {
  const updateMsg = {
    type: "update",
    state: null,
    volume: yControlPanel.getVolume(),
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
    updateMsg.volume = yControlPanel.getVolume();
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
