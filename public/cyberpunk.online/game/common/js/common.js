function isMobile(){
  if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
   return true; // 移动端
  }else{
   return false; // PC端
  }
 } 

 function isPc() {
   return !isMobile()
 }

  
  window.video_rate_before = 10;
  window.video_rate_after = 0;

  var global__utils = window.global__utils || {};
  var global_constants = window.global_constants || {};

  global_constants.afcHtml1 = '<ins class="adsbygoogle" \
  style="display:block" \
  data-ad-client="ca-pub-1747887917506408" \
  data-ad-slot="8453891279" \
  data-ad-format="auto" \
  data-full-width-responsive="true"></ins>';
  global_constants.afcHtml2 = global_constants.afcHtml1;

  global_constants.viewportSize = {
    width: window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth,
    height: window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
  };

  // var afgRate = 0;
  var afgRate = 1; // 插屏afg
  var openScreenAfgType = 0; // 开屏afg
  var rewardRate = 0.25; //
  global__utils.getDynamicAdType = function() {
    if (Math.random() < afgRate) {
      return 'afg';
    } else {
      return 'afc';
    }
  }



  global__utils.getOpenScreenAdType = function() {
    if (Math.random() < openScreenAfgType) {
      return 'afg';
    } else {
      return 'afc';
    }
  }

  global__utils.getAfgType = function() {
    if (Math.random() < rewardRate) {
      return 'reward';
    } else {
      return 'next';
    }
  }

  // window.ads1 =
  //             "https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image&client=ca-games-pub-7621450473269765&description_url=http%3A%2F%2Flemonjings.com%2F&videoad_start_delay=0&hl=en";
  // window.ads2 =
  //             "https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image&client=ca-games-pub-7621450473269765&description_url=http%3A%2F%2Flemonjings.com%2F&videoad_start_delay=0&hl=en";

  const afgUrl = "https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image&client=ca-games-pub-2131565486152375&description_url=https%3A%2F%2Fhippofunnygame.com&videoad_start_delay=0&max_ad_duration=30000&hl=en";

  window.ads1 = window.ads2 = afgUrl;

  function googleBannerAdv(width, height, div) {
      div.innerHTML = "<ins class='adsbygoogle' style='display:inline-block;width:" + width + "px;height:" + height + "px' data-ad-client='ca-pub-7621450473269765' data-ad-slot='6190598168'></ins>";

      var r = document.createElement("script");
      r.innerHTML = "(adsbygoogle = window.adsbygoogle || []).push({});";
      div.appendChild(r);
  }

  function googleBannerAdvLoading(width, height, div) {
      div.innerHTML = "<ins class='adsbygoogle' style='display:block;position: absolute;width:" + width + "px;height:" + height + "px' data-ad-client='ca-pub-7621450473269765' data-ad-slot='5950087290' data-ad-format='auto'></ins>";
      var r = document.createElement("script");
      r.innerHTML = "(adsbygoogle = window.adsbygoogle || []).push({});";
      div.appendChild(r);
  }

  function getValues() {
      return {
        'client' : '7621450473269765',
        'slot' : '5950087290'
      }
  }

  function googleBannerAdv2(width, height, div) {
      div.innerHTML = "<ins class='adsbygoogle' style='display:inline-block;width:" + width + "px;height:" + height + "px' data-ad-client='ca-pub-7621450473269765' data-ad-slot='5950087290'></ins>";

      var r = document.createElement("script");
      r.innerHTML = "(adsbygoogle = window.adsbygoogle || []).push({});";
      div.appendChild(r);
  }

  function getValues2() {
      return {
          'client' : '7621450473269765',
          'slot' : '5950087290'
      }
  }


  (function() {
    function debug(cons) {
      var keys = ['log', 'warn', 'error', 'info', 'debug'];
      keys.forEach(function(key) {
        cons[key] = function() {};
      })
    }
    debug(console)

    var timer = window.setInterval(function() {
      var gameIframe = document.getElementById('gameIFrame')
      if (gameIframe && gameIframe.contentWindow && gameIframe.contentWindow.console) {
        window.clearInterval(timer)
        debug(gameIframe.contentWindow.console)
      }
    }, 100)

  })();