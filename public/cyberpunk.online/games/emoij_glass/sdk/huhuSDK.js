window.HUHU = {
    _callback: null,
    _failback: null,
};

var interval = 30;
var huhu_s = Date.parse(new Date()) / 1000;

window.huhuAd = () => {
    var e = Date.parse(new Date()) / 1000;
    var i = e - huhu_s;
    console.log("interval time = " + i);
    if (i >= 30) {
        huhu_s = e;
        console.log("------------ad1----------------");
        try {
            window.parent.postMessage("open", "*");
        } catch (e) {}
    }
};

window.HUHU_showInterstitialAd = function (type) {
   
    if (window.parent != window) {
        window.parent.setLoadingVisible(true, false, () => {
         
        } , { __type__ : 'interstitial'});
     }
};

window.HUHU_showRewardedVideoAd = function (callback, failback) {
    console.log("HUHU_showRewardedVideoAd:");
    if (window.parent != window) {
        window.parent.setLoadingVisible(true, false, (data) => {
          
            if(data && data.reward){
                callback && callback();      
            }else{
                failback && failback();  
            }
        } , { __type__ : 'reward'});
     }
   
};
window.HUHU_setLoadingProgress = (i) => {}
window.onmessage = function (e) {
    e = e || event;
    tempData = e.data + "";
    if (tempData == "close") {
        if (typeof window.HUHU._callback == "function") {
            window.HUHU._callback();
            window.HUHU._callback = null;
        }
    } else if (tempData == "Error") {
        if (typeof window.HUHU._failback == "function") {
            window.HUHU._failback();
            window.HUHU._failback = null;
        }
    }
};

function promptMessage(msg, duration) {
    if (!this.prompt_) {
        this.prompt_ = document.createElement("div");
        this.prompt_.style.cssText = "font-family:siyuan;max-width:80%;min-width:320px;padding:10px 10px 10px 10px;min-height:40px;color: rgb(255, 255, 255);line-height: 20px;text-align:center;border-radius: 4px;position: fixed;top: 40%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(this.prompt_);
    }
    this.prompt_.innerHTML = msg;
    duration = isNaN(duration) ? 2000 : duration;
    this.prompt_.style.display = "inline";
    this.prompt_.style.opacity = "1";
    setTimeout(function () {
        var d = 0.5;
        this.prompt_.style.webkitTransition = "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
        this.prompt_.style.opacity = "0";
        this.prompt_.style.display = "none";
    }.bind(this), duration);
}