function encodeQuery(query) {
  var ret = '';
  query = query || {};
  for(var key in query) {
    if (query.hasOwnProperty(key)) {
      ret = ret + (ret === '' ? '' : '&') + (key + '=' + encodeURIComponent(query[key]));
    }
  }
  return ret;
}
function parseSearch(search) {
  search = search || ''
  if (search && search[0] === '?') {
    search = search.slice(1)
  }
  return parseQueryLikeStr(search)
}

function parseQueryLikeStr(str) {
  str = str || ''
  var result = {}
  var paramItem, paramItemParts
  try {
    var parts = str.split('&')
    for (var i = 0; i < parts.length; i++) {
      paramItem = parts[i] || ''
      var index = paramItem.indexOf('=')
      if (index > 0) {
        var key = paramItem.slice(0, index)
        var value = decodeURIComponent(paramItem.slice(index + 1) || '')
        result[key] = value
      }
    }
    return result
  } catch (err) {
    console.error(err)
    return {}
  }
}
var search = parseSearch(location.search);

var cxAdGames = [
  // "/global/Bridal-Race-3d","/global/SquidGame",
  // // "/global/ki-King-2022",
  // "/global/stone-line",
  // // "/global/2048"
]
var useCxAd = hitGame(cxAdGames);

var isCxAdPlayPage = search.__play__ === '1' || location.pathname.indexOf('play.html') >= 0;
var origins = [
  'https://hippofunnygame.com',
  'https://game1.hippofunnygame.com',
  'https://game2.hippofunnygame.com',
];
var originIdx = origins.indexOf(location.origin);
var linkOrigin = useCxAd ? (origins[(originIdx + 1) >= origins.length ? 0 : originIdx + 1] || origins[0]) : origins[0];

var global__doms = window.global__doms || {};
var global__utils = window.global__utils || {};
var assign = Object.assign;

var openScreenEndTime = Date.now();
var lastAdTime;

var forceNoPlayBtnAd = location.search.indexOf('noPlayBtnAd=1') >= 0;
var useOldAfg = hitGame(['games/anycolor']);
var adBreak,adConfig;
if (useOldAfg) {
  adBreak = function(opt) {
    showOldAfg(function() {
      opt.afterAd && opt.afterAd();
      opt.adBreakDone && opt.adBreakDone();
    });
  } 
} else {
  window.adsbygoogle = window.adsbygoogle || []; 
  adBreak = adConfig = function(o) {adsbygoogle.push(o);}
  // afg beta 广告配置，一定要调用
  adConfig({
    sound: 'on',
    preloadAdBreaks: 'on',
  });
}


var afgVisible = false;

var isDanfa = window.location.href.indexOf('/danfa/') >= 0;
var isGamesChannel = window.location.href.indexOf('/games/') >= 0;
// var isDanfa = true;
var isGlobal =  window.location.href.indexOf('/global/') >= 0;

function broadcastAdShow() {
  try {
    window.adFeedback && window.adFeedback.onAdShow()
  } catch (e) {
    console.error(e);
  }
}
function broadcastAdHide() {
  try {
    window.adFeedback && window.adFeedback.onAdDismiss()
  } catch (e) {
    console.error(e);
  }
}

function isAfgAvailable() {
  var list = [].slice.call(document.children[0].children || [], 0)
  var list2 = [].slice.call(document.body.children || [], 0)
  

  return [].find.call([...list, ...list2], function (item) {
    if (item.tagName.toLowerCase() === 'ins') {
      return item.style.display === 'block' && item.clientHeight > 10
    } else {
      return false
    }
  })
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomItems(list, count) {
  if (list.length <= count) return list;
  var idxs = list.map((_, index) => index);
  var randoms = [];
  while (randoms.length < count) {
    var i = getRandomNum(0, idxs.length);
    randoms.push(idxs[i]);
    idxs.splice(i, 1);
  }
  return randoms.map(i => list[i]);
}

function getRecommendGameUrl(key) {
  return origin + '/'+ (isDanfa ? 'danfa/' : 'games/') + key + '/index.html'
}

function getRecommendList() {
  var origin = window.location.origin;
  var games = [
    // {
    //   url: origin + '/games/21clock/index.html',
    //   icon: '/images/banner/21clock.png',
    //   key: '21clock',
    // },
    {
      url: getRecommendGameUrl('fruitkiller'),
      icon: '/images/banner/fruitkiller.png',
      key: 'fruitkiller'
    },
    // {
    //   url: origin + '/games/hechengqiangshou/index.html',
    //   icon: '/images/banner/hechengqiangshou.jpg',
    //   key: 'hechengqiangshou'
    // },

    {
      url: getRecommendGameUrl('Elastic-Car'),
      icon: '/images/banner/Elastic-Car.jpg',
      key: 'Elastic-Car'
    },
    {
      url: getRecommendGameUrl('SquidGame'),
      icon: '/images/banner/SquidGame.jpg',
      key: 'SquidGame'
    },
    // {
    //   url: origin + '/games/zombie-road/index.html',
    //   icon: '/images/banner/zombie-road.jpg',
    //   key: 'zombie-road'
    // },
    // {
    //   url: origin + '/games/Call-of-Duty/index.html',
    //   icon: '/images/banner/Call-of-Duty.jpg',
    //   key: 'Call-of-Duty'
    // },
    // {
    //   url: origin + '/games/Typhoon-Killer-Io/index.html',
    //   icon: '/images/banner/Typhoon-Killer-Io.jpg',
    //   key: 'Typhoon-Killer-Io'
    // },
    {
      url: getRecommendGameUrl('Color-Fill'),
      icon: '/images/banner/Color-Fill.png',
      key: 'Color-Fill'
    }
  ];

  // return getRandomItems(games, 4)
  return games;
}

function track(eventName, eventParams) {
  if (gtag) {
    gtag('event', eventName, eventParams || {})
  }
}

window.track = track;

function getNameFromUrl(gameUrl) {
  var pathname = gameUrl ? new URL(gameUrl).pathname : window.location.pathname;
  var splits = pathname.split('/')
  return (splits[splits.length - 2] || '').replace(/-/g, ' ')
}

var gameName = getNameFromUrl();
var hasShowGameScreen = false;

track('imp_load', {
  name: gameName
})

// function preventDefaultFunc(e) {
//   e.preventDefault();
// }
// function disableScroll() {
//    //passive 参数不能省略，用来兼容ios和android
//   document.body.addEventListener('touchmove', preventDefaultFunc, { passive: false });
// }

// disableScroll()

var appInnerHtml = '<div id="gameFrameContainer"> \
<object data="./game.html" type="text/html" id="gameIFrame" name="gameIFrame" style="display: block; width: 100%; min-width: 100%; height: 100%; overflow: hidden;"> \
</object>\
<img src="../../common/imgs/back-btn.png" alt="" class="back-btn"/> \
</div>\
\
<div id="view1">\
<div class="view1-inner">\
<div class="top-info">\
  <div class="icon-wrapper">\
    \
  </div>\
  <div class="name">&nbsp;</div>\
  <div class="rate-wrapper">\
    <span\
      ><span class="stars"></span>&nbsp;<span class="rate"></span\
    ></span>\
  </div>\
</div>\
<div class="middle-ad">\
  <div id="view1__ad"><ins></ins></div>\
</div>\
<div class="bottom-info">\
  <div class="desc">\
    \
  </div>\
  <div class="loading-bar">\
    <span class="loading-text">Try Now</span>\
    <div class="loading-btn completed"><div class="loading-btn-inner"></div></div>\
  </div>\
  <div class="recommend-block">\
    <div class="recommend-title">Game Suggesting</div>\
    <div class="recommend-list">\
    </div>\
  </div>\
</div>\
\
</div>\
</div>';


var playUri = '';
var playUrlSearch = '';
var backUrl = '';
var useQueryPlayParam = true;
(function() {
  // var search = parseSearch(location.search);
  // search.__play__ = '1';
  // playUrlSearch = '?' + encodeQuery(search);
  if (useQueryPlayParam) {
    var nextSearch = parseSearch(location.search);
    nextSearch.__play__ = '1';
    playUrlSearch = '?' + encodeQuery(nextSearch);
    playUri = linkOrigin + location.pathname + playUrlSearch + location.hash;
  } else {
    if (location.pathname.indexOf('index.html') >= 0) {
      playUri = linkOrigin + location.pathname.replace('index.html', 'play.html') + location.search + location.hash;
    } else if (location.pathname[location.pathname.length-1] === '/') {
      playUri = linkOrigin + location.pathname + 'play.html' + location.search + location.hash;
    }
  }
})();


if (useCxAd && (playUri || isCxAdPlayPage)) {
  if (isCxAdPlayPage) {
    var search = parseSearch(location.search);
    var searchStr = ''
    delete search.__play__;
    if (Object.keys && Object.keys(search).length) {
      searchStr = '?' + encodeQuery(search)
    }
    if (useQueryPlayParam) {
      backUrl = linkOrigin + location.pathname + searchStr + location.hash;
    } else {
      backUrl = linkOrigin + location.pathname.replace('play.html', 'index.html') + searchStr + location.hash;
    }
    
    appInnerHtml = '<div id="gameFrameContainer"> \
    <object data="./game.html" type="text/html" id="gameIFrame" name="gameIFrame" style="display: block; width: 100%; min-width: 100%; height: 100%; overflow: hidden;"> \
    </object>\
    <a href="'+backUrl+'"><img src="../../common/imgs/back-btn.png" alt="" class="back-btn"/></a> \
    </div>\
    \
    <div id="view1">\
    <div class="view1-inner">\
    <div class="top-info">\
      <div class="icon-wrapper">\
        \
      </div>\
      <div class="name">&nbsp;</div>\
      <div class="rate-wrapper">\
        <span\
          ><span class="stars"></span>&nbsp;<span class="rate"></span\
        ></span>\
      </div>\
    </div>\
    <div class="middle-ad">\
      <div id="view1__ad"><ins></ins></div>\
    </div>\
    <div class="bottom-info">\
      <div class="desc">\
        \
      </div>\
      <a class="loading-bar" href="'+playUri+'">\
        <span class="loading-text">Try Now</span>\
        <div class="loading-btn completed"><div class="loading-btn-inner"></div></div>\
      </a>\
      <div class="recommend-block">\
        <div class="recommend-title">Game Suggesting</div>\
        <div class="recommend-list">\
        </div>\
      </div>\
    </div>\
    \
    </div>\
    </div>';
  } else {
    appInnerHtml = '\
    <div id="view1">\
    <div class="view1-inner">\
    <div class="top-info">\
      <div class="icon-wrapper">\
        \
      </div>\
      <div class="name">&nbsp;</div>\
      <div class="rate-wrapper">\
        <span\
          ><span class="stars"></span>&nbsp;<span class="rate"></span\
        ></span>\
      </div>\
    </div>\
    <div class="middle-ad">\
      <div id="view1__ad"><ins></ins></div>\
    </div>\
    <div class="bottom-info">\
      <div class="desc">\
        \
      </div>\
      <a class="loading-bar" href="'+playUri+'">\
        <span class="loading-text">Try Now</span>\
        <div class="loading-btn completed"><div class="loading-btn-inner"></div></div>\
      </a>\
      <div class="recommend-block">\
        <div class="recommend-title">Game Suggesting</div>\
        <div class="recommend-list">\
        </div>\
      </div>\
    </div>\
    \
    </div>\
    </div>';
  }

};

(function initDom() {
  var app = document.getElementById('app');
  app.innerHTML = appInnerHtml;

  assign(global__doms, {
    body: document.querySelector('body'),
    view1Container:  document.querySelector('#view1'),
    loadingTopInfo: document.querySelector('#view1 .top-info'),
    loadingBottomInfo: document.querySelector('#view1 .bottom-info'),
    loadingText: document.querySelector('#view1 .loading-text'),
    loadingBtn: document.querySelector('#view1 .loading-btn'),
    loadingBtnInner: document.querySelector('#view1 .loading-btn-inner'),
    descEle: document.querySelector('#view1 .desc'),
    nameEle: document.querySelector('#view1 .name'),
    starsEle: document.querySelector('#view1 .stars'),
    rateEle: document.querySelector('#view1 .rate'),
    likeEle: document.querySelector('#view1 .like'),
    dynamicAfcContainer: document.querySelector('.afc-wrapper .dynamic-afc'),
    view1AdContainer: document.getElementById('view1__ad'),
    gameFrameContainer: document.getElementById('gameFrameContainer'),
    recommendList: document.querySelector('.recommend-list'),
    backBtn: document.querySelector('#gameFrameContainer .back-btn'),
    iconWrapper: app.querySelector('.icon-wrapper'),
    view1Inner: app.querySelector('.view1-inner'),
    recommendBlock: app.querySelector('.recommend-block'),
    loadingBar: app.querySelector('.loading-bar'),
  });
})();

if (isGlobal) {
  global__doms.body.classList.add('global')
}



assign(global__utils, {
  generateAd(adStr, parentDom) {
    parentDom.innerHTML = adStr;
    var script = document.createElement("script");
    script.innerHTML = "(adsbygoogle = window.adsbygoogle || []).push({});";
    parentDom.appendChild(script);
  },
  track
});

global__doms.backBtn && global__doms.backBtn.addEventListener('click', function(e) {
  window.location.reload();
});

(function adjustBackBtnPosition() {
  var config = {
    'Santa-Or-Thief': {
      left: '80px'
    },
    'Mini-Golf': {
      left: '80px'
    },
    'Car-Craft-Race': {
      left: '85px'
    },
    'rope-bawling-2-game': {
      left: '85px'
    },
    'Checkers-Dames': {
      left: '20px'
    },
    'Among-Us-Crazy-Gunner': {
      left: '90px'
    },
    'Garbage-Sorting-Truck': {
      left: '90px'
    },
    'shoot-ball': {
      left: '110px'
    },
    'ski-challenge-3d': {
      left: '125px'
    },
    'master-2048': {
      left: '10px',
      top: '30px',
    },
    'Cat-Room-Blast': {
      left: '80px',
    },
  };
  var games = Object.keys(config);
  var game = games.find(function(key) {
    return window.location.href.indexOf('/' + key + '/') >= 0
  });
  if (game) {
    var position = config[game];
    Object.keys(position).forEach(function(attr) {
      global__doms.backBtn && (global__doms.backBtn.style[attr] = position[attr]);
    })
  }
})();
var openScreenAdType = global__utils.getOpenScreenAdType();
// var openScreenAdType = 'afc'
// console.log('openScreenAdType', openScreenAdType)
var view1Module = {
  isInGameView: false,
  loadCall: null,
  // init() {
  //   this.adJustGameFrameSize();
  //   if (openScreenAdType === 'afg') {
  //   //   setLoadingVisible(true, false, () => {
  //   //     view1Module.afterLoading();
  //   //   }, {
  //   //     forceType: 'afg'
  //   //   })
  //     adBreak({
  //       type: 'preroll',
  //       adBreakDone: () => {
  //         console.log('开屏 afg回调')
  //         view1Module.afterLoading();
  //       }
  //     });
  //     this.initLoadingPageInfo()
  //   } else {
  //     this.hideGameFrameContainer()
  //     this.initLoadingPageInfo()
  //     global__doms.view1Container.style.display = 'block';
  //     this.initAd();
  //     this.startLoading();
  //     lastAdTime = Date.now()
  //   }

  // },
  init() {
    if (isCxAdPlayPage) {
      this.adJustGameFrameSize();
      this.hideGameFrameContainer();
      this.initAd();
      this.afterLoading();
    } else {
      this.adJustGameFrameSize();
      this.hideGameFrameContainer()
      // this.initLoadingPageInfo()
      // global__doms.view1Container.style.display = 'block';
      // this.initAd();
      // this.startLoading();
      // lastAdTime = Date.now()
      this.directStage();
    }
  },
  directStage() {
    var icon = this.createIcon();
    var gameInfo = this.getGameInfo();
    var _this = this;

    _this.initAd();
    setTimeout(function() {
      run()
    }, 1000)

    function run() {
      setTimeout(function() {
        global__doms.iconWrapper.appendChild(icon);
      }, 600);
      setTimeout(function() {
        global__doms.nameEle.innerText = gameInfo.name;
        global__doms.starsEle.innerHTML = _this.generateStarsHtml(gameInfo.starCount)
        global__doms.rateEle.innerText = gameInfo.rate;
      }, 800);
      setTimeout(function() {
        global__doms.view1Inner.classList.add('color-bg')
      }, 1000);
      setTimeout(function() {
        global__doms.view1Inner.classList.add('img-bg')
      }, 2000);
      setTimeout(function() {
        global__doms.descEle.innerText = gameInfo.desc;
        global__doms.descEle.style.display = 'block';
        view1Module.insertPrivacyText();
      }, 2500);
  
      setTimeout(function() {
        _this.initRecommends();
        global__doms.recommendBlock.style.display = 'block';
      }, 3000);
  
      setTimeout(function() {
        global__doms.loadingBar.style.display = 'block';
        if (useCxAd) {
          _this.initCxBtnLink();
        } else {
          _this.addListenerForBtn();
        }
      }, 3000);
    }
  },
  initCxBtnLink() {

  },
  insertPrivacyText() {
    if (location.pathname.indexOf('/zl/') >= 0) {
      var priDiv = document.createElement('div');
      priDiv.classList.add('Privacy')
      priDiv.style.textAlign = 'center';
      priDiv.style.padding = '14px 0';
      priDiv.innerHTML = '<a href="https://hippofunnygame.com/static/privacy-zl.html" target="_blank" style="font-size: 10px;text-decoration: none;    color: #fff;">\
      Entering the game will default to agree the Privacy Policy <br/>\
      Fowon Privacy Policy 2022<a/>';
      // document.body.appendChild(priDiv);
      // global__doms.view1Inner.appendChild(priDiv);
      global__doms.loadingBtn.style.marginTop = '0px';
      global__doms.loadingBottomInfo.insertBefore(priDiv, global__doms.loadingBar);
      global__doms.privacyEle = priDiv;
    }
  },
  movePrivacyTextToBottom() {
    if (global__doms.privacyEle) {
      global__doms.view1Inner.appendChild(global__doms.privacyEle);
    }
  },
  createIcon() {
    var iconUrl = './icon.png';
    var defaultIconUrl = '/default-icon.png';
    var icon = new Image();
    icon.src = iconUrl;
    icon.addEventListener('error', function() {
      icon.src = defaultIconUrl;
    })
    icon.classList.add('icon');
    return icon;
  },
  getGameInfo() {
    var name = (window.global__meta || {}).name || getNameFromUrl() || '';
    var desc = (window.global__meta || {}).desc || 'This is a great casual game, come and call your friends to play together!';

    if (isDanfa && isGame('fruitkiller')) {
      desc = 'Here, you have more weapons to choose from, come and choose the best one!';
    }
    if (isGamesChannel && hitGame(["funrace3d","qcybs","cricket","magicpuzzle","dingzhuzhebofangkuai","runsausagerun","coolgoal","cubesurfer","ludo","archerwarrior","wildlife","spiderstory","bounzy","cursedmarbles","huaxianjinqiu","basketballmaster2","minecraftblock","jewellegend","gochickengo","kniferain","flippinggunsimulator","weixianshamosaiche","beibangdehuochairen","boatrush","pingpangking","nitro","jump","furiousroad","streetballmaster","battleships","fruitlink2","subwayrunner","highwayrider","sweetconnect","bubblepop","neonswitch","furiousracing","crossyroad","deadlyrace","bouncyball","superstar","matchman","magictiles","smilycubes","aquathief","tapdashtap","skylands","ninjajump","zball5mountain","rabbitjump","touchnjump","snakeandblocks","shots","hechengqiangshou","matchman","jianongpao"])) {
      desc = 'In this game full of joy, you will challenge your observation and reaction abilities. This is a game that is extremely suitable for sharing with family and friends. I hope you can successfully challenge the game and gain happiness and satisfaction in the game.';
    }
    var starCount = Math.random() > 0.5 ? 5 : 4.5;
    var rate = (Math.random() * 0.9 + 4.1).toFixed(1);
    return {
      name: name,
      desc: desc,
      starCount: starCount,
      rate: rate
    }
  },
  // initLoadingPageInfo() {
  //   var name = (window.global__meta || {}).name || getNameFromUrl() || '';
  //   var desc = (window.global__meta || {}).desc || 'This is a great casual game, come and call your friends to play together!';

  //   if (isDanfa && isGame('fruitkiller')) {
  //     desc = 'Here, you have more weapons to choose from, come and choose the best one!';
  //   }

  //   var starCount = Math.random() > 0.5 ? 5 : 4.5;
  //   var rate = (Math.random() * 0.9 + 4.1).toFixed(1);
  //   // var likeCount = Math.ceil(Math.random() * 1000) + 45000;

  //   global__doms.nameEle.innerText = name;
  //   global__doms.descEle.innerText = desc;
  //   global__doms.rateEle.innerText = rate;
  //   // global__doms.likeEle.innerText = likeCount + ' People Like';
  //   global__doms.starsEle.innerHTML = this.generateStarsHtml(starCount)
  //   this.initRecommends()
  // },
  initRecommends() {
    var list = getRecommendList();
    list.forEach(item => {
      item['players'] = getRandomNum(50000, 51000);
    })
    var i = 0;
    var html = '';
    while(i < list.length) {
      var splits = list.slice(i, i+2);
      i = i + splits.length;
      var string = '<div class="recommend-line"><div class="recommend-item"><a href="' + splits[0].url + '"><img src="'+ splits[0].icon + '" alt=""></a></div>' + 
        (splits[1] ? '<div class="recommend-item"><a href="' + splits[1].url + '"><img src="'+ splits[1].icon + '" alt=""></a></div>' : '') +
        '</div>' +
        '<div class="recommend-line-descs"><div class="recommend-line-desc-item">' + splits[0].players + ' people playing</div>' + 
        (splits[1] ? '<div class="recommend-line-desc-item">' + splits[1].players + ' people playing</div>' : '') + 
        '</div>';
      html += string;
    }
    global__doms.recommendList.innerHTML = html;
    list.forEach(item => {
      track('imp_suggest', {
        name: item.key
      })
    })

    setTimeout(function() {
      var links = document.querySelectorAll('.recommend-item a');
      [].forEach.call(links, function(link) {
        var url = link.getAttribute('href');
        var key = getNameFromUrl(url);
        link.addEventListener('click', function() {
          track('click_suggest', {
            name: key
          })
        })
      })
    }, 0)
  },
  generateStarsHtml(count) {
    var fullStar = '<span class="star full"></span>';
    var emptyStar = '<span class="star empty"></span>';
    var halfFullStar = '<span class="star half"></span>';
    var i = 1;
    var result = ''
    while(i <= 5) {
      if (count >= i) {
        result += fullStar;
      } else if (i - count < 1) {
        result += halfFullStar;
      } else {
        result += emptyStar;
      }
      i++;
    }
    return result;
  },

  adJustGameFrameSize() {
    if (global__doms.gameFrameContainer) {
      if (global_constants.viewportSize && global_constants.viewportSize.height) {
        var gameHightRatio, height;
  
        if (isDanfa) {
          if (openScreenAdType === 'afg') {
            height = global_constants.viewportSize.height + 'px';
          } else {
            height = (global_constants.viewportSize.height - 53) + 'px';
          }
        } else {
          // gameHightRatio = openScreenAdType === 'afg' ? 1 : 0.8;
          // height = global_constants.viewportSize.height * gameHightRatio + 'px';
          // if (window.location.href.indexOf('War-Parkour') >= 0) { // 特殊游戏画布尺寸不合适
          //   height = '87vh';
          // }
          var bottomHeight = isGlobal ? 98 : 83;
  
  
          if (openScreenAdType === 'afg') {
            height = global_constants.viewportSize.height + 'px';
          } else {
            height = (global_constants.viewportSize.height - bottomHeight) + 'px';
          }
        }
  
        global__doms.gameFrameContainer.style.height = height;
      }
      global__doms.gameFrameContainer.addEventListener('touchmove', function(e) {e.preventDefault(); e.stopPropagation()})
    }

  },
  addListenerForBtn() {
    var enterGameView = function() {
      if (needFrontLoading()) {
        showFrontLoading();
      }
      if (!hasShowGameScreen) {
        hasShowGameScreen = true;
        track('imp_entergame', {
          name: gameName
        })
      }
      view1Module.afterLoading();
      openScreenEndTime = Date.now();
      // loadCall && loadCall()

      if (needPlayBtnTwiceAd()) {
        setTimeout(function() {
          setLoadingVisible(true, false, function () {}, {
            __type__: 'interstitial',
          }, {
            page: 'parent'
          })
        }, 8000)
      }
    }
    function whenLoadingComplelte() {
      track('loading_finish', {
        name: gameName
      })
      var hasClickBtn = false;
      var clickHandler = function (e) {
        hasClickBtn = true;
        global__doms.loadingBtn.removeEventListener('click', clickHandler)
        beforeEnterGame();
      }
      global__doms.loadingBtn.addEventListener('click', clickHandler)
      // !isDanfa && setTimeout(function() {
      //   if (!hasClickBtn) {
      //     global__doms.loadingBtn.removeEventListener('click', clickHandler);
      //     beforeEnterGame();
      //   }
      // }, 17 * 1000);
    }

    var beforeEnterGame = function() {
      // 开始动效
      track('click_loadplay', {
        name: gameName
      })
      global__doms.loadingText.innerHTML = '';
      global__doms.loadingBtnInner.innerHTML = '<div class="lds-spinner">\
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>\
      ';
      setTimeout(function() {
        if (needPlayBtnAd()) {
          broadcastAdShow();
          adBreak({
            type: 'preroll',
            adBreakDone: () => {
              console.log('preroll afg回调')
              broadcastAdHide();
              enterGameView();
            }
          });
        } else {
          enterGameView();
        }
      }, 1000)
    } 

    whenLoadingComplelte();
  },
  /**@deprecated*/
  startLoading(loadCall) {
    // global__doms.loadingBtn.removeEventListener('click');
    // this.loadCall = loadCall;
    // var newloadingText = global__doms.loadingPercentText;
    if (loadCall) {
      this.initRecommends();
    }
    var duration = 2700;
    var total = duration / 100;
    // newloadingText.innerText = '0%'
    global__doms.loadingBtn.classList.add('completed');
    global__doms.loadingBtnInner.style.width = '100%';
    var enterGameView = function() {
      if (!hasShowGameScreen) {
        hasShowGameScreen = true;
        track('imp_entergame', {
          name: gameName
        })
      }
      view1Module.afterLoading();
      openScreenEndTime = Date.now();
      loadCall && loadCall()

      if (needPlayBtnTwiceAd()) {
        setTimeout(function() {
          setLoadingVisible(true, false, function () {}, {
            __type__: 'interstitial',
          }, {
            page: 'parent'
          })
        }, 8000)
      }
    }
    var jd1 = 0;

    var beforeEnterGame = function() {
      // var longAdGames = ['zombie-road', 'Sniper-Elite', 'Call-of-Duty'];
      // if (!isDanfa && longAdGames.some(key => location.href.indexOf(key) >= 0)) {
      //   myShowInterstitial({
      //     beforeAd: function() {},
      //     afterAd: function() {
      //       adBreak({
      //         type: 'preroll',
      //         adBreakDone: () => {
      //           console.log('preroll afg回调')
      //           enterGameView();
      //         }
      //       });
      //     }
      //   })
      // } else {
        if (needPlayBtnAd()) {
          adBreak({
            type: 'preroll',
            adBreakDone: () => {
              console.log('preroll afg回调')
              enterGameView();
            }
          });
          // myShowInterstitial({
          //   beforeAd: function() {},
          //   afterAd: function() {
          //     console.log('preroll afg回调')
          //     enterGameView();
          //   }
          // })
        } else {
          enterGameView();
        }
      // }
    } 

    function whenLoadingComplelte() {
      global__doms.loadingBtn.classList.add('completed')
      // track('loading_finish', {
      //   name: gameName
      // })
      var hasClickBtn = false;
      var clickHandler = function (e) {
        track('click_loadplay', {
          name: gameName
        })
        hasClickBtn = true;
        global__doms.loadingBtn.removeEventListener('click', clickHandler)
        beforeEnterGame();
      }
      global__doms.loadingBtn.addEventListener('click', clickHandler)
      !isDanfa && setTimeout(function() {
        if (!hasClickBtn) {
          global__doms.loadingBtn.removeEventListener('click', clickHandler);
          beforeEnterGame();
        }
      }, 17 * 1000);
    }

    if (isDanfa) {
      whenLoadingComplelte();
    } else {
      // var timeNum2 = setInterval(function () {
      //   jd1 += 1
      //   if (jd1 >= 100) {
      //     jd1 = 100
      //     clearInterval(timeNum2)
      //     whenLoadingComplelte();
      //   }
      // }, total)
      whenLoadingComplelte();
    }

  },
  initAd() {
    global__utils.generateAd(global_constants.afcHtml1, global__doms.view1AdContainer);
  },
  afterLoading() {
    global__doms.body.classList.add('game-playing')
    global__doms.body.style.background = '#fff';
    this.showGameFrameContainer();
    view1Module.hideLoadingContainer();
    view1Module.movePrivacyTextToBottom();

    if (location.href.indexOf('/games/Car-Race-Master') >= 0) {
      global__doms.view1AdContainer.innerHTML = '';
      var code = '<ins class="adsbygoogle" \
      style="display:block" \
      data-ad-client="ca-pub-2131565486152375" \
      data-ad-slot="9071685674" \
      data-ad-format="auto" \
      data-full-width-responsive="true"></ins>';
      global__utils.generateAd(code, global__doms.view1AdContainer);
    }
  },
  showLoadingContainer() {
    global__doms.loadingTopInfo.style.display = 'block';
    global__doms.loadingBottomInfo.style.display = 'block';
  },
  hideLoadingContainer() {
    global__doms.loadingTopInfo.style.display = 'none';
    global__doms.loadingBottomInfo.style.display = 'none';
  },
  showGameFrameContainer() {
    if (global__doms.gameFrameContainer) {
      global__doms.gameFrameContainer.style.left = 0;
      global__doms.gameFrameContainer.style.position = 'relative';
    }
  },
  hideGameFrameContainer() {
    if (global__doms.gameFrameContainer) {
      global__doms.gameFrameContainer.style.left = '9999px';
      global__doms.gameFrameContainer.style.position = 'absolute';
    }
  }
};


view1Module.init();


// var _w =
//   window.innerWidth ||
//   document.documentElement.clientWidth ||
//   document.body.clientWidth;
// var _h =
//   window.innerHeight ||
//   document.documentElement.clientHeight ||
//   document.body.clientHeight;
// googleBannerAdv(_w, 100, document.getElementById('newgooglebanner1'))

var innerAdCount = 0;

function setLoadingVisible(visible, isEnd, loadCall, option) {
  console.log('setLoadingVisible', visible, isEnd, loadCall, option)
  if (visible && window.location.href.indexOf('/Pin-Love-Balls/') >= 0 && Date.now() - openScreenEndTime <= 70 * 1000) {
    loadCall();
    return;
  }

  option = option || {};

  // if (option.page !== 'parent' && hitGame(['Truck-Deliver-3d']) && option.__type__!== 'reward') {
  //   innerAdCount++;
  //   if (innerAdCount <= 1) {
  //     loadCall && loadCall();
  //     return;
  //   }
  // }
  var gdt_video2 = document.getElementById('gdt_video2')
  // var gdt_title = document.getElementById('gdt_title')
  var gdt_video = document.getElementById('gdt_video')

  var gdt_3 = document.getElementById('gdt_3')

  if (visible && afgVisible) return;

  if ((visible && gdt_3.style.display == 'block')) {
    return
  }
  if (visible && global__doms.loadingTopInfo.style.display !== 'none') {
    loadCall && loadCall();
    return;
  }
  if (!visible && gdt_3.style.display == 'none') {
    return
  }

  if (!visible) {
    gdt_3.style.display = 'none'
    if (global__doms.loadingTopInfo.style.display == 'block') {
      view1Module.afterLoading();
    }
    return
  }

  var adTimeLimitGames = ['matchman-push', '8ballpool-push', 'fruitkiller-push'];
  var isAdTimeLimitGame = adTimeLimitGames.some(item => window.location.pathname.indexOf(item) >= 0);
  if (visible && lastAdTime && (Date.now() - lastAdTime < 30 * 1000) && isAdTimeLimitGame) {
    loadCall && loadCall()
    return;
  }



  // if (!isEnd) {
  //   gdt_title.style.display = 'block'
  // } else {
  //   gdt_title.style.display = 'none'
  //   gdt_video.style.top = '0px'
  // }
  // var videoBeforeRate = window.video_rate_before || 0
  // var videoAfterRate = window.video_rate_after || 0

  // if ((!isEnd && Math.random() * 100 < videoBeforeRate) || (isEnd && Math.random() * 100 < videoAfterRate)) {
  lastAdTime = Date.now();
  let isAfc
  if (option.forceType) { // 开屏时会配置这个强制使用afg
    isAfc = option.forceType === 'afc'
  } else { // 插屏广告随机控制
    if (window.location.pathname.indexOf('/fruitkiller/') >= 0) {
      isAfc = false;
    } else {
      isAfc = global__utils.getDynamicAdType() === 'afc';
    }
  }
  if (isAfc) {
    view1Module.hideGameFrameContainer();
    view1Module.showLoadingContainer();
    view1Module.startLoading(loadCall);
    global__utils.generateAd(global_constants.afcHtml2, global__doms.view1AdContainer);
    // var onclicks = false
    // gdt_video2.onclick = function () {
    //   console.log('呗点击啊')
    //   if (onclicks) {
    //     gdt_3.style.display = 'none'
    //     view1Module.showGameFrameContainer();

    //     if (loadCall) {
    //       loadCall()
    //     }
    //   }
    // }

    // var process = document.getElementById('progress')
    // process.innerText = ''
    // var pss = 0
    // process.style.width = '0%'
    // var o = setInterval(function () {
    //   pss++
    //   process.style.width = pss + '%'
    //   pss >= 100 &&
    //     (clearInterval(o),
    //     setTimeout(function () {
    //       onclicks = true
    //       process.innerText = 'PLAY'
    //     }, 1e3))
    // }, 80)

    // gdt_video2.style.display = 'block'
    // gdt_video.style.display = 'none'
    // view1Module.hideGameFrameContainer()
    // global__utils.generateAd(global_constants.afcHtml2, global__doms.dynamicAfcContainer);
  } else {
    afgVisible = true;
    var afgType = global__utils.getAfgType(arguments);
    var forceNext = false;
    // var list = [];
    // if (list.some(function(item) {
    //    return window.location.href.indexOf(item) > -1
    // })) {
    //   forceNext = true;
    // }

    broadcastAdShow();
    function showReward() {
      var afgOption = {
        type: 'reward',
        name: 'game_reward',
        beforeAd: () => {
          console.log('beforeAd')
          gdt_video2.style.display = 'none'
          gdt_3.style.display = 'none' // 不需要展示
        },
        beforeReward(showAdFn) {
          // console.log('beforeReward')
          showAdFn && showAdFn()
        },
        adDismissed() {
          // console.log('adDismissed')
        },
        adViewed() {
          // console.log('adViewed')
        },
        afterAd: () => {
          // console.log('afterAd')
          // afgVisible = false
          // loadCall && loadCall()
          // this.next()
        },
        adBreakDone:() => {
          // adBreakDone不论广告是否出都会执行，而afterAd只会在广告出的时候才会执行
          console.log('afterAd')
          // view1Module.showGameFrameContainer();
          gdt_3.style.display = 'none'
          afgVisible = false;
          broadcastAdHide();
          if (loadCall) {
            loadCall()
          }
        }
      };

      if (isGame('fruitkiller') || isGame('/games/Typhoon-Killer-Io/') || isGame('/games/House-Paint-Puzzle/')) {
        showMyAfg(afgOption)
      } else {
        adBreak(afgOption);
      }
      
    }

    function showNext() {
      var afgOption = {
        type: 'next',
        name: 'game_pause',
        beforeAd: () => {
          console.log('beforeAd')
          gdt_video2.style.display = 'none'
          gdt_3.style.display = 'none'
        },
        afterAd: () => {
          // console.log('afterAd')
          // view1Module.showGameFrameContainer();
          gdt_3.style.display = 'none'
          afgVisible = false;
          broadcastAdHide();
          if (loadCall) {
            loadCall()
          }
        },
      };

      if (useNewInterstitial()) {
        showInterstitial({
          code: global_constants.afcHtml2,
          getGameUrl: function(key) {
            return 'https://hippofunnygame.com/games/'+ key + '/index.html';
          },
          beforeAd: afgOption.beforeAd,
          afterAd: afgOption.afterAd,
        })
      } else {
        adBreak(afgOption);

        if (!useOldAfg) {
          var startTime = Date.now();
          var timer = setInterval(function() {
            if (isAfgAvailable()) {
              clearInterval(timer);
            } else {
              var now = Date.now();
              if (now - startTime > 200) {
                clearInterval(timer);
                // if (forceNext) {
                  afgOption.afterAd();
                // } else {
                //   afgOption.afterAd = function() {};
                //   showReward();
                // }
    
              }
            }
          }, 10)
        }
      
      }
    }

    // if(window.location.href.indexOf('Elastic-Car') >= 0) {
    //   var rand = Math.random();
    //   if (rand < 0.5) {
    //     return showReward();
    //   } else {
    //     return showNext();
    //   }
    // }

    // console.log(option.__type__)
    if (option.__type__ === 'reward' || needRAD()) {
      if (afgType === 'reward') {
        return showReward();
      } else {
        return showNext();
      }
    } else if (option.__type__ === 'interstitial') {
      return showNext();
    }

    if (forceNext) {
      afgType = 'next';
    }
    // console.log('afgType', afgType)
    if (afgType === 'reward' || needRAD()) {
      showReward()
    } else {
      showNext()
    }

  }
}
// setLoadingVisible(true)

function setBannerVisible(index, visible) {
//   if (index != 1) {
//     return
//   }
//   var div = document.getElementById('gdt_' + index)
//   if (visible) {
//     div.style.display = 'block'
//     div.style.zIndex = '8999'
//   } else {
//     div.style.display = 'none'
//   }
}
// setBannerVisible(1, true)


// hechengqiangshou 'watermelon','Typhoon-Killer-Io','fruitkiller',
// 'roller-ski-queen' 'matchman', '21clock','ludo','8ballpool',
function needPlayBtnAd() {
  // var keys = ['cricket-Legends', 'Super-Baseball', 'subway2', 'boxing-super-star',
  //   'train-taxi', '3D-tiger-run-game-snacks', 'table-tennis', 'Be-King',
  //   'Cube-Mania', 'Bump-Io', 'royal-archers', 'Lick-Em-All', 'Blob-Giant-3d',
  //   'grid-blocks-puzzle', 'Farmers-Io', 'funrace3d', 
  //   'FireBlocks', 'armedroad', 'crowdcity', 'bearsstacktracks', 'realboxing', 'coolgoal', 'DriveTaxi', 'cricket', 
  //   'streetballmaster', 'BombBalls3D', 'drawclimber', 'boatrush', 'Master-Thief',
  //   'RoadFury', 'Spiral-Roll', 'Super-Word-Search-Pro', 'Water-Sort', 'archerwarrior',
  //   'furiousracing', 
  //   'moto-rush', 'Santa-Run'
  // ];
  // var keys = ['santa-run', '21clock', 'Call-Of-Duty', 'Call-Of-Duty-Shooting-King', 'zombie-road'];
  // var keys = ['Call-of-Duty', 'nitro', '21clock'];
  if (forceNoPlayBtnAd) return false;
  var keys = ['Call-of-Duty', 'nitro', '21clock',
  'Cupcake-Shop', 'roller-ski-queen', 'food-pusher-challenge', 'matchman', 'car-zigzag-3d', 'bearsstacktracks', 'sky-war', 'moto-rush', 'Pick-Me-Up', 'brainstorm', 'funrace3d', 'Bounce-Big-Online']
  if (isDanfa) {
    keys = ['Call-of-Duty', 'nitro', '21clock', 'Typhoon-Killer-Io', 'Elastic-Car'];
    return keys.some(key => window.location.href.indexOf(key) >= 0)
  } else {
    var excludes = ['Elastic-Car', 'Color-Fill', 'Elastic-Car', 'Typhoon-Killer-Io', 'House-Paint-Puzzle', 
    // 'fruitkiller', 
    'Hurdle-Rush', 
    'Truck-Deliver-3d',
    'Highway-Racer',
    'ki-King-2022', 'Ski-King-2022',

    ,"Stolen-House","Fire-The-Gun","Kill-The-Monster","Runaway-Truck","Coffee-Stack","Vampire-Princess-Cheerleader-Girl","Street-Fight-Match","Red-Light-Green-Light","PizzaNinjaMania","BrickBlock","Ace-Moto-Rider","Highway-Racer",
    'PizzaNinjaMania',
    "Among-Us-Jigsaw",
    "Car-Race-Master",
    "battleships",
    "tapdashtap",
    "snakeandblocks",
    "War-Parkour",
    "stone-line",
    "Beauty-Clinic-Spa-Salon",
    "Wordscapes",
    "Draw-Duel",
    "Bottle-Shoot",
    "johnnytrigger","Bounce-Big-Online","Lick-Em-All","matchman",
  ];
    return !hitGame(excludes);
  }
  
  // return true;
  // return false;
}

function needFrontLoading() {
  var games = [
    '/games/Car-Race-Master',
    '/global/Elastic-Car-2/',
    "/global/Hurdle-Rush/","/global/Car-Race-Master/","/global/House-Paint-Puzzle/",
  ];
  return hitGame(games);
}

function needPlayBtnTwiceAd() {
  var keys = ['Cupcake-Shop', 'roller-ski-queen', 'food-pusher-challenge', 'matchman', 'car-zigzag-3d', 'bearsstacktracks', 'sky-war', 'moto-rush', 'Pick-Me-Up', 'brainstorm', 'funrace3d', 'Bounce-Big-Online'];
  return isGamesChannel && hitGame(keys);
}

function useNewInterstitial() {
  var includes = ['Call-Of-Duty', 'Call-Of-Duty-Shooting-King', 'zombie-road'];
  var excludes = ['Elastic-Car', 'Typhoon-Killer-Io']; // 这两不上
  return includes.some(key => isGame(key));
}

function isGame(key) {
  return window.location.href.indexOf(key) >= 0;
}

function hitGame(list, url) {
  url = url || location.href;
  return list.some(function(key) {
    return url.indexOf(key) >= 0;
  })
}

function needRAD() {
  // var keys = ['funrace3d', 'merge-fish', 'archeryking', 'i-like-oj', 'Sky-Roller-Online', 
  // 'thesaloon', 'Draw-Archer', 'cool-run-3d', 'PizzaNinjaMania', 'BrickBlock', 
  // 'Pick-Me-Up', 'Giant-Rush', 'Bumper-Io', 'guns-and-bottles2', 'DragRacingClub', 
  // 'Ice-Man-3d', 'Idle-Ants', 'NeonBiker', 'Length-Draw', 'Cube-Mania'];
  // return keys.some(key => window.location.href.indexOf(key) >= 0)
  return false;
}


/**
 * 
 * @param {*} option 
 * @param {*} option.beforeAd
 * @param {*} option.afterAd
 * @param {*} option.code
 * @param {*} option.getGameUrl
 * @param {*} option.showToast
 * 
 * 
 */
function showInterstitial(option) {
  option.beforeAd && option.beforeAd();
  var games = [
    {
      key: 'Call-of-Duty',
      name: 'Call of Duty',
      icon: '/common/imgs/recommend-game-icon/Call-of-Duty.png'
    },
    {
      key: 'fruitkiller',
      name: 'Fruit Killer',
      icon: '/common/imgs/recommend-game-icon/fruitkiller.png'
    },
    {
      key: 'matchman',
      name: 'Matchman',
      icon: '/common/imgs/recommend-game-icon/matchman.png'
    },
    {
      key: 'Elastic-Car',
      name: 'Elastic Car',
      icon: '/common/imgs/recommend-game-icon/Elastic-Car.png'
    },
    {
      key: 'hechengqiangshou',
      name: 'Crack Shot 3D',
      icon: '/common/imgs/recommend-game-icon/hechengqiangshou.png'
    },
    {
      key: '21clock',
      name: 'BlackJack',
      icon: '/common/imgs/recommend-game-icon/21clock.png'
    },
    {
      key: 'Typhoon-Killer-Io',
      name: 'Typhoon Killer Io',
      icon: '/common/imgs/recommend-game-icon/Typhoon-Killer-Io.png'
    },
    {
      key: 'ludo',
      name: 'ludo',
      icon: '/common/imgs/recommend-game-icon/ludo.png'
    },
    {
      key: 'bikerush',
      name: 'Bike Rush',
      icon: '/common/imgs/recommend-game-icon/bikerush.png'
    },
  ];
  var root = document.createElement('div');
  root.classList.add('interstitial-root');
  root.innerHTML = '<div class="ir-header"></div>\
    <div class="ad-container-wrapper"><div class="ad-container"></div></div>\
    <div class="continue btn">Continue Games</div>\
    <div class="more-games">\
      <div class="more-game-header"></div>\
      <div class="more-game-list"></div>\
    </div>\
    <div><textarea class="ir-textarea"></textarea></div>\
    <div class="submit-btn btn">Submit</div>\
  \
  ';

  var textarea = root.querySelector('.ir-textarea');
  var adEle = root.querySelector('.ad-container');

  var gameItemsHtml = games.reduce(function(sum, item) {
    var url = option.getGameUrl(item.key);
    return sum += '<a class="more-game-item" href="'+url+'">\
      <img class="game-icon" src="'+ item.icon+ '">\
      <span class="game-name">'+item.name+'</span>\
    </a>'
  }, '');
  root.querySelector('.more-game-list').innerHTML = gameItemsHtml;
  document.body.appendChild(root);
  global__utils.generateAd(option.code, adEle);
  function handleClose() {
    root.parentElement.removeChild(root);
    option.afterAd && option.afterAd();
  }
  function handleSubmit() {
    setTimeout(function() {
      (option.showToast || showToast)('Submitted successfully!');
      textarea.value = '';
    }, 200)
  }
  setTimeout(function() {
    root.querySelector('.continue.btn').addEventListener('click', handleClose);
  }, 2500)
  root.querySelector('.submit-btn.btn').addEventListener('click', handleSubmit);
}

function myShowInterstitial (afgOption) {
  return showInterstitial({
    code: global_constants.afcHtml2,
    getGameUrl: function(key) {
      return 'https://hippofunnygame.com/games/'+ key + '/index.html';
    },
    beforeAd: afgOption.beforeAd,
    afterAd: afgOption.afterAd,
  })
}

function showToast(msg) {
  var div = document.createElement('div')
  div.classList.add('toast-root');
  div.innerHTML = msg;
  div.addEventListener('animationend', function() {
    div.parentElement.removeChild(div);
  });
  document.body.appendChild(div);
}

function showMyAfg(opt) {
  opt = opt || {};
  var clickCounter = opt.clickCounter || 5;
  var autoCloseCounter = opt.autoCloseCounter || 15;
  var root = document.createElement('div');
  root.classList.add('oafg-container')
  root.innerHTML = '<div class="oafg-inner"></div>\
    <div class="foot-action-wrapper">\
      <div class="click-counter">'+clickCounter+'</div>\
      <div class="click-btn"><div class="click-btn-inner">Skip Ad <img src="../../common/imgs/oafg-play.png" width="15" height="17"/></div></div>\
      <div class="close-counter">Ad will close in 0:<span class="close-remain">'+ (autoCloseCounter > 9 ? autoCloseCounter : '0' + autoCloseCounter) +'</span>\
    </div>\
  ';

  var clickBtn = root.querySelector('.click-btn');
  var clickCunter = root.querySelector('.click-counter');
  var closeRemain = root.querySelector('.close-remain');

  document.body.appendChild(root);
  var adInner = root.querySelector('.oafg-inner');
  var adString = '<ins class="adsbygoogle"\
  style="display:block"\
  data-ad-client="ca-pub-2131565486152375"\
  data-ad-slot="7099154377"\
  data-ad-format="auto"\
  data-full-width-responsive="true"></ins>';

  opt.beforeAd && opt.beforeAd();

  var timer;

  function closeAd() {
    document.body.removeChild(root);
    opt.afterAd && opt.afterAd();
    opt.adBreakDone && opt.adBreakDone();
    clearInterval(timer);
  }

  clickBtn.addEventListener('click', function() {
    closeAd()
  })

  setTimeout(function() {
    global__utils.generateAd(adString, adInner);
    
    timer = setInterval(function() {
      clickCounter--;
      autoCloseCounter--;
      clickCunter.innerText = clickCounter;
      closeRemain.innerText = autoCloseCounter > 9 ? autoCloseCounter : '0' + autoCloseCounter; 
      if (clickCounter === 0) {
        clickCunter.style.display = 'none';
        clickBtn.style.display = 'inline-block';
      }
      if (autoCloseCounter === 0) {
        closeAd();
      }
    }, 1000)
  })

}


// var needRefresh = false;
function enableAdWhenComeBack() {
  var visibleChangeListener = function () {
    console.log(
      'visibilitychange',
      document.visibilityState,
      // needRefresh
    );
    if (document.visibilityState === 'visible') {
      // if (needRefresh) {
      //   needRefresh = false;
      //   setLoadingVisible(true, false, function() {}, {
      //     __type__: 'interstitial'
      //   })
      // }
      // console.log('needRefresh', needRefresh)
    } else {
      // needRefresh = true;
      // console.log('needRefresh', needRefresh)
      insertSk({
        onClick: function() {
          track('ads_pause');
          global__utils.CYSDK && global__utils.CYSDK.track('ads_pause');
          setLoadingVisible(true, false, function() {}, {
            __type__: 'interstitial'
          })
        }
      })
    }
  };

  document.addEventListener('visibilitychange', visibleChangeListener);
}


  enableAdWhenComeBack();


function insertSk(option) {
  if (document.querySelector('.tsk')) return;
  var div = document.createElement('div');
  div.classList.add('tsk');
  div.style.position = 'fixed';
  div.style.top = 0;
  div.style.left = 0;
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.zIndex = '9999999';
  document.body.appendChild(div);
  bindSkEvent(div, option);
  track('imp_pause');
  global__utils.CYSDK && global__utils.CYSDK.track('imp_pause');
  return div;
}
function bindSkEvent(sk, option) {
  var TOUCH_STATE = {
    start: 'start',
    move: 'move',
    end: 'end'
  };
  var touchState = '';
  var hideSk = function() {
    // sk.style.display = 'none';
    setTimeout(function() {
      sk.style.display = 'none';
    }, 0);
  };
  var showSk = function() {
    setTimeout(function() {
      sk.style.display = 'block';
    }, 0);
  };
  var removeSk = function() {
    sk.removeEventListener('touchstart', handleSkTouchStart)
    sk.removeEventListener('touchmove', handleSkTouchMove)
    sk.removeEventListener('touchend', handleSkTouchEnd)
    sk.parentElement.removeChild(sk);
  };
  var handleSkTouchStart = function() {
    // logger.log('handleMaskTouchStart');
    touchState = TOUCH_STATE.start;
    hideSk();
  };
  var handleSkTouchMove = function() {
    // logger.log('handleMaskTouchMove');
    touchState = TOUCH_STATE.move;
  };
  var handleSkTouchEnd = function() {
    // logger.log('handleMaskTouchEnd');
    if (touchState === TOUCH_STATE.move) {
      showSk();
    } else {
      handleClick();
    }
  };
  function handleClick() {
    removeSk();
    option.onClick && option.onClick();
  }
  sk.addEventListener('touchstart', handleSkTouchStart)
  sk.addEventListener('touchmove', handleSkTouchMove)
  sk.addEventListener('touchend', handleSkTouchEnd)
}

function showFrontLoading() {
  var generateAd = window.generateAd || (window.global__utils && window.global__utils).generateAd;
  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.zIndex = 999999999;
  container.style.left = 0;
  container.style.top = 0;
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.paddingTop = '64.0741vw'; 
  container.style.textAlign = 'center';
  container.style.background = '#FFFDE9';
  container.style.boxSizing = 'border-box';

  var logo = document.createElement('img');
  logo.src = '/common/imgs/fw-logo.png';
  logo.style.width = '61.2037vw';
  logo.style.height = '23.6111vw';
  logo.style.marginBottom = '7.3148vw';

  var loadingBtn = document.createElement('div');

  loadingBtn.style.width = '58.1481vw';
  loadingBtn.style.margin = '0 auto';
  loadingBtn.style.height = '7.5vw';
  loadingBtn.style.lineHeight = '7.5vw';
  loadingBtn.style.background = '#edece0';
  loadingBtn.style.borderRadius = '3.75vw';
  loadingBtn.style.fontSize = '2.6852vw';
  loadingBtn.style.fontWeight = 'bold';
  loadingBtn.style.color = '#4D413C';
  loadingBtn.style.textAlign = 'center';
  loadingBtn.style.position = 'relative';

  var loadingBtn__text = document.createElement('div');
  loadingBtn__text.textContent = 'Loading...';
  loadingBtn__text.style.position = 'relative';
  loadingBtn__text.style.zIndex = 2;

  var loadingBtn__inner = document.createElement('div');
  loadingBtn__inner.style.background = '#FEC513';
  loadingBtn__inner.style.width = '0%';
  loadingBtn__inner.style.height = '100%';
  loadingBtn__inner.style.position = 'absolute';
  loadingBtn__inner.style.zIndex = 1;
  loadingBtn__inner.style.borderRadius = '3.75vw';

  loadingBtn.appendChild(loadingBtn__inner);
  loadingBtn.appendChild(loadingBtn__text);

  var adContainer = document.createElement('div');
  adContainer.style.position = 'absolute';
  adContainer.style.bottom = '0';
  adContainer.style.left = '0';
  adContainer.style.width = '100%';
  adContainer.style.height = '50px';

  container.appendChild(logo);
  container.appendChild(loadingBtn);
  container.appendChild(adContainer);

  document.body.appendChild(container);

  var code = '<ins class="adsbygoogle" \
  style="display:inline-block;width:320px;height:50px" \
  data-ad-client="ca-pub-2131565486152375" \
  data-ad-slot="1962599841"></ins>';

  generateAd(code, adContainer);

  var progress = 0;
  var totalTime = 4000;

  var finish = function() {
    document.body.removeChild(container);
  }
  var timer = setInterval(function() {
    progress++;
    if (progress >= 100) {
      clearInterval(timer);
      loadingBtn__inner.style.width = '100%';
      finish();
    } else {
      loadingBtn__inner.style.width = progress + '%';
    }
  }, totalTime/100);
}

function showOldAfg(callback) {
  if (!window.initAds) {
    console.error('no initAds')
    callback && callback();
    return;
  }
  var gdt_3 = document.getElementById('gdt_3');
  var gdt_video = document.getElementById('gdt_video')

  var gdt_video2 = document.getElementById('gdt_video2')

  gdt_3.style.display = 'block';
  gdt_video2.style.display = 'none'; // afc
  gdt_video.style.display = 'block';

  var adContainer = document.getElementById('adContainer')

  while (adContainer.hasChildNodes()) {
    //当div下还存在子节点时 循环继续, 删除已经展示过的的广告，重新生成
    adContainer.removeChild(adContainer.firstChild)
  }
  window.initAds(window.ads1, function() {
    gdt_3.style.display = 'none';
    gdt_video.style.display = 'none';
    callback && callback()
  })
}