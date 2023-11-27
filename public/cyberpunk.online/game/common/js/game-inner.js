(function() {

  var enterTime = Date.now();
  var onloadTime;
  // var handleStatsEventAdapter = (window.parent && window.parent.GameBridge && window.parent.GameBridge.handleStatsEvent) || function() {
  //   console.error('no GameBridge')
  // };

  function track(eventName, eventParams) {
    if (window.parent && window.parent.track) {
      window.parent.track(eventName, eventParams)
    } else {
      console.error('no track impl')
    }
  }
  
  function getNameFromUrl(gameUrl) {
    var pathname = gameUrl ? new URL(gameUrl).pathname : window.location.pathname;
    var splits = pathname.split('/')
    return (splits[splits.length - 2] || '').replace(/-/g, ' ')
  }

  var gameName = getNameFromUrl();
  window.addEventListener('load', function(e) {
    onloadTime = Date.now();
    // handleStatsEventAdapter('page_loadfinish', onloadTime - enterTime);
    // handleStatsEventAdapter('page_loadfinish');
    listenCanvas();
  });

  function onStartPlayGame(time) {
    var duration = time - onloadTime;
    if (duration <= 0) {
      duration = Math.floor(Math.random() * 2000);
    }
    track('click_entergame', {
      name: gameName
    })
  }

  function listenCanvas() {
    var canvas;
    var timer = setInterval(function() {
      canvas = document.querySelector('canvas');
      if (canvas) {
        clearInterval(timer);
        onCanvasReady(canvas);
      }
    }, 60);

    function onCanvasReady(canvas) {
      var handler = function() {
        canvas.removeEventListener('touchstart', handler);
        onStartPlayGame(Date.now());
      };
      canvas.addEventListener('touchstart', handler);
    }
  }
})();