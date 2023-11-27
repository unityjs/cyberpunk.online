window.__require = function e(t, o, a) {
    function i(s, r) {
        if (!o[s]) {
            if (!t[s]) {
                var c = s.split("/");
                if (c = c[c.length - 1],
                    !t[c]) {
                    var d = "function" == typeof __require && __require;
                    if (!r && d)
                        return d(c, !0);
                    if (n)
                        return n(c, !0);
                    throw new Error("Cannot find module '" + s + "'")
                }
            }
            var l = o[s] = {
                exports: {}
            };
            t[s][0].call(l.exports, function (e) {
                return i(t[s][1][e] || e)
            }, l, l.exports, e, t, o, a)
        }
        return o[s].exports
    }
    for (var n = "function" == typeof __require && __require, s = 0; s < a.length; s++)
        i(a[s]);
    return i
} ({
    Changemodel: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "0baacycEiJG6biHcQPvz6UK", "Changemodel"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = e("./weChatApi/WXApi")
            , n = cc._decorator
            , s = n.ccclass
            , r = n.property
            , c = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.tickcountLabel = null,
                        t.n1 = null,
                        t.n2 = null,
                        t.n3 = null,
                        t.rankNode = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.onEnable = function () {
                        this.updataTict(),
                            this.updataShareCount()
                    }
                    ,
                    t.prototype.updataTict = function () {
                        this.tickcountLabel.getComponent(cc.Label).string = a.default.shareGameData.tickCount.toString()
                    }
                    ,
                    t.prototype.updataShareCount = function () {
                        2 == a.default.shareGameData.t_video ? this.n1.active = !1 : (this.n1.getChildByName("count").getComponent(cc.Label).string = "\u53ef\u89c2\u770b" + (2 - a.default.shareGameData.t_video) + "\u6b21",
                            this.n1.active = !0),
                            2 == a.default.shareGameData.t_share ? this.n2.active = !1 : (this.n2.active = !0,
                                this.n2.getChildByName("count").getComponent(cc.Label).string = "\u53ef\u89c2\u770b" + (2 - a.default.shareGameData.t_share) + "\u6b21")
                    }
                    ,
                    t.prototype.helpBtnCB = function () {
                        this.n3.active = !0
                    }
                    ,
                    t.prototype.rankBtnCB = function (e, t) {
                        this.rankNode.active = !0
                    }
                    ,
                    t.prototype.startModelBtnCB = function (e, t) {
                        var o = this;
                        a.default.shareGameData.tickCount = 3,
                            a.default.shareGameData.tickCount > 0 && i.default.HttpPost("/api/sgkx/useTicket", {
                                open_id: i.default.OpenId
                            }, function (e, i) {
                                a.default.shareGameData.tickCount = i.c_ticket,
                                    o.updataTict(),
                                    1 == t ? (a.default.shareGameData.gameModel = 1,
                                        cc.director.loadScene("gameScene")) : 2 == t && (a.default.shareGameData.gameModel = 2,
                                            cc.director.loadScene("gameScene"))
                            })
                    }
                    ,
                    t.prototype.shareBtnCB = function (e, t) {
                        var o = this;
                        1 == t ? i.default.OpenAdVides(function () {
                            a.default.shareGameData.tickCount >= 6 || i.default.HttpPost("/api/sgkx/ticketVideoAndShare", {
                                open_id: i.default.OpenId,
                                type: 2
                            }, function (e, t) {
                                a.default.shareGameData.t_video = t.t_video,
                                    a.default.shareGameData.tickCount = t.c_ticket,
                                    o.updataShareCount(),
                                    o.updataTict()
                            })
                        }) : 2 == t && i.default.OpenShare(1, {}, !1, !1, function () {
                            a.default.shareGameData.tickCount >= 6 || i.default.HttpPost("/api/sgkx/ticketVideoAndShare", {
                                open_id: i.default.OpenId,
                                type: 1
                            }, function (e, t) {
                                a.default.shareGameData.t_share = t.t_share,
                                    a.default.shareGameData.tickCount = t.c_ticket,
                                    o.updataShareCount(),
                                    o.updataTict()
                            })
                        })
                    }
                    ,
                    __decorate([r(cc.Node)], t.prototype, "tickcountLabel", void 0),
                    __decorate([r(cc.Node)], t.prototype, "n1", void 0),
                    __decorate([r(cc.Node)], t.prototype, "n2", void 0),
                    __decorate([r(cc.Node)], t.prototype, "n3", void 0),
                    __decorate([r(cc.Node)], t.prototype, "rankNode", void 0),
                    t = __decorate([s], t)
            } (cc.Component);
        o.default = c,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./weChatApi/WXApi": "WXApi"
    }],
    WXApi: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "bf8cauhwvRHRJVsjljIpfSw", "WXApi"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("../gameData")
            , i = (e("md5"),
                e("config"),
                e("WonderJsSdk"),
                cc._decorator)
            , n = i.ccclass
            , s = (i.property,
                function () {
                    function e() {
                        this.tex = null
                    }
                    var t;
                    return t = e,
                        e.setSubCover = function (e, t) {
                            void 0 === t && (t = !0)
                        }
                        ,
                        e.GetLaunchParam = function (e) { }
                        ,
                        e.Login = function (e) {
                            this.isBaiDu ? e(!0, t.OpenId) : (console.log("pc"),
                                e(!0, t.OpenId))
                        }
                        ,
                        e.SetUserKV = function (e, o, a, i) {
                            if (void 0 === i && (i = null),
                                console.log("\u8bb0\u5f55\u5206\u6570", e, o, a),
                                this.isBaiDu) {
                                var n = new XMLHttpRequest;
                                n.open("POST", "" + t.Url + t.UserKVUrl, !0),
                                    n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
                                    n.onreadystatechange = function () {
                                        if (4 == n.readyState && 200 == n.status) {
                                            var e = JSON.parse(n.responseText);
                                            if (console.log("\u670d\u52a1\u5668\u56de\u8c03\u6570\u636e", n.responseText),
                                                null != i) {
                                                i("ok", e.data),
                                                    console.log(n.responseText)
                                            }
                                        }
                                    }
                                    ,
                                    n.send("gold=" + o + "&open_id=" + t.OpenId + "&score=" + e + "&grade=" + e + "&food_arr=" + a)
                            } else
                                null != i && i("ok")
                        }
                        ,
                        e.OpenShare = function (e, o, a, i, n) {
                            void 0 === e && (e = 1),
                                void 0 === o && (o = {}),
                                void 0 === a && (a = !1),
                                void 0 === i && (i = !1),
                                this.isBaiDu ? i ? tt.shareAppMessage({
                                    title: "",
                                    imageUrl: canvas.toTempFilePathSync({
                                        destWidth: 500,
                                        destHeight: 400
                                    })
                                }) : (tt.shareAppMessage(t.GetShareRandom(e, o, n)),
                                    null != n && (t.ShareFun = n),
                                    t.shareTimeCheck = Date.now()) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS ? (console.log("\u5206\u4eab\u53c2\u6570", o),
                                        jsb.reflection.callStaticMethod("AppController", "iosShareWithTitle:"),
                                        window.iOSSendMsg(function (e) {
                                            return console.log("ios oc\u4f20\u8fc7\u6765\u7684" + e),
                                                cc.game.emit(e),
                                                "abcd"
                                        })) : (console.log("\u5206\u4eab\u53c2\u6570", o),
                                            null != n && n())
                        }
                        ,
                        e.CloseOverStep = function () {
                            this.isBaiDu && (t.SubCover.active = !1,
                                t.WXSubCoverView.enabled = !1,
                                this.PostMsg({
                                    Action: "CloseOverStep"
                                }))
                        }
                        ,
                        e.OpenOverStep = function (e, t) {
                            void 0 === t && (t = 1)
                        }
                        ,
                        e.OpenFriendListSmall = function (e, o) {
                            (void 0 === e && (e = 0),
                                void 0 === o && (o = 0),
                                this.isBaiDu) && (t.WXSubCoverView.enabled = !0,
                                    t.SubCover.active = !0,
                                    tt.getOpenDataContext().postMessage({
                                        Action: "ShowFriendSmall",
                                        offw: o,
                                        Posy: e,
                                        MyOpid: t.OpenId
                                    }))
                        }
                        ,
                        e.CloseFriendListSmall = function () {
                            this.isBaiDu && (t.WXSubCoverView.enabled = !1,
                                t.SubCover.active = !1,
                                this.PostMsg({
                                    Action: "CloseFriendSmall"
                                }))
                        }
                        ,
                        e.GetUserInfo = function () {
                            this.isBaiDu && this.PostMsg({
                                Action: "GetUserInfo"
                            })
                        }
                        ,
                        e.DoVibrate = function (e) {
                            this.isBaiDu && 1 == t.isOpendVibrate && navigator.vibrate && (e ? navigator.vibrate(100) : navigator.vibrate(300))
                        }
                        ,
                        e.OpenAlert = function (e) {
                            this.isBaiDu && tt.showToast({
                                title: e,
                                duration: 2e3,
                                mask: !0,
                                icon: "success",
                                success: function () { },
                                fail: function () { },
                                complete: function () { }
                            })
                        }
                        ,
                        e.PostMsg = function (e) {
                            this.isBaiDu && tt.getOpenDataContext().postMessage(e)
                        }
                        ,
                        e.CheckKeyCount = function (e, t) {
                            return void 0 === t && (t = !0),
                                0
                        }
                        ,
                        e.ShowBestRank = function (e) { }
                        ,
                        e.CloseBestRank = function () {
                            this.isBaiDu && (t.WXSubCoverView.enabled = !1,
                                t.SubCover.active = !1,
                                this.PostMsg({
                                    Action: "CloseBestRank"
                                }))
                        }
                        ,
                        e.GetShareRandom = function (e, o, a) {
                            void 0 === e && (e = 1);
                            var i = Math.floor(Math.random() * t.share_img.length);
                            console.log("----", t.share_img, i);
                            var n = t.share_img[i];
                            console.log("\u5206\u4eab\u4fe1\u606f", n);
                            var s = n.title ? n.title : ""
                                , r = n.image ? n.image : "";
                            return console.log(r, s),
                                o = {
                                    shaImgIndex: "v_" + t.share_img_v + "_id_" + i
                                },
                                {
                                    title: s,
                                    imageUrl: r,
                                    query: t.parseObjUrlPara(o),
                                    success: function (e) {
                                        console.log("share succss:", e)
                                    },
                                    fail: function () {
                                        console.log("share fail:")
                                    }
                                }
                        }
                        ,
                        e.parseObjUrlPara = function (e) {
                            var t = "";
                            for (var o in e)
                                e.hasOwnProperty(o) && (t += o + "=" + e[o] + "&");
                            return t.substring(0, t.length - 1)
                        }
                        ,
                        e.showNextOver = function (e) { }
                        ,
                        e.hideNextOver = function () {
                            this.isBaiDu && (t.WXSubCoverView.enabled = !1,
                                t.SubCover.active = !1,
                                this.PostMsg({
                                    Action: "hideNextOver"
                                }))
                        }
                        ,
                        e.ksort = function (e) {
                            var t = Object.keys(e).sort()
                                , o = {};
                            for (var a in t)
                                o[t[a]] = e[t[a]];
                            return o
                        }
                        ,
                        e.HttpPost = function (e, o, a) {
                            if (a && 0 == t.isBaiDu) {
                                a("", {})
                            } else {
                                console.log("\u8bf7\u6c42\u6570\u636e", e, o);
                                var i = {};
                                if ("/index.php/api/shui_guo_da_shi/Get_all_data" === e)
                                    for (var n = o.keys.split(","), s = 0; s < n.length; s++) {
                                        i[d = n[s]] = cc.sys.localStorage.getItem(d)
                                    }
                                else if ("/index.php/api/shui_guo_da_shi/Get_game_data" === e)
                                    i.data_info = cc.sys.localStorage.getItem(o.key);
                                else if ("/index.php/api/shui_guo_da_shi/Save_multi_game_data" === e) {
                                    var r = JSON.parse(o.data_info);
                                    for (var c in console.log("\u5b58\u50a8\u6570\u636e----", r),
                                        r)
                                        if (r.hasOwnProperty(c)) {
                                            var d = r[c];
                                            if (console.log("element.type", typeof d),
                                                "object" == typeof d) {
                                                if (console.log("\u518d\u6b21\u89e3\u6790"),
                                                    "package_map" === c)
                                                    for (var l in d)
                                                        delete d[l].index_sort,
                                                            delete d[l].page;
                                                d = JSON.stringify(d)
                                            }
                                            cc.sys.localStorage.setItem(c, d)
                                        }
                                } else
                                    "/index.php/api/shui_guo_da_shi/Save_game_data" === e && cc.sys.localStorage.setItem(o.key, o.data_info);
                                a && (console.log("\u6700\u540e\u6570\u636e---", i),
                                    a("\u597d--", i),
                                    a = null)
                            }
                        }
                        ,
                        e.setCurSceneID = function (e) {
                            (void 0 === e && (e = 0),
                                this.isBaiDu) && tt.getOpenDataContext().postMessage({
                                    Action: "setCurSceneID",
                                    nID: e
                                })
                        }
                        ,
                        e.showWorldRank = function (e) {
                            this.isBaiDu && (t.WXSubCoverView.enabled = !0,
                                t.SubCover.active = !0,
                                tt.getOpenDataContext().postMessage({
                                    Action: "showWorldRank",
                                    data: e,
                                    id: t.id
                                }))
                        }
                        ,
                        e.GetSystemInfo = function () {
                            if (this.isBaiDu)
                                return tt.getSystemInfoSync()
                        }
                        ,
                        e.OpenAd = function (e, o, a, i) {
                            var n = this;
                            if (void 0 === e && (e = ""),
                                void 0 === o && (o = 0),
                                void 0 === a && (a = 0),
                                void 0 === i && (i = 208),
                                1 != t.is_banner && this.isBaiDu) {
                                i = 208;
                                var s = tt.getSystemInfoSync()
                                    , r = i || s.screenWidth;
                                if (null != t.AdBanner)
                                    return void (0 == t.isPlingAdv && t.AdBanner.show().then().catch(function (e) {
                                        console.log("\u5e7f\u544a\u7ec4\u4ef6\u51fa\u73b0\u95ee\u9898", e),
                                            n.updataAd()
                                    }));
                                console.log("OpenAd", r, s);
                                var c = 736 * (cc.winSize.height / cc.winSize.width - 1.775) / 4;
                                -1 == a && (c = 0);
                                s.screenWidth,
                                    s.screenHeight,
                                    cc.winSize.height,
                                    s.screenHeight;
                                t.AdBanner = tt.createBannerAd({
                                    adUnitId: t.adId,
                                    style: {
                                        left: .5 * (s.screenWidth - r),
                                        top: s.screenHeight - r / 16 * 9,
                                        width: r
                                    }
                                }),
                                    t.AdBanner.onLoad(function () {
                                        t.AdBanner.show().then().catch(function (e) {
                                            console.log("\u5e7f\u544a\u7ec4\u4ef6\u51fa\u73b0\u95ee\u9898", e),
                                                n.updataAd()
                                        })
                                    })
                            }
                        }
                        ,
                        e.updataAd = function () {
                            1 != t.is_banner && null != t.AdBanner && (console.log("\u5220\u9664\u5e7f\u544a"),
                                t.AdBanner.destroy(),
                                t.AdBanner = null)
                        }
                        ,
                        e.CloseAd = function () {
                            1 != t.is_banner && this.isBaiDu && null != t.AdBanner && t.AdBanner.hide()
                        }
                        ,
                        e.OpenAdVides = function (e, o) {
                            //todo 播放视频
                            void 0 === o && (o = null);
                            t.AdVidesFunCB = e;
                            cc.audioEngine.pauseAll();
                            console.log("00000000--------OpenAdVides");
                            if (this.isBaiDu) {
                                console.log("OpenAdVides");
                                t.isViedoReturn = !1;
                                if (1 == t.isPlayVideo) {

                                    setLoadingVisible(true, true, function () {
                                        t.isPlingAdv = !1;
                                        t.AdVidesFunCB && t.AdVidesFunCB();
                                        cc.audioEngine.resumeAll();
                                    }, {
                                      __type__: 'reward',
                                    })
                                }
                                else {
                                    console.log("333333333333--------");
                                    t.AdVidesFunCB && t.AdVidesFunCB()
                                }
                            }
                            else {
                                console.log("222222222**********");
                                t.AdVidesFunCB && t.AdVidesFunCB()
                            }
                        }
                        ,
                        e.HideAuthorizeBtn = function (e) { }
                        ,
                        e.destroyAuthorizeBtn = function () { }
                        ,
                        e.CreateAuthorizeBtn = function (e, t) { }
                        ,
                        e.bmsHttpPost = function (e, t, o) { }
                        ,
                        e.OpenSchema = function () {
                            var e = tt.getSystemInfoSync();
                            console.log("\u6253\u5f00\u6296\u97f3\u76d2\u5b50---", e),
                                tt.openSchema({
                                    schema: "sslocal://microapp?app_id=ttacffda4233d51d45&launch_from=shuiguodashi"
                                })
                        }
                        ,
                        e.appName = "toutiaoshuiguodashi",
                        e.token = "",
                        e.BMSUrl = "https://game.zuiqiangyingyu.net/",
                        e.share_img_v = 1,
                        e.share_img = [],
                        e.gameList = [],
                        e.js_code = "",
                        e.platform = "toutiao",
                        e.Code2TokeUrl = "",
                        e.UserKVUrl = "",
                        e.Url = "",
                        e.Perfix = "",
                        e.OpenId = "",
                        e.isNewUser = 1,
                        e.OnShowFun = null,
                        e.ShareLabel = ["78888888888888888"],
                        e.GbtnAuthorize = null,
                        e.login_count = 0,
                        e.user_nickName = null,
                        e.user_avatar = null,
                        e.isOpendVibrate = !0,
                        e.area_openSitch = 1,
                        e.is_aotuRecod = 1,
                        e.is_aotuShareRecod = 1,
                        e.is_banner = 1,
                        e.isOpenOncMoreShot = 1,
                        e.isOpenShareRewar = 1,
                        e.isShowViewIcon = 0,
                        e.adId = "fa9a40e2fjjop83h3o",
                        e.adAppId = "e11c1b31",
                        e.vId = "622siikqb6ji2k2l4a",
                        e.AdBanner = null,
                        e.VidoesAd = null,
                        e.AdVidesFunCB = null,
                        e.id = 0,
                        e.shareTimeCheck = -1,
                        e.ShareFun = null,
                        e.toMiniPrograme = !1,
                        e.toMiniProgrameID = 0,
                        e.exitMiniProgramCB = null,
                        e.isBaiDu = !0,
                        e.isTest = !1,
                        e.isPlayVideo = !0,
                        e.isPlingAdv = !1,
                        e.isFirsPlayVido = !0,
                        e.isViedoReturn = !1,
                        e.wondersdk = null,
                        e.isLogin = !0,
                        e.gameRecordMng = null,
                        e.isDouyin = !1,
                        e = t = __decorate([n], e)
                } ());
        o.default = s,
            cc._RF.pop()
    }
        , {
        "../gameData": "gameData",
        WonderJsSdk: "WonderJsSdk",
        config: "config",
        md5: "md5"
    }],
    WonderJsSdk: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "e9501ltJH1D1JYO94Y3wXt0", "WonderJsSdk"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
            return typeof e
        }
            : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            , i = function () {
                function e(e, t) {
                    for (var o = 0; o < t.length; o++) {
                        var a = t[o];
                        a.enumerable = a.enumerable || !1,
                            a.configurable = !0,
                            "value" in a && (a.writable = !0),
                            Object.defineProperty(e, a.key, a)
                    }
                }
                return function (t, o, a) {
                    return o && e(t.prototype, o),
                        a && e(t, a),
                        t
                }
            } ();
        function n(e, t) {
            if (!e)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }
        function s(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        var r = o.apiUrl = {
            gameAdsV2: "/common/game/v2/ads",
            adShit: "/statistics/ad/hit",
            adsShow: "/statistics/ad/show",
            loginLog: "/statistics/login_log",
            statUrl: "/statistics/user_behavior_log",
            shoreList: "/common/game/share_list",
            addRmbPlayer: "/afa99040/v1/product/add_rmb_player"
        }
            , c = {
                1: {
                    code: "weixin",
                    name: "\u5fae\u4fe1\u5e73\u53f0",
                    pid: 1
                },
                2: {
                    code: "taobao",
                    name: "\u6dd8\u91d1\u5e01",
                    pid: 2
                },
                3: {
                    code: "qq",
                    name: "QQ\u5e73\u53f0",
                    pid: 3
                },
                4: {
                    code: "baidu",
                    name: "\u767e\u5ea6\u5c0f\u7a0b\u5e8f",
                    pid: 4
                },
                5: {
                    code: "ios",
                    name: "ios\u5e73\u53f0",
                    pid: 5
                },
                6: {
                    code: "oppo",
                    name: "oppo\u5e73\u53f0",
                    pid: 6
                },
                7: {
                    code: "vivo",
                    name: "vivo\u5e73\u53f0",
                    pid: 7
                },
                8: {
                    code: "toutiao",
                    name: "\u4eca\u65e5\u5934\u6761",
                    pid: 8
                },
                9: {
                    code: "xiaomi",
                    name: "\u5c0f\u7c73",
                    pid: 9
                },
                10: {
                    code: "huawei",
                    name: "\u534e\u4e3a",
                    pid: 10
                },
                99: {
                    code: "other",
                    name: "\u5176\u5b83",
                    pid: 99
                }
            }
            , d = (o.ApiRequst = function () {
                function e(t, o) {
                    s(this, e),
                        this.baseUrl = t,
                        this.pid = o,
                        this.adapterApi = this.adapterCallApi()
                }
                return i(e, [{
                    key: "callApi",
                    value: function (e, t, o, a) {
                        var i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : function (e) { }
                            , n = this.baseUrl + e;
                        try {
                            this.adapterApi(n, t, o, a, i)
                        } catch (e) {
                            "undefined" != typeof XMLHttpRequest && this.xmlHttpRequest(n, t, o, a, i),
                                console.warn("wonder sdk", "\u517c\u5bb9\u5e73\u53f0\u8bf7\u6c42\uff1a", e)
                        }
                    }
                }, {
                    key: "adapterCallApi",
                    value: function () {
                        var e = this
                            , t = {
                                1: function (t, o, a, i) {
                                    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : function (e) { }
                                        ;
                                    e.xmlHttpRequest(t, o, a, i, n)
                                },
                                4: function (t, o, a, i) {
                                    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : function (e) { }
                                        ;
                                    e.xmlHttpRequest(t, o, a, i, n)
                                }
                            };
                        return void 0 !== t[e.pid] ? t[e.pid] : function (t, o, a, i) {
                            var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : function (e) { }
                                ;
                            e.xmlHttpRequest(t, o, a, i, n)
                        }
                    }
                }, {
                    key: "xmlHttpRequest",
                    value: function (e, t, o, a) {
                        var i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : function (e) { }
                            , n = new XMLHttpRequest;
                        n.onreadystatechange = function () {
                            if (4 == n.readyState)
                                if (n.status >= 200 && n.status < 400) {
                                    var e = n.responseText;
                                    i && "function" == typeof i && i(JSON.parse(e))
                                } else {
                                    var t = n.responseText;
                                    console.error("wonder sdk: \u8bf7\u6c42\u5931\u8d25", t)
                                }
                        }
                            ,
                            n.open("POST", e, !0),
                            n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
                        var s = this.parseParams(o);
                        n.send(s)
                    }
                }, {
                    key: "parseParams",
                    value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        try {
                            var t = [];
                            for (var o in e) {
                                var a = encodeURIComponent(o)
                                    , i = encodeURIComponent(e[o]);
                                t.push(a + "=" + i)
                            }
                            return t.join("&")
                        } catch (e) {
                            return ""
                        }
                    }
                }]),
                    e
            } (),
                o.Analysts = function () {
                    function e(t) {
                        if (s(this, e),
                            !c.hasOwnProperty(t))
                            throw new Error("\u672a\u652f\u6301\u6e20\u9053");
                        this.pid = t,
                            this.platform = c[this.pid],
                            this.baseHeader = {
                                Accept: "application/json, */*",
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                    }
                    return i(e, [{
                        key: "doStart",
                        value: function () {
                            console.log("wonder sdk: \u521d\u59cb\u5316")
                        }
                    }, {
                        key: "statEvent",
                        value: function (e, t) {
                            console.log("wonder sdk: \u4e8b\u4ef6\u7edf\u8ba1")
                        }
                    }, {
                        key: "loginLog",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                                is_new_user: !1
                            };
                            console.log("wonder sdk: \u767b\u5f55\u65e5\u5fd7", e)
                        }
                    }, {
                        key: "logger",
                        value: function (e) { }
                    }]),
                        e
                } ())
            , l = (function () {
                function e(t) {
                    s(this, e),
                        this.pid = t;
                    try {
                        if (1 === this.pid)
                            if ("undefined" != typeof wx)
                                void 0 !== wx.getSystemInfoSync().benchmarkLevel ? (this.wechatType = 1,
                                    console.log("wonder sdk: \u5f53\u524d\u662f\u5fae\u4fe1\u5c0f\u6e38\u620f")) : this.wechatType = wx.hasOwnProperty("canIUse") ? 2 : 1;
                            else
                                console.warn("wonder sdk", "\u5f53\u524d\u6e20\u9053\u4e0d\u662f\u5fae\u4fe1\u6e20\u9053\uff01")
                    } catch (e) {
                        console.warn("wonder sdk", "\u5e73\u53f0\u5224\u65ad\u9519\u8bef", e)
                    }
                }
                i(e, [{
                    key: "getPageName",
                    value: function () {
                        var e = "";
                        switch (this.pid) {
                            case 1:
                                try {
                                    if (2 === this.wechatType) {
                                        var t = getCurrentPages();
                                        e = t[t.length - 1].route
                                    } else
                                        e = cc.director.getScene().name
                                } catch (e) {
                                    console.warn("wonder sdk", e)
                                }
                                break;
                            case 2:
                                try {
                                    e = cc.director.getScene().name
                                } catch (e) {
                                    console.warn("wonder sdk", e)
                                }
                        }
                        return e
                    }
                }])
            } (),
                function () {
                    function e() {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 100;
                        s(this, e),
                            this.capacity = t,
                            this._queue = []
                    }
                    return i(e, [{
                        key: "push",
                        value: function (e) {
                            return this._queue.length >= this.capacity ? (console.warn("wonder sdk: \u7f13\u5b58\u961f\u5217\u957f\u5ea6\u5df2\u5927\u4e8e\u6700\u5927\u5bb9\u91cf[", this.capacity, "]\uff0c\u4fdd\u5b58\u5931\u8d25\uff01"),
                                !1) : (this._queue.push(e),
                                    !0)
                        }
                    }, {
                        key: "pop",
                        value: function () {
                            return this._queue.shift()
                        }
                    }, {
                        key: "size",
                        value: function () {
                            return this._queue.length
                        }
                    }, {
                        key: "capacity",
                        value: function () {
                            return this.capacity
                        }
                    }, {
                        key: "isEmpty",
                        value: function () {
                            return 0 === this._queue.length
                        }
                    }]),
                        e
                } ())
            , u = "not setLogin"
            , h = function (e) {
                function t(e, o, a) {
                    s(this, t);
                    var i = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return o ? void 0 == a ? (console.error("wonder sdk", "\u7edf\u8ba1SDK\u521d\u59cb\u5316\u5931\u8d25\uff0c\u7f3a\u5c11\u53c2\u6570isDebug"),
                        n(i)) : "boolean" != typeof a ? (console.error("wonder sdk", "\u7edf\u8ba1SDK\u521d\u59cb\u5316\u5931\u8d25\uff0c\u53c2\u6570isDebug\u7c7b\u578b\u9519\u8bef"),
                            n(i)) : n(i) : (console.error("wonder sdk", "\u7edf\u8ba1SDK\u521d\u59cb\u5316\u5931\u8d25\uff0c\u7f3a\u5c11\u53c2\u6570app_name"),
                                n(i))
                }
                return function (e, t) {
                    if ("function" != typeof t && null !== t)
                        throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                        t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                } (t, d),
                    i(t, [{
                        key: "setLogin",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                                open_id: ""
                            };
                            e.open_id && (console.log("wonder sdk: \u8bbe\u7f6e\u7528\u6237open_id:", e.open_id),
                                t.open_id = e.open_id)
                        }
                    }, {
                        key: "init",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null
                                , t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                                , o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                            this.formAppName = e,
                                this.hasInit || (this.doStart(e, t, o),
                                    console.log("wonder sdk: WonderSDK\u521d\u59cb\u5316\u6210\u529f"),
                                    this.hasInit = !0)
                        }
                    }, {
                        key: "getvesion",
                        value: function () {
                            return "0.0.5"
                        }
                    }, {
                        key: "createMsgBuffer",
                        value: function () {
                            t.requestQueue = new l(100),
                                t.timingSendRequestTask = null,
                                t.timingSendRequestTaskRunTimes = 0
                        }
                    }, {
                        key: "doStart",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null
                                , t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                                , o = {
                                    source: e,
                                    path: arguments[2],
                                    share_enter: t
                                }
                                , a = {
                                    event: "start_up",
                                    param: JSON.stringify(o)
                                };
                            this.statRequest(a)
                        }
                    }, {
                        key: "getAds",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function (e) {
                                console.log("wonder sdk: ", e)
                            }
                                , o = this;
                            try {
                                t.callApi(r.gameAdsV2, "POST", {
                                    app_name: this.app_name
                                }, function (t) {
                                    void 0 !== t.code && 0 === parseInt(t.code) && (o.ads = t.data.list),
                                        e && "function" == typeof e && e(o.ads)
                                })
                            } catch (t) {
                                e && "function" == typeof e && e(o.ads),
                                    console.log("wonder sdk: ", t)
                            }
                        }
                    }, {
                        key: "getSuspendAds",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function () { }
                                , t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "sdk_suspend_ads"
                                , o = []
                                , a = this;
                            0 === a.ads.length ? a.getAds(function (i) {
                                a.ads.forEach(function (e, a) {
                                    e.flag === t && o.push(e)
                                }),
                                    e && "function" == typeof e && e(o)
                            }) : (a.ads.forEach(function (e, a) {
                                e.flag === t && o.push(e)
                            }),
                                e && "function" == typeof e && e(o))
                        }
                    }, {
                        key: "statAdClick",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            arguments[1];
                            if ("object" === (void 0 === e ? "undefined" : a(e))) {
                                if (void 0 === e.ad_id) {
                                    if (void 0 === e.flag || void 0 === e.id)
                                        return void console.error("wonder sdk", "param\u7f3a\u5c11ad_id");
                                    e.ad_id = e.id
                                }
                                var t = {
                                    event: "ad",
                                    param: JSON.stringify({
                                        action: "hit",
                                        name: e.name,
                                        gender: e.gender,
                                        ad_id: parseInt(e.ad_id),
                                        weight: e.weight
                                    })
                                };
                                this.statRequest(t)
                            } else
                                console.error("wonder sdk", "param\u7c7b\u578b\u9519\u8bef\uff0c\u8981\u662f\u5bf9\u8c61")
                        }
                    }, {
                        key: "statAdShow",
                        value: function (e, t) {
                            try {
                                if ("object" !== (void 0 === e ? "undefined" : a(e)))
                                    return void console.error("wonder sdk", "param\u7c7b\u578b\u9519\u8bef\uff0c\u8981\u662f\u5bf9\u8c61");
                                if (void 0 === e.ad_id) {
                                    if (void 0 === e.flag || void 0 === e.id)
                                        return void console.error("wonder sdk", "param\u7f3a\u5c11ad_id");
                                    e.ad_id = e.id
                                }
                                var o = {
                                    event: "ad",
                                    param: JSON.stringify({
                                        action: "show",
                                        name: e.name,
                                        gender: e.gender,
                                        ad_id: parseInt(e.ad_id),
                                        weight: e.weight
                                    })
                                };
                                this.statRequest(o, t)
                            } catch (e) {
                                console.error("wonder sdk: ", e)
                            }
                        }
                    }, {
                        key: "share",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null
                                , t = {
                                    event: "share",
                                    param: JSON.stringify(e)
                                };
                            this.statRequest(t)
                        }
                    }, {
                        key: "pageShow",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                            try {
                                this.start_time = Date.parse(new Date);
                                var t = null === e ? this.platformUtil.getPageName() : e
                                    , o = {
                                        event: "show",
                                        param: JSON.stringify({
                                            page: t
                                        })
                                    };
                                this.statRequest(o)
                            } catch (e) {
                                console.error("wonder sdk: ", e)
                            }
                        }
                    }, {
                        key: "pageHidden",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                            try {
                                this.end_time = Date.parse(new Date);
                                var t = this.end_time - this.start_time
                                    , o = null === e ? this.platformUtil.getPageName() : e
                                    , a = {
                                        event: "hidden",
                                        param: JSON.stringify({
                                            page: o,
                                            durtion: t / 1e3
                                        })
                                    };
                                this.statRequest(a)
                            } catch (e) {
                                console.error("wonder sdk: ", e)
                            }
                        }
                    }, {
                        key: "statRequest",
                        value: function (e, o) {
                            t.callApi(r.statUrl, "POST", Object.assign(e, this.commonparam()), o)
                        }
                    }, {
                        key: "commonparam",
                        value: function () {
                            return {
                                app_name: this.app_name,
                                open_id: t.open_id,
                                platform_name: this.platform.code
                            }
                        }
                    }, {
                        key: "statevent",
                        value: function (e, t) { }
                    }, {
                        key: "loginLog",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                                is_new_user: !1,
                                is_auth: !1
                            };
                            this.statevent("login", {
                                is_new: void 0 !== e.is_new_user && Boolean(e.is_new_user),
                                is_auth: void 0 !== e.is_auth && Boolean(e.is_auth)
                            })
                        }
                    }, {
                        key: "getShoreList",
                        value: function (e) {
                            try {
                                t.callApi(r.shoreList, "GET", this.commonparam(), function (t) {
                                    void 0 !== t.code && 0 === parseInt(t.code) && e && "function" == typeof e && e(t.data.list)
                                })
                            } catch (t) {
                                e && "function" == typeof e && e([]),
                                    console.log("wonder sdk: ", t)
                            }
                        }
                    }, {
                        key: "shoreInfo",
                        value: function (e, t) {
                            var o = []
                                , a = this;
                            try {
                                if (!e)
                                    return void console.error("wonder sdk", "position\u4e0d\u80fd\u4e3a\u7a7a");
                                if (a.shoreList.length > 0)
                                    return a.shoreList.forEach(function (t, a) {
                                        parseInt(t.position) === e && o.push(t)
                                    }),
                                        void (t && "function" == typeof t && t(o));
                                a.getShoreList(function (i) {
                                    a.shoreList = i,
                                        a.shoreList.forEach(function (t, a) {
                                            parseInt(t.position) === e && o.push(t)
                                        }),
                                        t && "function" == typeof t && t(o)
                                })
                            } catch (e) {
                                t(o),
                                    console.error("wonder sdk", e)
                            }
                        }
                    }, {
                        key: "updatePlayerInfo",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            if ("object" === (void 0 === e ? "undefined" : a(e))) {
                                void 0 === e.server_name && (e.server_name = "");
                                var o = {
                                    event: "player_info",
                                    param: JSON.stringify(e)
                                }
                                    , i = JSON.stringify(Object.assign(o, this.commonparam()));
                                t.playerInfo != i && (t.playerInfo = i,
                                    t.playerInfoIsNew = !0,
                                    t.timingSendPlayerInfoTask || t.timingToSendPlayerInfo())
                            } else
                                console.error("wonder sdk", "info\u7c7b\u578b\u9519\u8bef\uff0c\u5fc5\u987b\u662f\u5bf9\u8c61")
                        }
                    }, {
                        key: "initUpdatePlayerInfoTask",
                        value: function () {
                            t.playerInfo = null,
                                t.playerInfoIsNew = !1,
                                t.timingSendPlayerInfoTask = null
                        }
                    }, {
                        key: "playerAccountLog",
                        value: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            if ("object" === (void 0 === e ? "undefined" : a(e))) {
                                void 0 === e.server_name && (e.server_name = "");
                                var t = {
                                    event: "account",
                                    param: JSON.stringify(e)
                                };
                                this.statRequest(t)
                            } else
                                console.error("wonder sdk", "log\u7c7b\u578b\u9519\u8bef\uff0c\u5fc5\u987b\u662f\u5bf9\u8c61")
                        }
                    }], [{
                        key: "timingToSendQueueRequest",
                        value: function () {
                            if (t.timingSendRequestTaskRunTimes += 1,
                                t.open_id != u) {
                                if (t.requestQueue.isEmpty())
                                    return clearInterval(t.timingSendRequestTask),
                                        t.timingSendRequestTask = null,
                                        void console.log("wonder sdk: \u7f13\u51b2\u533a\u6570\u636e\u4e3a\u7a7a\uff0c\u53d6\u6d88\u5b9a\u65f6\u53d1\u9001\u4efb\u52a1");
                                var e = t.requestQueue.pop()
                                    , o = JSON.parse(e);
                                o.data.open_id = t.open_id,
                                    t.callApi(o.apiUrl, o.method, o.data, function (e) {
                                        console.log("wonder sdk:", e)
                                    })
                            } else
                                t.timingSendRequestTaskRunTimes % 4 == 1 && console.warn("wonder sdk: open_id\u672a\u521d\u59cb\u5316:", t.open_id)
                        }
                    }, {
                        key: "saveRequestToQueue",
                        value: function (e, o, a) {
                            var i = {
                                apiUrl: e,
                                method: o,
                                data: a
                            }
                                , n = JSON.stringify(i);
                            t.requestQueue.push(n),
                                console.log("wonder sdk: save to queue", n),
                                t.timingSendRequestTask || (t.timingSendRequestTask = setInterval(t.timingToSendQueueRequest, 500))
                        }
                    }, {
                        key: "callApi",
                        value: function (e, o, i) {
                            var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : function (e) {
                                console.log("wonder sdk:", e)
                            }
                                ;
                            try {
                                if ("object" != (void 0 === i ? "undefined" : a(i)) && (i = JSON.parse(i)),
                                    void 0 != i.open_id && i.open_id == u)
                                    return console.warn("wonder sdk: data.open_id\u672a\u5b9a\u4e49\uff0c\u4fdd\u5b58\u6570\u636e\u5230\u7f13\u51b2\u533a"),
                                        void t.saveRequestToQueue(e, o, i);
                                t.apiRequest.callApi(e, o, i, this.baseHeader, n)
                            } catch (e) {
                                n({
                                    code: 500,
                                    data: {},
                                    msg: "\u670d\u52a1\u5668\u8bf7\u6c42\u5931\u8d25"
                                }),
                                    console.error("wonder sdk", e)
                            }
                        }
                    }, {
                        key: "timingToSendPlayerInfo",
                        value: function () {
                            t.playerInfoIsNew && t.playerInfo && (t.callApi(r.statUrl, "POST", t.playerInfo),
                                t.playerInfoIsNew = !1),
                                t.timingSendPlayerInfoTask || (t.timingSendPlayerInfoTask = setInterval(t.timingToSendPlayerInfo, 3e4))
                        }
                    }]),
                    t
            } ();
        o.default = h,
            t.exports = h,
            cc._RF.pop()
    }
        , {}],
    achItemTip: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "a158aFDrktM855vlLxkl9SK", "achItemTip"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = e("./gameScene")
            , n = cc._decorator
            , s = n.ccclass
            , r = (n.property,
                function (e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.showAchTip = function () {
                            if (a.default.shareGameData.isShowAchTip(),
                                a.default.shareGameData.curAchData) {
                                this.node.active = !0,
                                    this.node.getChildByName("sp").getComponent(cc.Sprite).spriteFrame = i.default.shareGameScene.allKnifeTexturePlist.getSpriteFrame("a" + a.default.shareGameData.curAchData.items[0].ID);
                                var e = a.default.shareGameData.curAchData.needMissionID - a.default.shareGameData.lv
                                    , t = "Gain in " + e + "";
                                0 == e && (t = "Access to customs clearance"),
                                    this.node.getChildByName("cLabel").getComponent(cc.Label).string = t,
                                    this.node.getChildByName("cLabel").stopAllActions(),
                                    this.node.getChildByName("cLabel").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1))))
                            } else
                                this.node.active = !1
                        }
                        ,
                        t = __decorate([s], t)
                } (cc.Component));
        o.default = r,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./gameScene": "gameScene"
    }],
    baohe: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "ff4a8wauJFKK7qK10lwAje1", "baohe"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = e("./weChatApi/WXApi")
            , n = cc._decorator
            , s = n.ccclass
            , r = n.property
            , c = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.surprisedNode = null,
                        t.zhizhen = null,
                        t.isSpining = !1,
                        t.rewardKinfeCallBack = null,
                        t.closeCallBack = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.openBtn = function () {
                        var e = this;
                        1 != this.isSpining && i.default.OpenAdVides(function () {
                            e.startSpin()
                        })
                    }
                    ,
                    t.prototype.startSpin = function () {
                        var e = this
                            , t = [.25, .25, 0, .25, 0, .25];
                        if (a.default.shareGameData.all_phoneMoney >= 20 && a.default.shareGameData.all_phoneMoney < 30 ? t = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6] : a.default.shareGameData.all_phoneMoney >= 30 && a.default.shareGameData.all_phoneMoney < 35 ? t = [1 / 6, 1 / 12, 1 / 3, 1 / 6, 1 / 6, 1 / 12] : a.default.shareGameData.all_phoneMoney >= 35 && a.default.shareGameData.all_phoneMoney < 40 ? t = [1 / 3, 0, 1 / 6, 1 / 12, 1 / 3, 1 / 12] : a.default.shareGameData.all_phoneMoney >= 40 && a.default.shareGameData.all_phoneMoney < 43 ? t = [1 / 3, 0, 1 / 6, 1 / 6, 1 / 3, 0] : a.default.shareGameData.all_phoneMoney >= 43 && a.default.shareGameData.all_phoneMoney < 46 ? t = [1 / 3, 0, 1 / 3, 0, 1 / 3, 0] : a.default.shareGameData.all_phoneMoney >= 46 && (t = [.5, 0, 0, 0, .5, 0]),
                            console.log("\u6b63\u5e38\u62bd\u5956\u6982\u7387----", t),
                            a.default.shareGameData.all_FriutTick >= 6600) {
                            for (var o = 0, i = 0, n = 0; n < t.length; n++) {
                                var s = t[n];
                                0 == n ? (i = t[n],
                                    t[n] = 0) : t[n] > 0 && (o += 1)
                            }
                            i /= o;
                            for (n = 0; n < t.length; n++)
                                t[n] > 0 && (t[n] += i);
                            console.log("\u4fee\u6b63\u62bd\u5956\u6982\u7387----", t)
                        }
                        var r = Math.random();
                        console.log("\u5f53\u524d\u968f\u673a\u6982\u7387", r);
                        var c = 0
                            , d = 0;
                        for (n = 0; n < t.length; n++) {
                            if (r < (s = t[n]) + d) {
                                c = n;
                                break
                            }
                            d += s
                        }
                        1 == a.default.shareGameData.isFirstLuckyDraw && (c = 1,
                            a.default.shareGameData.isFirstLuckyDraw = 0),
                            this.isSpining = !0;
                        var l = 300 + 360 * c / 6 + 10
                            , u = 300 + 360 * (c + 1) / 6 - 10
                            , h = l + Math.random() * (u - l);
                        console.log("\u4e2d\u5956\u533a\u57dfID", c, h),
                            this.zhizhen.stopAllActions(),
                            this.zhizhen.runAction(cc.sequence(cc.rotateTo(4, 3600 + h).easing(cc.easeSineInOut()), cc.callFunc(function () {
                                e.zhizhen.rotation = h,
                                    e.isSpining = !1,
                                    e.showReward(c)
                            })))
                    }
                    ,
                    t.prototype.showReward = function (e) {
                        var t = this;
                        this.node.active = !1;
                        var o = 0;
                        if (0 == e) {
                            o = 50,
                                a.default.shareGameData.all_FriutTick += o;
                            var n = {
                                all_FriutTick: a.default.shareGameData.all_FriutTick,
                                isFirstLuckyDraw: a.default.shareGameData.isFirstLuckyDraw
                            };
                            i.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: i.default.OpenId,
                                data_info: JSON.stringify(n)
                            }, function (e, t) {
                                console.log("\u4fdd\u5b58\u679c\u5708--", a.default.shareGameData.all_FriutTick)
                            });
                            var s = cc.instantiate(this.surprisedNode);
                            this.node.getParent().addChild(s),
                                s.getComponent("surprisedNode").showUI(o, 4)
                        } else if (4 == e)
                            a.default.shareGameData.showTip(1, 2),
                                this.rewardKinfeCallBack && (this.rewardKinfeCallBack(),
                                    this.rewardKinfeCallBack = null);
                        else {
                            1 == e ? o = 3 : 2 == e ? o = .3 : 3 == e ? o = 1 : 5 == e && (o = 2),
                                a.default.shareGameData.all_phoneMoney += o;
                            n = {
                                all_phoneMoney: a.default.shareGameData.all_phoneMoney,
                                isFirstLuckyDraw: a.default.shareGameData.isFirstLuckyDraw
                            };
                            i.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: i.default.OpenId,
                                data_info: JSON.stringify(n)
                            }, function (e, o) {
                                console.log("\u4fdd\u5b58\u8bdd\u8d39--", a.default.shareGameData.all_phoneMoney),
                                    t.closeCallBack && (t.closeCallBack(),
                                        t.closeCallBack = null)
                            });
                            s = cc.instantiate(this.surprisedNode);
                            this.node.getParent().addChild(s),
                                s.getComponent("surprisedNode").showUI(o, 3)
                        }
                    }
                    ,
                    t.prototype.closeBtn = function () {
                        1 != this.isSpining && (this.node.active = !1)
                    }
                    ,
                    t.prototype.setRewardCB = function (e) {
                        this.rewardKinfeCallBack = e
                    }
                    ,
                    t.prototype.setcloseCallBack = function (e) {
                        this.closeCallBack = e
                    }
                    ,
                    __decorate([r(cc.Prefab)], t.prototype, "surprisedNode", void 0),
                    __decorate([r(cc.Node)], t.prototype, "zhizhen", void 0),
                    t = __decorate([s], t)
            } (cc.Component);
        o.default = c,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./weChatApi/WXApi": "WXApi"
    }],
    baozhi: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "e3f0dDGr5tFqrFetTV9wUjt", "baozhi"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.label = null,
                        t.d_arry = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.paleyAct = function () {
                        this.node.getChildByName("2").scale = 1
                    }
                    ,
                    __decorate([n(cc.Prefab)], t.prototype, "label", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    bgEfc: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "c45da38swpDhK9KyLYHoS8D", "bgEfc"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.efcPrefab = null,
                        t.bgEfcSpf = [],
                        t.efcArry = [],
                        t.efcPool = null,
                        t.maxCount = 30,
                        t.removeArry = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.onLoad = function () { }
                    ,
                    t.prototype.start = function () {
                        console.log("\u521d\u59cb\u5316\u80cc\u666f\u6548\u679c"),
                            this.efcPool = new cc.NodePool;
                        for (var e = 0; e < this.maxCount; e++) {
                            var t = cc.instantiate(this.efcPrefab);
                            this.efcPool.put(t)
                        }
                        for (e = 0; e < this.maxCount; e++) {
                            var o = this.createOneEfc();
                            o.position = cc.v2(.5 * -cc.winSize.width + Math.random() * cc.winSize.width, .5 * cc.winSize.height - Math.random() * cc.winSize.height),
                                this.node.addChild(o)
                        }
                    }
                    ,
                    t.prototype.createOneEfc = function () {
                        var e = null;
                        return this.efcPool.size() > 0 ? e = this.efcPool.get() : (e = cc.instantiate(this.efcPrefab),
                            this.efcPool.put(e)),
                            e.getComponent("efcPrefab").initState(),
                            e.getComponent(cc.Sprite).spriteFrame = this.bgEfcSpf[Math.ceil(5 * Math.random())],
                            this.efcArry.push(e),
                            e
                    }
                    ,
                    t.prototype.isRepet = function (e) {
                        for (var t = !1, o = 0; o < this.removeArry.length; o++) {
                            if (this.removeArry[o] == e) {
                                t = !0;
                                break
                            }
                        }
                        return t
                    }
                    ,
                    t.prototype.doDrop = function (e) {
                        var t = this;
                        if (1 == e) {
                            var o = function (e) {
                                var t = 120 * Math.random() - 60
                                    , a = (e.y + .5 * cc.winSize.height + 50) / (50 + 100 * Math.random());
                                e.stopAllActions(),
                                    e.runAction(cc.repeatForever(cc.rotateBy(.3 + Math.random(), t))),
                                    e.runAction(cc.sequence(cc.moveTo(a, cc.v2(e.x - 50 + 100 * Math.random(), .5 * -cc.winSize.height - 50)), cc.callFunc(function () {
                                        e.position = cc.v2(.5 * -cc.winSize.width + Math.random() * cc.winSize.width, .5 * cc.winSize.height + 50),
                                            o(e)
                                    })))
                            };
                            console.log("\u5f00\u59cb\u4e0b\u843d", this.efcArry.length, this.efcArry),
                                this.scheduleOnce(function () {
                                    for (var e = 0; e < t.efcArry.length; e++) {
                                        var a = t.efcArry[e];
                                        o(a)
                                    }
                                })
                        } else {
                            console.log("g\u5173\u95ed\u4e0b\u843d", this.removeArry.length);
                            for (var a = 0; a < this.efcArry.length; a++) {
                                this.efcArry[a].stopAllActions()
                            }
                        }
                    }
                    ,
                    __decorate([n(cc.Prefab)], t.prototype, "efcPrefab", void 0),
                    __decorate([n(cc.SpriteFrame)], t.prototype, "bgEfcSpf", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    bossComeNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "fac4cjs0nZLxbFySXVt9ioT", "bossComeNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = (a.property,
                function (e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.onEnable = function () {
                            var e = this;
                            this.node.getChildByName("pic_jinggao_bg").x = cc.winSize.width,
                                this.node.getChildByName("pic_jinggao_bg").stopAllActions(),
                                this.node.getChildByName("pic_jinggao_bg").runAction(cc.sequence(cc.moveBy(2.5, cc.v2(600, 0)), cc.callFunc(function () {
                                    e.node.active = !1
                                }))),
                                this.node.getChildByName("txt_laixi").stopAllActions(),
                                this.node.getChildByName("txt_laixi").runAction(cc.repeatForever(cc.sequence(cc.fadeTo(.3, 100), cc.fadeTo(.3, 255), cc.delayTime(.4))))
                        }
                        ,
                        t = __decorate([i], t)
                } (cc.Component));
        o.default = n,
            cc._RF.pop()
    }
        , {}],
    bossConbom: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "dddc7u9witGnKcHOYfn8/yB", "bossConbom"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.spfBg = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initConbom = function (e, t) {
                        var o = this;
                        void 0 === e && (e = 0),
                            this.node.getComponent(cc.Sprite).spriteFrame = this.spfBg[e],
                            this.node.position = t,
                            this.node.opacity = 255,
                            this.node.scale = 1,
                            this.node.stopAllActions(),
                            this.node.runAction(cc.spawn(cc.moveBy(.8, cc.v2(0, 100)), cc.sequence(cc.scaleTo(.1, 1.2), cc.scaleTo(0, 1), cc.delayTime(.3), cc.fadeTo(.5, 10), cc.callFunc(function () {
                                o.node.removeFromParent()
                            }))))
                    }
                    ,
                    __decorate([n(cc.SpriteFrame)], t.prototype, "spfBg", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    bossNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "80b0b+rMudIMZVIjJegTsSV", "bossNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./gameScene")
            , n = e("./gameData")
            , s = e("./knife")
            , r = cc._decorator
            , c = r.ccclass
            , d = r.property
            , l = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.bossPrefab = null,
                        t.shootPrefab = null,
                        t.kinfePrefab = null,
                        t.bosskinfePrefab = null,
                        t.bossConbomPrefab = null,
                        t.foodPool = null,
                        t.bossShader = null,
                        t.shootPool = null,
                        t.conbomPos = [],
                        t.bossKnifeArry = [],
                        t.curKinfeCount = 10,
                        t.curBoss = null,
                        t.isBossDead = !1,
                        t
                }
                return __extends(t, e),
                    t.prototype.onLoad = function () {
                        this.foodPool = new cc.NodePool;
                        for (var e = 0; e < 20; e++) {
                            var t = cc.instantiate(this.bossConbomPrefab);
                            this.foodPool.put(t)
                        }
                        this.shootPool = new cc.NodePool;
                        for (e = 0; e < 20; e++) {
                            t = cc.instantiate(this.shootPrefab);
                            this.shootPool.put(t)
                        }
                        for (e = 0; e < 10; e++) {
                            t = cc.instantiate(this.bosskinfePrefab);
                            this.bossKnifeArry.push(t),
                                this.node.addChild(t),
                                t.position = cc.v2(-280 - (cc.winSize.width - 640) / 2, -320 - (cc.winSize.height - 1136) / 2 + 28 * e)
                        }
                    }
                    ,
                    t.prototype.start = function () {
                        this.conbomPos = [cc.v2(36, 100), cc.v2(-170, 130), cc.v2(156, 200)],
                            this.node.on("shootBoss", function (e) {
                                var t = e.getUserData();
                                if (e.stopPropagation(),
                                    this.curBoss) {
                                    var o = this.curBoss.getActionByTag(999);
                                    if (null == o || 1 == o.isDone()) {
                                        console.log("\u6253\u5230boss", t);
                                        var a = 1
                                            , i = -1
                                            , n = 100 * Math.random();
                                        n < 38 ? a = 1 : n >= 38 && n < 68 ? (a = 2,
                                            i = 0) : n >= 68 && n < 88 ? (a = 3,
                                                i = 1) : n >= 88 && n < 98 ? (a = 5,
                                                    i = 2) : (a = 10,
                                                        i = 3),
                                            this.updateBossBlood(-a),
                                            this.playShader(),
                                            this.showConbom(i, t),
                                            this.showShootEfc(t)
                                    }
                                }
                            }, this)
                    }
                    ,
                    t.prototype.initUI = function () {
                        this.isBossDead = !1,
                            1 == n.default.shareGameData.fruitBoss_Lv ? i.default.shareGameScene.showHelp(!0) : i.default.shareGameScene.showHelp(!1),
                            this.curBoss && this.curBoss.removeFromParent();
                        var e = cc.instantiate(this.bossPrefab);
                        this.node.addChild(e, 0, "boss"),
                            e.position = cc.v2(0, 201),
                            this.curBoss = e,
                            this.openColider(!0),
                            this.initBossKinfe(),
                            this.node.getChildByName("topSp").y = .5 * cc.winSize.height + 100,
                            this.node.getChildByName("topSp").runAction(cc.sequence(cc.delayTime(.3), cc.moveTo(.5, cc.v2(0, 516 + (cc.winSize.height - 1136) / 2)).easing(cc.easeBackOut()))),
                            this.node.getChildByName("topSp").getChildByName("cLabel").getComponent(cc.Label).string = n.default.shareGameData.fruitBoss_Lv + "\u7ea7 \u6c34\u679cBOSS",
                            this.curBoss.stopAllActions(),
                            this.curBoss.y = 550;
                        var t = cc.spawn(cc.fadeIn(.3).easing(cc.easeBackOut()), cc.moveTo(.5, cc.v2(0, 201)).easing(cc.easeBackOut()));
                        t.setTag(999),
                            this.curBoss.runAction(t),
                            this.updateBossBlood()
                    }
                    ,
                    t.prototype.openColider = function (e) {
                        this.curBoss.getComponent(cc.BoxCollider).enabled = e,
                            this.curBoss.getChildByName("9").active = e,
                            0 == e && this.curBoss.getComponent("boss").fly()
                    }
                    ,
                    t.prototype.updateBossBlood = function (e) {
                        void 0 === e && (e = 0),
                            console.log("Boos\u8840\u91cf---", n.default.shareGameData.curfruitBoss_blood, n.default.shareGameData.fruitBoss_Lv),
                            n.default.shareGameData.curfruitBoss_blood += e,
                            n.default.shareGameData.curfruitBoss_blood < 0 && (n.default.shareGameData.curfruitBoss_blood = 0);
                        var t = n.default.shareGameData.getBossMaxBlood()
                            , o = n.default.shareGameData.curfruitBoss_blood / t;
                        this.node.getChildByName("topSp").getChildByName("ProgressBar").getComponent(cc.ProgressBar).progress = o,
                            this.node.getChildByName("topSp").getChildByName("ProgressBar").getChildByName("misionLabel").getComponent(cc.Label).string = n.default.shareGameData.curfruitBoss_blood.toString(),
                            this.isKillBoss()
                    }
                    ,
                    t.prototype.isKillBoss = function () {
                        n.default.shareGameData.curfruitBoss_blood <= 0 && (this.isBossDead = !0,
                            this.openColider(!1),
                            a.default.DoVibrate(!1),
                            n.default.shareGameData.fruitBoss_Lv += 1,
                            n.default.shareGameData.curfruitBoss_blood = n.default.shareGameData.getBossMaxBlood(),
                            this.saveBoss())
                    }
                    ,
                    t.prototype.playShader = function () {
                        this.bossShader.stopAllActions(),
                            this.bossShader.active = !0,
                            this.bossShader.opacity = 255,
                            this.bossShader.scale = 1.2,
                            this.bossShader.rotation = this.curBoss.rotation,
                            this.bossShader.runAction(cc.spawn(cc.fadeOut(.3), cc.scaleTo(.2, 1.8).easing(cc.easeOut(1))));
                        var e = this.curBoss.getActionByTag(102);
                        null == e && ((e = cc.sequence(cc.scaleTo(.05, 2.4), cc.scaleTo(0, 2))).setTag(102),
                            this.curBoss.runAction(e))
                    }
                    ,
                    t.prototype.showShootEfc = function (e) {
                        var t = this
                            , o = null;
                        o = this.shootPool.size() > 0 ? this.shootPool.get() : cc.instantiate(this.shootPrefab);
                        var a = cc.v2(0, 0);
                        1 == e ? a = cc.v2(-110, 80) : 2 == e && (a = cc.v2(110, 80)),
                            o.position = a,
                            o.getComponent(dragonBones.ArmatureDisplay).playAnimation("hit", 1),
                            this.scheduleOnce(function () {
                                t.recyclingShootItem(o)
                            }, 1),
                            this.node.addChild(o)
                    }
                    ,
                    t.prototype.recyclingShootItem = function (e) {
                        e && (this.shootPool.put(e),
                            e.removeFromParent())
                    }
                    ,
                    t.prototype.showConbom = function (e, t) {
                        var o = null;
                        (o = this.foodPool.size() > 0 ? this.foodPool.get() : cc.instantiate(this.bossConbomPrefab)).getComponent("bossConbom").initConbom(e, this.conbomPos[t]),
                            this.node.addChild(o, 1)
                    }
                    ,
                    t.prototype.recyclingItem = function (e) {
                        e && (this.foodPool.put(e),
                            e.removeFromParent())
                    }
                    ,
                    t.prototype.initBossKinfe = function () {
                        this.curKinfeCount = 10;
                        for (var e = 0; e < this.bossKnifeArry.length; e++) {
                            this.bossKnifeArry[e].color = cc.color(255, 255, 255)
                        }
                    }
                    ,
                    t.prototype.updataBossKinfe = function () {
                        var e = this;
                        this.curKinfeCount > 0 && (this.curKinfeCount -= 1,
                            this.bossKnifeArry[this.curKinfeCount].color = cc.color(0, 0, 0),
                            0 == this.curKinfeCount && this.scheduleOnce(function () {
                                n.default.shareGameData.curfruitBoss_blood > 0 && 0 == e.isBossDead && (e.saveBoss(1.8, function () {
                                    s.default.shareKnife.offTouchEvent(),
                                        s.default.shareKnife.clreaKinef(),
                                        s.default.shareKnife.resetKinfe(),
                                        1 == n.default.shareGameData.isBossToLucky ? i.default.shareGameScene.showResult(!0, !0) : i.default.shareGameScene.showResult(!1, !0),
                                        i.default.shareGameScene.clearDisFood()
                                }),
                                    i.default.shareGameScene.showTip(10, !1))
                            }, 1))
                    }
                    ,
                    t.prototype.saveBoss = function (e, t) {
                        void 0 === e && (e = 1.5),
                            void 0 === t && (t = null),
                            this.scheduleOnce(function () {
                                var e = {
                                    curfruitBoss_blood: n.default.shareGameData.curfruitBoss_blood,
                                    fruitBoss_Lv: n.default.shareGameData.fruitBoss_Lv
                                };
                                a.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                    user_id: a.default.OpenId,
                                    data_info: JSON.stringify(e)
                                }, function (e, o) {
                                    t ? (t(),
                                        t = null) : i.default.shareGameScene.showParty()
                                })
                            }, e)
                    }
                    ,
                    t.prototype.isEndShoot = function () {
                        var e = !1;
                        return this.curKinfeCount <= 0 && (e = !0),
                            e
                    }
                    ,
                    __decorate([d(cc.Prefab)], t.prototype, "bossPrefab", void 0),
                    __decorate([d(cc.Prefab)], t.prototype, "shootPrefab", void 0),
                    __decorate([d(cc.Prefab)], t.prototype, "kinfePrefab", void 0),
                    __decorate([d(cc.Prefab)], t.prototype, "bosskinfePrefab", void 0),
                    __decorate([d(cc.Prefab)], t.prototype, "bossConbomPrefab", void 0),
                    __decorate([d(cc.Node)], t.prototype, "bossShader", void 0),
                    t = __decorate([c], t)
            } (cc.Component);
        o.default = l,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./weChatApi/WXApi": "WXApi"
    }],
    boss: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "329126axrFK4LlYso/hvF+n", "boss"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./knife")
            , n = e("./gameScene")
            , s = e("./soundMrg")
            , r = e("./gameData")
            , c = cc._decorator
            , d = c.ccclass
            , l = c.property
            , u = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.sp = null,
                        t.bossConbomPrefab = null,
                        t.bodyItems = [],
                        t.cracksItems = [],
                        t.bossShader = null,
                        t.isCut = !1,
                        t.id = 0,
                        t.type = 0,
                        t.orgPos = [],
                        t.curHealthy = 0,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initTextureWithID = function (e) {
                        var t = [cc.v2(0, 31), cc.v2(-32, -17), cc.v2(0, -52), cc.v2(36, 0)];
                        this.doRamdonRota(),
                            this.node.getComponent(cc.CircleCollider).enabled = !0,
                            this.curHealthy = r.default.shareGameData.bossMaxHealthy,
                            this.id = e,
                            this.sp.active = !0;
                        for (var o = 0; o < this.bodyItems.length; o++) {
                            var a = this.bodyItems[o];
                            a.setParent(this.node),
                                a.position = t[o],
                                a.opacity = 255,
                                a.active = !1
                        }
                        this.isCut = !1,
                            this.sp.getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame("" + e),
                            this.bodyItems[0].getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(e + "-1"),
                            this.bodyItems[1].getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(e + "-2"),
                            this.bodyItems[2].getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(e + "-3"),
                            this.bodyItems[3].getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(e + "-4"),
                            this.bossShader.getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(e + "-0")
                    }
                    ,
                    t.prototype.onCollisionEnter = function (e, t) {
                        if (0 == this.isCut && "food" == t.node.group && "kinfd" == e.node.group) {
                            s.default.suondMgrShader.playEffectSound(s.soundType.cut2),
                                a.default.DoVibrate(!0);
                            var o = t.world
                                , c = 1
                                , d = -1
                                , l = 100 * Math.random();
                            l < 20 ? c = 1 : l >= 20 && l < 50 ? (c = 2,
                                d = 0) : l >= 50 && l < 80 ? (c = 3,
                                    d = 1) : l >= 80 && l < 95 ? (c = 5,
                                        d = 2) : (c = 10,
                                            d = 3),
                                c = c > this.curHealthy ? this.curHealthy : c,
                                this.curHealthy -= c,
                                console.log("\u6253\u5230boss", this.curHealthy),
                                r.default.shareGameData.missionCurProgress += c,
                                n.default.shareGameScene.updataMissionProbar(),
                                this.playShader();
                            var u = 0;
                            if (1 == e.tag ? u = -70 : 2 == e.tag && (u = 70),
                                (u = o.position.x - .5 * cc.winSize.width + u) > 300 ? u = 300 : u < -300 && (u = -300),
                                this.showConbom(d, cc.v2(u, o.position.y - .5 * cc.winSize.height)),
                                i.default.shareKnife.isCutEmpty = !1,
                                this.node.getParent().getComponent("foodArry").sudOneFood(c),
                                this.updataCracks(),
                                0 == this.curHealthy) {
                                this.showBaozhiEfc();
                                for (var h = 0; h < this.cracksItems.length; h++) {
                                    this.cracksItems[h].active = !1
                                }
                            }
                        }
                    }
                    ,
                    t.prototype.showBaozhiEfc = function () {
                        var e = this;
                        this.isCut = !0,
                            this.node.getComponent(cc.CircleCollider).enabled = !1;
                        var t = this.node.convertToWorldSpace(cc.v2(0, 0));
                        t = cc.v2(t.x - .5 * cc.winSize.width, t.y - .5 * cc.winSize.height);
                        var o = this.node.getParent().getParent()
                            , a = n.default.shareGameScene.getEfc1();
                        a.scale = 1.3,
                            a.active = !0,
                            a.getComponent("efc1").initText(1),
                            a.getComponent(cc.Animation).play("guozhi").resume(),
                            a.position = t,
                            a.setParent(o),
                            a.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                a.removeFromParent(),
                                    n.default.shareGameScene.recyclingef1(a)
                            }))),
                            this.fly(),
                            this.scheduleOnce(function () {
                                n.default.shareGameScene.recycliBossPreafab(e.node)
                            }, .8)
                    }
                    ,
                    t.prototype.updataCracks = function () {
                        var e = 0;
                        Math.floor(.2 * r.default.shareGameData.bossMaxHealthy) >= this.curHealthy ? e = 4 : Math.floor(.4 * r.default.shareGameData.bossMaxHealthy) >= this.curHealthy ? e = 3 : Math.floor(.6 * r.default.shareGameData.bossMaxHealthy) >= this.curHealthy ? e = 2 : Math.floor(.8 * r.default.shareGameData.bossMaxHealthy) >= this.curHealthy && (e = 1),
                            console.log("updataCracks", e);
                        for (var t = 0; t < e; t++) {
                            var o = this.cracksItems[t];
                            o.active = !1,
                                t == e - 1 && (o.active = !0)
                        }
                    }
                    ,
                    t.prototype.fly = function () {
                        var e = [cc.v2(0, 31), cc.v2(-32, -17), cc.v2(0, -52), cc.v2(36, 0)]
                            , t = this.node.convertToWorldSpace(cc.v2(0, 0));
                        t = cc.v2(t.x - .5 * cc.winSize.width, t.y - .5 * cc.winSize.height);
                        for (var o = this.node.getParent().getParent(), a = 0; a < 10; a++)
                            n.default.shareGameScene.addmoneyFly(cc.v2(160 * Math.random() + t.x - 80, 160 * Math.random() + t.y - 80));
                        this.sp.active = !1;
                        for (a = 0; a < this.bodyItems.length; a++) {
                            var i = this.bodyItems[a];
                            i.position = t.add(e[0]),
                                i.setParent(o),
                                i.active = !0
                        }
                        var s = [cc.v2(t.x + 100, t.y + 250), cc.v2(t.x + 260, t.y - 200), cc.v2(t.x + 200, .5 * -cc.winSize.height)]
                            , r = cc.bezierTo(1, s);
                        this.bodyItems[0].runAction(cc.sequence(r, cc.fadeOut(.1))),
                            this.bodyItems[0].runAction(cc.repeatForever(cc.rotateBy(.2, -60 - 40 * Math.random()))),
                            this.bodyItems[1].runAction(cc.sequence(r.clone(), cc.fadeOut(.1))),
                            this.bodyItems[1].runAction(cc.repeatForever(cc.rotateBy(.2, -60 - 40 * Math.random())));
                        var c = [cc.v2(t.x - 100, t.y + 250), cc.v2(t.x - 260, t.y - 200), cc.v2(t.x - 200, .5 * -cc.winSize.height)]
                            , d = cc.bezierTo(1, c);
                        this.bodyItems[2].runAction(cc.repeatForever(cc.rotateBy(.2, 60 + 40 * Math.random()))),
                            this.bodyItems[2].runAction(cc.sequence(d, cc.fadeOut(.1), cc.callFunc(function () { }))),
                            this.bodyItems[3].runAction(cc.repeatForever(cc.rotateBy(.2, 60 + 40 * Math.random()))),
                            this.bodyItems[3].runAction(cc.sequence(d.clone(), cc.fadeOut(.1)))
                    }
                    ,
                    t.prototype.doRamdonRota = function () {
                        var e = this
                            , t = 0
                            , o = cc.callFunc(function () {
                                t = 100 * (1 + 2 * Math.random()),
                                    Math.random() > .5 && (t = -t),
                                    e.node.runAction(cc.sequence(cc.rotateBy(Math.abs(t) / (250 * (Math.random() + 1)), t), cc.delayTime(3 * Math.random()), o))
                            });
                        this.node.stopAllActions(),
                            this.node.runAction(cc.sequence(cc.delayTime(3 * Math.random()), o))
                    }
                    ,
                    t.prototype.playShader = function () {
                        this.bossShader.stopAllActions(),
                            this.bossShader.active = !0,
                            this.bossShader.opacity = 255,
                            this.bossShader.scale = 1,
                            this.bossShader.runAction(cc.spawn(cc.fadeOut(.25), cc.scaleTo(.25, 1.8)));
                        var e = this.node.getActionByTag(102);
                        null == e && ((e = cc.sequence(cc.scaleTo(.05, 1.5), cc.scaleTo(.03, 1))).setTag(102),
                            this.node.runAction(e))
                    }
                    ,
                    t.prototype.showConbom = function (e, t) {
                        var o = cc.instantiate(this.bossConbomPrefab);
                        o.getComponent("bossConbom").initConbom(e, t),
                            this.node.getParent().getParent().addChild(o, 1)
                    }
                    ,
                    __decorate([l(cc.Node)], t.prototype, "sp", void 0),
                    __decorate([l(cc.Prefab)], t.prototype, "bossConbomPrefab", void 0),
                    __decorate([l(cc.Node)], t.prototype, "bodyItems", void 0),
                    __decorate([l(cc.Node)], t.prototype, "cracksItems", void 0),
                    __decorate([l(cc.Node)], t.prototype, "bossShader", void 0),
                    t = __decorate([d], t)
            } (cc.Component);
        o.default = u,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    bottomGame: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "b5ed2o71opB5rt47KDSaZAH", "bottomGame"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.headprefab = null,
                        t.bottom_parentNode = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initBottom = function (e) {
                        var t = 736 * (cc.winSize.height / cc.winSize.width - 1.775) / 2;
                        console.log("------\u53d8\u6210", t),
                            console.log("initBottom", e.length),
                            this.bottom_parentNode.removeAllChildren();
                        for (var o = cc.winSize.width / 5, a = 25 + .5 * o, i = 0, n = 0; n < e.length; n++) {
                            var s = e[n];
                            if ("bottom_icon_ads" == s.flag) {
                                var r = cc.instantiate(this.headprefab);
                                r.getComponent("gameHead").init(s),
                                    r.getComponent("gameHead").nameLb.active = !1,
                                    this.bottom_parentNode.addChild(r),
                                    r.position = cc.v2(a + i * o, .5 * -this.node.height),
                                    i += 1,
                                    r.opacity = 0,
                                    r.runAction(cc.sequence(cc.delayTime(.05 * n), cc.fadeIn(.15)))
                            }
                        }
                        this.bottom_parentNode.width = i * o + 50 > cc.winSize.width ? i * o + 50 : cc.winSize.width
                    }
                    ,
                    __decorate([n(cc.Prefab)], t.prototype, "headprefab", void 0),
                    __decorate([n(cc.Node)], t.prototype, "bottom_parentNode", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    conbomNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "ee27auREDxBj5FLZ2Wau14m", "conbomNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = cc._decorator
            , n = i.ccclass
            , s = i.property
            , r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.spfArry = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.showConbomUI = function (e) {
                        var t = this;
                        void 0 === e && (e = 2);
                        var o = function (e) {
                            e.stopAllActions(),
                                e.scale = 1,
                                e.runAction(cc.sequence(cc.scaleTo(.2, 1.15), cc.scaleTo(.05, 1), cc.delayTime(.3), cc.callFunc(function () {
                                    t.node.active = !1,
                                        1 == a.default.shareGameData.isPerfectConbom && (a.default.shareGameData.isPerfectConbom = !1)
                                })))
                        };
                        e <= 6 ? (this.node.getChildByName("cNode").active = !1,
                            this.node.getChildByName("sp").active = !0,
                            this.node.active = !0,
                            this.node.getChildByName("sp").position = 1 == e ? cc.v2(35, 214) : cc.v2(169, 320),
                            this.node.getChildByName("sp").getComponent(cc.Sprite).spriteFrame = this.spfArry[e - 1],
                            o(this.node.getChildByName("sp"))) : (this.node.active = !0,
                                this.node.getChildByName("cNode").active = !0,
                                this.node.getChildByName("sp").active = !1,
                                this.node.getChildByName("cNode").getChildByName("cLabel").getComponent(cc.Label).string = e.toString(),
                                this.node.getChildByName("sp").position = cc.v2(169, 320),
                                o(this.node.getChildByName("cNode")))
                    }
                    ,
                    __decorate([s(cc.SpriteFrame)], t.prototype, "spfArry", void 0),
                    t = __decorate([n], t)
            } (cc.Component);
        o.default = r,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData"
    }],
    config: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "10b1azjDsxG0oMnaGDymDBh", "config");
        var a = {
            domain: "https://api.zuiqiangyingyu.net",
            BMSDomain: "https://game.zuiqiangyingyu.net",
            ticket: "FRl2LQfeWgyWtUxcXs9g0jvLGtWQUuAP",
            version: "0.0.1",
            platform: "baidu",
            isDebug: !1
        };
        t.exports = a,
            cc._RF.pop()
    }
        , {}],
    cutFood: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "97ef2N2ypRAoa/RRJFRaPyR", "cutFood"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = (a.property,
                function (e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.setTexture = function (e) {
                            this.node.getComponent(cc.Sprite).spriteFrame = e
                        }
                        ,
                        t = __decorate([i], t)
                } (cc.Component));
        o.default = n,
            cc._RF.pop()
    }
        , {}],
    dayItem: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "19d023UkJ9NW4KXnz7QT257", "dayItem"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.allKnifeTexturePlist = null,
                        t.bgSpf = [],
                        t.titlebgSpf = [],
                        t.state = 0,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.init = function (e, t, o) {
                        this.state = o,
                            this.node.getComponent(cc.Sprite).spriteFrame = this.bgSpf[o],
                            2 == t || 7 == t ? (this.node.getChildByName("icon_baoxiang1").scale = .8,
                                this.node.getChildByName("icon_baoxiang1").getComponent(cc.Sprite).spriteFrame = this.allKnifeTexturePlist.getSpriteFrame("a" + e),
                                this.node.getChildByName("countLabel").getComponent(cc.Label).string = "Powerful\nweapon",
                                7 == t && (this.node.getChildByName("countLabel").getComponent(cc.Label).string = "Super\nweapon")) : this.node.getChildByName("countLabel").getComponent(cc.Label).string = "x" + e,
                            1 == o ? (this.node.getChildByName("pic_qd_lq2").getComponent(cc.Sprite).spriteFrame = this.titlebgSpf[1],
                                this.node.getChildByName("Label").getComponent(cc.Label).string = "Receive") : (this.node.getChildByName("pic_qd_lq2").getComponent(cc.Sprite).spriteFrame = this.titlebgSpf[0],
                                    this.node.getChildByName("Label").getComponent(cc.Label).string = "Day " + t + "",
                                    2 == o && (this.node.getChildByName("icon_gou").active = !0,
                                        this.node.getChildByName("pic_qiandao3").active = !0))
                    }
                    ,
                    t.prototype.cheakGou = function () {
                        this.node.getChildByName("icon_gou").active = !0,
                            this.node.getChildByName("pic_qiandao3").active,
                            this.node.getChildByName("icon_gou").scale = 3,
                            this.node.getChildByName("icon_gou").runAction(cc.scaleTo(.3, 1))
                    }
                    ,
                    t.prototype.touchIconCB = function () {
                        console.log("\u70b9\u51fb\u7b7e\u5230")
                    }
                    ,
                    __decorate([n(cc.SpriteAtlas)], t.prototype, "allKnifeTexturePlist", void 0),
                    __decorate([n(cc.SpriteFrame)], t.prototype, "bgSpf", void 0),
                    __decorate([n(cc.SpriteFrame)], t.prototype, "titlebgSpf", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    dayNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "641e4Kf0WlFk6qM2dXb0+M5", "dayNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./soundMrg")
            , n = e("./gameData")
            , s = cc._decorator
            , r = s.ccclass
            , c = s.property
            , d = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.getNode = null,
                        t.dayItem = null,
                        t.isLoad = !1,
                        t.dayItemList = [],
                        t.callBack = null,
                        t.priseList = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.onEnable = function () {
                        a.default.CloseAd()
                    }
                    ,
                    t.prototype.onDisable = function () {
                        a.default.OpenAd()
                    }
                    ,
                    t.prototype.setCallBack = function (e) {
                        this.callBack = e
                    }
                    ,
                    t.prototype.showUI = function () {
                        var e = n.default.shareGameData.is_sign
                            , t = n.default.shareGameData.cur_DayCount;
                        this.priseList = [200, 1009, 600, 1e3, 1500, 2e3, 1010];
                        var o = this.priseList;
                        console.log("\u7b7e\u5230\u6570\u636e----", e, t, window.navigator),
                            this.node.getChildByName("bg_3").getChildByName("cNode").removeAllChildren();
                        for (var a = 0; a < 7; a++) {
                            var i = cc.instantiate(this.dayItem);
                            this.dayItemList.push(i),
                                a <= 3 ? i.setPosition(cc.v2(140 * a - 210, 115)) : i.setPosition(cc.v2(140 * (a - 4) - 135, -145)),
                                this.node.getChildByName("bg_3").getChildByName("cNode").addChild(i);
                            var s = i.getComponent("dayItem");
                            t >= 7 ? s.init(o[a], a + 1, 2) : 1 == e ? a < t ? s.init(o[a], a + 1, 2) : s.init(o[a], a + 1, 0) : a < t ? s.init(o[a], a + 1, 2) : a == t ? s.init(o[a], a + 1, 1) : s.init(o[a], a + 1, 0)
                        }
                    }
                    ,
                    t.prototype.touchCB = function (e, t) {
                        var o = this;
                        if (i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            0 == n.default.shareGameData.is_sign) {
                            var s = function (e) {
                                o.isLoad = !0;
                                var t = {
                                    singelTime: Math.floor(Date.now() / 1e3),
                                    cur_DayCount: n.default.shareGameData.cur_DayCount + 1
                                };
                                o.node.active = !1,
                                    a.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                        user_id: a.default.OpenId,
                                        data_info: JSON.stringify(t)
                                    }, function (t, i) {
                                        console.log("\u7b7e\u5230\u51fa\u4e2a"),
                                            o.isLoad = !1,
                                            o.dayItemList[n.default.shareGameData.cur_DayCount % 7].getComponent("dayItem").init(2),
                                            n.default.shareGameData.cur_DayCount += 1,
                                            n.default.shareGameData.is_sign = 1;
                                        var s = (n.default.shareGameData.cur_DayCount - 1) % 7 + 1
                                            , r = 0;
                                        r = o.priseList[s - 1],
                                            r *= e;
                                        var c = cc.instantiate(o.getNode);
                                        o.node.getParent().addChild(c),
                                            2 == s || 7 == s ? c.getComponent("surprisedNode").showUI(r, 6) : c.getComponent("surprisedNode").showUI(r, 2),
                                            c.getComponent("surprisedNode").setCallBack(function () {
                                                o.oneMoreReward(s);
                                                var e = null;
                                                2 == s || 7 == s ? (n.default.shareGameData.addOneSkinData(r),
                                                    e = {
                                                        package_map: JSON.stringify(n.default.skinMap)
                                                    }) : (n.default.shareGameData.gold += r,
                                                        e = {
                                                            gold: n.default.shareGameData.gold
                                                        }),
                                                    a.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                                        user_id: a.default.OpenId,
                                                        data_info: JSON.stringify(e)
                                                    }, function (e, t) {
                                                        console.log("\u83b7\u5f97Surprise--", r),
                                                            o.callBack && (o.callBack(),
                                                                o.closeCB())
                                                    })
                                            })
                                    })
                            };
                            2 == t ? (a.default.wondersdk.statevent("\u53cc\u500d\u6309\u94ae"),
                                a.default.OpenAdVides(function () {
                                    s(2)
                                })) : (a.default.wondersdk.statevent("\u5355\u500d\u6309\u94ae"),
                                    s(1))
                        } else
                            n.default.shareGameData.showTip(17, 2)
                    }
                    ,
                    t.prototype.oneMoreReward = function (e) {
                        var t = this
                            , o = cc.instantiate(this.getNode);
                        this.node.getParent().addChild(o),
                            o.getComponent("surprisedNode").showUI(300 * e, 7, !0),
                            o.getComponent("surprisedNode").setCallBack(function () {
                                a.default.OpenAdVides(function () {
                                    t.closeCB(),
                                        n.default.shareGameData.gold += 300 * e;
                                    var o = {
                                        gold: n.default.shareGameData.gold
                                    };
                                    t.callBack && t.callBack(),
                                        a.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                            user_id: a.default.OpenId,
                                            data_info: JSON.stringify(o)
                                        }, function (t, o) {
                                            console.log("\u83b7\u5f97Surprise--", 300 * e)
                                        })
                                })
                            })
                    }
                    ,
                    t.prototype.closeCB = function () {
                        this.node.active = !1
                    }
                    ,
                    t.prototype.palayAct = function () {
                        this.node.getChildByName("bg_3").scale = 0,
                            this.node.getChildByName("bg_3").stopAllActions(),
                            this.node.getChildByName("bg_3").runAction(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1)));
                        var e = this.node.getChildByName("bg_3").getChildByName("sigelButton");
                        e.stopAllActions(),
                            e.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1))))
                    }
                    ,
                    __decorate([c(cc.Prefab)], t.prototype, "getNode", void 0),
                    __decorate([c(cc.Prefab)], t.prototype, "dayItem", void 0),
                    t = __decorate([r], t)
            } (cc.Component);
        o.default = d,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    douyinhezi: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "9ce8bB1GllPQqjsafsf/yCr", "douyinhezi"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = cc._decorator
            , n = i.ccclass
            , s = (i.property,
                function (e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.toHezi = function () {
                            a.default.OpenSchema()
                        }
                        ,
                        t = __decorate([n], t)
                } (cc.Component));
        o.default = s,
            cc._RF.pop()
    }
        , {
        "./weChatApi/WXApi": "WXApi"
    }],
    efc1: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "47c75Ne+XBADavPMIs1zNl0", "efc1"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameScene")
            , i = cc._decorator
            , n = i.ccclass
            , s = (i.property,
                function (e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.initText = function (e) {
                            console.log("\u52a8\u753bid---------------", e);
                            var t = a.default.shareGameScene.efcTexturePlist;
                            this.node.getChildByName("2").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_2"),
                                this.node.getChildByName("4").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_4"),
                                this.node.getChildByName("3").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_3"),
                                this.node.getChildByName("5-3").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_5-3"),
                                this.node.getChildByName("5-2").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_5-2"),
                                this.node.getChildByName("5-4").getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_5-4");
                            for (var o = 0; o < 8; o++) {
                                var i = "5-1-" + o;
                                this.node.getChildByName(i).getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_5-1")
                            }
                            for (o = 0; o < 4; o++) {
                                i = "6-" + o;
                                this.node.getChildByName(i).getComponent(cc.Sprite).spriteFrame = t.getSpriteFrame("efc" + e + "_6")
                            }
                        }
                        ,
                        t = __decorate([n], t)
                } (cc.Component));
        o.default = s,
            cc._RF.pop()
    }
        , {
        "./gameScene": "gameScene"
    }],
    efcPrefab: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "48567fWTvlETL9ZfcBWEAWN", "efcPrefab"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = (a.property,
                function (e) {
                    function t() {
                        var t = null !== e && e.apply(this, arguments) || this;
                        return t.isOverrun = !1,
                            t
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.initState = function () {
                            this.isOverrun = !1
                        }
                        ,
                        t = __decorate([i], t)
                } (cc.Component));
        o.default = n,
            cc._RF.pop()
    }
        , {}],
    event: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "78032JyU1dDSLu4BFhBlIvy", "event"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            function (e) {
                e[e.dayli_get = 1] = "dayli_get",
                    e[e.dayli_doubelGet = 2] = "dayli_doubelGet",
                    e[e.startGame = 3] = "startGame",
                    e[e.drawer = 4] = "drawer",
                    e[e.drawer_maoxian = 5] = "drawer_maoxian",
                    e[e.drawer_fish = 6] = "drawer_fish",
                    e[e.drawer_nanJi = 7] = "drawer_nanJi",
                    e[e.drawer_car = 8] = "drawer_car",
                    e[e.drawer_samllBall = 9] = "drawer_samllBall",
                    e[e.drawer_2048 = 10] = "drawer_2048",
                    e[e.drawer_jiHe = 11] = "drawer_jiHe",
                    e[e.drawer_jiangSan = 12] = "drawer_jiangSan",
                    e[e.redEnvelope = 13] = "redEnvelope",
                    e[e.redEnvelope_open = 14] = "redEnvelope_open",
                    e[e.luckySpinOnce = 15] = "luckySpinOnce",
                    e[e.dayGift = 16] = "dayGift",
                    e[e.dayGift_share = 17] = "dayGift_share",
                    e[e.backPack = 18] = "backPack",
                    e[e.backPack_bom_Share = 19] = "backPack_bom_Share",
                    e[e.backPack_san_Share = 20] = "backPack_san_Share",
                    e[e.rank = 21] = "rank",
                    e[e.rank_share = 22] = "rank_share",
                    e[e.game_weaponShadow = 23] = "game_weaponShadow",
                    e[e.game_weaponShadow_share = 24] = "game_weaponShadow_share",
                    e[e.game_weaponShadow_video = 25] = "game_weaponShadow_video",
                    e[e.mission_weaponShadow_share = 26] = "mission_weaponShadow_share",
                    e[e.mission_weaponShadow_video = 27] = "mission_weaponShadow_video",
                    e[e.mission_weapon_share = 28] = "mission_weapon_share",
                    e[e.mission_weapon_video = 29] = "mission_weapon_video",
                    e[e.mission_next = 30] = "mission_next",
                    e[e.mission_return = 31] = "mission_return",
                    e[e.additional = 32] = "additional",
                    e[e.additional_next = 33] = "additional_next",
                    e[e.additional_again = 34] = "additional_again",
                    e[e.additional_return = 35] = "additional_return",
                    e[e.redEnvelope_game = 36] = "redEnvelope_game",
                    e[e.redEnvelope_open_game = 37] = "redEnvelope_open_game",
                    e[e.redEnvelope_be_open_game = 38] = "redEnvelope_be_open_game",
                    e[e.first_share_resurrection = 39] = "first_share_resurrection",
                    e[e.second_share_resurrection = 40] = "second_share_resurrection",
                    e[e.first_video_resurrection = 41] = "first_video_resurrection",
                    e[e.second_video_resurrection = 42] = "second_video_resurrection",
                    e[e.skip_resurrection = 43] = "skip_resurrection",
                    e[e.settlement_moneyGet = 44] = "settlement_moneyGet",
                    e[e.settlement_moneyDoubleGet = 45] = "settlement_moneyDoubleGet",
                    e[e.settlement_rank = 46] = "settlement_rank",
                    e[e.settlement_rankShare = 47] = "settlement_rankShare",
                    e[e.settlement_playAgain = 48] = "settlement_playAgain",
                    e[e.settlement_challengeFriend = 49] = "settlement_challengeFriend",
                    e[e.settlement_returnMain = 50] = "settlement_returnMain",
                    e[e.lucky_table = 51] = "lucky_table",
                    e[e.click_shareInfo_enterGame = 52] = "click_shareInfo_enterGame",
                    e[e.shareInfo = 53] = "shareInfo",
                    e[e.store = 100] = "store",
                    e[e.store_skin1 = 101] = "store_skin1",
                    e[e.store_skin1_share = 102] = "store_skin1_share",
                    e[e.store_skin1_bug = 103] = "store_skin1_bug",
                    e[e.store_skin58 = 272] = "store_skin58",
                    e[e.store_skin58_share = 273] = "store_skin58_share",
                    e[e.store_skin58_bug = 274] = "store_skin58_bug"
            } (o.eventID || (o.eventID = {}));
        var a = cc._decorator
            , i = a.ccclass
            , n = (a.property,
                function () {
                    function e() { }
                    return e,
                        e.prototype.start = function () { }
                        ,
                        e.addEventPos = function (e, t) {
                            void 0 === t && (t = {})
                        }
                        ,
                        e.strName = ["dayli_get", "dayli_doubelGet", "startGame", "drawer", "drawer_maoxian", "drawer_fish", "drawer_nanJi", "drawer_car", "drawer_samllBall", "drawer_2048", "drawer_jiHe", "drawer_jiangSan", "redEnvelope", "redEnvelope_open", "luckySpinOnce", "dayGift", "dayGift_share", "backPack", "backPack_bom_Share", "backPack_san_Share", "rank", "rank_share", "game_weaponShadow", "game_weaponShadow_share", "game_weaponShadow_video", "mission_weaponShadow_share", "mission_weaponShadow_video", "mission_weapon_share", "mission_weapon_video", "mission_next", "mission_return", "additional", "additional_next", "additional_again", "additional_return", "redEnvelope_game", "redEnvelope_open_game", "redEnvelope_be_open_game", "first_share_resurrection", "second_share_resurrection", "first_video_resurrection", "second_video_resurrection", "skip_resurrection", "settlement_moneyGet", "settlement_moneyDoubleGet", "settlement_rank", "settlement_rankShare", "settlement_playAgain", "settlement_challengeFriend", "settlement_returnMain", "lucky_table", "click_shareInfo_enterGame", "shareInfo", "store", "store_skin1", "store_skin1_share", "store_skin1_bug", "store_skin58", "store_skin58_share", "store_skin58_bug"],
                        e = __decorate([i], e)
                } ());
        o.default = n,
            cc._RF.pop()
    }
        , {}],
    foodArry: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "b0131BPfI1KHrfOcHKh7JYm", "foodArry"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./knife")
            , i = e("./gameScene")
            , n = e("./gameData")
            , s = e("./weChatApi/WXApi")
            , r = e("./gameConfig")
            , c = cc._decorator
            , d = c.ccclass
            , l = c.property
            , u = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.foodCount = 0,
                        t.pointItem = null,
                        t.foodItem = null,
                        t.isRunAct = !1,
                        t.speed = 0,
                        t.addSpeed = 0,
                        t.limitSpeed = 0,
                        t.curCooldownTime = 0,
                        t.CD = 0,
                        t.actData = [],
                        t.actIndex = 1,
                        t.actDir = 0,
                        t.curUseIndex = -1,
                        t.keepTime = 0,
                        t.specialBtn = null,
                        t.baoheBtn = null,
                        t.curSudID = 0,
                        t.baohe_orgPos = cc.v2(.5 * -cc.winSize.width + 45, 45),
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.onLoad = function () { }
                    ,
                    t.prototype.opneUpdata = function (e) { }
                    ,
                    t.prototype.initFoodArry = function (e, t) {
                        if (void 0 === t && (t = 3),
                            console.log("\u521d\u59cb\u98df\u7269\u9635\uff1a", e),
                            1 == n.default.shareGameData.curIsHaveTresure ? (this.baoheBtn.active = !0,
                                this.baoheBtn.getComponent(cc.Button).enabled = !0,
                                this.baoheBtn.getChildByName("cLabel").active = !0,
                                this.baoheBtn.position = this.baohe_orgPos) : this.baoheBtn.active = !1,
                            this.curSudID = t,
                            this.specialBtn.active = !1,
                            this.curUseIndex = -1,
                            this.initActData(),
                            this.node.removeAllChildren(),
                            e.groudList.length == e.FoodIDList.length && e.foodCount == e.FoodPosList.length) {
                            var o = 1;
                            e.scale && (o = e.scale),
                                this.node.scale = o;
                            for (var a = Math.floor(Math.random() * e.foodCount), r = 100 * Math.random(), c = [], d = 0; d < e.groudList.length; d++) {
                                var l = e.FoodIDList[d][Math.floor(Math.random() * e.FoodIDList[d].length)];
                                c[d] = l
                            }
                            var u = -1;
                            this.foodCount = 0;
                            var h = 0;
                            if (n.default.shareGameData.day_FriutTick > 0) {
                                var p = n.default.shareGameData.day_FriutTick >= 3 ? 3 : n.default.shareGameData.day_FriutTick;
                                Math.random() <= .35 && (h = Math.ceil(Math.random() * p))
                            }
                            for (d = 0; d < e.foodCount; d++) {
                                u = -1;
                                for (var f = 0; f < e.groudList.length && -1 == u; f++)
                                    for (var m = e.groudList[f], g = 0; g < m.length; g++)
                                        if (d + 1 == m[g]) {
                                            u = f;
                                            break
                                        }
                                var y = null;
                                c[u] > 1e3 ? (this.foodCount += n.default.shareGameData.bossMaxHealthy,
                                    (y = i.default.shareGameScene.getBossPrefab()).getComponent("boss").initTextureWithID(c[u])) : (this.foodCount += 1,
                                        (y = i.default.shareGameScene.foodPool.size() > 0 ? i.default.shareGameScene.foodPool.get() : cc.instantiate(this.foodItem)).getComponent("food").initTextureWithID(c[u]),
                                        0 == n.default.shareGameData.Fruit_video && t < 2 && a == d && r < 30 && n.default.shareGameData.lv >= 4 && (console.log("\u524d2\u5173\uff0c \u6b64\u6c34\u679c\u6253\u4e2d\u6709\u5206\u8eab\u4f53\u9a8c"),
                                            y.getComponent("food").setState(1),
                                            this.specialBtn.active = !0,
                                            this.specialBtn.scale = .6,
                                            this.specialBtn.setParent(y.getComponent("food").sp),
                                            this.specialBtn.position = cc.v2(0, 0)),
                                        0 == s.default.area_openSitch && t < 2 && 0 == n.default.shareGameData.curIsHaveTresure && n.default.shareGameData.lv % 2 == 0 && n.default.shareGameData.lv > 4 && (n.default.shareGameData.curIsHaveTresure = !0,
                                            y.getComponent("food").setState(2),
                                            this.baoheBtn.getComponent(cc.Button).enabled = !1,
                                            this.baoheBtn.active = !0,
                                            this.baoheBtn.getChildByName("cLabel").active = !1,
                                            this.baoheBtn.setParent(y.getComponent("food").sp),
                                            this.baoheBtn.position = cc.v2(0, 0)),
                                        0 == s.default.area_openSitch && h > 0 && n.default.shareGameData.lv >= 4 && (y.getComponent("food").setState(3),
                                            h -= 1)),
                                    this.node.addChild(y),
                                    y.position = cc.v2(e.FoodPosList[d].x, e.FoodPosList[d].y)
                            }
                        } else
                            console.log("\u914d\u7f6e\u9519\u8bef----ID", e.ID)
                    }
                    ,
                    t.prototype.flythreeKinfe = function (e) {
                        this.specialBtn.active = !1,
                            s.default.OpenAdVides(function () {
                                n.default.shareGameData.curThreeCount = 6,
                                    a.default.shareKnife.openThreeKinfe(!0),
                                    a.default.shareKnife.initKinfePos(),
                                    a.default.shareKnife.initCountTip(),
                                    i.default.shareGameScene.showTip(1, !1)
                            })
                    }
                    ,
                    t.prototype.resetBaohe = function () {
                        console.log("\u91cd\u7f6e\u5b9d\u76d2"),
                            n.default.shareGameData.curIsHaveTresure = !1,
                            this.baoheBtn.active = !1,
                            this.baoheBtn.getComponent(cc.Button).enabled = !1
                    }
                    ,
                    t.prototype.flyBaoheIcon = function (e) {
                        var t = this;
                        n.default.shareGameData.curIsHaveTresure = !0,
                            this.baoheBtn.getComponent(cc.Button).enabled = !0,
                            this.baoheBtn.rotation = 0;
                        var o = e.convertToWorldSpace(cc.v2(0, 0));
                        o = cc.v2(o.x - .5 * cc.winSize.width, o.y - .5 * cc.winSize.height),
                            this.baoheBtn.position = o,
                            this.baoheBtn.setParent(this.node.getParent()),
                            this.baoheBtn.stopAllActions(),
                            this.baoheBtn.runAction(cc.sequence(cc.spawn(cc.moveBy(.1, cc.v2(0, 10)), cc.scaleTo(0, 1.1)), cc.delayTime(.2), cc.callFunc(function () { })));
                        var a = [cc.v2(this.baoheBtn.x, this.baoheBtn.y), cc.v2(this.baoheBtn.x, this.baoheBtn.y + 150), this.baohe_orgPos]
                            , i = cc.bezierTo(.5, a);
                        this.baoheBtn.runAction(cc.sequence(cc.delayTime(.4), cc.spawn(i, cc.scaleTo(.3, 1)), cc.callFunc(function () {
                            t.baoheBtn.getChildByName("cLabel").active = !0
                        })))
                    }
                    ,
                    t.prototype.addPointItem = function (e) {
                        var t = cc.instantiate(this.pointItem);
                        t.position = e,
                            this.node.addChild(t)
                    }
                    ,
                    t.prototype.setFoodCount = function (e) {
                        this.foodCount = e
                    }
                    ,
                    t.prototype.update = function (e) {
                        var t = this;
                        1 != n.default.shareGameData.isFuritPartyMode && (this.isRunAct ? (this.addSpeed < 0 ? this.speed + this.addSpeed < this.limitSpeed ? (this.addSpeed = 0,
                            this.scheduleOnce(function () {
                                t.getNextActData()
                            }, this.keepTime)) : this.speed += this.addSpeed : this.addSpeed > 0 && (this.speed + this.addSpeed > this.limitSpeed ? (this.addSpeed = 0,
                                this.scheduleOnce(function () {
                                    t.getNextActData()
                                }, this.keepTime)) : this.speed += this.addSpeed),
                            0 == this.actDir ? this.node.rotation -= this.speed : this.node.rotation += this.speed) : (this.curCooldownTime += e,
                                this.curCooldownTime >= this.CD && this.initActData()))
                    }
                    ,
                    t.prototype.initActData = function () {
                        console.log("\u521d\u59cb\u5316\u52a8\u4f5c---", this.curSudID, n.default.missionData),
                            Math.random() > .5 ? this.actDir = 0 : this.actDir = 1,
                            this.isRunAct = !0,
                            this.actData = [],
                            this.curCooldownTime = 0,
                            this.actIndex = 1,
                            this.curUseIndex = n.default.missionData[this.curSudID - 1].actID;
                        var e = r.default.foodArryActConfig_.json.actData[this.curUseIndex - 1];
                        this.actData = e,
                            this.CD = e.minDelayTime + Math.random() * (e.maxDelayTime - e.minDelayTime),
                            this.speed = e.minSpeed + Math.random() * (e.maxSpeed - e.minSpeed),
                            this.getNextActData()
                    }
                    ,
                    t.prototype.getNextActData = function () {
                        if (this.actIndex > this.actData.data.length)
                            this.isRunAct = !1;
                        else {
                            var e = this.actData.data[this.actIndex - 1];
                            this.actIndex += 1,
                                this.speed = e.startSpeed ? e.startSpeed : this.speed,
                                this.addSpeed = e.minAddSpeed + Math.random() * (e.maxAddSpeed - e.minAddSpeed),
                                this.addSpeed = this.addSpeed * n.default.shareGameData.gameSpeedOff,
                                this.limitSpeed = e.limitSpeed * +(1 + .2 * n.default.shareGameData.gameSpeedOff),
                                this.keepTime = e.keepTime ? e.keepTime : 0
                        }
                    }
                    ,
                    t.prototype.sudOneFood = function (e) {
                        void 0 === e && (e = 1),
                            this.foodCount -= e,
                            this.isFinish()
                    }
                    ,
                    t.prototype.isFinish = function () {
                        0 == this.foodCount && (i.default.shareGameScene.FooddishState = 1,
                            this.scheduleOnce(function () {
                                i.default.shareGameScene.finishOneFoodArry()
                            }, 1),
                            1 == n.default.curCutCount && i.default.shareGameScene.showConbom(!0))
                    }
                    ,
                    __decorate([l(cc.Prefab)], t.prototype, "pointItem", void 0),
                    __decorate([l(cc.Prefab)], t.prototype, "foodItem", void 0),
                    __decorate([l(cc.Node)], t.prototype, "specialBtn", void 0),
                    __decorate([l(cc.Node)], t.prototype, "baoheBtn", void 0),
                    t = __decorate([d], t)
            } (cc.Component);
        o.default = u,
            cc._RF.pop()
    }
        , {
        "./gameConfig": "gameConfig",
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./weChatApi/WXApi": "WXApi"
    }],
    food: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "76d4cqSW8BOSqBN2XlhssDz", "food"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./soundMrg")
            , n = e("./gameScene")
            , s = e("./gameData")
            , r = e("./knife")
            , c = cc._decorator
            , d = c.ccclass
            , l = c.property
            , u = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.guo_icon = null,
                        t.sp = null,
                        t.cut1 = null,
                        t.cut2 = null,
                        t.isCut = !1,
                        t.id = 0,
                        t.type = 0,
                        t.isSpecial = -1,
                        t
                }
                return __extends(t, e),
                    t.prototype.onload = function () { }
                    ,
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initTextureWithID = function (e) {
                        this.scheduleOnce(this.doRamdonRota, 1),
                            this.node.getComponent(cc.BoxCollider).enabled = !0,
                            this.guo_icon.active = !1,
                            this.guo_icon.position = cc.v2(0, 0),
                            this.sp.active = !0,
                            this.cut1.setParent(this.node),
                            this.cut2.setParent(this.node),
                            this.cut1.position = cc.v2(0, 0),
                            this.cut2.position = cc.v2(0, 0),
                            this.cut1.opacity = 255,
                            this.cut2.opacity = 255,
                            this.cut1.active = !1,
                            this.cut2.active = !1,
                            this.isSpecial = -1,
                            this.isCut = !1,
                            this.id = e;
                        var t = e.toString();
                        this.sp.getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(t),
                            t = e + "-1",
                            this.cut1.getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(t),
                            this.cut2.getComponent(cc.Sprite).spriteFrame = n.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(t)
                    }
                    ,
                    t.prototype.setState = function (e) {
                        -1 == this.isSpecial ? (this.isSpecial = e,
                            1 == e || 3 == e && (this.guo_icon.active = !0,
                                this.guo_icon.position = cc.v2(0, 0),
                                this.guo_icon.opacity = 255,
                                this.guo_icon.scale = .7)) : console.log("\u5df2\u6709\u72b6\u6001", this.isSpecial)
                    }
                    ,
                    t.prototype.doRamdonRota = function () {
                        var e = this;
                        this.sp.stopAllActions();
                        var t = 0
                            , o = cc.callFunc(function () {
                                t = 100 * (1 + 2 * Math.random()),
                                    Math.random() > .5 && (t = -t),
                                    e.sp.runAction(cc.sequence(cc.rotateBy(Math.abs(t) / (250 * (Math.random() + 1)), t), cc.delayTime(8 * Math.random()), o))
                            });
                        this.sp.runAction(cc.sequence(cc.delayTime(3 * Math.random()), o))
                    }
                    ,
                    t.prototype.onCollisionEnter = function (e, t) {
                        if (0 == this.isCut && "food" == t.node.group && "kinfd" == e.node.group) {
                            switch (a.default.DoVibrate(!0),
                            this.isSpecial) {
                                case 1:
                                    this.node.getParent().getComponent("foodArry").flythreeKinfe(this.sp);
                                    break;
                                case 2:
                                    this.node.getParent().getComponent("foodArry").flyBaoheIcon(this.sp);
                                    break;
                                case 3:
                                    s.default.shareGameData.cur_getFriutTick += 1,
                                        this.tickFly()
                            }
                            var o = 1
                                , c = i.soundType.cut1;
                            switch (this.id) {
                                case 3:
                                case 6:
                                    c = i.soundType.cut1,
                                        o = 3;
                                    break;
                                case 7:
                                    c = i.soundType.cut2,
                                        o = 1;
                                    break;
                                case 8:
                                    o = 2,
                                        c = i.soundType.cut2;
                                    break;
                                case 1:
                                case 4:
                                    c = i.soundType.cut3,
                                        o = 4;
                                    break;
                                case 2:
                                    c = i.soundType.cut4,
                                        o = 5;
                                    break;
                                case 5:
                                    c = i.soundType.cut4,
                                        o = 1;
                                    break;
                                default:
                                    console.log("\u6728\u6709-----")
                            }
                            i.default.suondMgrShader.playEffectSound(c),
                                s.default.shareGameData.addConbom(1),
                                this.isCut = !0,
                                r.default.shareKnife.isCutEmpty = !1;
                            var d = this.node.convertToWorldSpace(cc.v2(0, 0));
                            d = cc.v2(d.x - .5 * cc.winSize.width, d.y - .5 * cc.winSize.height);
                            var l = n.default.shareGameScene.getEfc1();
                            l.active = !0,
                                l.getComponent("efc1").initText(o),
                                l.getComponent(cc.Animation).play("guozhi").resume(),
                                1 == s.default.shareGameData.isFuritPartyMode ? (l.getComponent(cc.Animation).play("guozhi").resume(),
                                    l.position = d,
                                    l.setParent(this.node.getParent().getParent()),
                                    this.partyFly()) : (s.default.shareGameData.missionCurProgress += 1,
                                        n.default.shareGameScene.updataMissionProbar(),
                                        this.node.getParent().getComponent("foodArry").sudOneFood(),
                                        this.fly(),
                                        l.position = d,
                                        l.setParent(this.node.getParent().getParent())),
                                l.zIndex = 0,
                                l.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                    l.removeFromParent(),
                                        n.default.shareGameScene.recyclingef1(l)
                                }))),
                                this.node.getComponent(cc.BoxCollider).enabled = !1
                        }
                    }
                    ,
                    t.prototype.tickFly = function () {
                        var e = this
                            , t = this.node.convertToWorldSpace(cc.v2(0, 0));
                        t = cc.v2(t.x - .5 * cc.winSize.width, t.y - .5 * cc.winSize.height),
                            this.guo_icon.position = t,
                            this.guo_icon.setParent(this.node.getParent().getParent()),
                            this.guo_icon.zIndex = 10,
                            this.guo_icon.runAction(cc.sequence(cc.spawn(cc.moveBy(.1, cc.v2(0, 30)), cc.scaleTo(0, 1.3)), cc.delayTime(.5), cc.callFunc(function () {
                                var t = [cc.v2(e.guo_icon.x + 150, e.guo_icon.y + 250), cc.v2(e.guo_icon.x + 150, e.guo_icon.y - 200), cc.v2(.5 * cc.winSize.width - 50, 40)]
                                    , o = cc.bezierTo(.6, t);
                                e.guo_icon.runAction(cc.spawn(cc.scaleTo(.6, .8), cc.sequence(o, cc.fadeOut(.1), cc.removeSelf())))
                            }))),
                            this.guo_icon.runAction(cc.repeatForever(cc.rotateBy(.2, -80))),
                            this.guo_icon.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                n.default.shareGameScene.node.getParent().getChildByName("friutStore").getComponent("friutTickStore").btnScale()
                            })))
                    }
                    ,
                    t.prototype.fly = function () {
                        var e = this
                            , t = this.node.convertToWorldSpace(cc.v2(0, 0));
                        t = cc.v2(t.x - .5 * cc.winSize.width, t.y - .5 * cc.winSize.height),
                            this.node.getParent().getComponent("foodArry").addPointItem(this.node.position),
                            this.node.position = t,
                            this.node.setParent(this.node.getParent().getParent()),
                            n.default.shareGameScene.addmoneyFly(t),
                            this.node.zIndex = 1,
                            this.sp.active = !1,
                            this.cut1.position = t,
                            this.cut1.setParent(this.node.getParent()),
                            this.cut1.active = !0,
                            this.cut2.active = !0;
                        var o = [cc.v2(this.cut1.x + 100, this.cut1.y + 250), cc.v2(this.cut1.x + 150, this.cut1.y - 200), cc.v2(n.default.shareGameScene.Fooddish.position.x, n.default.shareGameScene.Fooddish.position.y + n.default.shareGameScene.FooddishMeatPos.y + 40)]
                            , a = cc.bezierTo(.8, o);
                        this.cut1.runAction(cc.sequence(a, cc.removeSelf())),
                            this.cut1.runAction(cc.repeatForever(cc.rotateBy(.2, -80))),
                            this.cut1.runAction(cc.sequence(cc.scaleTo(.1, 1.2), cc.scaleTo(.8, .6))),
                            this.cut2.position = t,
                            this.cut2.setParent(this.node.getParent());
                        var i = [cc.v2(this.cut2.x - 150, this.cut1.y + 250), cc.v2(this.cut1.x - 160, this.cut1.y - 200), cc.v2(n.default.shareGameScene.Fooddish.position.x, n.default.shareGameScene.Fooddish.position.y + n.default.shareGameScene.FooddishMeatPos.y + 40)]
                            , s = cc.bezierTo(.8, i);
                        this.cut2.runAction(cc.sequence(cc.scaleTo(.1, 1.2), cc.scaleTo(.8, .6))),
                            this.cut2.runAction(cc.repeatForever(cc.rotateBy(.2, 80))),
                            this.cut2.runAction(cc.sequence(s, cc.removeSelf(), cc.callFunc(function () {
                                n.default.shareGameScene.addMeatToDish(e.id),
                                    e.node.removeFromParent(),
                                    n.default.shareGameScene.foodPool.put(e.node)
                            })))
                    }
                    ,
                    t.prototype.partyFly = function () {
                        var e = this
                            , t = this.node.convertToWorldSpace(cc.v2(0, 0));
                        t = cc.v2(t.x - .5 * cc.winSize.width, t.y - .5 * cc.winSize.height),
                            this.node.position = t,
                            this.node.setParent(this.node.getParent()),
                            n.default.shareGameScene.addmoneyFly(t, 2),
                            this.node.stopAllActions(),
                            this.sp.active = !1,
                            this.cut1.position = t,
                            this.cut1.setParent(this.node.getParent()),
                            this.cut1.active = !0,
                            this.cut2.active = !0;
                        var o = [cc.v2(this.cut1.x + 100, this.cut1.y + 250), cc.v2(this.cut1.x + 260, this.cut1.y - 200), cc.v2(t.x + 200, .5 * -cc.winSize.height)]
                            , a = cc.bezierTo(.8, o);
                        this.cut1.runAction(cc.sequence(a, cc.removeSelf())),
                            this.cut1.runAction(cc.repeatForever(cc.rotateBy(.2, -60 - 40 * Math.random()))),
                            this.cut2.position = t,
                            this.cut2.setParent(this.node.getParent());
                        var i = [cc.v2(this.cut2.x - 100, this.cut1.y + 250), cc.v2(this.cut1.x - 260, this.cut1.y - 200), cc.v2(t.x - 200, .5 * -cc.winSize.height)]
                            , s = cc.bezierTo(.8, i);
                        this.cut2.runAction(cc.repeatForever(cc.rotateBy(.2, 60 + 40 * Math.random()))),
                            this.cut2.runAction(cc.sequence(s, cc.callFunc(function () { }), cc.removeSelf(), cc.callFunc(function () {
                                e.node.removeFromParent(),
                                    n.default.shareGameScene.foodPool.put(e.node)
                            })))
                    }
                    ,
                    __decorate([l(cc.Node)], t.prototype, "guo_icon", void 0),
                    __decorate([l(cc.Node)], t.prototype, "sp", void 0),
                    __decorate([l(cc.Node)], t.prototype, "cut1", void 0),
                    __decorate([l(cc.Node)], t.prototype, "cut2", void 0),
                    t = __decorate([d], t)
            } (cc.Component);
        o.default = u,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    friutTickStore: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "3fae8pstZ9LzoCWkiE3jE0J", "friutTickStore"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = e("./weChatApi/WXApi")
            , n = cc._decorator
            , s = n.ccclass
            , r = n.property
            , c = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.tickcountLabel = null,
                        t.isShow = !1,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () {
                        this.isShow = !1,
                            this.node.getChildByName("pic_lingqu_bg").x = .5 * cc.winSize.width,
                            this.node.getChildByName("bg").active = !1,
                            this.node.getChildByName("pic_lingqu_bg").getChildByName("showNode").active = !1
                    }
                    ,
                    t.prototype.btnScale = function () {
                        var e = this.node.getChildByName("pic_lingqu_bg").getChildByName("btn_chouti_2");
                        if (null == e.getActionByTag(1)) {
                            var t = cc.sequence(cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 1));
                            t.setTag(1),
                                e.runAction(t)
                        }
                    }
                    ,
                    t.prototype.openBtn = function () {
                        var e = this
                            , t = this.node.getChildByName("pic_lingqu_bg");
                        t.stopAllActions(),
                            0 == this.isShow ? (this.isShow = !0,
                                this.node.getChildByName("pic_lingqu_bg").getChildByName("showNode").active = !0,
                                this.tickcountLabel.string = (a.default.shareGameData.all_FriutTick + a.default.shareGameData.cur_getFriutTick).toString(),
                                t.runAction(cc.sequence(cc.moveTo(.3, cc.v2(.5 * cc.winSize.width - t.width, t.y)).easing(cc.easeOut(1)), cc.callFunc(function () {
                                    e.node.getChildByName("bg").active = !0
                                })))) : (this.isShow = !1,
                                    this.node.getChildByName("bg").active = !1,
                                    t.runAction(cc.sequence(cc.moveTo(.3, cc.v2(.5 * cc.winSize.width, t.y)).easing(cc.easeOut(1)), cc.callFunc(function () {
                                        e.node.getChildByName("pic_lingqu_bg").getChildByName("showNode").active = !1
                                    }))))
                    }
                    ,
                    t.prototype.buyBtn = function (e, t) {
                        var o = [1e3, 1800, 1e3, 1800, 9800, 6800];
                        if (console.log("buyBtn", t),
                            t -= 1,
                            a.default.shareGameData.all_FriutTick >= o[t] && t < 4) {
                            this.tickcountLabel.string = (a.default.shareGameData.all_FriutTick + a.default.shareGameData.cur_getFriutTick).toString();
                            var n = {};
                            if (0 == t || 1 == t) {
                                var s = 15e3;
                                1 == t && (s = 3e4),
                                    a.default.shareGameData.all_FriutTick -= o[t],
                                    a.default.shareGameData.gold += s,
                                    n = {
                                        all_FriutTick: a.default.shareGameData.all_FriutTick,
                                        gold: a.default.shareGameData.gold
                                    };
                                var r = new cc.Event.EventCustom("updataMoney", !0);
                                this.node.dispatchEvent(r)
                            } else {
                                s = 1008;
                                3 == t && (s = 1007),
                                    0 == a.default.shareGameData.isHaveSkin(s) ? (n = {
                                        all_FriutTick: a.default.shareGameData.all_FriutTick,
                                        package_map: JSON.stringify(a.default.skinMap)
                                    },
                                        a.default.shareGameData.all_FriutTick -= o[t],
                                        a.default.shareGameData.addOneSkinData(s)) : a.default.shareGameData.showTip(15, 2)
                            }
                            i.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: i.default.OpenId,
                                data_info: JSON.stringify(n)
                            }, function (e, t) {
                                console.log("\u679c\u5708\u5151\u6362\u6210\u529f*****"),
                                    a.default.shareGameData.showTip(14, 2)
                            })
                        } else
                            a.default.shareGameData.showTip(12, 2)
                    }
                    ,
                    __decorate([r(cc.Label)], t.prototype, "tickcountLabel", void 0),
                    t = __decorate([s], t)
            } (cc.Component);
        o.default = c,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./weChatApi/WXApi": "WXApi"
    }],
    gameConfig: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "c41c47fHaJGaLfGAM8BBBpw", "gameConfig"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.foodArryConfig = null,
                        t.luckyRotaryConfig = null,
                        t.foodArryActConfig = null,
                        t.storeConfig = null,
                        t.arryModelTypeConfig = null,
                        t.achConfig = null,
                        t.partyConfig = null,
                        t
                }
                var o;
                return __extends(t, e),
                    o = t,
                    t.prototype.onLoad = function () {
                        o.shareConfig = this,
                            o.foodArryConfig_ = this.foodArryConfig,
                            o.luckyRotaryConfig_ = this.luckyRotaryConfig,
                            o.storeConfig_ = this.storeConfig,
                            o.foodArryActConfig_ = this.foodArryActConfig,
                            o.arryModelTypeConfig_ = this.arryModelTypeConfig,
                            o.achConfig_ = this.achConfig,
                            o.partyConfig_ = this.partyConfig
                    }
                    ,
                    t.prototype.onDisable = function () { }
                    ,
                    t.prototype.start = function () { }
                    ,
                    t.foodArryConfig_ = null,
                    t.luckyRotaryConfig_ = null,
                    t.storeConfig_ = null,
                    t.foodArryActConfig_ = null,
                    t.arryModelTypeConfig_ = null,
                    t.achConfig_ = null,
                    t.partyConfig_ = null,
                    __decorate([n(cc.JsonAsset)], t.prototype, "foodArryConfig", void 0),
                    __decorate([n(cc.JsonAsset)], t.prototype, "luckyRotaryConfig", void 0),
                    __decorate([n(cc.JsonAsset)], t.prototype, "foodArryActConfig", void 0),
                    __decorate([n(cc.JsonAsset)], t.prototype, "storeConfig", void 0),
                    __decorate([n(cc.JsonAsset)], t.prototype, "arryModelTypeConfig", void 0),
                    __decorate([n(cc.JsonAsset)], t.prototype, "achConfig", void 0),
                    __decorate([n(cc.JsonAsset)], t.prototype, "partyConfig", void 0),
                    t = o = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    gameData: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "bae0bS1JA5Exqi8nN+yO2nD", "gameData"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameConfig")
            , i = e("./gameConfig")
            , n = e("./weChatApi/WXApi")
            , s = e("./gameScene")
            , r = e("./knife")
            , c = cc._decorator
            , d = c.ccclass
            , l = c.property
            , u = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.isBossToLucky = !1,
                        t.isOpenSwich = !0,
                        t.gameModel = 0,
                        t.gameSpeedOff = 0,
                        t.lv = 1,
                        t.curGetMoney = 0,
                        t.gold = 0,
                        t.tickCount = 0,
                        t.isThree = !1,
                        t.isSuperThree = !1,
                        t.curThreeCount = 0,
                        t.curSkinID = 1,
                        t.curResurrectionCount = 0,
                        t.conbom = 0,
                        t.curExperienceSkinID = null,
                        t.curExperienceUseCount = 0,
                        t.missionTotalProgress = 0,
                        t.missionCurProgress = 0,
                        t.d_shareCount = 0,
                        t.d_videoCount = 0,
                        t.cur_DayCount = 0,
                        t.is_sign = 0,
                        t.t_video = 0,
                        t.t_share = 0,
                        t.isShowOnceCutGift = !1,
                        t.isExprece3Mision = !1,
                        t.isPerfectConbom = !1,
                        t.Fruit_video = 1,
                        t.Up_down = 1,
                        t.curAchData = null,
                        t.isFuritPartyMode = !1,
                        t.isFuritBossMode = !1,
                        t.partyMoney = 0,
                        t.partyHealthy = 2,
                        t.fruitBoss_Lv = 1,
                        t.curfruitBoss_blood = 5,
                        t.day_FriutTick = 50,
                        t.cur_getFriutTick = 0,
                        t.all_FriutTick = 0,
                        t.all_phoneMoney = 0,
                        t.curIsHaveTresure = !1,
                        t.isFirstLuckyDraw = 1,
                        t.partyModelCount = 2,
                        t.bossMaxHealthy = 20,
                        t.recordRewardCount = 2,
                        t.recordvideoPath = null,
                        t.recordtime = 0,
                        t.isGoDayWeapon = !1,
                        t.tipPrefab = null,
                        t
                }
                var o;
                return __extends(t, e),
                    o = t,
                    t.prototype.onLoad = function () {
                        o.shareGameData = this,
                            o.tipPrefab_ = this.tipPrefab
                    }
                    ,
                    t.prototype.onDisable = function () { }
                    ,
                    t.prototype.start = function () { }
                    ,
                    t.prototype.getMissionTotalProgress = function (e) {
                        console.log("getMissionTotalProgress", e);
                        for (var t = 1, o = 0; o < e.groudList.length; o++) {
                            var a = e.groudList[o];
                            t = e.FoodIDList[o][0] > 1e3 ? this.bossMaxHealthy : 1;
                            for (var i = 0; i < a.length; i++) {
                                a[i];
                                this.missionTotalProgress += t
                            }
                        }
                    }
                    ,
                    t.prototype.initBossHeathy = function () {
                        this.bossMaxHealthy = 6 + 2 * (Math.floor(o.shareGameData.lv / 5) - 1),
                            this.bossMaxHealthy = this.bossMaxHealthy > 18 ? 18 : this.bossMaxHealthy
                    }
                    ,
                    t.prototype.initMissionSubIDArry = function () {
                        var e = this;
                        if (this.initBossHeathy(),
                            this.missionCurProgress = 0,
                            this.missionTotalProgress = 0,
                            o.missionData.length > 0)
                            for (var t = 0; t < o.missionData.length; t++) {
                                (c = o.missionData[t]).isBoss ? this.getMissionTotalProgress(i.default.foodArryConfig_.json.boss[c.ID - 1]) : this.getMissionTotalProgress(i.default.foodArryConfig_.json.normal[c.ID - 1])
                            }
                        else {
                            var a = 0
                                , s = 2;
                            this.lv <= 6 ? s = 4 : this.lv > 7 && this.lv <= 20 ? (s = 4,
                                a = 1) : this.lv > 20 && this.lv <= 40 ? (s = 5,
                                    a = 2) : this.lv > 40 && this.lv <= 60 ? (s = 6,
                                        a = 3) : this.lv > 60 && this.lv <= 100 ? (s = 7,
                                            a = 4) : this.lv > 100 && this.lv <= 200 ? (s = 7 + Math.ceil(3 * Math.random()),
                                                a = 5) : this.lv > 200 && (s = 8 + Math.ceil(4 * Math.random()),
                                                    a = 6);
                            var r = [];
                            for (t = 0; t < i.default.foodArryActConfig_.json.Lv[a].actIDList.length; t++) {
                                var c = i.default.foodArryActConfig_.json.Lv[a].actIDList[t]
                                    , d = i.default.foodArryActConfig_.json.actData[c - 1].ID;
                                r.push(d)
                            }
                            var l = []
                                , u = 0
                                , h = -1;
                            if (i.default.arryModelTypeConfig_.json.fixdLv.length >= o.shareGameData.lv) {
                                if ((l = i.default.arryModelTypeConfig_.json.fixdLv[this.lv - 1].arryID).forEach(function (t) {
                                    e.getMissionTotalProgress(i.default.foodArryConfig_.json.normal[t - 1])
                                }),
                                    i.default.arryModelTypeConfig_.json.fixdLv[this.lv - 1].bossArryID) {
                                    h = i.default.arryModelTypeConfig_.json.fixdLv[this.lv - 1].bossArryID;
                                    var p = i.default.arryModelTypeConfig_.json.fixdLv[this.lv - 1].bossArryID;
                                    this.getMissionTotalProgress(i.default.foodArryConfig_.json.boss[p - 1])
                                }
                                console.log("\u7b56\u5212\u524d\u976212\u5173\u81ea\u5df1\u914d\u554a-", this.lv, this.missionTotalProgress)
                            } else {
                                var f = i.default.arryModelTypeConfig_.json.arryModel
                                    , m = [];
                                for (t = 0; t < f.length; t++) {
                                    m[t] = [];
                                    for (var g = 0; g < f[t].idList.length; g++) {
                                        c = f[t].idList[g];
                                        m[t].push(c)
                                    }
                                }
                                var y = 0;
                                for (t = 0; t < s; t++) {
                                    y = t % f.length;
                                    c = 1;
                                    u = Math.floor(Math.random() * m[y].length),
                                        c = m[y][u],
                                        this.getMissionTotalProgress(i.default.foodArryConfig_.json.normal[c - 1]),
                                        l.push(c),
                                        m[y].splice(u, 1)
                                }
                            }
                            console.log("\u521d\u59cb\u5316\u5173\u5361id---------", l);
                            for (t = 0; t < l.length; t++) {
                                c = l[t];
                                var _ = {
                                    actID: r[Math.floor(Math.random() * r.length)],
                                    ID: c
                                };
                                o.missionData.push(_)
                            }
                            if (-1 == h) {
                                if (o.shareGameData.lv % 5 == 0) {
                                    h = i.default.foodArryConfig_.json.boss[Math.floor(Math.random() * i.default.foodArryConfig_.json.boss.length)].ID,
                                        this.getMissionTotalProgress(i.default.foodArryConfig_.json.boss[h - 1]);
                                    _ = {
                                        actID: r[Math.floor(Math.random() * r.length)],
                                        ID: h,
                                        isBoss: 1
                                    };
                                    o.missionData.push(_)
                                }
                            } else {
                                _ = {
                                    actID: r[Math.floor(Math.random() * r.length)],
                                    ID: h,
                                    isBoss: 1
                                };
                                o.missionData.push(_)
                            }
                            console.log("\u751f\u6210\u5173\u5361\u6570\u636e---------", o.missionData);
                            var v = {
                                cur_MissionIDList: JSON.stringify(o.missionData)
                            };
                            n.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: n.default.OpenId,
                                data_info: JSON.stringify(v)
                            }, function (e, t) {
                                console.log("\u4fdd\u5b58\u5173\u5361\u6570\u636e--", 200)
                            })
                        }
                    }
                    ,
                    t.prototype.addConbom = function (e) {
                        this.conbom += e
                    }
                    ,
                    t.prototype.resetConbom = function () {
                        for (var e = 0; e < this.conbom; e++)
                            1 == o.shareGameData.isFuritPartyMode ? this.partyMoney += e + 1 : this.curGetMoney += e + 1;
                        this.conbom = 0
                    }
                    ,
                    t.prototype.initSkinData = function () {
                        var e = a.default.storeConfig_.json.storeList;
                        o.skinMap = [],
                            e.forEach(function (e, t) {
                                var a = {};
                                a.id = e.ID,
                                    a.status = 0,
                                    a.index_sort = t,
                                    a.page = e.page,
                                    1 == e.ID && (a.status = 1),
                                    o.skinMap.push(a)
                            }),
                            console.log("\u521d\u59cb\u5316\u6570\u636e", o.skinMap)
                    }
                    ,
                    t.prototype.addOneSkinData = function (e) {
                        e > 1e3 && (console.log("\u6dfb\u52a0\u4e00\u4ef6\u76ae\u80a4", e),
                            e = 61 + e % 1e3),
                            o.skinMap[e - 1].status = 1
                    }
                    ,
                    t.prototype.isShowBuySkinTip = function (e) {
                        for (var t = !1, i = a.default.storeConfig_.json.pageCostList[e - 1], n = a.default.storeConfig_.json.storeList, s = 0; s < o.skinMap.length; s++) {
                            var r = o.skinMap[s]
                                , c = n[r.index_sort];
                            if (0 == r.status && c.page == e && o.shareGameData.gold >= i) {
                                t = !0;
                                break
                            }
                        }
                        return t
                    }
                    ,
                    t.prototype.isHaveSkin = function (e, t) {
                        void 0 === t && (t = 1);
                        for (var i = a.default.storeConfig_.json.storeList, n = !1, s = 0; s < o.skinMap.length; s++) {
                            var r = o.skinMap[s];
                            if (1 == t) {
                                if (e == r.id && 1 == r.status) {
                                    n = !0;
                                    break
                                }
                            } else {
                                var c = i[r.index_sort];
                                if (e == r.id && 1 == r.status && 5 == c.page) {
                                    n = !0;
                                    break
                                }
                            }
                        }
                        return n
                    }
                    ,
                    t.prototype.getNoBuySkin = function () {
                        for (var e = null, t = a.default.storeConfig_.json.storeList, i = [], n = 0; n < o.skinMap.length; n++) {
                            var s = o.skinMap[n]
                                , r = t[s.index_sort];
                            r.page < 5 && r.page > 0 && 0 == s.status && i.push(s.id)
                        }
                        return i.length > 0 && (e = i[Math.floor(Math.random() * i.length)]),
                            e
                    }
                    ,
                    t.prototype.setSkinState = function (e, t) {
                        for (var a = 0; a < o.skinMap.length; a++) {
                            var i = o.skinMap[a];
                            if (i.id == e) {
                                i.status;
                                break
                            }
                        }
                    }
                    ,
                    t.prototype.isAllWeapon = function (e) {
                        void 0 === e && (e = 4);
                        for (var t = !0, a = 0; a < o.skinMap.length; a++) {
                            var i = o.skinMap[a];
                            if (i.page == e && 0 == i.status) {
                                t = !1;
                                break
                            }
                        }
                        return console.log("\u76ae\u80a4\u662f\u5426\u5168\u6709", t),
                            t
                    }
                    ,
                    t.prototype.getLuckyItem = function (e) {
                        var t = 0
                            , o = i.default.luckyRotaryConfig_.json.list2[e - 1].price;
                        return 6 == e ? (console.log("content.length", o.length),
                            t = o[Math.floor(Math.random() * o.length)]) : t = o,
                            console.log("\u83b7\u53d6\u4e2d\u5956\u533a\u57df\u4e2d\u5956", e, t),
                            t
                    }
                    ,
                    t.prototype.isShowAchTip = function () {
                        o.shareGameData.curAchData = null;
                        var e = i.default.achConfig_.json.ach;
                        if (console.log("\u68c0\u67e5\u6210\u5c31", e[e.length - 1].needMissionID, o.shareGameData.lv),
                            e[e.length - 1].needMissionID < o.shareGameData.lv)
                            ;
                        else
                            for (var t = 0; t < e.length; t++) {
                                var a = e[t];
                                if (a.tipMissionID <= o.shareGameData.lv && o.shareGameData.lv <= a.needMissionID) {
                                    o.shareGameData.curAchData = a,
                                        console.log("\u6709\u6210\u5c31\u6570\u636e----", a);
                                    break
                                }
                            }
                    }
                    ,
                    t.prototype.getAchItem = function () {
                        if (o.shareGameData.curAchData && o.shareGameData.lv - 1 == o.shareGameData.curAchData.needMissionID && 1 == o.shareGameData.curAchData.items[0].type) {
                            o.shareGameData.curSkinID = o.shareGameData.curAchData.items[0].ID,
                                r.default.shareKnife.setKindfSkin(o.shareGameData.curSkinID),
                                r.default.shareKnife.doDownUp(),
                                s.default.shareGameScene.showTip(11, !1),
                                o.shareGameData.addOneSkinData(o.shareGameData.curAchData.items[0].ID);
                            var e = {
                                package_map: JSON.stringify(o.skinMap)
                            };
                            n.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: n.default.OpenId,
                                data_info: JSON.stringify(e)
                            }, function (e, t) {
                                console.log("\u6210\u529f\u83b7\u5f97\u6210\u5c31\u6b66\u5668---2222-", o.shareGameData.curAchData.items[0].ID)
                            })
                        }
                    }
                    ,
                    t.prototype.isUpdataRank = function (e) {
                        void 0 === e && (e = 1),
                            e >= o.shareGameData.lv && (o.shareGameData.lv = e,
                                n.default.HttpPost("/index.php/api/shui_guo_da_shi/Update_rank_score", {
                                    user_id: n.default.OpenId,
                                    rank_name: "worlkrank",
                                    value: o.shareGameData.lv
                                }, function (t, o) {
                                    console.log("\u66f4\u65b0\u6392\u884c\u699c", e)
                                }))
                    }
                    ,
                    t.prototype.getRank = function (e, t, o) {
                        void 0 === e && (e = 1),
                            void 0 === t && (t = 6),
                            void 0 === o && (o = null),
                            n.default.HttpPost("/index.php/api/shui_guo_da_shi/Get_ranking_list", {
                                user_id: n.default.OpenId,
                                rank_name: "worlkrank",
                                p: e,
                                page_size: t
                            }, function (e, t) {
                                console.log("\u83b7\u53d6\u6392\u884c\u699c", t),
                                    o && (o(t),
                                        o = null)
                            })
                    }
                    ,
                    t.prototype.getBossMaxBlood = function () {
                        return 13 + 2 * (o.shareGameData.fruitBoss_Lv - 1)
                    }
                    ,
                    t.prototype.showTip = function (e, t) {
                        void 0 === e && (e = 1),
                            void 0 === t && (t = 1),
                            console.log("-1\u7cfb\u7edf\u63d0\u793a\uff0c\uff0c2\u5956\u52b1\u63d0\u793a----------------------", e, t);
                        var a = "";
                        if (1 == t ? (a = "tip1",
                            200) : 2 == t && (a = "tip2"),
                            !cc.director.getScene().getChildByName(a)) {
                            var i = cc.instantiate(o.tipPrefab_);
                            i.position = cc.v2(.5 * cc.winSize.width, .5 * cc.winSize.height),
                                i.getComponent("tipNode").setCallBack(function () {
                                    i.removeFromParent()
                                }),
                                i.getComponent("tipNode").showTip(e),
                                cc.director.getScene().addChild(i, 10, a)
                        }
                    }
                    ,
                    t.missionReportArry = [],
                    t.skinMap = [],
                    t.missionData = [],
                    t.curCutCount = 0,
                    t.tipPrefab_ = null,
                    __decorate([l(cc.Prefab)], t.prototype, "tipPrefab", void 0),
                    t = o = __decorate([d], t)
            } (cc.Component);
        o.default = u,
            cc._RF.pop()
    }
        , {
        "./gameConfig": "gameConfig",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./weChatApi/WXApi": "WXApi"
    }],
    gameHead: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "ddee7SEXE9DmZ/DKQAAinNg", "gameHead"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.nameLb = null,
                        t.sp = null,
                        t.headDta = {},
                        t
                }
                return __extends(t, e),
                    t.prototype.onLoad = function () {
                        this.node.on(cc.Node.EventType.TOUCH_END, this.touchHead, this)
                    }
                    ,
                    t.prototype.start = function () { }
                    ,
                    t.prototype.init = function (e) {
                        var t = this;
                        this.headDta = e,
                            cc.loader.load(e.image, function (e, o) {
                                t.sp.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(o)
                            }),
                            this.nameLb.getComponent(cc.Label).string = e.title
                    }
                    ,
                    t.prototype.touchHead = function () { }
                    ,
                    __decorate([n(cc.Node)], t.prototype, "nameLb", void 0),
                    __decorate([n(cc.Node)], t.prototype, "sp", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    gameOver: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "a174f/iPMZDTI5lAmuO2bWE", "gameOver"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./event")
            , i = e("./soundMrg")
            , n = e("./weChatApi/WXApi")
            , s = e("./gameData")
            , r = e("./gameScene")
            , c = cc._decorator
            , d = c.ccclass
            , l = c.property
            , u = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.wxNode = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.onEnable = function () {
                        console.log("f\u590d\u6d3b--\u6a21\u5f0f", s.default.shareGameData.gameModel),
                            0 != s.default.shareGameData.gameModel && n.default.SetUserKV(s.default.shareGameData.lv.toString(), "0", ""),
                            i.default.suondMgrShader.playBgmSound(i.soundType.gameOverBgm, !1),
                            n.default.setSubCover(this.wxNode),
                            n.default.ShowBestRank(s.default.shareGameData.lv),
                            n.default.OpenAd("", 0, -1)
                    }
                    ,
                    t.prototype.returnButton = function () {
                        i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            a.default.addEventPos(a.eventID.settlement_returnMain),
                            cc.director.loadScene("start")
                    }
                    ,
                    t.prototype.shareButton = function (e, t) {
                        i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            console.log("f\u590d\u6d3b--\u6a21\u5f0f", s.default.shareGameData.gameModel),
                            a.default.addEventPos(a.eventID.settlement_challengeFriend),
                            1 == t ? n.default.OpenShare(1, {
                                other_openid: n.default.OpenId,
                                type: 2
                            }, !1, !1, function () {
                                console.log("\u5206\u4eab\u6210\u529f"),
                                    r.default.shareGameScene.resurrectionGame()
                            }) : n.default.OpenAdVides(function () {
                                console.log("\u5206\u4eab\u6210\u529f"),
                                    r.default.shareGameScene.resurrectionGame()
                            })
                    }
                    ,
                    t.prototype.aginButton = function () {
                        i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            s.default.shareGameData.curResurrectionCount = 0,
                            s.default.shareGameData.cur_getFriutTick = 0,
                            a.default.addEventPos(a.eventID.settlement_playAgain),
                            cc.director.loadScene("gameScene")
                    }
                    ,
                    t.prototype.rankButton = function () { }
                    ,
                    __decorate([l(cc.Node)], t.prototype, "wxNode", void 0),
                    t = __decorate([d], t)
            } (cc.Component);
        o.default = u,
            cc._RF.pop()
    }
        , {
        "./event": "event",
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    gameScene: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "3382fXx7flHqbk7qFMc5hAd", "gameScene"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./event")
            , i = e("./soundMrg")
            , n = e("./gameConfig")
            , s = e("./gameData")
            , r = e("./knife")
            , c = e("./weChatApi/WXApi")
            , d = cc._decorator
            , l = d.ccclass
            , u = d.property
            , h = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.baoheNode = null,
                        t.bossNode = null,
                        t.partNode = null,
                        t.conbomNode = null,
                        t.surprisedNode = null,
                        t.weaponBtnNode = null,
                        t.sanPrefab = null,
                        t.tipNode = null,
                        t.storeNode = null,
                        t.scoreNode = null,
                        t.gameResuriNode = null,
                        t.threeGetNode = null,
                        t.luckyNode = null,
                        t.playNode = null,
                        t.passNode = null,
                        t.allKnifeTexturePlist = null,
                        t.efcTexturePlist = null,
                        t.allFoodTexturePlist = null,
                        t.bossPrefab = null,
                        t.cutFoodItem = null,
                        t.efc1Prefab = null,
                        t.Fooddish = null,
                        t.FoodArryNode = null,
                        t.FooddishMeatPos = null,
                        t.curFoodArryIndex = 1,
                        t.cutFoodReportArry = [],
                        t.FooddishState = 0,
                        t.specialBtn = null,
                        t.foodItem = null,
                        t.moneyItem = null,
                        t.foodPool = null,
                        t.ef1pool = null,
                        t.bossPool = null,
                        t.moneyPool = null,
                        t.FoodArryid = 0,
                        t.actid = 1,
                        t.stopRecordCallBack = null,
                        t.curRecordTime = 0,
                        t
                }
                var o;
                return __extends(t, e),
                    o = t,
                    t.prototype.onLoad = function () {
                        o.shareGameScene = this,
                            this.Fooddish.x = .5 * -cc.winSize.width - .5 * this.Fooddish.width - 25,
                            console.log("\u5f53\u524d\u6e38\u620f\u6a21\u5f0f", s.default.shareGameData.gameModel),
                            s.default.shareGameData.gameSpeedOff = n.default.foodArryActConfig_.json.modelSpeed[s.default.shareGameData.gameModel]
                    }
                    ,
                    t.prototype.start = function () {
                        this.moneyPool = new cc.NodePool;
                        for (var e = 0; e < 35; e++) {
                            var t = cc.instantiate(this.moneyItem);
                            this.moneyPool.put(t)
                        }
                        this.foodPool = new cc.NodePool;
                        for (e = 0; e < 25; e++) {
                            t = cc.instantiate(this.foodItem);
                            this.foodPool.put(t)
                        }
                        this.ef1pool = new cc.NodePool;
                        for (e = 0; e < 25; e++) {
                            t = cc.instantiate(this.efc1Prefab);
                            this.ef1pool.put(t)
                        }
                        this.bossPool = new cc.NodePool;
                        for (e = 0; e < 5; e++) {
                            t = cc.instantiate(this.bossPrefab);
                            this.bossPool.put(t)
                        }
                        s.default.shareGameData.isShowOnceCutGift = !1,
                            s.default.curCutCount = 0,
                            c.default.CloseAd(),
                            this.initDish(),
                            this.playNode.getChildByName("threeButton").stopAllActions(),
                            this.playNode.getChildByName("threeButton").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1)))),
                            1 == s.default.shareGameData.isFuritPartyMode ? this.showParty() : this.shouUI()
                    }
                    ,
                    t.prototype.showFriutStore = function () {
                        0 == c.default.area_openSitch ? this.node.getParent().getChildByName("friutStore").active = !0 : this.node.getParent().getChildByName("friutStore").active = !1
                    }
                    ,
                    t.prototype.showFruitBoss = function () {
                        this.FooddishState = 0,
                            this.Fooddish.active = !1,
                            this.playNode.getChildByName("achItemTip").active = !1,
                            this.scoreNode.active = !1,
                            this.FoodArryNode.active = !1,
                            this.bossNode.active = !0,
                            this.bossNode.getComponent("bossNode").initUI(),
                            r.default.shareKnife.clreaKinef(),
                            r.default.shareKnife.resetKinfe()
                    }
                    ,
                    t.prototype.showParty = function () {
                        this.playNode.getChildByName("setBtn").active = !1,
                            this.showHelp(!1),
                            this.FooddishState = 0,
                            this.Fooddish.active = !1,
                            this.scoreNode.active = !1,
                            this.node.parent.getChildByName("misiionBarNode").active = !1,
                            s.default.shareGameData.isFuritBossMode = !1,
                            this.playNode.getChildByName("achItemTip").active = !1,
                            this.partNode.active = !0,
                            this.partNode.getComponent("partNode").startShoot(),
                            r.default.shareKnife.clreaKinef(),
                            r.default.shareKnife.resetKinfe()
                    }
                    ,
                    t.prototype.shouUI = function () {
                        var e = this;
                        this.playNode.getChildByName("setBtn").active = !0,
                            c.default.wondersdk.statevent("Level-" + s.default.shareGameData.lv),
                            this.showFriutStore(),
                            3 == s.default.shareGameData.lv ? this.scheduleOnce(function () {
                                console.log("\u5f00\u542f\u4f53\u9a8c\u6a21\u5f0f-----"),
                                    s.default.shareGameData.isExprece3Mision = !0,
                                    r.default.shareKnife.openThreeKinfe(!0),
                                    r.default.shareKnife.initKinfePos(),
                                    r.default.shareKnife.initCountTip(),
                                    o.shareGameScene.showTip(3, !1)
                            }, .4) : 4 == s.default.shareGameData.lv ? (o.shareGameScene.showTip(3, !1),
                                this.btnThreeGetCB()) : s.default.shareGameData.curThreeCount > 0 && (r.default.shareKnife.openThreeKinfe(!0),
                                    r.default.shareKnife.initKinfePos(),
                                    r.default.shareKnife.initCountTip()),
                            this.playNode.getChildByName("achItemTip").active = !0,
                            s.default.shareGameData.isBossToLucky = !1,
                            this.Fooddish.active = !0,
                            this.scoreNode.active = !0,
                            this.node.parent.getChildByName("misiionBarNode").active = !0,
                            this.FoodArryNode.active = !0,
                            s.default.shareGameData.isFuritPartyMode = !1,
                            s.default.shareGameData.isFuritBossMode = !1,
                            i.default.suondMgrShader.playBgmSound(i.soundType.GameBgm, !0),
                            this.scheduleOnce(function () {
                                r.default.shareKnife.initTouchEvent()
                            }),
                            s.default.shareGameData.initMissionSubIDArry(),
                            s.default.shareGameData.curGetMoney = 0,
                            s.default.shareGameData.partyMoney = 0,
                            this.node.parent.getChildByName("misiionBarNode").getComponent("misiionBarNode").init(s.default.shareGameData.lv, .6),
                            this.FooddishState = 1,
                            this.FooddishMeatPos = cc.v2(0, .5 * -this.Fooddish.height - 5),
                            this.Fooddish.runAction(cc.sequence(cc.moveTo(.4, cc.v2(.5 * -cc.winSize.width + .5 * this.Fooddish.width, this.Fooddish.y)).easing(cc.easeOut(2)), cc.callFunc(function () {
                                e.FooddishState = 0
                            }))),
                            this.curFoodArryIndex = 1;
                        for (var t = 0; t < s.default.missionData.length; t++)
                            this.cutFoodReportArry[t] = [];
                        this.initFoodArry(),
                            o.shareGameScene.updataMissionMoney(),
                            o.shareGameScene.updataMissionProbar(!1),
                            this.playNode.getChildByName("achItemTip").getComponent("achItemTip").showAchTip()
                    }
                    ,
                    t.prototype.initDish = function () {
                        var e = this.Fooddish.getChildByName("san");
                        e && e.removeFromParent();
                        var t = cc.instantiate(this.sanPrefab);
                        this.Fooddish.addChild(t, -1, "san"),
                            t.position = cc.v2(44, 25)
                    }
                    ,
                    t.prototype.addMeatToDish = function (e) {
                        this.cutFoodReportArry[this.curFoodArryIndex - 1].push(e);
                        var t = cc.instantiate(this.cutFoodItem);
                        t.getComponent("cutFood").setTexture(this.allFoodTexturePlist.getSpriteFrame(e + "-2")),
                            this.Fooddish.addChild(t, -1),
                            this.FooddishMeatPos.y += t.height,
                            t.position = cc.v2(this.FooddishMeatPos.x + 5 - 10 * Math.random(), this.FooddishMeatPos.y - .5 * t.height),
                            this.FooddishMeatPos.y > 25 && (this.Fooddish.getChildByName("san").y = this.FooddishMeatPos.y)
                    }
                    ,
                    t.prototype.initFoodArry = function () {
                        var e = this;
                        console.log("---------initFoodArry", s.default.missionData);
                        var t = s.default.missionData;
                        if (2 != s.default.shareGameData.gameModel && (s.default.shareGameData.isSuperThree = !1,
                            s.default.shareGameData.curThreeCount > 0 || 0 == s.default.shareGameData.isExprece3Mision && r.default.shareKnife.openThreeKinfe(!1)),
                            console.log("gameData.shareGameData.isShowOnceCutGif", s.default.shareGameData.isShowOnceCutGift, s.default.curCutCount, s.default.shareGameData.lv),
                            0 == s.default.shareGameData.isShowOnceCutGift && 1 == s.default.curCutCount) {
                            var o = 0;
                            s.default.shareGameData.lv <= 1 ? o = 0 : s.default.shareGameData.lv >= 4 && (o = 50),
                                o >= 100 * Math.random() && (s.default.shareGameData.isShowOnceCutGift = !0,
                                    this.showSurprisedNode())
                        }
                        if (s.default.curCutCount = 0,
                            0 != this.FoodArryid) {
                            s.default.missionData = [];
                            var a = {
                                ID: this.FoodArryid,
                                actID: this.actid
                            };
                            s.default.missionData.push(a),
                                t = s.default.missionData
                        }
                        if (1 == s.default.shareGameData.lv && 1 == this.curFoodArryIndex ? this.showHelp(!0) : this.showHelp(!1),
                            this.curFoodArryIndex > t.length)
                            s.default.missionReportArry.push(this.cutFoodReportArry[this.cutFoodReportArry.length - 1]),
                                2 == s.default.shareGameData.gameModel || 1 == s.default.shareGameData.gameModel ? (s.default.shareGameData.lv += 1,
                                    this.nextMission()) : this.missinResult();
                        else {
                            s.default.shareGameData.lv % 5 == 0 && this.curFoodArryIndex == t.length && (this.node.parent.getChildByName("bossComeNode").active = !0);
                            var i = t[this.curFoodArryIndex - 1].ID
                                , c = null;
                            c = t[this.curFoodArryIndex - 1].isBoss ? n.default.foodArryConfig_.json.boss[i - 1] : n.default.foodArryConfig_.json.normal[i - 1],
                                this.FoodArryNode.getComponent("foodArry").initFoodArry(c, this.curFoodArryIndex),
                                this.FoodArryNode.y = 450,
                                this.FoodArryNode.runAction(cc.spawn(cc.fadeIn(.5).easing(cc.easeBackOut()), cc.moveTo(.5, cc.v2(this.FoodArryNode.x, 154)).easing(cc.easeBackOut()))),
                                this.scheduleOnce(function () {
                                    e.FooddishState = 0
                                }, .5)
                        }
                    }
                    ,
                    t.prototype.missinResult = function () {
                        var e = this;
                        c.default.wondersdk.statevent("Clear the game-" + s.default.shareGameData.lv);
                        for (var t = [], o = 0; o < s.default.missionReportArry.length; o++) {
                            var a = s.default.missionReportArry[o];
                            t[o] = a.join(",")
                        }
                        s.default.shareGameData.lv += 1,
                            s.default.shareGameData.isUpdataRank(s.default.shareGameData.lv),
                            s.default.missionData = [],
                            s.default.shareGameData.all_FriutTick += s.default.shareGameData.cur_getFriutTick,
                            s.default.shareGameData.day_FriutTick -= s.default.shareGameData.cur_getFriutTick,
                            console.log("\u5b8c\u6210\u5927\u5173\u5361\u83b7\u5f97---", s.default.shareGameData.lv),
                            console.log("\u7ed3\u7b97\u83b7\u5f97\u679c\u5708---", s.default.shareGameData.all_FriutTick, s.default.shareGameData.cur_getFriutTick);
                        var i = {
                            food_arr: t.join("/"),
                            gold: s.default.shareGameData.gold,
                            max_score: s.default.shareGameData.lv,
                            cur_MissionIDList: JSON.stringify(s.default.missionData),
                            day_FriutTick: s.default.shareGameData.day_FriutTick,
                            all_FriutTick: s.default.shareGameData.all_FriutTick
                        };
                        s.default.shareGameData.cur_getFriutTick = 0,
                            c.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: c.default.OpenId,
                                data_info: JSON.stringify(i)
                            }, function (t, o) {
                                console.log("\u5b8c\u6210\u5173\u5361--\u4fdd\u5b58\u4fe1\u606f"),
                                    s.default.shareGameData.getAchItem(),
                                    4 == s.default.missionReportArry.length && 0 == s.default.shareGameData.gameModel ? (s.default.shareGameData.isBossToLucky = !0,
                                        e.showResult(!0)) : e.showResult(!1)
                            })
                    }
                    ,
                    t.prototype.showResult = function (e, t) {
                        var o = this;
                        void 0 === t && (t = !1),
                            this.scheduleOnce(function () {
                                o.scoreNode.active = !1,
                                    o.playNode.active = !1,
                                    o.node.parent.getChildByName("misiionBarNode").active = !0,
                                    o.passNode.active = !0,
                                    o.node.getParent().getChildByName("friutStore").active = !1,
                                    o.passNode.getComponent("passNode").showUI(e, t)
                            }, 1)
                    }
                    ,
                    t.prototype.finishOneFoodArry = function () {
                        this.FooddishState = 1,
                            this.curFoodArryIndex += 1,
                            this.initFoodArry(),
                            console.log("\u76d8\u5b50\u98df\u7269", this.cutFoodReportArry),
                            this.finishDIshAct()
                    }
                    ,
                    t.prototype.finishDIshAct = function () {
                        var e = this;
                        this.Fooddish.stopAllActions(),
                            this.Fooddish.runAction(cc.sequence(cc.moveTo(.15, cc.v2(.5 * -cc.winSize.width - .5 * this.Fooddish.width, this.Fooddish.y)), cc.callFunc(function () {
                                e.clearDisFood(),
                                    e.FooddishMeatPos = cc.v2(0, .5 * -e.Fooddish.height + 5)
                            }), cc.moveTo(.15, cc.v2(.5 * -cc.winSize.width + .5 * this.Fooddish.width, this.Fooddish.y)).easing(cc.easeOut(2)), cc.callFunc(function () {
                                e.initDish()
                            })))
                    }
                    ,
                    t.prototype.clearDisFood = function () {
                        this.Fooddish.removeAllChildren(),
                            this.initDish(),
                            console.log("\u6e05\u695a\u5b9e\u7269", this.Fooddish.children)
                    }
                    ,
                    t.prototype.nextMission = function (e) {
                        void 0 === e && (e = !0),
                            this.finishDIshAct(),
                            this.playNode.active = !0,
                            this.scoreNode.active = !0,
                            this.passNode.active = !1,
                            this.luckyNode.active = !1,
                            s.default.shareGameData.isShowOnceCutGift = !1,
                            s.default.shareGameData.isExprece3Mision = !1,
                            s.default.shareGameData.curResurrectionCount = 0,
                            s.default.shareGameData.cur_getFriutTick = 0,
                            s.default.curCutCount = 0,
                            1 == e && (s.default.missionData = []),
                            this.shouUI(),
                            c.default.OpenOverStep(s.default.shareGameData.lv)
                    }
                    ,
                    t.prototype.resurrection = function () {
                        s.default.missionReportArry.length > 0 && (s.default.missionReportArry[s.default.missionReportArry.length - 1] = []),
                            this.nextMission(!1)
                    }
                    ,
                    t.prototype.showLuckyUI = function () {
                        this.playNode.active = !1,
                            this.passNode.active = !1,
                            this.luckyNode.active = !0,
                            this.luckyNode.getComponent("luckyRotary").showUI(1)
                    }
                    ,
                    t.prototype.btnThreeGetCB = function () {
                        c.default.wondersdk.statevent("Level-" + s.default.shareGameData.lv + "-Avatar"),
                            i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            2 != s.default.shareGameData.gameModel && (a.default.addEventPos(a.eventID.game_weaponShadow),
                                s.default.shareGameData.curThreeCount <= 0 && 0 == s.default.shareGameData.isSuperThree && this.showThreeGetNodeUI(!0))
                    }
                    ,
                    t.prototype.showThreeGetNodeUI = function (e) {
                        void 0 === e && (e = !1),
                            i.default.suondMgrShader.playEffectSound(i.soundType.money),
                            this.threeGetNode.active = !0,
                            this.threeGetNode.getComponent("threeGet").isGame = e,
                            this.threeGetNode.getComponent("threeGet").setShareType(0)
                    }
                    ,
                    t.prototype.showWeaponExperienceUI = function () { }
                    ,
                    t.prototype.showResurrectionUI = function () {
                        this.playNode.active = !1,
                            this.threeGetNode.active = !1,
                            this.gameResuriNode.active = !0,
                            this.gameResuriNode.zIndex = 2
                    }
                    ,
                    t.prototype.resurrectionGame = function (e) {
                        void 0 === e && (e = 1),
                            this.passNode.active = !1,
                            this.threeGetNode.active = !1,
                            this.playNode.active = !0,
                            this.gameResuriNode.active = !1,
                            r.default.shareKnife.initTouchEvent(),
                            s.default.shareGameData.curResurrectionCount += e,
                            this.showTip(4, !0)
                    }
                    ,
                    t.prototype.showGameOverUI = function () {
                        s.default.shareGameData.curGetMoney = 0,
                            this.threeGetNode.active = !1,
                            this.playNode.active = !1,
                            this.gameResuriNode.active = !1,
                            this.passNode.active = !0,
                            this.scoreNode.active = !1,
                            this.node.getParent().getChildByName("friutStore").active = !1,
                            this.passNode.getComponent("passNode").showDefalUI()
                    }
                    ,
                    t.prototype.isGameEnd = function () {
                        var e = this;
                        0 == s.default.shareGameData.isFuritPartyMode ? 1 == r.default.shareKnife.isCutEmpty && (i.default.suondMgrShader.playEffectSound(i.soundType.gameOverBgm),
                            r.default.shareKnife.offTouchEvent(),
                            this.node.getParent().getChildByName("failure").active = !0,
                            this.node.getParent().getChildByName("failure").getChildByName("pic_texiao_7").y = 103,
                            this.node.getParent().getChildByName("failure").getChildByName("pic_texiao_7").opacity = 255,
                            this.node.getParent().getChildByName("failure").getChildByName("pic_texiao_7").runAction(cc.spawn(cc.moveBy(1, cc.v2(0, 100)), cc.sequence(cc.delayTime(.4), cc.fadeOut(.6), cc.callFunc(function () {
                                e.node.getParent().getChildByName("failure").active = !1,
                                    s.default.shareGameData.curResurrectionCount < 1 && 1 == s.default.shareGameData.isOpenSwich ? e.showResurrectionUI() : e.showGameOverUI()
                            }))))) : 1 == r.default.shareKnife.isCutEmpty && (s.default.shareGameData.partyHealthy -= 1,
                                this.partNode.getComponent("partNode").isStartShoot = !1,
                                this.node.getParent().getChildByName("failure").active = !0,
                                this.node.getParent().getChildByName("failure").getChildByName("pic_texiao_7").y = 103,
                                this.node.getParent().getChildByName("failure").getChildByName("pic_texiao_7").opacity = 255,
                                this.node.getParent().getChildByName("failure").getChildByName("pic_texiao_7").runAction(cc.spawn(cc.moveBy(1, cc.v2(0, 100)), cc.sequence(cc.delayTime(.4), cc.fadeOut(.6), cc.callFunc(function () {
                                    e.node.getParent().getChildByName("failure").active = !1,
                                        s.default.shareGameData.partyHealthy < 0 && (s.default.shareGameData.partyHealthy = 0),
                                        e.partNode.getComponent("partNode").isStartShoot = !0,
                                        e.partNode.getComponent("partNode").updataHealthy()
                                })))))
                    }
                    ,
                    t.prototype.updataMissionMoney = function () {
                        0 == s.default.shareGameData.isFuritPartyMode ? this.scoreNode.getChildByName("moneyNode").getChildByName("moneyLabel").getComponent(cc.Label).string = s.default.shareGameData.curGetMoney.toString() : this.partNode.getChildByName("scoreNode").getChildByName("moneyNode").getChildByName("moneyLabel").getComponent(cc.Label).string = s.default.shareGameData.partyMoney.toString()
                    }
                    ,
                    t.prototype.updataMissionProbar = function (e) {
                        void 0 === e && (e = !0),
                            console.log("updataMissionProbar", s.default.shareGameData.missionCurProgress, s.default.shareGameData.missionTotalProgress),
                            this.scoreNode.getChildByName("ProgressBar").getComponent(cc.ProgressBar).progress = s.default.shareGameData.missionCurProgress / s.default.shareGameData.missionTotalProgress,
                            this.scoreNode.getChildByName("misionLabel").getComponent(cc.Label).string = "Left:" + (100 * (1 - s.default.shareGameData.missionCurProgress / s.default.shareGameData.missionTotalProgress)).toFixed(0) + "%"
                    }
                    ,
                    t.prototype.showTip = function (e, t) {
                        this.tipNode.y = 0,
                            this.tipNode.getComponent("tipNode").showTip(e, t)
                    }
                    ,
                    t.prototype.selectSkin = function () {
                        r.default.shareKnife.setKindfSkin(Math.ceil(56 * Math.random()))
                    }
                    ,
                    t.prototype.useSuperThreeBtnCB = function () {
                        s.default.shareGameData.isSuperThree = !0,
                            r.default.shareKnife.openThreeKinfe(!0),
                            r.default.shareKnife.initKinfePos(),
                            this.specialBtn.active = !1
                    }
                    ,
                    t.prototype.showSurprisedNode = function () {
                        console.log("--\u597d\u5200\u6cd5\u5956\u52b1--------");
                        var e = cc.instantiate(this.surprisedNode);
                        this.node.getParent().addChild(e),
                            e.getComponent("surprisedNode").showUI(666, 1, !0),
                            e.getComponent("surprisedNode").setCallBack(function () {
                                c.default.OpenAdVides(function () {
                                    s.default.shareGameData.gold += 666;
                                    var e = {
                                        gold: s.default.shareGameData.gold
                                    };
                                    c.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                        user_id: c.default.OpenId,
                                        data_info: JSON.stringify(e)
                                    }, function (e, t) {
                                        console.log("\u83b7\u5f97Surprise--", 666)
                                    })
                                })
                            })
                    }
                    ,
                    t.prototype.storeCB = function () {
                        var e = this;
                        c.default.wondersdk.statevent("\u6e38\u620f\u4e2d-\u5546\u5e97\u6309\u94ae"),
                            i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            this.storeNode.active = !0,
                            c.default.HideAuthorizeBtn(!1),
                            this.storeNode.getChildByName("itemListNode").getComponent("store").setCloseCB(function () {
                                r.default.shareKnife.setKindfSkin(s.default.shareGameData.curSkinID),
                                    c.default.HideAuthorizeBtn(!0)
                            }),
                            this.storeNode.getChildByName("itemListNode").getComponent("store").setGoGamefc(function (t) {
                                1009 == t || 1010 == t ? (s.default.shareGameData.isGoDayWeapon = !0,
                                    cc.director.loadScene("start")) : e.storeNode.active = !1
                            }),
                            this.storeNode.getChildByName("itemListNode").getComponent("store").init()
                    }
                    ,
                    t.prototype.setingCB = function () {
                        this.playNode.getChildByName("setingNode").active = !0
                    }
                    ,
                    t.prototype.showConbom = function (e) {
                        void 0 === e && (e = !1),
                            0 == e ? s.default.shareGameData.conbom >= 2 && 0 == s.default.shareGameData.isPerfectConbom && this.conbomNode.getComponent("conbomNode").showConbomUI(s.default.shareGameData.conbom) : (s.default.shareGameData.isPerfectConbom = !0,
                                this.conbomNode.getComponent("conbomNode").showConbomUI(1))
                    }
                    ,
                    t.prototype.showBuyTip = function () {
                        for (var e = !1, t = 0; t < 4 && 1 != (e = s.default.shareGameData.isShowBuySkinTip(t + 1)); t++)
                            ;
                        console.log("\u662f\u5426\u663e\u793a", e),
                            this.playNode.getChildByName("storeBtn").getChildByName("redPoint").active = e
                    }
                    ,
                    t.prototype.showHelp = function (e) {
                        this.playNode.getChildByName("helpNode").active = e
                    }
                    ,
                    t.prototype.rankBtn = function () {
                        c.default.CloseAd(),
                            this.node.getParent().getChildByName("rankNode").active = !0,
                            c.default.HideAuthorizeBtn(!1),
                            this.node.getParent().getChildByName("rankNode").getComponent("rankNode").setCallBack(function () {
                                c.default.HideAuthorizeBtn(!0),
                                    c.default.OpenAd("", 0, -1)
                            })
                    }
                    ,
                    t.prototype.getEfc1 = function () {
                        return o.shareGameScene.ef1pool.size() > 0 ? o.shareGameScene.ef1pool.get() : cc.instantiate(this.efc1Prefab)
                    }
                    ,
                    t.prototype.recyclingef1 = function (e) {
                        e && o.shareGameScene.ef1pool.put(e),
                            console.log("\u7279\u6548\u7f13\u5b58size---", o.shareGameScene.ef1pool.size())
                    }
                    ,
                    t.prototype.getBossPrefab = function () {
                        return o.shareGameScene.bossPool.size() > 0 ? o.shareGameScene.bossPool.get() : cc.instantiate(this.bossPrefab)
                    }
                    ,
                    t.prototype.recycliBossPreafab = function (e) {
                        e && o.shareGameScene.bossPool.put(e),
                            console.log("boss\u7f13\u5b58size---", o.shareGameScene.bossPool.size())
                    }
                    ,
                    t.prototype.showBaoheUI = function () {
                        console.log("\u5b9d\u76d2\u62bd\u5956"),
                            this.FoodArryNode.getComponent("foodArry").resetBaohe(),
                            this.baoheNode.active = !0,
                            this.baoheNode.getComponent("baohe").setRewardCB(function () {
                                s.default.shareGameData.isThree = !0,
                                    s.default.shareGameData.curThreeCount = 5,
                                    r.default.shareKnife.clreaKinef(),
                                    r.default.shareKnife.resetKinfe(),
                                    r.default.shareKnife.initCountTip()
                            })
                    }
                    ,
                    t.prototype.addmoneyFly = function (e, t, a, i) {
                        var n = this;
                        void 0 === t && (t = 1),
                            void 0 === a && (a = null),
                            void 0 === i && (i = null);
                        var s = null;
                        (s = o.shareGameScene.moneyPool.size() > 0 ? o.shareGameScene.moneyPool.get() : cc.instantiate(this.moneyItem)).active = !0,
                            s.position = e,
                            s.scale = 1,
                            s.zIndex = 1;
                        var r = null
                            , c = null;
                        null == a ? 1 == t ? (r = this.scoreNode.getChildByName("moneyNode").getChildByName("icon_jinbi_01").convertToWorldSpaceAR(cc.v2(0, 0)),
                            r = cc.v2(r.x - .5 * cc.winSize.width, r.y - .5 * cc.winSize.height),
                            this.scoreNode.getParent().addChild(s),
                            c = this.scoreNode.getChildByName("moneyNode").getChildByName("icon_jinbi_01")) : (r = this.partNode.getChildByName("scoreNode").getChildByName("moneyNode").getChildByName("icon_jinbi_01").convertToWorldSpaceAR(cc.v2(0, 0)),
                                r = cc.v2(r.x - .5 * cc.winSize.width, r.y - .5 * cc.winSize.height),
                                this.partNode.getParent().addChild(s),
                                c = this.partNode.getChildByName("scoreNode").getChildByName("moneyNode").getChildByName("icon_jinbi_01")) : (r = a.convertToWorldSpaceAR(cc.v2(0, 0)),
                                    r = cc.v2(r.x - .5 * cc.winSize.width, r.y - .5 * cc.winSize.height),
                                    c = a,
                                    i.addChild(s)),
                            console.log("\u91d1\u5e01\u98de", e, r);
                        var d = [cc.v2(e.x, e.y), cc.v2(e.x + 150 - 300 * Math.random(), e.y + 100), r]
                            , l = cc.bezierTo(.7, d);
                        s.stopAllActions(),
                            s.runAction(cc.scaleTo(.7, .5)),
                            s.runAction(cc.sequence(l, cc.callFunc(function () {
                                o.shareGameScene.updataMissionMoney(),
                                    s.removeFromParent(),
                                    n.recycliMoneyPreafab(s),
                                    null == c.getActionByTag(101) && c.runAction(cc.sequence(cc.scaleTo(.1, 1.5), cc.scaleTo(.3, 1.1)))
                            })))
                    }
                    ,
                    t.prototype.recycliMoneyPreafab = function (e) {
                        e && o.shareGameScene.moneyPool.put(e),
                            console.log("moneyPools\u7f13\u5b58size---", o.shareGameScene.moneyPool.size())
                    }
                    ,
                    t.prototype.RecorderCB = function (e, t) {
                        1 == t ? (console.log("\u5f00\u59cb\u5f55\u5c4f"),
                            this.playNode.getChildByName("RecorderNode").children[0].active = !1,
                            this.playNode.getChildByName("RecorderNode").children[1].active = !0,
                            this.playNode.getChildByName("RecorderNode").children[1].getChildByName("cLabel").getComponent(cc.Label).string = "00:00",
                            c.default.gameRecordMng.start({
                                duration: 15
                            })) : 2 == t && (console.log("\u4e3b\u52a8\u7ed3\u675f"),
                                this.playNode.getChildByName("RecorderNode").children[0].active = !0,
                                this.playNode.getChildByName("RecorderNode").children[1].active = !1,
                                c.default.gameRecordMng.stop())
                    }
                    ,
                    t.prototype.recordInit = function () {
                        var e = this;
                        this.playNode.getChildByName("RecorderNode").children[0].active = !0,
                            this.playNode.getChildByName("RecorderNode").children[1].active = !1,
                            s.default.shareGameData.recordtime = 0,
                            s.default.shareGameData.recordvideoPath = null,
                            c.default.gameRecordMng = tt.getGameRecorderManager(),
                            c.default.gameRecordMng.onStart(function (t) {
                                s.default.shareGameData.recordtime = (new Date).getTime() / 1e3,
                                    e.updataRecordTime(!0)
                            }),
                            c.default.gameRecordMng.onStop(function (t) {
                                if (console.log("\u7ed3\u675f\u5f55\u5c4f", t),
                                    e.playNode.getChildByName("RecorderNode").children[0].active = !0,
                                    e.playNode.getChildByName("RecorderNode").children[1].active = !1,
                                    s.default.shareGameData.recordvideoPath = t.videoPath,
                                    e.curRecordTime = 0,
                                    e.updataRecordTime(!1),
                                    s.default.shareGameData.recordtime) {
                                    if (s.default.shareGameData.recordtime = (new Date).getTime() / 1e3 - s.default.shareGameData.recordtime,
                                        s.default.shareGameData.recordtime < 3)
                                        return void s.default.shareGameData.showTip(19, 2);
                                    e.stopRecordCallBack && (e.stopRecordCallBack(),
                                        e.stopRecordCallBack = null)
                                }
                            })
                    }
                    ,
                    t.prototype.updataRecordTime = function (e) {
                        1 == e ? (this.curRecordTime = 0,
                            this.schedule(this.updataTime, 1)) : this.unschedule(this.updataTime)
                    }
                    ,
                    t.prototype.updataTime = function () {
                        this.curRecordTime += 1;
                        var e = "0" + this.curRecordTime.toString();
                        this.curRecordTime > 9 && (e = this.curRecordTime.toString()),
                            this.playNode.getChildByName("RecorderNode").children[1].getChildByName("cLabel").getComponent(cc.Label).string = "00:" + e,
                            console.log("updataRecordTime", this.curRecordTime)
                    }
                    ,
                    t.prototype.shareRecord = function (e) {
                        void 0 === e && (e = null),
                            console.log("\u5f55\u5c4f\u5206\u4eab--", s.default.shareGameData.recordvideoPath),
                            tt.shareVideo({
                                videoPath: s.default.shareGameData.recordvideoPath,
                                title: "\u5207\u6c34\u679c\u8d3c6",
                                success: function () {
                                    console.log("suc"),
                                        e && (e(),
                                            e = null)
                                },
                                fail: function (e) {
                                    console.log("fail", e),
                                        s.default.shareGameData.showTip(20, 2)
                                }
                            })
                    }
                    ,
                    __decorate([u(cc.Node)], t.prototype, "baoheNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "bossNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "partNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "conbomNode", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "surprisedNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "weaponBtnNode", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "sanPrefab", void 0),
                    __decorate([u(cc.Node)], t.prototype, "tipNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "storeNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "scoreNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "gameResuriNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "threeGetNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "luckyNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "playNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "passNode", void 0),
                    __decorate([u(cc.SpriteAtlas)], t.prototype, "allKnifeTexturePlist", void 0),
                    __decorate([u(cc.SpriteAtlas)], t.prototype, "efcTexturePlist", void 0),
                    __decorate([u(cc.SpriteAtlas)], t.prototype, "allFoodTexturePlist", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "bossPrefab", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "cutFoodItem", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "efc1Prefab", void 0),
                    __decorate([u(cc.Node)], t.prototype, "Fooddish", void 0),
                    __decorate([u(cc.Node)], t.prototype, "FoodArryNode", void 0),
                    __decorate([u(cc.Node)], t.prototype, "specialBtn", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "foodItem", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "moneyItem", void 0),
                    __decorate([u(Number)], t.prototype, "FoodArryid", void 0),
                    __decorate([u(Number)], t.prototype, "actid", void 0),
                    t = o = __decorate([l], t)
            } (cc.Component);
        o.default = h,
            cc._RF.pop()
    }
        , {
        "./event": "event",
        "./gameConfig": "gameConfig",
        "./gameData": "gameData",
        "./knife": "knife",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    huaFeiNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "996dbQF0zRMrpd83ouWwB5H", "huaFeiNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = cc._decorator
            , n = i.ccclass
            , s = i.property
            , r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.label = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.onEnable = function () {
                        this.label.string = a.default.shareGameData.all_phoneMoney.toFixed(2).toString()
                    }
                    ,
                    t.prototype.closeBtn = function () {
                        this.node.active = !1
                    }
                    ,
                    t.prototype.duihuanBtn = function () {
                        a.default.shareGameData.showTip(13, 2)
                    }
                    ,
                    __decorate([s(cc.Label)], t.prototype, "label", void 0),
                    t = __decorate([n], t)
            } (cc.Component);
        o.default = r,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData"
    }],
    interceptor: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "c140514PptMCpNID3WUrwSJ", "interceptor");
        t.exports = {
            waitUserInfoInterceptor: function (e) {
                return function () {
                    var t = arguments
                        , o = new Promise(function (e, t) {
                            var o = wx.getStorageSync("user_info");
                            if (o)
                                e();
                            else
                                var a = 0
                                    , i = setInterval(function () {
                                        console.log(a),
                                            (o = wx.getStorageSync("user_info")) ? (e(),
                                                clearInterval(i)) : ++a > 10 && (clearInterval(i),
                                                    t("\u83b7\u53d6ouserInfo\u5931\u8d25"))
                                    }, 500)
                        }
                        );
                    return new Promise(function (a, i) {
                        o.then(function (o) {
                            (function (e, t) {
                                for (var o = new Array, a = 0; a < t.length; a++)
                                    o.push(t[a]);
                                return e.apply(null, o)
                            }
                            )(e, t).then(function (e) {
                                a(e)
                            }, function (e) {
                                i(e)
                            })
                        }, function (e) {
                            i(e)
                        })
                    }
                    )
                }
            }
        },
            cc._RF.pop()
    }
        , {}],
    isBuy: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "91863MoBdVITaZhmlTkr69i", "isBuy"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("../gameConfig")
            , i = e("../soundMrg")
            , n = cc._decorator
            , s = n.ccclass
            , r = n.property
            , c = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.priceLb = null,
                        t.price = 0,
                        t.ItemID = 0,
                        t.headNode = null,
                        t.notEnoughNode = null,
                        t.onBuyCb = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initUI = function (e, t) {
                        for (var o, i = 0; i < a.default.storeConfig_.json.length; i++) {
                            var n = a.default.storeConfig_.json[i];
                            if (e == a.default.storeConfig_.json[i].ID) {
                                o = n;
                                break
                            }
                        }
                        var s = o.price;
                        this.price = s,
                            null != s && null != e || console.log("\u4ef7\u683c=null"),
                            this.ItemID = e,
                            this.priceLb.getComponent(cc.Label).string = s.toString(),
                            this.headNode.getComponent(cc.Sprite).spriteFrame = t
                    }
                    ,
                    t.prototype.buy = function () { }
                    ,
                    t.prototype.setBuyCB = function (e) {
                        this.onBuyCb = e
                    }
                    ,
                    t.prototype.closeCB = function () {
                        i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            this.node.active = !1
                    }
                    ,
                    t.prototype.closeNotEnoughMoneyCB = function () {
                        i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            this.notEnoughNode.active = !1
                    }
                    ,
                    __decorate([r(cc.Node)], t.prototype, "priceLb", void 0),
                    __decorate([r(cc.Node)], t.prototype, "headNode", void 0),
                    __decorate([r(cc.Node)], t.prototype, "notEnoughNode", void 0),
                    t = __decorate([s], t)
            } (cc.Component);
        o.default = c,
            cc._RF.pop()
    }
        , {
        "../gameConfig": "gameConfig",
        "../soundMrg": "soundMrg"
    }],
    knife: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "41bb0s5BMpGwYa0FaSzlsa1", "knife"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameScene")
            , i = e("./gameData")
            , n = e("./soundMrg")
            , s = cc._decorator
            , r = s.ccclass
            , c = s.property
            , d = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.kinfePrefab = null,
                        t.isFlyEnd = !0,
                        t.isCutEmpty = !1,
                        t.kinfeData = [],
                        t.knifeNode = [],
                        t.curCountTipLable = null,
                        t.foodPool = null,
                        t
                }
                var o;
                return __extends(t, e),
                    o = t,
                    t.prototype.onLoad = function () {
                        o.shareKnife = this,
                            this.foodPool = new cc.NodePool;
                        for (var e = 0; e < 0; e++) {
                            var t = cc.instantiate(this.kinfePrefab);
                            this.foodPool.put(t)
                        }
                        for (e = 0; e < 3; e++) {
                            var a = void 0;
                            0 == e ? a = {
                                r: 0,
                                orgPos: cc.v2(0, -320 - (cc.winSize.height - 1136) / 2),
                                endPos: cc.v2(0, .5 * cc.winSize.height + 100)
                            } : 1 == e ? a = {
                                r: -15,
                                orgPos: cc.v2(-31, -320 - (cc.winSize.height - 1136) / 2),
                                endPos: cc.v2(.5 * -cc.winSize.width, .5 * cc.winSize.height + 100)
                            } : 2 == e && (a = {
                                r: 15,
                                orgPos: cc.v2(31, -320 - (cc.winSize.height - 1136) / 2),
                                endPos: cc.v2(.5 * cc.winSize.width, .5 * cc.winSize.height + 100)
                            }),
                                this.kinfeData.push(a)
                        }
                        this.clreaKinef(),
                            this.resetKinfe()
                    }
                    ,
                    t.prototype.resetKinfe = function () {
                        for (var e = 0; e < 3; e++)
                            this.createKinfeItem(e);
                        this.initKinfePos(),
                            this.openThreeKinfe(i.default.shareGameData.isThree),
                            this.doDownUp()
                    }
                    ,
                    t.prototype.initTouchEvent = function () {
                        this.node.getParent().on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this)
                    }
                    ,
                    t.prototype.offTouchEvent = function () {
                        this.node.getParent().off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this)
                    }
                    ,
                    t.prototype.onTouchEnded = function () {
                        1 == this.isFlyEnd && 0 == a.default.shareGameScene.FooddishState && (1 == i.default.shareGameData.isFuritPartyMode ? 1 == a.default.shareGameScene.partNode.getComponent("partNode").isStartShoot && this.Flyknife() : this.Flyknife())
                    }
                    ,
                    t.prototype.start = function () {
                        this.openThreeKinfe(i.default.shareGameData.isThree),
                            this.initTouchEvent(),
                            this.doDownUp(),
                            this.initCountTip(),
                            this.setKindfSkin(i.default.shareGameData.curSkinID),
                            2 == i.default.shareGameData.gameModel && a.default.shareGameScene.useSuperThreeBtnCB()
                    }
                    ,
                    t.prototype.initCountTip = function () {
                        console.log("\u5206\u8eab\u6b21\u6570", i.default.shareGameData.curThreeCount),
                            i.default.shareGameData.curThreeCount > 0 ? (this.curCountTipLable.getParent().active = !0,
                                this.curCountTipLable.getComponent(cc.Label).string = "x" + i.default.shareGameData.curThreeCount) : (this.curCountTipLable.getParent().active = !1,
                                    this.curCountTipLable.getComponent(cc.Label).string = "")
                    }
                    ,
                    t.prototype.addKinfe = function () {
                        var e = null;
                        (e = this.foodPool.size() > 0 ? this.foodPool.get() : cc.instantiate(this.kinfePrefab)).rotation = 0,
                            e.active = !0,
                            e.opacity = 255;
                        var t = a.default.shareGameScene.allKnifeTexturePlist.getSpriteFrame("a" + i.default.shareGameData.curSkinID);
                        return e.getComponent(cc.Sprite).spriteFrame = t,
                            e.getComponent(cc.BoxCollider).size.height = e.height - 30,
                            this.node.addChild(e, -1),
                            e
                    }
                    ,
                    t.prototype.recyclingKinfe = function (e) {
                        e && (e.active = !1)
                    }
                    ,
                    t.prototype.createKinfeItem = function (e) {
                        void 0 === e && (e = 0);
                        var t = this.addKinfe();
                        t.getComponent(cc.BoxCollider).tag = e,
                            this.knifeNode[e] = t
                    }
                    ,
                    t.prototype.clreaKinef = function () {
                        this.knifeNode.forEach(function (e) {
                            e.stopAllActions(),
                                e.removeFromParent()
                        }),
                            this.knifeNode = [],
                            console.log("\u91cd\u8bbe\u72b6\u6001--", this.isFlyEnd),
                            this.isFlyEnd = !0
                    }
                    ,
                    t.prototype.initKinfePos = function () {
                        console.log("\u521d\u59cb\u5316\u6b66\u5668\u4f4d\u7f6e", this.knifeNode.length);
                        for (var e = 0; e < this.knifeNode.length; e++) {
                            var t = this.knifeNode[e];
                            t.rotation = this.kinfeData[e].r,
                                t.position = this.kinfeData[e].orgPos
                        }
                    }
                    ,
                    t.prototype.openThreeKinfe = function (e) {
                        console.log("openThreeKinfe", e),
                            i.default.shareGameData.isThree = e,
                            this.knifeNode[1].active = e,
                            this.knifeNode[2].active = e
                    }
                    ,
                    t.prototype.useOnceThreeKinfe = function () {
                        1 != i.default.shareGameData.isSuperThree && 2 != i.default.shareGameData.gameModel && 1 != i.default.shareGameData.isExprece3Mision && i.default.shareGameData.curThreeCount > 0 && (i.default.shareGameData.curThreeCount -= 1,
                            o.shareKnife.initCountTip(),
                            0 == i.default.shareGameData.curThreeCount && (a.default.shareGameScene.showTip(1, !0),
                                this.openThreeKinfe(!1)))
                    }
                    ,
                    t.prototype.uesOnceExperienceWeaponCount = function () {
                        i.default.shareGameData.curExperienceSkinID > 0 && i.default.shareGameData.curExperienceUseCount > 0 && (i.default.shareGameData.curExperienceUseCount -= 1,
                            console.log("\u65b0\u6b66\u5668\u4f53\u9a8c\u6b21\u6570", i.default.shareGameData.curExperienceUseCount),
                            0 == i.default.shareGameData.curExperienceUseCount && (a.default.shareGameScene.showTip(3, !0),
                                i.default.shareGameData.curExperienceSkinID = null,
                                this.setKindfSkin(i.default.shareGameData.curSkinID)))
                    }
                    ,
                    t.prototype.setKindfSkin = function (e) {
                        for (var t = a.default.shareGameScene.allKnifeTexturePlist.getSpriteFrame("a" + e), o = 0; o < this.knifeNode.length; o++) {
                            var i = this.knifeNode[o];
                            i.getComponent(cc.Sprite).spriteFrame = t,
                                i.getComponent(cc.BoxCollider).size.height = i.height - 30
                        }
                    }
                    ,
                    t.prototype.doDownUp = function () {
                        this.node.stopAllActions(),
                            this.node.runAction(cc.repeatForever(cc.sequence(cc.moveTo(.6, cc.v2(0, 30)), cc.moveTo(.6, cc.v2(0, 0))).easing(cc.easeInOut(2))))
                    }
                    ,
                    t.prototype.Flyknife = function () {
                        var e = this;
                        n.default.suondMgrShader.playEffectSound(n.soundType.kinfeFly),
                            this.isFlyEnd = !1,
                            this.isCutEmpty = !0,
                            this.node.stopAllActions(),
                            i.default.curCutCount += 1;
                        for (var t = function (t) {
                            var n = o.knifeNode[t];
                            n.stopAllActions(),
                                n.runAction(cc.sequence(cc.moveTo(.4, cc.v2(o.kinfeData[t].endPos)), cc.callFunc(function () {
                                    n.stopActionByTag(1),
                                        console.log("\u521d\u59cb\u4f4d\u7f6e", e.kinfeData[t]),
                                        n.rotation = e.kinfeData[t].r,
                                        n.position = e.kinfeData[t].orgPos,
                                        0 == t && (e.doDownUp(),
                                            e.useOnceThreeKinfe(),
                                            e.isFlyEnd = !0,
                                            a.default.shareGameScene.showConbom(),
                                            i.default.shareGameData.resetConbom(),
                                            a.default.shareGameScene.isGameEnd())
                                })));
                            var s = cc.repeatForever(cc.rotateBy(.05, 360));
                            s.setTag(1),
                                n.stopActionByTag(1),
                                n.runAction(s)
                        }, o = this, s = 0; s < this.knifeNode.length; s++)
                            t(s)
                    }
                    ,
                    __decorate([c(cc.Prefab)], t.prototype, "kinfePrefab", void 0),
                    __decorate([c(cc.Node)], t.prototype, "curCountTipLable", void 0),
                    t = o = __decorate([r], t)
            } (cc.Component);
        o.default = d,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./soundMrg": "soundMrg"
    }],
    leftGame: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "eafa660lVpEeYQvXMBvsg80", "leftGame"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("../weChatApi/WXApi")
            , i = e("../soundMrg")
            , n = cc._decorator
            , s = n.ccclass
            , r = n.property
            , c = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.btn_spf = [],
                        t.headprefab = null,
                        t.left_parentNode = null,
                        t.showIndex = 0,
                        t.all = 0,
                        t.ishow = !1,
                        t
                }
                return __extends(t, e),
                    t.prototype.onLoad = function () {
                        this.node.x = .5 * -cc.winSize.width
                    }
                    ,
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initLeft = function (e) {
                        console.log("WXApi. gameList", a.default.gameList);
                        var t = 0;
                        this.left_parentNode.removeAllChildren();
                        for (var o = 0; o < e.length; o++) {
                            var i = e[o];
                            if ("sdk_suspend_ads" == i.flag) {
                                var n = cc.instantiate(this.headprefab);
                                n.getComponent("gameHead").init(i),
                                    this.left_parentNode.addChild(n),
                                    n.position = cc.v2(t % 3 * 115 - 310, 200 - 150 * Math.floor(t / 3)),
                                    t += 1
                            }
                        }
                        this.node.active = 0 != t
                    }
                    ,
                    t.prototype.showbtnAct = function (e) {
                        this.node.getChildByName("showButton").stopAllActions(),
                            1 == e ? (this.node.getChildByName("showButton").rotation,
                                this.node.getChildByName("showButton").runAction(cc.repeatForever(cc.sequence(cc.rotateBy(.1, -15), cc.rotateBy(.2, 30), cc.rotateBy(.2, -30), cc.rotateBy(.1, 15), cc.delayTime(2.5))))) : this.node.getChildByName("showButton").rotation = 0
                    }
                    ,
                    t.prototype.touchShow = function () {
                        var e = this;
                        i.default.suondMgrShader.playEffectSound(i.soundType.Btn);
                        var t = this.node;
                        0 == this.ishow ? (this.showbtnAct(!1),
                            this.ishow = !0,
                            t.getChildByName("showButton").getComponent(cc.Sprite).spriteFrame = this.btn_spf[0],
                            t.stopAllActions(),
                            t.runAction(cc.moveTo(.3, cc.v2(.5 * -cc.winSize.width + t.width, 0)))) : (this.ishow = !1,
                                t.getChildByName("showButton").getComponent(cc.Sprite).spriteFrame = this.btn_spf[1],
                                t.stopAllActions(),
                                t.runAction(cc.sequence(cc.moveTo(.3, cc.v2(.5 * -cc.winSize.width, 0)), cc.callFunc(function () {
                                    e.showbtnAct(!0)
                                }))))
                    }
                    ,
                    __decorate([r(cc.SpriteFrame)], t.prototype, "btn_spf", void 0),
                    __decorate([r(cc.Prefab)], t.prototype, "headprefab", void 0),
                    __decorate([r(cc.Node)], t.prototype, "left_parentNode", void 0),
                    t = __decorate([s], t)
            } (cc.Component);
        o.default = c,
            cc._RF.pop()
    }
        , {
        "../soundMrg": "soundMrg",
        "../weChatApi/WXApi": "WXApi"
    }],
    loading: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "48e13AiZrJLOYRVkrf24isp", "loading"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = e("./weChatApi/WXApi")
            , n = e("WonderJsSdk");
        i.default.wondersdk = new n(4, i.default.appName, !1);
        var s = cc._decorator
            , r = s.ccclass
            , c = s.property
            , d = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.probar = null,
                        t.targt = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () {
                        var e = this;
                        console.log(" cc.director.getCollisionManager()111", cc.director.getCollisionManager()),
                            console.log(" cc.director.getCollisionManager()3333", cc.director.getActionManager()),
                            console.log(" cc.director.getCollisionManager()4444", cc.director.getPhysicsManager()),
                            console.log(" cc.director.getCollisionManager()222", cc.director.getCollisionManager),
                            cc.director.getCollisionManager().enabled = !0;
                        e.probar.getChildByName("pic_chengzi").runAction(cc.repeatForever(cc.rotateBy(1, 360))),
                            cc.director.preloadScene("start", function (t, o, a) {
                                var i = t / o * .5 > .1 ? t / o * .5 : .1;
                                e.probar.getComponent(cc.ProgressBar).progress = i,
                                    e.updataVapue(i)
                            }, function () {
                                i.default.wondersdk.statevent("\u52a0\u8f7d\u9875\u9762"),
                                    cc.director.preloadScene("gameScene", function (t, o, a) {
                                        var i = .5 + t / o * .45;
                                        e.probar.getComponent(cc.ProgressBar).progress = i,
                                            e.updataVapue(i)
                                    }, function () {
                                        1 == i.default.isBaiDu ? (console.log("\u52a0\u8f7d\u5f00\u59cb", cc.sys.os),
                                            e.login()) : cc.director.loadScene("start"),
                                            i.default.bmsHttpPost("/common/config/info", {
                                                app_name: i.default.appName,
                                                version: "1.1.4"
                                            }, function (e, t) {
                                                console.log("\u83b7\u53d6\u540e\u53f0\u5f00\u5173", t),
                                                    i.default.is_aotuShareRecod = t.is_aotuShareRecod,
                                                    i.default.is_aotuRecod = t.is_aotuRecod,
                                                    i.default.is_banner = t.is_banner,
                                                    i.default.isOpenOncMoreShot = t.isOpenOncMoreShot,
                                                    i.default.isOpenShareRewar = t.isOpenShareRewar,
                                                    i.default.isShowViewIcon = t.isShowViewIcon,
                                                    a.default.shareGameData.Up_down = t.Up_down,
                                                    0 == t.area_openSitch ? i.default.bmsHttpPost("/common/ip/is_enable", {
                                                        app_name: i.default.appName,
                                                        version: "1.1.4"
                                                    }, function (e, t) {
                                                        console.log("\u533a\u57df\u5c4f\u853d-----", t),
                                                            0 == t.is_enable ? i.default.area_openSitch = 1 : i.default.area_openSitch = 0
                                                    }) : i.default.area_openSitch = 1
                                            })
                                    })
                            })
                    }
                    ,
                    t.prototype.updataVapue = function (e) {
                        this.node.getChildByName("barLabel").getComponent(cc.Label).string = "Loading... " + Math.floor(100 * e) + "%",
                            this.targt.x = .5 * -this.node.getChildByName("ProgressBar").width + e * this.node.getChildByName("ProgressBar").width
                    }
                    ,
                    t.prototype.login = function () {
                        var e = this;
                        console.log("\u767b\u9646---"),
                            i.default.Url = "https://api.zuiqiangyingyu.net",
                            i.default.Code2TokeUrl = "/index.php/api/shui_guo_da_shi/TT_game_auth",
                            i.default.UserKVUrl = "/api/wmkx/userStorage",
                            i.default.Perfix = "wmkx",
                            i.default.Login(function (t, o) {
                                console.log("\u767b\u5f55---------", t, o),
                                    e.updataVapue(1),
                                    e.scheduleOnce(function () {
                                        cc.director.loadScene("start")
                                    }, .5),
                                    e.probar.getComponent(cc.ProgressBar).progress = 1
                            }),
                            a.default.shareGameData.isOpenSwich = !0,
                            console.log("WXApi.OpenId", i.default.OpenId)
                    }
                    ,
                    __decorate([c(cc.Node)], t.prototype, "probar", void 0),
                    __decorate([c(cc.Node)], t.prototype, "targt", void 0),
                    t = __decorate([r], t)
            } (cc.Component);
        o.default = d,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./weChatApi/WXApi": "WXApi",
        WonderJsSdk: "WonderJsSdk"
    }],
    luckShoot: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "160c5TxIT5JOZNaCW7atVI/", "luckShoot"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = (a.property,
                function (e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.onCollisionEnter = function (e, t) {
                            if (console.log("\u62bd\u5956\u8bbe\u8ba1", t.tag, e.node),
                                "food" == t.node.group && "kinfd" == e.node.group) {
                                var o = new cc.Event.EventCustom("shoot", !0);
                                o.setUserData({
                                    id: t.tag
                                }),
                                    this.node.dispatchEvent(o),
                                    this.node.getParent().getComponent("luckyRotary").shootevent(t.tag)
                            }
                        }
                        ,
                        t = __decorate([i], t)
                } (cc.Component));
        o.default = n,
            cc._RF.pop()
    }
        , {}],
    luckyRotary: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "834c4JnOtFBLKOzRx9ximxt", "luckyRotary"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./gameData")
            , n = e("./gameScene")
            , s = e("./knife")
            , r = e("./soundMrg")
            , c = e("./event")
            , d = cc._decorator
            , l = d.ccclass
            , u = d.property
            , h = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.closeFCB = null,
                        t.allKnifeTexturePlist = null,
                        t.moneyPrefab = null,
                        t.luckBox = null,
                        t.knife = null,
                        t.n1 = null,
                        t.n2 = null,
                        t.p1 = null,
                        t.p2 = null,
                        t.luckyCount = 0,
                        t.maxCount = 0,
                        t.luckyID = 0,
                        t.prizeID = 0,
                        t.isSpin = !1,
                        t.curShowType = 1,
                        t.shareState = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.onLoad = function () {
                        this.shareState[0] = !1,
                            this.shareState[1] = !1,
                            this.knife.y = -256,
                            this.node.on(cc.Node.EventType.TOUCH_START, this.flyKinef, this)
                    }
                    ,
                    t.prototype.shootevent = function (e) {
                        this.knife.stopAllActions(),
                            this.node.getChildByName("bg").stopAllActions(),
                            console.log("\u4e2d\u5956ID", e),
                            this.winningCB(e)
                    }
                    ,
                    t.prototype.flyKinef = function () {
                        if (1 == this.isSpin && null == this.knife.getActionByTag(102)) {
                            console.log("----\u5c04\u51fb"),
                                c.default.addEventPos(c.eventID.luckySpinOnce),
                                r.default.suondMgrShader.playEffectSound(r.soundType.Btn),
                                this.knife.stopAllActions();
                            var e = cc.spawn(cc.moveBy(.3, cc.v2(0, 240 + cc.winSize.height - 1136)), cc.rotateBy(.18, 360));
                            e.setTag(102),
                                this.knife.runAction(e)
                        }
                    }
                    ,
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initUINode = function () {
                        this.n2.active = !1,
                            this.n1.active = !0,
                            this.p1.active = !1,
                            this.p2.active = !1,
                            this.knife.active = !1
                    }
                    ,
                    t.prototype.showUI = function (e) {
                        this.curShowType = 1,
                            this.shareState[0] = !1,
                            this.shareState[1] = !1,
                            this.initUINode()
                    }
                    ,
                    t.prototype.onEnable = function () {
                        this.initUINode()
                    }
                    ,
                    t.prototype.startCB = function () {
                        this.n1.active = !1,
                            this.n2.active = !1,
                            this.p1.active = !1,
                            this.p2.active = !1,
                            this.node.getChildByName("bg").stopAllActions(),
                            this.node.getChildByName("bg").runAction(cc.repeatForever(cc.rotateBy(2, 360))),
                            this.knife.active = !0,
                            this.knife.y = -256,
                            this.knife.getComponent(cc.Widget).updateAlignment(),
                            this.knife.rotation = 0,
                            this.isSpin = !0,
                            this.knife.stopAllActions(),
                            this.knife.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.6, cc.v2(0, 35)), cc.moveBy(.6, cc.v2(0, -35))).easing(cc.easeInOut(2))))
                    }
                    ,
                    t.prototype.winningCB = function (e) {
                        if (this.luckyID = e,
                            1 == this.curShowType) {
                            this.prizeID = i.default.shareGameData.getLuckyItem(e);
                            var t = {};
                            6 == e ? (s.default.shareKnife.setKindfSkin(this.prizeID),
                                i.default.shareGameData.addOneSkinData(this.prizeID),
                                t = {
                                    package_map: i.default.skinMap
                                }) : (i.default.shareGameData.gold += this.prizeID,
                                    t = {
                                        gold: i.default.shareGameData.gold
                                    }),
                                a.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                    user_id: a.default.OpenId,
                                    data_info: JSON.stringify(t)
                                }, function (e, t) { }),
                                this.stopSpin()
                        }
                    }
                    ,
                    t.prototype.stopSpin = function () {
                        this.isSpin = !1,
                            this.scheduleOnce(this.showReward, .5)
                    }
                    ,
                    t.prototype.setCloseCB = function (e) {
                        this.closeFCB = e
                    }
                    ,
                    t.prototype.closeBtnCB = function () {
                        1 != this.isSpin && (r.default.suondMgrShader.playEffectSound(r.soundType.Btn),
                            c.default.addEventPos(c.eventID.additional_return),
                            cc.director.loadScene("start"))
                    }
                    ,
                    t.prototype.showReward = function () {
                        1 == this.curShowType && (this.n2.active = !0,
                            1 == a.default.isOpenOncMoreShot && (this.n2.getChildByName("VedioaginButton").active = !1),
                            this.n1.active = !1,
                            a.default.CloseAd()),
                            6 == this.luckyID ? (this.p1.active = !1,
                                this.p2.active = !0,
                                this.p2.getChildByName("weapon").getComponent(cc.Sprite).spriteFrame = this.allKnifeTexturePlist.getSpriteFrame("a" + this.prizeID)) : (this.p1.active = !0,
                                    this.p2.active = !1,
                                    this.p1.getChildByName("Label").getComponent(cc.Label).string = this.prizeID.toString())
                    }
                    ,
                    t.prototype.moneyFly = function () { }
                    ,
                    t.prototype.aginCB = function (e, t) {
                        var o = this;
                        if (a.default.wondersdk.statevent("\u62bd\u5956\u518d\u6765\u4e00\u6b21"),
                            1 != this.isSpin) {
                            var i = function (e) {
                                console.log("\u5df2\u7ecf\u5206\u4eab\u4e86\uff0c\u7ee7\u7eed\u62bd\u5956"),
                                    o.shareState[e - 1] = !0,
                                    c.default.addEventPos(c.eventID.additional_again),
                                    o.startCB()
                            };
                            1 == parseInt(t) ? a.default.OpenAdVides(function () {
                                i(parseInt(t))
                            }) : 2 == parseInt(t) && 0 == this.shareState[1] && a.default.OpenShare(1, {
                                other_openid: a.default.OpenId,
                                type: 2
                            }, !0, !1, function () {
                                i(parseInt(t))
                            })
                        }
                    }
                    ,
                    t.prototype.nextCB = function () {
                        1 != this.isSpin && (a.default.wondersdk.statevent("Next Level"),
                            a.default.OpenAd("", 0, -1),
                            c.default.addEventPos(c.eventID.additional_next),
                            n.default.shareGameScene.nextMission())
                    }
                    ,
                    t.prototype.closeCB = function () {
                        1 != this.isSpin && (this.node.active = !1)
                    }
                    ,
                    __decorate([u(cc.SpriteAtlas)], t.prototype, "allKnifeTexturePlist", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "moneyPrefab", void 0),
                    __decorate([u(cc.Node)], t.prototype, "luckBox", void 0),
                    __decorate([u(cc.Node)], t.prototype, "knife", void 0),
                    __decorate([u(cc.Node)], t.prototype, "n1", void 0),
                    __decorate([u(cc.Node)], t.prototype, "n2", void 0),
                    __decorate([u(cc.Node)], t.prototype, "p1", void 0),
                    __decorate([u(cc.Node)], t.prototype, "p2", void 0),
                    t = __decorate([l], t)
            } (cc.Component);
        o.default = h,
            cc._RF.pop()
    }
        , {
        "./event": "event",
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    md5: [function (e, t, o) {
        "use strict";
        function a(e, t) {
            var o = (65535 & e) + (65535 & t);
            return (e >> 16) + (t >> 16) + (o >> 16) << 16 | 65535 & o
        }
        function i(e, t, o, i, n, s) {
            return a(function (e, t) {
                return e << t | e >>> 32 - t
            } (a(a(t, e), a(i, s)), n), o)
        }
        function n(e, t, o, a, n, s, r) {
            return i(t & o | ~t & a, e, t, n, s, r)
        }
        function s(e, t, o, a, n, s, r) {
            return i(t & a | o & ~a, e, t, n, s, r)
        }
        function r(e, t, o, a, n, s, r) {
            return i(t ^ o ^ a, e, t, n, s, r)
        }
        function c(e, t, o, a, n, s, r) {
            return i(o ^ (t | ~a), e, t, n, s, r)
        }
        function d(e) {
            for (var t = 1732584193, o = -271733879, i = -1732584194, d = 271733878, l = 0; l < e.length; l += 16) {
                var u = t
                    , h = o
                    , p = i
                    , f = d;
                o = c(o = c(o = c(o = c(o = r(o = r(o = r(o = r(o = s(o = s(o = s(o = s(o = n(o = n(o = n(o = n(o, i = n(i, d = n(d, t = n(t, o, i, d, e[l + 0], 7, -680876936), o, i, e[l + 1], 12, -389564586), t, o, e[l + 2], 17, 606105819), d, t, e[l + 3], 22, -1044525330), i = n(i, d = n(d, t = n(t, o, i, d, e[l + 4], 7, -176418897), o, i, e[l + 5], 12, 1200080426), t, o, e[l + 6], 17, -1473231341), d, t, e[l + 7], 22, -45705983), i = n(i, d = n(d, t = n(t, o, i, d, e[l + 8], 7, 1770035416), o, i, e[l + 9], 12, -1958414417), t, o, e[l + 10], 17, -42063), d, t, e[l + 11], 22, -1990404162), i = n(i, d = n(d, t = n(t, o, i, d, e[l + 12], 7, 1804603682), o, i, e[l + 13], 12, -40341101), t, o, e[l + 14], 17, -1502002290), d, t, e[l + 15], 22, 1236535329), i = s(i, d = s(d, t = s(t, o, i, d, e[l + 1], 5, -165796510), o, i, e[l + 6], 9, -1069501632), t, o, e[l + 11], 14, 643717713), d, t, e[l + 0], 20, -373897302), i = s(i, d = s(d, t = s(t, o, i, d, e[l + 5], 5, -701558691), o, i, e[l + 10], 9, 38016083), t, o, e[l + 15], 14, -660478335), d, t, e[l + 4], 20, -405537848), i = s(i, d = s(d, t = s(t, o, i, d, e[l + 9], 5, 568446438), o, i, e[l + 14], 9, -1019803690), t, o, e[l + 3], 14, -187363961), d, t, e[l + 8], 20, 1163531501), i = s(i, d = s(d, t = s(t, o, i, d, e[l + 13], 5, -1444681467), o, i, e[l + 2], 9, -51403784), t, o, e[l + 7], 14, 1735328473), d, t, e[l + 12], 20, -1926607734), i = r(i, d = r(d, t = r(t, o, i, d, e[l + 5], 4, -378558), o, i, e[l + 8], 11, -2022574463), t, o, e[l + 11], 16, 1839030562), d, t, e[l + 14], 23, -35309556), i = r(i, d = r(d, t = r(t, o, i, d, e[l + 1], 4, -1530992060), o, i, e[l + 4], 11, 1272893353), t, o, e[l + 7], 16, -155497632), d, t, e[l + 10], 23, -1094730640), i = r(i, d = r(d, t = r(t, o, i, d, e[l + 13], 4, 681279174), o, i, e[l + 0], 11, -358537222), t, o, e[l + 3], 16, -722521979), d, t, e[l + 6], 23, 76029189), i = r(i, d = r(d, t = r(t, o, i, d, e[l + 9], 4, -640364487), o, i, e[l + 12], 11, -421815835), t, o, e[l + 15], 16, 530742520), d, t, e[l + 2], 23, -995338651), i = c(i, d = c(d, t = c(t, o, i, d, e[l + 0], 6, -198630844), o, i, e[l + 7], 10, 1126891415), t, o, e[l + 14], 15, -1416354905), d, t, e[l + 5], 21, -57434055), i = c(i, d = c(d, t = c(t, o, i, d, e[l + 12], 6, 1700485571), o, i, e[l + 3], 10, -1894986606), t, o, e[l + 10], 15, -1051523), d, t, e[l + 1], 21, -2054922799), i = c(i, d = c(d, t = c(t, o, i, d, e[l + 8], 6, 1873313359), o, i, e[l + 15], 10, -30611744), t, o, e[l + 6], 15, -1560198380), d, t, e[l + 13], 21, 1309151649), i = c(i, d = c(d, t = c(t, o, i, d, e[l + 4], 6, -145523070), o, i, e[l + 11], 10, -1120210379), t, o, e[l + 2], 15, 718787259), d, t, e[l + 9], 21, -343485551),
                    t = a(t, u),
                    o = a(o, h),
                    i = a(i, p),
                    d = a(d, f)
            }
            return [t, o, i, d]
        }
        function l(e) {
            for (var t = "", o = 0; o < 4 * e.length; o++)
                t += "0123456789abcdef".charAt(e[o >> 2] >> o % 4 * 8 + 4 & 15) + "0123456789abcdef".charAt(e[o >> 2] >> o % 4 * 8 & 15);
            return t
        }
        function u(e) {
            for (var t = 1 + (e.length + 8 >> 6), o = new Array(16 * t), a = 0; a < 16 * t; a++)
                o[a] = 0;
            for (a = 0; a < e.length; a++)
                o[a >> 2] |= (255 & e.charCodeAt(a)) << a % 4 * 8;
            return o[a >> 2] |= 128 << a % 4 * 8,
                o[16 * t - 2] = 8 * e.length,
                o
        }
        cc._RF.push(t, "87786uBCIFF0rzKr+tIeIW0", "md5"),
            t.exports = {
                hexMD5: function (e) {
                    return l(d(u(e)))
                }
            },
            cc._RF.pop()
    }
        , {}],
    misiionBarNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "73f88yFxJBJLpF0t2Lx3U+/", "misiionBarNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.n1 = null,
                        t.n2 = null,
                        t.n3 = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.init = function (e, t) {
                        void 0 === t && (t = 1),
                            this.node.scale = t,
                            this.n1.active = !0;
                        var o = e;
                        this.node.getChildByName("pic_guanka_5").active = !0,
                            e <= 1 ? (this.n1.active = !1,
                                this.node.getChildByName("pic_guanka_5").active = !1) : this.n1.getComponent("missionItem").init(o - 1, !1),
                            this.n2.getComponent("missionItem").init(o, !0),
                            this.n3.getComponent("missionItem").init(o + 1, !1)
                    }
                    ,
                    __decorate([n(cc.Node)], t.prototype, "n1", void 0),
                    __decorate([n(cc.Node)], t.prototype, "n2", void 0),
                    __decorate([n(cc.Node)], t.prototype, "n3", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    missionItem: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "9e64brxnqhJa47rFqNyS338", "missionItem"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.ItemsSpf = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.init = function (e, t) {
                        var o = 0;
                        0 == t ? (o = 2,
                            this.node.getChildByName("cLabel").getComponent(cc.Label).fontSize = 24) : o = 0,
                            e % 5 == 0 ? (o += 1,
                                this.node.getChildByName("cLabel").active = !1) : (this.node.getChildByName("cLabel").active = !0,
                                    this.node.getChildByName("cLabel").getComponent(cc.Label).string = e.toString()),
                            this.node.getChildByName("sp").getComponent(cc.Sprite).spriteFrame = this.ItemsSpf[o]
                    }
                    ,
                    __decorate([n(cc.SpriteFrame)], t.prototype, "ItemsSpf", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = s,
            cc._RF.pop()
    }
        , {}],
    oneGame: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "61b5bK3Ko5EsoJrAEUeBpVX", "oneGame"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("../weChatApi/WXApi")
            , i = cc._decorator
            , n = i.ccclass
            , s = i.property
            , r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.headprefab = null,
                        t.showIndex = 0,
                        t.all = 0,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.onEnable = function () {
                        this.playeRotaAct()
                    }
                    ,
                    t.prototype.initOne = function (e, t) {
                        var o = this;
                        void 0 === t && (t = !0),
                            this.showIndex = 0,
                            this.all = 0;
                        var i = null;
                        this.node.removeAllChildren();
                        for (var n = 0; n < e.length; n++) {
                            var s = e[n];
                            "start_icon_ads" == s.flag && (console.log("\u6210\u7ee9\u5355\u4e2a"),
                                null == i && ((i = cc.instantiate(this.headprefab)).getComponent("gameHead").init(s),
                                    i.getChildByName("name").y -= 3,
                                    i.getChildByName("name").active = t,
                                    this.node.addChild(i),
                                    i.position = cc.v2(0, 16)),
                                this.all += 1)
                        }
                        if (0 == this.all ? this.node.active = !1 : this.node.active = !0,
                            i) {
                            i.scale = .9,
                                this.playeRotaAct();
                            this.schedule(function () {
                                (function () {
                                    o.showIndex += 1,
                                        o.showIndex > o.all && (o.showIndex = 0);
                                    for (var e = 0, t = null, n = 0; n < a.default.gameList.length; n++) {
                                        var s = a.default.gameList[n];
                                        if ("start_icon_ads" == s.flag) {
                                            if (o.showIndex == e) {
                                                t = s;
                                                break
                                            }
                                            e += 1
                                        }
                                    }
                                    t && i.getComponent("gameHead").init(t)
                                }
                                )()
                            }, 5)
                        }
                    }
                    ,
                    t.prototype.playeRotaAct = function () {
                        this.node.active = !0,
                            this.node.stopAllActions(),
                            this.node.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(.1, -15), cc.rotateBy(.1, 15), cc.rotateBy(.1, -10), cc.rotateBy(.1, 10), cc.delayTime(1.5))))
                    }
                    ,
                    __decorate([s(cc.Prefab)], t.prototype, "headprefab", void 0),
                    t = __decorate([n], t)
            } (cc.Component);
        o.default = r,
            cc._RF.pop()
    }
        , {
        "../weChatApi/WXApi": "WXApi"
    }],
    partNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "dad2bq7ryFHfpzm6o3uD/vZ", "partNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./soundMrg")
            , n = e("./gameScene")
            , s = e("./gameData")
            , r = e("./gameConfig")
            , c = cc._decorator
            , d = c.ccclass
            , l = c.property
            , u = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.getNode = null,
                        t.foodItem = null,
                        t.healthyNode = [],
                        t.leftPos = [],
                        t.rightPos = [],
                        t.curTime = 0,
                        t.isStartShoot = !1,
                        t.nextAddTime = -1,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () {
                        this.leftPos = [cc.v2(.5 * -cc.winSize.width - 70, .5 * cc.winSize.height * .5 - 0), cc.v2(.5 * -cc.winSize.width - 70, .5 * cc.winSize.height * .5 - 100), cc.v2(.5 * -cc.winSize.width - 70, .5 * cc.winSize.height * .5 - 200), cc.v2(.5 * -cc.winSize.width - 70, .5 * cc.winSize.height * .5 - 300)],
                            this.rightPos = [cc.v2(.5 * cc.winSize.width + 70, .5 * cc.winSize.height * .5 - 0), cc.v2(.5 * cc.winSize.width + 70, .5 * cc.winSize.height * .5 - 100), cc.v2(.5 * cc.winSize.width + 70, .5 * cc.winSize.height * .5 - 200), cc.v2(.5 * cc.winSize.width + 70, .5 * cc.winSize.height * .5 - 300)]
                    }
                    ,
                    t.prototype.onDisable = function () { }
                    ,
                    t.prototype.updataHealthy = function () {
                        0 == s.default.shareGameData.partyHealthy && this.showPartyResult();
                        for (var e = 0; e < this.healthyNode.length; e++) {
                            var t = this.healthyNode[e];
                            s.default.shareGameData.partyHealthy > e ? t.active = !0 : t.active = !1
                        }
                    }
                    ,
                    t.prototype.timeDown = function () {
                        var e = this
                            , t = r.default.partyConfig_.json.time;
                        this.curTime = t,
                            this.schedule(function () {
                                if (e.node.getChildByName("scoreNode").getChildByName("misionLabel").getComponent(cc.Label).string = e.curTime.toString(),
                                    0 == e.curTime)
                                    e.unscheduleAllCallbacks(),
                                        e.scheduleOnce(function () {
                                            e.showPartyResult()
                                        }, 1);
                                else {
                                    if (e.curTime % 5 == 0) {
                                        var t = Math.ceil(2 * Math.random());
                                        e.nextAddTime = e.curTime - t,
                                            console.log("this. nextAddTime", e.nextAddTime, e.curTime)
                                    }
                                    if (e.nextAddTime == e.curTime) {
                                        for (var o = 0; o < e.leftPos.length - 1; o++) {
                                            var a = e.leftPos[o];
                                            e.addOneFurit(a, 1)
                                        }
                                        for (o = 0; o < e.rightPos.length - 1; o++) {
                                            a = e.rightPos[o];
                                            e.addOneFurit(a, 2, !0)
                                        }
                                    }
                                }
                                e.curTime -= 1
                            }, 1)
                    }
                    ,
                    t.prototype.startShoot = function () {
                        var e = this;
                        this.isStartShoot = !1,
                            s.default.shareGameData.partyHealthy = 2,
                            this.updataHealthy(),
                            this.node.getChildByName("scoreNode").getChildByName("moneyNode").getChildByName("moneyLabel").getComponent(cc.Label).string = "0",
                            this.node.getChildByName("treasureParticle").getComponent(cc.ParticleSystem).stopSystem(),
                            this.node.getChildByName("scoreNode").getChildByName("misionLabel").active = !1,
                            this.node.getChildByName("scoreNode").getChildByName("misionLabel").getComponent(cc.Label).string = r.default.partyConfig_.json.time,
                            this.node.getChildByName("cTimeLabel").active = !0;
                        var t = 3
                            , o = function () {
                                e.node.getChildByName("cTimeLabel").scale = 4,
                                    e.node.getChildByName("cTimeLabel").getComponent(cc.Label).string = t.toString(),
                                    e.node.getChildByName("cTimeLabel").runAction(cc.sequence(cc.scaleTo(.3, 1).easing(cc.easeOut(2)), cc.delayTime(.8), cc.callFunc(function () {
                                        (t -= 1) > 0 ? o() : (e.isStartShoot = !0,
                                            e.node.getChildByName("cTimeLabel").active = !1,
                                            e.node.getChildByName("scoreNode").getChildByName("misionLabel").active = !0,
                                            e.node.getChildByName("treasureParticle").getComponent(cc.ParticleSystem).resetSystem(),
                                            e.showFriut())
                                    })))
                            };
                        o()
                    }
                    ,
                    t.prototype.showFriut = function () {
                        var e = this;
                        this.timeDown();
                        for (var t = function (o, a) {
                            var i = r.default.partyConfig_.json.CD1 + Math.random() * (r.default.partyConfig_.json.CD2 - r.default.partyConfig_.json.CD1);
                            e.scheduleOnce(function () {
                                e.addOneFurit(o, a),
                                    t(o, a)
                            }, i)
                        }, o = function (o) {
                            var i = a.leftPos[o]
                                , n = r.default.partyConfig_.json.CD1 + Math.random() * (r.default.partyConfig_.json.CD2 - r.default.partyConfig_.json.CD1);
                            console.log("cd", n),
                                a.scheduleOnce(function () {
                                    e.addOneFurit(i, 1),
                                        t(i, 1)
                                }, n)
                        }, a = this, i = 0; i < this.leftPos.length; i++)
                            o(i);
                        var n = function (o) {
                            var a = s.rightPos[o]
                                , i = r.default.partyConfig_.json.CD1 + Math.random() * (r.default.partyConfig_.json.CD2 - r.default.partyConfig_.json.CD1);
                            s.scheduleOnce(function () {
                                e.addOneFurit(a, 2),
                                    t(a, 2)
                            }, i)
                        }
                            , s = this;
                        for (i = 0; i < this.rightPos.length; i++)
                            n(i)
                    }
                    ,
                    t.prototype.addOneFurit = function (e, t, o) {
                        void 0 === o && (o = !1);
                        var a = null;
                        (a = n.default.shareGameScene.foodPool.size() > 0 ? n.default.shareGameScene.foodPool.get() : cc.instantiate(this.foodItem)).getComponent("food").initTextureWithID(Math.ceil(8 * Math.random())),
                            this.node.addChild(a);
                        var i = -0;
                        if (1 == o && (i = -100),
                            e = cc.v2(e.x, e.y + i),
                            a.position = e,
                            1 == t) {
                            var s = [cc.v2(e.x, e.y), cc.v2(100 - 100 * Math.random(), e.y + 600 - 200 * Math.random()), cc.v2(.5 * cc.winSize.width + 70, e.y - 300 - 100 * Math.random())]
                                , r = cc.bezierTo(1.5, s);
                            a.stopAllActions(),
                                a.runAction(cc.sequence(r, cc.removeSelf())),
                                a.runAction(cc.repeatForever(cc.rotateBy(.2, -80)))
                        } else {
                            s = [cc.v2(e.x, e.y), cc.v2(100 - 100 * Math.random(), e.y + 600 - 200 * Math.random()), cc.v2(.5 * -cc.winSize.width - 70, e.y - 300 - 100 * Math.random())],
                                r = cc.bezierTo(1.5, s);
                            a.stopAllActions(),
                                a.runAction(cc.sequence(r, cc.removeSelf())),
                                a.runAction(cc.repeatForever(cc.rotateBy(.2, -80)))
                        }
                    }
                    ,
                    t.prototype.showPartyResult = function () {
                        s.default.missionReportArry = [];
                        var e = function () {
                            s.default.shareGameData.gold += s.default.shareGameData.partyMoney;
                            var e = {
                                gold: s.default.shareGameData.gold
                            };
                            a.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: a.default.OpenId,
                                data_info: JSON.stringify(e)
                            }, function (e, t) {
                                console.log("Fruit Party--", s.default.shareGameData.partyMoney)
                            })
                        };
                        e(),
                            this.unscheduleAllCallbacks();
                        var t = cc.instantiate(this.getNode);
                        t.getComponent("surprisedNode").showUI(s.default.shareGameData.partyMoney, 5, !0),
                            t.getComponent("surprisedNode").setCallBack(function () {
                                a.default.OpenAdVides(function () {
                                    e(),
                                        cc.director.loadScene("start")
                                })
                            }),
                            t.getComponent("surprisedNode").setclosecallBack(function () {
                                cc.director.loadScene("start")
                            }),
                            this.node.parent.addChild(t, 10)
                    }
                    ,
                    t.prototype.returnCB = function (e, t) {
                        i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                            1 == t ? (this.node.getChildByName("surprisedNode").active = !1,
                                cc.director.resume()) : 2 == t ? (a.default.wondersdk.statevent("\u6d3e\u5bf9-\u8fd4\u56de\u4e3b\u9875"),
                                    s.default.missionReportArry = [],
                                    cc.director.resume(),
                                    cc.director.loadScene("start")) : 3 == t && (this.node.getChildByName("surprisedNode").active = !0,
                                        this.node.getChildByName("surprisedNode").zIndex = 2,
                                        cc.director.pause())
                    }
                    ,
                    __decorate([l(cc.Prefab)], t.prototype, "getNode", void 0),
                    __decorate([l(cc.Prefab)], t.prototype, "foodItem", void 0),
                    __decorate([l(cc.Node)], t.prototype, "healthyNode", void 0),
                    t = __decorate([d], t)
            } (cc.Component);
        o.default = u,
            cc._RF.pop()
    }
        , {
        "./gameConfig": "gameConfig",
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    passFoodReport: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "6cc49Vd9YFNEbeLCh00V+Sl", "passFoodReport"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameScene")
            , i = cc._decorator
            , n = i.ccclass
            , s = i.property
            , r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.cutFoodPrefab = null,
                        t.Fooddish = null,
                        t.bgSpfArry = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.onLoad = function () { }
                    ,
                    t.prototype.start = function () { }
                    ,
                    t.prototype.initUI = function (e, t) {
                        void 0 === t && (t = []),
                            this.Fooddish.removeAllChildren(),
                            0 == e ? (this.node.getComponent(cc.Sprite).spriteFrame = this.bgSpfArry[1],
                                this.Fooddish.active = !1,
                                this.node.getChildByName("san").active = !1) : (this.node.getComponent(cc.Sprite).spriteFrame = this.bgSpfArry[0],
                                    this.node.getChildByName("san").active = !0);
                        for (var o = .5 * -this.Fooddish.height, i = 0; i < t.length; i++) {
                            var n = cc.instantiate(this.cutFoodPrefab);
                            n.getComponent("cutFood").setTexture(a.default.shareGameScene.allFoodTexturePlist.getSpriteFrame(t[i] + "-2")),
                                this.Fooddish.addChild(n, -1),
                                n.position = cc.v2(5 - 10 * Math.random(), o + .5 * n.height),
                                o += n.height
                        }
                        this.node.getChildByName("san").y = o - 35
                    }
                    ,
                    __decorate([s(cc.Prefab)], t.prototype, "cutFoodPrefab", void 0),
                    __decorate([s(cc.Node)], t.prototype, "Fooddish", void 0),
                    __decorate([s(cc.SpriteFrame)], t.prototype, "bgSpfArry", void 0),
                    t = __decorate([n], t)
            } (cc.Component);
        o.default = r,
            cc._RF.pop()
    }
        , {
        "./gameScene": "gameScene"
    }],
    passNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "a0c4fNJU5xPH7moJGqKj7l6", "passNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./gameData")
            , i = e("./gameScene")
            , n = e("./weChatApi/WXApi")
            , s = e("./soundMrg")
            , r = e("./event")
            , c = e("./knife")
            , d = cc._decorator
            , l = d.ccclass
            , u = d.property
            , h = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.getNode = null,
                        t.PssaFoodPrefab = null,
                        t.n1 = null,
                        t.missionReward = null,
                        t.n2 = null,
                        t.n3 = null,
                        t.isFour = !1,
                        t.passFoodArry = [],
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.showAction = function () {
                        var e = this;
                        this.node.getChildByName("misiionBarNode").opacity = 0,
                            this.node.getChildByName("misiionBarNode").stopAllActions(),
                            this.node.getChildByName("misiionBarNode").runAction(cc.fadeIn(.3)),
                            this.node.getChildByName("misiionBarNode").getChildByName("pic_shengli").scale = 0,
                            this.node.getChildByName("misiionBarNode").getChildByName("pic_shengli").runAction(cc.scaleTo(.2, 1)),
                            this.node.getChildByName("missionProgressBar").opacity = 0,
                            this.node.getChildByName("missionProgressBar").stopAllActions(),
                            this.node.getChildByName("missionProgressBar").runAction(cc.sequence(cc.delayTime(.1), cc.fadeIn(.3))),
                            this.missionReward.opacity = 0,
                            this.missionReward.stopAllActions(),
                            this.missionReward.runAction(cc.sequence(cc.delayTime(.2), cc.fadeIn(.3), cc.callFunc(function () {
                                e.showMoneyFly()
                            }))),
                            this.node.getChildByName("ProgressBar").opacity = 0,
                            this.node.getChildByName("ProgressBar").stopAllActions(),
                            this.node.getChildByName("ProgressBar").runAction(cc.sequence(cc.delayTime(.3), cc.fadeIn(.3))),
                            this.node.getChildByName("btnNode").opacity = 0
                    }
                    ,
                    t.prototype.showBtnNode = function () {
                        this.node.getChildByName("btnNode").opacity = 0,
                            this.node.getChildByName("btnNode").stopAllActions(),
                            this.node.getChildByName("btnNode").runAction(cc.sequence(cc.delayTime(0), cc.fadeIn(.3)))
                    }
                    ,
                    t.prototype.showMoneyFly = function () {
                        var e = this
                            , t = this.missionReward.getChildByName("icon_jinbi_01").convertToWorldSpace(cc.v2(0, 0));
                        t = cc.v2(t.x - .5 * cc.winSize.width + 20, t.y - .5 * cc.winSize.height + 30);
                        for (var o = 0; o < Math.floor(a.default.shareGameData.curGetMoney / 5); o++)
                            this.scheduleOnce(function () {
                                i.default.shareGameScene.addmoneyFly(t, 1, e.node.getChildByName("moneyBg").getChildByName("icon_jinbi_01"), i.default.shareGameScene.passNode)
                            }, .03 * o)
                    }
                    ,
                    t.prototype.onEnable = function () {
                        this.node.getChildByName("treasureParticle").getComponent(cc.ParticleSystem).stopSystem(),
                            n.default.OpenAd("2", 0, -1),
                            this.node.getChildByName("moneyBg").getChildByName("cLabel").getComponent(cc.Label).string = a.default.shareGameData.gold.toString(),
                            this.n1.getChildByName("doubleBtn").active = !0,
                            this.n1.getChildByName("doubleBtn").stopAllActions(),
                            this.n1.getChildByName("doubleBtn").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.06), cc.scaleTo(.3, 1)))),
                            n.default.CreateAuthorizeBtn(this.node.getChildByName("rankBtn"), function () {
                                console.log("\u6388\u6743\u6309\u94ae--", n.default.user_nickName, n.default.user_avatar),
                                    i.default.shareGameScene.rankBtn()
                            }),
                            this.n1.getChildByName("nextBtn2").active = !1,
                            this.n1.getChildByName("doubleBtn").active = !0,
                            this.n1.getChildByName("doubleBtn").stopAllActions(),
                            this.n1.getChildByName("doubleBtn").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.06), cc.scaleTo(.3, 1)))),
                            console.log("gameData.shareGameData.isShowViewIcon=====", n.default.isShowViewIcon),
                            0 == n.default.isShowViewIcon ? (this.n1.getChildByName("doubleBtn").getChildByName("icon").active = !1,
                                this.n3.getChildByName("superStart").getChildByName("icon").active = !1) : (this.n1.getChildByName("doubleBtn").getChildByName("icon").active = !0,
                                    this.n3.getChildByName("superStart").getChildByName("icon").active = !0),
                            this.node.getChildByName("misiionBarNode").getComponent("misiionBarNode").init(a.default.shareGameData.lv, 1),
                            this.node.getChildByName("missionProgressBar").getComponent(cc.ProgressBar).progress = a.default.shareGameData.missionCurProgress / a.default.shareGameData.missionTotalProgress,
                            this.node.getChildByName("missionProgressBar").getChildByName("misionLabel").getComponent(cc.Label).string = "Left:" + (100 * (1 - a.default.shareGameData.missionCurProgress / a.default.shareGameData.missionTotalProgress)).toFixed(0) + "%",
                            this.showAction(),
                            this.node.getChildByName("btnNode").getChildByName("shareBtn").getChildByName("price").active = !1
                    }
                    ,
                    t.prototype.shareRecord = function () {
                        var e = this;
                        i.default.shareGameScene.shareRecord(function () {
                            if (e.node.getChildByName("shareBtn").active = !1,
                                a.default.shareGameData.recordRewardCount > 0 && 0 == n.default.isOpenShareRewar) {
                                a.default.shareGameData.showTip(21, 2),
                                    a.default.shareGameData.recordRewardCount -= 1,
                                    a.default.shareGameData.gold += 500;
                                var t = {
                                    gold: a.default.shareGameData.gold,
                                    recordRewardCount: a.default.shareGameData.recordRewardCount
                                };
                                e.node.getChildByName("moneyBg").getChildByName("cLabel").getComponent(cc.Label).string = a.default.shareGameData.gold.toString(),
                                    n.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                        user_id: n.default.OpenId,
                                        data_info: JSON.stringify(t)
                                    }, function (e, t) {
                                        console.log("\u5934\u6761\u5206\u4eab\u5956\u52b1", a.default.shareGameData.gold)
                                    })
                            }
                        })
                    }
                    ,
                    t.prototype.onDisable = function () {
                        n.default.CloseAd(),
                            n.default.destroyAuthorizeBtn()
                    }
                    ,
                    t.prototype.showUI = function (e, t) {
                        var o = this;
                        if (void 0 === t && (t = !1),
                            this.isFour = e,
                            n.default.wondersdk.statevent("\u80dc\u5229" + a.default.shareGameData.lv),
                            s.default.suondMgrShader.playEffectSound(s.soundType.wim),
                            0 == a.default.shareGameData.gameModel) {
                            this.node.getChildByName("misiionBarNode").getChildByName("pic_shengli").active = !0,
                                this.node.getChildByName("misiionBarNode").getChildByName("pic_shibai").active = !1,
                                a.default.shareGameData.gold += a.default.shareGameData.curGetMoney + a.default.shareGameData.partyMoney;
                            var i = {
                                gold: a.default.shareGameData.gold
                            };
                            n.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: n.default.OpenId,
                                data_info: JSON.stringify(i)
                            }, function (e, t) {
                                console.log("\u7ed3\u7b97\u91d1\u5e01", a.default.shareGameData.gold)
                            }),
                                this.missionReward.getChildByName("icon_jinbi_02").active = !1,
                                this.missionReward.getChildByName("icon_jinbi_01").active = !0,
                                this.n3.active = !1,
                                this.n1.active = !0,
                                this.node.getChildByName("treasureParticle").getComponent(cc.ParticleSystem).resetSystem(),
                                this.scheduleOnce(function () {
                                    o.showPassFood(!0)
                                }, .4),
                                this.missionReward.getChildByName("cLabel").getComponent(cc.Label).string = a.default.shareGameData.curGetMoney.toString(),
                                this.n1.getChildByName("doubleBtn").getChildByName("cLabel").getComponent(cc.Label).string = a.default.shareGameData.curGetMoney.toString(),
                                0 == a.default.shareGameData.Up_down ? (n.default.CloseAd(),
                                    this.node.getChildByName("btnNode").y = -120,
                                    this.scheduleOnce(function () {
                                        n.default.OpenAd("2"),
                                            o.node.getChildByName("btnNode").y = -40
                                    }, 2)) : this.node.getChildByName("btnNode").y = -40
                        }
                    }
                    ,
                    t.prototype.returnCB = function () {
                        n.default.wondersdk.statevent("\u7ed3\u7b97\u8fd4\u56de" + a.default.shareGameData.lv),
                            s.default.suondMgrShader.playEffectSound(s.soundType.Btn),
                            a.default.missionReportArry = [],
                            a.default.shareGameData.curResurrectionCount = 0,
                            r.default.addEventPos(r.eventID.mission_return),
                            cc.director.loadScene("start")
                    }
                    ,
                    t.prototype.nextCB = function () {
                        n.default.wondersdk.statevent("\u7ed3\u7b97\u4e0b\u4e00\u5173"),
                            s.default.suondMgrShader.playEffectSound(s.soundType.Btn),
                            i.default.shareGameScene.nextMission()
                    }
                    ,
                    t.prototype.additionalCB = function () {
                        n.default.wondersdk.statevent("\u7ed3\u7b97\u5e78\u8fd0\u62bd\u5956"),
                            s.default.suondMgrShader.playEffectSound(s.soundType.Btn),
                            a.default.missionReportArry = [],
                            r.default.addEventPos(r.eventID.additional),
                            i.default.shareGameScene.showLuckyUI()
                    }
                    ,
                    t.prototype.doubleCB = function () {
                        var e = this;
                        n.default.wondersdk.statevent("\u7ed3\u7b97\u5956\u52b1\u7ffb\u500d"),
                            s.default.suondMgrShader.playEffectSound(s.soundType.Btn),
                            n.default.OpenAdVides(function () {
                                e.n1.getChildByName("doubleBtn").active = !1;
                                var t = cc.instantiate(e.getNode);
                                e.node.addChild(t, 10),
                                    t.getComponent("surprisedNode").showUI(a.default.shareGameData.curGetMoney + a.default.shareGameData.partyMoney, 2),
                                    t.getComponent("surprisedNode").setCallBack(function () {
                                        e.saveMoney()
                                    })
                            })
                    }
                    ,
                    t.prototype.shareCB = function () {
                        s.default.suondMgrShader.playEffectSound(s.soundType.Btn),
                            n.default.OpenShare()
                    }
                    ,
                    t.prototype.saveMoney = function () {
                        a.default.shareGameData.gold += a.default.shareGameData.curGetMoney + a.default.shareGameData.partyMoney;
                        var e = {
                            gold: a.default.shareGameData.gold
                        };
                        n.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                            user_id: n.default.OpenId,
                            data_info: JSON.stringify(e)
                        }, function (e, t) {
                            console.log("\u5b8c\u6210\u5173\u5361--\u4fdd\u5b58\u4fe1\u606f")
                        })
                    }
                    ,
                    t.prototype.showDefalUI = function () {
                        var e = this;
                        n.default.wondersdk.statevent("\u5931\u8d25" + a.default.shareGameData.lv),
                            this.node.getChildByName("misiionBarNode").getChildByName("pic_shengli").active = !1,
                            this.node.getChildByName("misiionBarNode").getChildByName("pic_shibai").active = !0,
                            this.n1.active = !1,
                            this.n2.active = !1,
                            this.n3.active = !0,
                            this.missionReward.getChildByName("icon_jinbi_02").active = !0,
                            this.missionReward.getChildByName("icon_jinbi_01").active = !1,
                            this.n3.getChildByName("superStart").stopAllActions(),
                            this.n3.getChildByName("superStart").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.06), cc.scaleTo(.3, 1)))),
                            console.log("gameData.shareGameData.Up_down", a.default.shareGameData.Up_down),
                            0 == a.default.shareGameData.Up_down ? (n.default.CloseAd(),
                                this.node.getChildByName("btnNode").y = -120,
                                this.scheduleOnce(function () {
                                    e.node.getChildByName("btnNode").y = -40,
                                        n.default.OpenAd("2")
                                }, 2)) : this.node.getChildByName("btnNode").y = -40,
                            this.showPassFood(),
                            this.missionReward.getChildByName("cLabel").getComponent(cc.Label).string = "0"
                    }
                    ,
                    t.prototype.aginButton = function (e, t) {
                        var o = function () {
                            s.default.suondMgrShader.playEffectSound(s.soundType.Btn),
                                a.default.shareGameData.curResurrectionCount = 0,
                                a.default.shareGameData.cur_getFriutTick = 0,
                                i.default.shareGameScene.resurrection()
                        };
                        1 == t ? (n.default.wondersdk.statevent("\u8d85\u7ea7\u5f00\u5c40" + a.default.shareGameData.lv),
                            n.default.OpenAdVides(function () {
                                o(),
                                    a.default.shareGameData.isExprece3Mision = !0,
                                    c.default.shareKnife.openThreeKinfe(!0),
                                    c.default.shareKnife.initKinfePos(),
                                    c.default.shareKnife.initCountTip()
                            })) : (n.default.wondersdk.statevent("\u7ed3\u7b97\u518d\u6765\u4e00\u6b21" + a.default.shareGameData.lv),
                                o())
                    }
                    ,
                    t.prototype.showPassFood = function (e) {
                        var t = this;
                        void 0 === e && (e = !1),
                            console.log("111111missionReportArry------", a.default.missionReportArry.length),
                            1 == this.isFour ? (this.node.getChildByName("ProgressBar").getChildByName("pic_qiandao_guang").active = !0,
                                this.node.getChildByName("ProgressBar").getChildByName("pic_qiandao_guang").stopAllActions(),
                                this.node.getChildByName("ProgressBar").getChildByName("pic_qiandao_guang").runAction(cc.repeatForever(cc.rotateBy(6, 360)))) : this.node.getChildByName("ProgressBar").getChildByName("pic_qiandao_guang").active = !1,
                            this.node.getChildByName("ProgressBar").getChildByName("missionTipLabel").getComponent(cc.Label).string = a.default.missionReportArry.length + "/4";
                        var o = 0;
                        a.default.missionReportArry.length > 0 && (o = a.default.missionReportArry.length,
                            1 == e && (o -= 1));
                        var i = o / 4;
                        i = i < 0 ? 0 : i,
                            this.node.getChildByName("ProgressBar").getComponent(cc.ProgressBar).progress = i,
                            console.log("\u8fdb\u5ea6\u5236-----", i);
                        var n = (a.default.missionReportArry.length - o) / 4;
                        if (n > 0) {
                            var s = n / 30
                                , r = 0;
                            console.log("\u8fdb\u5ea6\u5236----22222-", s);
                            var c = function () {
                                r += 1,
                                    i += s,
                                    t.node.getChildByName("ProgressBar").getComponent(cc.ProgressBar).progress = i,
                                    r >= 30 ? (1 == t.isFour && (t.isFour = !1,
                                        t.scheduleOnce(function () {
                                            t.additionalCB()
                                        }, .5)),
                                        t.showBtnNode()) : t.node.runAction(cc.sequence(cc.delayTime(1 / 30), cc.callFunc(c)))
                            };
                            this.node.runAction(cc.callFunc(c))
                        } else
                            this.scheduleOnce(function () {
                                t.showBtnNode()
                            }, .4)
                    }
                    ,
                    __decorate([u(cc.Prefab)], t.prototype, "getNode", void 0),
                    __decorate([u(cc.Prefab)], t.prototype, "PssaFoodPrefab", void 0),
                    __decorate([u(cc.Node)], t.prototype, "n1", void 0),
                    __decorate([u(cc.Node)], t.prototype, "missionReward", void 0),
                    __decorate([u(cc.Node)], t.prototype, "n2", void 0),
                    __decorate([u(cc.Node)], t.prototype, "n3", void 0),
                    t = __decorate([l], t)
            } (cc.Component);
        o.default = h,
            cc._RF.pop()
    }
        , {
        "./event": "event",
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    rankNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "92e0c+JWFNBAp9rDV8gcAR6", "rankNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./gameData")
            , n = e("./soundMrg")
            , s = cc._decorator
            , r = s.ccclass
            , c = s.property
            , d = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.contentNode = null,
                        t.rankItem = null,
                        t.rankBgSpf = [],
                        t.callBack = null,
                        t.ranktype = 0,
                        t.curPage = 1,
                        t.totalCount = 0,
                        t.curCount = 0,
                        t.pageSize = 6,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () {
                        this.curPage = 1
                    }
                    ,
                    t.prototype.onEnable = function () {
                        this.getRabk()
                    }
                    ,
                    t.prototype.getRabk = function () {
                        var e = this;
                        this.contentNode.removeAllChildren(),
                            i.default.shareGameData.getRank(this.curPage, this.pageSize, function (t) {
                                e.totalCount = t.total,
                                    e.curCount = 6 * (e.curPage - 1) + t.list.length,
                                    e.createRankList(t.list)
                            })
                    }
                    ,
                    t.prototype.createRankList = function (e) {
                        console.log("\u521b\u5efa\u6392\u884c\u699c", e);
                        this.contentNode.removeAllChildren();
                        for (var t = function (t) {
                            var a = e[t].nickname
                                , i = e[t].rank_score
                                , n = e[t].avatar
                                , s = cc.instantiate(o.rankItem);
                            s.position = cc.v2(0, 113 * -(t + .5)),
                                s.active = !0,
                                o.contentNode.addChild(s),
                                "" != n && cc.loader.load({
                                    url: n,
                                    type: "png"
                                }, function (e, t) {
                                    console.log("\u8bbe\u7f6e\u5934\u50cf---", n, t),
                                        e ? console.log("\u56fe\u7247\u4e0b\u8f7d\u5931\u8d25", e) : s.getChildByName("head").getChildByName("pic_daoliu_bg").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t)
                                }),
                                s.getChildByName("name").getComponent(cc.Label).string = "" == a ? "\u767e\u5ea6\u7f51\u53cb" : a,
                                s.getChildByName("score").getComponent(cc.Label).string = i.toString(),
                                s.getChildByName("rank").getComponent(cc.Label).string = (6 * (o.curPage - 1) + t + 1).toString(),
                                2 >= 6 * (o.curPage - 1) + t && (s.getChildByName("rankBg").active = !0,
                                    s.getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = o.rankBgSpf[t],
                                    s.getChildByName("rank").active = !1),
                                s.opacity = 0,
                                s.runAction(cc.sequence(cc.delayTime(.1 * t), cc.fadeIn(.2)))
                        }, o = this, a = 0; a < e.length; a++)
                            t(a)
                    }
                    ,
                    t.prototype.createImage = function (e, t) {
                        if (void 0 === t && (t = null),
                            a.default.isBaiDu) {
                            var o = swan.createImage();
                            o.onload = function () {
                                var t = new cc.Texture2D;
                                t.initWithElement(o),
                                    t.handleLoadedTexture(),
                                    e.spriteFrame = new cc.SpriteFrame(t)
                            }
                        }
                    }
                    ,
                    t.prototype.pageBtnCB = function (e, t) {
                        if (n.default.suondMgrShader.playEffectSound(n.soundType.Btn),
                            1 == t)
                            console.log("\u4e0a"),
                                this.pageSize = 6,
                                this.curPage > 1 && (this.curPage -= 1,
                                    this.getRabk());
                        else if (2 == t && (console.log("\u4e0b"),
                            this.curCount < 100)) {
                            var o = 100 - this.curCount;
                            o >= 6 || (this.pageSize = o),
                                o > 0 && this.totalCount > this.curCount && (this.curPage += 1,
                                    this.getRabk())
                        }
                    }
                    ,
                    t.prototype.shareCB = function () {
                        n.default.suondMgrShader.playEffectSound(n.soundType.Btn),
                            a.default.OpenShare()
                    }
                    ,
                    t.prototype.closeCB = function () {
                        n.default.suondMgrShader.playEffectSound(n.soundType.Btn),
                            a.default.CloseFriendListSmall(),
                            this.callBack && (this.callBack(),
                                this.callBack = null),
                            this.node.active = !1
                    }
                    ,
                    t.prototype.setCallBack = function (e) {
                        this.callBack = e
                    }
                    ,
                    __decorate([c(cc.Node)], t.prototype, "contentNode", void 0),
                    __decorate([c(cc.Prefab)], t.prototype, "rankItem", void 0),
                    __decorate([c(cc.SpriteFrame)], t.prototype, "rankBgSpf", void 0),
                    t = __decorate([r], t)
            } (cc.Component);
        o.default = d,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    resurrection: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "b21famraA9Cn51Te0/AHTyp", "resurrection"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./event")
            , i = e("./gameData")
            , n = e("./weChatApi/WXApi")
            , s = e("./gameScene")
            , r = cc._decorator
            , c = r.ccclass
            , d = r.property
            , l = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.foodItem = null,
                        t.label = null,
                        t.curTime = 0,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.onDisable = function () {
                        this.unscheduleAllCallbacks()
                    }
                    ,
                    t.prototype.onEnable = function () {
                        var e = this;
                        this.curTime = 6,
                            this.timeDown(),
                            this.node.getChildByName("bg").getChildByName("videoButton").stopAllActions(),
                            this.node.getChildByName("bg").scale = 0,
                            this.node.getChildByName("bg").stopAllActions(),
                            this.node.getChildByName("bg").runAction(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1), cc.callFunc(function () {
                                e.node.getChildByName("bg").getChildByName("videoButton").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.2, 1.1), cc.scaleTo(.2, 1))))
                            })).easing(cc.easeIn(1)))
                    }
                    ,
                    t.prototype.timeDown = function () {
                        var e = this;
                        this.label.getComponent(cc.Label).string = this.curTime.toString(),
                            this.schedule(function () {
                                console.log("\u5012\u8ba1\u65f6\u81ea\u52a8\u89c6\u9891"),
                                    e.curTime -= 1,
                                    e.label.getComponent(cc.Label).string = e.curTime.toString(),
                                    e.curTime <= 0 && (n.default.OpenAdVides(function () {
                                        console.log("\u5206\u4eab\u590d\u6d3b\u6210\u529f"),
                                            s.default.shareGameScene.resurrectionGame()
                                    }),
                                        e.unscheduleAllCallbacks())
                            }, 1)
                    }
                    ,
                    t.prototype.useCoinCB = function (e, t) {
                        var o = this;
                        n.default.wondersdk.statevent("\u590d\u6d3b-\u786e\u8ba4\u590d\u6d3b"),
                            console.log("f\u590d\u6d3b--\u6a21\u5f0f", i.default.shareGameData.gameModel);
                        var a = function () {
                            console.log("\u5206\u4eab\u590d\u6d3b\u6210\u529f"),
                                s.default.shareGameScene.resurrectionGame()
                        };
                        1 == parseInt(t) ? (this.unscheduleAllCallbacks(),
                            n.default.OpenShare(1, {
                                other_openid: n.default.OpenId,
                                type: 2
                            }, !1, !1, function () {
                                console.log("\u5206\u4eab\u590d\u6d3b\u6210\u529f"),
                                    a()
                            })) : (this.unscheduleAllCallbacks(),
                                n.default.OpenAdVides(function () {
                                    console.log("\u5206\u4eab\u590d\u6d3b\u6210\u529f"),
                                        a()
                                }, function () {
                                    o.timeDown()
                                }))
                    }
                    ,
                    t.prototype.skin = function () {
                        a.default.addEventPos(a.eventID.skip_resurrection),
                            s.default.shareGameScene.showGameOverUI()
                    }
                    ,
                    __decorate([d(cc.Prefab)], t.prototype, "foodItem", void 0),
                    __decorate([d(cc.Node)], t.prototype, "label", void 0),
                    t = __decorate([c], t)
            } (cc.Component);
        o.default = l,
            cc._RF.pop()
    }
        , {
        "./event": "event",
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./weChatApi/WXApi": "WXApi"
    }],
    setingNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "25e3cqUEAJMWJJ2OTC7ZJof", "setingNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./soundMrg")
            , n = cc._decorator
            , s = n.ccclass
            , r = (n.property,
                function (e) {
                    function t() {
                        var t = null !== e && e.apply(this, arguments) || this;
                        return t.callback = null,
                            t
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.onEnable = function () {
                            var e = !0;
                            0 == cc.audioEngine.getMusicVolume() && (e = !1),
                                console.log("\u5f00\u5173---", e, a.default.isOpendVibrate),
                                1 == e ? this.node.getChildByName("pic_tanchuang_bg").getChildByName("ToggleContainer1").getChildByName("toggle1").getComponent(cc.Toggle).isChecked = !0 : this.node.getChildByName("pic_tanchuang_bg").getChildByName("ToggleContainer1").getChildByName("toggle2").getComponent(cc.Toggle).isChecked = !0,
                                1 == a.default.isOpendVibrate ? this.node.getChildByName("pic_tanchuang_bg").getChildByName("ToggleContainer2").getChildByName("toggle1").getComponent(cc.Toggle).isChecked = !0 : this.node.getChildByName("pic_tanchuang_bg").getChildByName("ToggleContainer2").getChildByName("toggle2").getComponent(cc.Toggle).isChecked = !0
                        }
                        ,
                        t.prototype.closeCB = function () {
                            this.node.active = !1,
                                this.callback && (this.callback(),
                                    this.callback = null)
                        }
                        ,
                        t.prototype.soundButton = function (e, t) {
                            i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                                1 == parseInt(t) ? (cc.audioEngine.setMusicVolume(1),
                                    cc.audioEngine.setEffectsVolume(1)) : (cc.audioEngine.setMusicVolume(0),
                                        cc.audioEngine.setEffectsVolume(0))
                        }
                        ,
                        t.prototype.VibrateBtnCB = function (e, t) {
                            i.default.suondMgrShader.playEffectSound(i.soundType.Btn),
                                1 == parseInt(t) ? a.default.isOpendVibrate = !0 : a.default.isOpendVibrate = !1
                        }
                        ,
                        t.prototype.setCallBack = function (e) {
                            this.callback = e
                        }
                        ,
                        t = __decorate([s], t)
                } (cc.Component));
        o.default = r,
            cc._RF.pop()
    }
        , {
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    soundMrg: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "8e3c7W/e2NB7rcg/J/h22hy", "soundMrg"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass;
        a.property;
        (function (e) {
            e[e.GameBgm = 1] = "GameBgm",
                e[e.gameOverBgm = 2] = "gameOverBgm",
                e[e.Btn = 3] = "Btn",
                e[e.money = 4] = "money",
                e[e.combongift = 5] = "combongift",
                e[e.kinfeFly = 6] = "kinfeFly",
                e[e.cut1 = 7] = "cut1",
                e[e.cut2 = 8] = "cut2",
                e[e.cut3 = 9] = "cut3",
                e[e.cut4 = 10] = "cut4",
                e[e.wim = 11] = "wim",
                e[e.startBtn = 12] = "startBtn",
                e[e.startBgm = 13] = "startBgm",
                e[e.empty = 14] = "empty"
        }
        )(o.soundType || (o.soundType = {}));
        var n = function (e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            var o;
            return __extends(t, e),
                o = t,
                t.prototype.onLoad = function () {
                    o.suondMgrShader = this,
                        o.gameSound.push("\u80cc\u666f\u97f3\u4e50"),
                        o.gameSound.push("\u5931\u8d25"),
                        o.gameSound.push("\u70b9\u51fb\u6309\u94ae"),
                        o.gameSound.push("\u83b7\u5f97\u91d1\u5e01"),
                        o.gameSound.push("\u5f39\u51fa\u793c\u5305"),
                        o.gameSound.push("\u6b66\u5668\u98de\u884c"),
                        o.gameSound.push("\u5207\u6c34\u679c1(\u82f9\u679c,\u96ea\u68a8)"),
                        o.gameSound.push("\u5207\u6c34\u679c2(\u897f\u74dc,\u83e0\u841d)"),
                        o.gameSound.push("\u5207\u6c34\u679c3(\u67e0\u6aac,\u6a59\u5b50)"),
                        o.gameSound.push("\u5207\u6c34\u679c4(\u5947\u5f02\u679c,\u8349\u8393)"),
                        o.gameSound.push("\u80dc\u5229"),
                        o.gameSound.push("\u70b9\u51fb\u5f00\u59cb\u6e38\u620f"),
                        o.gameSound.push("\u5f00\u59cb\u6e38\u620f\u9875\u9762")
                }
                ,
                t.prototype.start = function () { }
                ,
                t.prototype.playBgmSound = function (e, t) {
                    void 0 === t && (t = !0),
                        console.log("--playBgmSound--------------", e),
                        cc.audioEngine.stopMusic(),
                        cc.loader.loadRes(o.gameSound[e - 1], cc.AudioClip, null, function (e, o) {
                            console.log("\u97f3\u6548\u52a0\u8f7d\u5b8c\u6210", e, o),
                                cc.audioEngine.playMusic(o, t)
                        })
                }
                ,
                t.prototype.playEffectSound = function (e, t) {
                    void 0 === t && (t = !1),
                        console.log("playEffectSound", e);
                    var a = 0;
                    return cc.loader.loadRes(o.gameSound[e - 1], cc.AudioClip, null, function (e, o) {
                        console.log("\u97f3\u6548\u52a0\u8f7d\u5b8c\u6210", e, o),
                            a = cc.audioEngine.playEffect(o, t)
                    }),
                        a
                }
                ,
                t.gameSound = [],
                t = o = __decorate([i], t)
        } (cc.Component);
        o.default = n,
            cc._RF.pop()
    }
        , {}],
    start: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "e1b90/rohdEk4SdmmEZANaD", "start"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = a.property
            , s = e("./event")
            , r = e("./weChatApi/WXApi")
            , c = e("./soundMrg")
            , d = e("./gameData")
            , l = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.sbtn = null,
                        t.vbtn = null,
                        t.curWeapon = null,
                        t.wxNode = null,
                        t.storeNode = null,
                        t.dayNode = null,
                        t.leftnode = null,
                        t.kinfeSpAtlas = null,
                        t.isRewardMinLogin = !1,
                        t
                }
                return __extends(t, e),
                    t.prototype.onload = function () { }
                    ,
                    t.prototype.start = function () {
                        1 == r.default.isDouyin ? this.node.getChildByName("shece").active = !0 : this.node.getChildByName("shece").active = !1,
                            d.default.shareGameData.isFuritPartyMode = !1,
                            this.node.on("updataMoney", function (e) {
                                console.log("\u66f4\u65b0\u94b1"),
                                    this.updataMoney(),
                                    e.stopPropagation()
                            }, this),
                            c.default.suondMgrShader.playBgmSound(c.soundType.GameBgm, !0),
                            r.default.setSubCover(this.wxNode),
                            r.default.OpenAd("", 0, -1),
                            d.default.shareGameData.initSkinData(),
                            this.login(),
                            r.default.wondersdk.statevent("\u5f00\u59cb\u9875\u9762"),
                            1 == r.default.isTest ? this.node.getChildByName("testNode").active = !0 : this.node.getChildByName("testNode").active = !1
                    }
                    ,
                    t.prototype.login = function () {
                        var e = this;
                        if (0 == r.default.isBaiDu)
                            return d.default.shareGameData.lv = 5,
                                d.default.shareGameData.isOpenSwich = !0,
                                this.isDayliAttance(),
                                void this.showUI();
                        this.node.getChildByName("btnNode").active = !0,
                            r.default.HttpPost("/index.php/api/shui_guo_da_shi/Get_all_data", {
                                user_id: r.default.OpenId,
                                keys: "recordRewardCount,partyModelCount,isFirstLuckyDraw,all_phoneMoney,singelTime,enterTime,all_FriutTick,day_FriutTick,fruitBoss_Lv,curfruitBoss_blood,gold,cur_DayCount,food_arr,cur_arms_id,max_score,t_share,t_video,package_map,cur_MissionIDList"
                            }, function (t, o) {
                                if (console.log("-----------data", o),
                                    d.default.shareGameData.recordRewardCount = parseInt(o.recordRewardCount ? o.recordRewardCount : 2),
                                    d.default.shareGameData.isFirstLuckyDraw = parseInt(o.isFirstLuckyDraw ? o.isFirstLuckyDraw : 1),
                                    d.default.shareGameData.all_FriutTick = parseInt(o.all_FriutTick ? o.all_FriutTick : 0),
                                    d.default.shareGameData.day_FriutTick = parseInt(o.day_FriutTick ? o.day_FriutTick : 50),
                                    d.default.shareGameData.all_phoneMoney = parseInt(o.all_phoneMoney ? o.all_phoneMoney : 0),
                                    d.default.shareGameData.partyModelCount = parseInt(o.partyModelCount ? o.partyModelCount : 2),
                                    null != o.package_map && o.package_map.length > 0) {
                                    var a = JSON.parse(o.package_map);
                                    console.log("\u80cc\u5305\u6570\u636e444444", a),
                                        a.forEach(function (e) {
                                            1 == e.status && d.default.shareGameData.addOneSkinData(e.id)
                                        })
                                }
                                d.default.shareGameData.fruitBoss_Lv = parseInt(o.fruitBoss_Lv ? o.fruitBoss_Lv : 1),
                                    d.default.shareGameData.curfruitBoss_blood = parseInt(o.curfruitBoss_blood ? o.curfruitBoss_blood : d.default.shareGameData.getBossMaxBlood()),
                                    d.default.shareGameData.gold = parseInt(o.gold ? o.gold : 0);
                                var i = parseInt(o.max_score ? o.max_score : 1);
                                d.default.shareGameData.isUpdataRank(i),
                                    d.default.shareGameData.lv = i,
                                    e.parsFoodArryReport(o.food_arr),
                                    d.default.shareGameData.curSkinID = parseInt(o.cur_arms_id ? o.cur_arms_id : 1),
                                    d.default.shareGameData.t_video = parseInt(o.t_video ? o.t_video : 5),
                                    d.default.shareGameData.t_share = parseInt(o.t_share ? o.t_share : 2);
                                var n = parseInt(o.singelTime ? o.singelTime : 0)
                                    , s = parseInt(o.enterTime ? o.enterTime : 0);
                                if (d.default.shareGameData.cur_DayCount = parseInt(o.cur_DayCount ? o.cur_DayCount : 0),
                                    d.default.shareGameData.cur_DayCount = d.default.shareGameData.cur_DayCount,
                                    o.cur_MissionIDList) {
                                    var c = JSON.parse(o.cur_MissionIDList);
                                    console.log("\u89e3\u6790\u5173\u5361id--", c),
                                        d.default.missionData = c
                                }
                                r.default.HttpPost("/index.php/api/shui_guo_da_shi/Get_time", {
                                    user_id: r.default.OpenId
                                }, function (t, o) {
                                    console.log("\u65f6\u95f4--", o, s),
                                        o = Date.now() / 1e3;
                                    var a = {
                                        enterTime: Math.floor(Date.now() / 1e3)
                                    };
                                    r.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                        user_id: r.default.OpenId,
                                        data_info: JSON.stringify(a)
                                    }, function () {
                                        console.log("\u66f4\u65b0\u767b\u5f55\u6e38\u620f\u65f6\u95f4")
                                    });
                                    var i = new Date;
                                    i.setTime(1e3 * s),
                                        console.info("\u65f6\u95f4cur_DayCount111111", i.getFullYear(), i.getMonth(), i.getDate()),
                                        d.default.shareGameData.is_sign = 1,
                                        e.isRewardMinLogin = !1,
                                        Math.floor(o / 86400) - Math.floor(n / 86400) > 0 && d.default.shareGameData.cur_DayCount < 7 && (console.log("\u8de8\u5929"),
                                            d.default.shareGameData.is_sign = 0);
                                    var c = new Date;
                                    if (c.setTime(1e3 * o),
                                        console.info("\u65f6\u95f4cur_DayCount2222222", c.getFullYear(), c.getMonth(), c.getDate()),
                                        c.getFullYear() > i.getFullYear() || c.getMonth() > i.getMonth() || c.getDate() > i.getDate()) {
                                        console.log("\u5956\u5238\u91cd\u7f6e"),
                                            d.default.shareGameData.day_FriutTick = 50,
                                            d.default.shareGameData.t_share = 2,
                                            d.default.shareGameData.t_video = 5,
                                            e.isRewardMinLogin = !0,
                                            d.default.shareGameData.partyModelCount = 2;
                                        r.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                            user_id: r.default.OpenId,
                                            data_info: JSON.stringify({
                                                t_share: 2,
                                                t_video: 5,
                                                partyModelCount: 2,
                                                day_FriutTick: 50
                                            })
                                        }, function (e, t) {
                                            console.log("\u66f4\u65b0\u6e38\u620f\u6570\u636e")
                                        })
                                    }
                                    d.default.shareGameData.all_FriutTick >= 6600 && (console.log("\u6c34\u679c\u5708\u6700\u5927\u4e86", d.default.shareGameData.all_FriutTick),
                                        d.default.shareGameData.day_FriutTick = 0);
                                    var l = "Left:" + d.default.shareGameData.partyModelCount + "";
                                    d.default.shareGameData.lv > 4 ? (e.node.getChildByName("rightBtnNode").getChildByName("pic_suo").active = !1,
                                        e.node.getChildByName("rightBtnNode").getChildByName("partyBtn").opacity = 255,
                                        d.default.shareGameData.partyModelCount > 0 && (e.node.getChildByName("rightBtnNode").getChildByName("redPoint").active = !0)) : (e.node.getChildByName("rightBtnNode").getChildByName("redPoint").active = !1,
                                            e.node.getChildByName("rightBtnNode").getChildByName("pic_suo").active = !0,
                                            e.node.getChildByName("rightBtnNode").getChildByName("partyBtn").opacity = 130,
                                            l = "Cleaar Level 4"),
                                        console.log("\u6c34\u679c\u6a21\u5f0f\u6b21\u6570", l),
                                        e.node.getChildByName("rightBtnNode").getChildByName("cLabel").getComponent(cc.Label).string = l,
                                        e.isDayliAttance()
                                }),
                                    e.showUI()
                            }),
                            r.default.HttpPost("/index.php/api/shui_guo_da_shi/Get_user_info", {
                                user_id: r.default.OpenId
                            }, function (t, o) {
                                console.log("\u83b7\u53d6\u7528\u6237\u4fe1\u606f----", o.nickname, o.avatar),
                                    "\u767e\u5ea6\u7f51\u53cb" == o.nickname ? (r.default.user_nickName = "",
                                        r.default.user_avatar = "") : (r.default.user_nickName = o.nickname,
                                            r.default.user_avatar = o.avatar),
                                    r.default.CreateAuthorizeBtn(e.node.getChildByName("btnNode").getChildByName("rankBtn"), function () {
                                        console.log("\u6388\u6743\u6309\u94ae--", r.default.user_nickName, r.default.user_avatar),
                                            e.rankBtn()
                                    })
                            })
                    }
                    ,
                    t.prototype.parsFoodArryReport = function (e) {
                        if (d.default.missionReportArry = [],
                            e) {
                            for (var t = e.split("/"), o = 0; o < t.length; o++) {
                                t[o];
                                t[o] = t[o].split(",");
                                for (var a = 0; a < t[o].length; a++)
                                    t[o][a] = parseInt(t[o][a])
                            }
                            d.default.missionReportArry = t,
                                d.default.missionReportArry = d.default.missionReportArry.length > 3 ? [] : d.default.missionReportArry
                        }
                    }
                    ,
                    t.prototype.updataWeapon = function () {
                        this.node.getChildByName("curWeapon").getComponent(cc.Sprite).spriteFrame = this.kinfeSpAtlas.getSpriteFrame("a" + d.default.shareGameData.curSkinID)
                    }
                    ,
                    t.prototype.updataMoney = function () {
                        this.leftnode.getChildByName("moneyBg").getChildByName("cLabel").getComponent(cc.Label).string = d.default.shareGameData.gold.toString()
                    }
                    ,
                    t.prototype.showUI = function () {
                        1 == d.default.shareGameData.isGoDayWeapon && (d.default.shareGameData.isGoDayWeapon = !1,
                            this.showDay()),
                            0 == r.default.area_openSitch && (this.node.getChildByName("LeftNode1").getChildByName("huaFeiBtn").active = !0,
                                this.node.getChildByName("friutStore").active = !0,
                                1 == r.default.isLogin && (r.default.isLogin = !1,
                                    this.baoheUI())),
                            this.node.getChildByName("misiionBarNode").active = !0,
                            this.node.getChildByName("misiionBarNode").getComponent("misiionBarNode").init(d.default.shareGameData.lv),
                            this.updataWeapon(),
                            this.updataMoney(),
                            this.node.getChildByName("btnNode").getChildByName("startButton").rotation = 0,
                            this.node.getChildByName("btnNode").getChildByName("startButton").stopAllActions(),
                            this.node.getChildByName("btnNode").getChildByName("startButton").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1)))),
                            this.node.getChildByName("LeftNode1").getChildByName("huaFeiBtn").getChildByName("cLabel").getComponent(cc.Label).string = d.default.shareGameData.all_phoneMoney.toFixed(2),
                            1 == d.default.shareGameData.curIsHaveTresure ? this.node.getChildByName("LeftNode1").getChildByName("huaFeiBtn").getChildByName("icon_huafei_lingqu").active = !0 : this.node.getChildByName("LeftNode1").getChildByName("huaFeiBtn").getChildByName("icon_huafei_lingqu").active = !1,
                            r.default.GetLaunchParam(function (e) {
                                console.log("z\u542f\u52a8\u51fd\u6570", e);
                                e.scene;
                                e = e.query
                            })
                    }
                    ,
                    t.prototype.showBuyTip = function () {
                        for (var e = !1, t = 0; t < 4 && 1 != (e = d.default.shareGameData.isShowBuySkinTip(t + 1)); t++)
                            ;
                        console.log("\u662f\u5426\u663e\u793a", e),
                            this.node.getChildByName("btnNode").getChildByName("storeButton").getChildByName("redPoint").active = e
                    }
                    ,
                    t.prototype.dayCB = function () {
                        1 == r.default.isTest && (d.default.shareGameData.lv = 5,
                            d.default.shareGameData.fruitBoss_Lv = 1,
                            d.default.shareGameData.curfruitBoss_blood = 5,
                            d.default.missionData = [],
                            d.default.shareGameData.partyModelCount = 2),
                            r.default.wondersdk.statevent("\u5f00\u59cb-\u7b7e\u5230\u6309\u94ae"),
                            c.default.suondMgrShader.playEffectSound(c.soundType.Btn),
                            this.showDay()
                    }
                    ,
                    t.prototype.showDay = function () {
                        var e = this;
                        r.default.HideAuthorizeBtn(!1),
                            this.dayNode.active = !0,
                            this.dayNode.getComponent("dayNode").showUI(),
                            this.dayNode.getComponent("dayNode").setCallBack(function () {
                                e.updataMoney(),
                                    r.default.HideAuthorizeBtn(!0)
                            }),
                            this.dayNode.getComponent("dayNode").palayAct()
                    }
                    ,
                    t.prototype.isDayliAttance = function () {
                        var e = this;
                        console.log("\u8bf7\u6c42\u83b7\u53d6\u7b7e\u5230"),
                            console.log("\u7b7e\u5230\u6570\u636e+++ WXApi. login_count", d.default.shareGameData.is_sign, r.default.login_count),
                            (d.default.shareGameData.cur_DayCount < 7 || 7 == d.default.shareGameData.cur_DayCount && 0 == d.default.shareGameData.is_sign) && 0 == d.default.shareGameData.is_sign && (2 == r.default.isNewUser ? r.default.login_count >= 0 ? (r.default.login_count += 1,
                                this.scheduleOnce(function () {
                                    e.showDay()
                                }, .3)) : r.default.login_count += 1 : r.default.isNewUser = 2)
                    }
                    ,
                    t.prototype.startBtn = function () {
                        r.default.wondersdk.statevent("\u5f00\u59cb-\u5f00\u59cb\u6309\u94ae"),
                            s.default.addEventPos(s.eventID.startGame),
                            d.default.shareGameData.gameModel = 0,
                            this.startAct(!0, function () {
                                r.default.destroyAuthorizeBtn(),
                                    cc.director.loadScene("gameScene")
                            })
                    }
                    ,
                    t.prototype.storeBtn = function () {
                        var e = this;
                        r.default.wondersdk.statevent("\u5f00\u59cb-\u5546\u5e97\u6309\u94ae"),
                            c.default.suondMgrShader.playEffectSound(c.soundType.Btn),
                            r.default.HideAuthorizeBtn(!1);
                        var t = function () {
                            console.log("\u6253\u5f00\u5546\u5e97--\u76ae\u80a4\u6570\u636e"),
                                e.storeNode.active = !0,
                                e.storeNode.getChildByName("itemListNode").getComponent("store").setCloseCB(function () {
                                    r.default.HideAuthorizeBtn(!0),
                                        e.updataWeapon(),
                                        e.updataMoney()
                                }),
                                e.storeNode.getChildByName("itemListNode").getComponent("store").setGoGamefc(function () {
                                    r.default.destroyAuthorizeBtn(),
                                        cc.director.loadScene("gameScene")
                                }),
                                e.storeNode.getChildByName("itemListNode").getComponent("store").init(),
                                s.default.addEventPos(s.eventID.store)
                        };
                        r.default.isBaiDu,
                            t()
                    }
                    ,
                    t.prototype.rankBtn = function () {
                        r.default.CloseAd(),
                            this.node.getChildByName("rankNode").active = !0,
                            r.default.HideAuthorizeBtn(!1),
                            this.node.getChildByName("rankNode").getComponent("rankNode").setCallBack(function () {
                                r.default.HideAuthorizeBtn(!0),
                                    r.default.OpenAd("", 0, -1)
                            })
                    }
                    ,
                    t.prototype.toOtherGameCB = function (e, t) { }
                    ,
                    t.prototype.setBtnCB = function () {
                        this.node.getChildByName("setingNode").active = !0,
                            r.default.HideAuthorizeBtn(!1),
                            this.node.getChildByName("setingNode").getComponent("setingNode").setCallBack(function () {
                                r.default.HideAuthorizeBtn(!0)
                            })
                    }
                    ,
                    t.prototype.shareCB = function () {
                        r.default.wondersdk.statevent("\u5f00\u59cb-\u5206\u4eab\u6309\u94ae"),
                            c.default.suondMgrShader.playEffectSound(c.soundType.Btn),
                            r.default.OpenShare()
                    }
                    ,
                    t.prototype.changeModeBtn = function () { }
                    ,
                    t.prototype.closeNodeBtn = function (e, t) {
                        console.log(e.target),
                            e.target.getParent().active = !1
                    }
                    ,
                    t.prototype.showminiTipCB = function (e, t) {
                        r.default.wondersdk.statevent("\u5f00\u59cb-\u5c0f\u7a0b\u5e8f\u6309\u94ae"),
                            c.default.suondMgrShader.playEffectSound(c.soundType.Btn),
                            1 == t ? (this.node.getChildByName("btnNode").getChildByName("miniTipBtn").active = !1,
                                this.node.getChildByName("miniTips").active = !0,
                                this.node.getChildByName("miniTips").getChildByName("pic_tianjiaxiaochengxu").scale = 0,
                                this.node.getChildByName("miniTips").getChildByName("pic_tianjiaxiaochengxu").runAction(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1)))) : this.node.getChildByName("miniTips").active = !1
                    }
                    ,
                    t.prototype.showBaoheUI = function () {
                        1 == d.default.shareGameData.curIsHaveTresure ? (d.default.shareGameData.curIsHaveTresure = !1,
                            this.baoheUI()) : this.node.getChildByName("huafeiNode").active = !0
                    }
                    ,
                    t.prototype.baoheUI = function () {
                        var e = this;
                        this.node.getChildByName("LeftNode1").getChildByName("huaFeiBtn").getChildByName("icon_huafei_lingqu").active = !1,
                            this.node.getChildByName("baoheNode").active = !0,
                            this.node.getChildByName("baoheNode").getComponent("baohe").setRewardCB(function () {
                                d.default.shareGameData.isThree = !0,
                                    d.default.shareGameData.curThreeCount = 5
                            }),
                            this.node.getChildByName("baoheNode").getComponent("baohe").setcloseCallBack(function () {
                                e.node.getChildByName("LeftNode1").getChildByName("huaFeiBtn").getChildByName("cLabel").getComponent(cc.Label).string = d.default.shareGameData.all_phoneMoney.toFixed(2)
                            })
                    }
                    ,
                    t.prototype.partyBtn = function () {
                        if (console.log("\u8fdb\u5165Fruit Party\u6a21\u5f0f", d.default.shareGameData.partyModelCount),
                            d.default.shareGameData.lv <= 4)
                            d.default.shareGameData.showTip(16, 2);
                        else if (d.default.shareGameData.partyModelCount <= 0 && d.default.shareGameData.showTip(18, 2),
                            d.default.shareGameData.lv > 4 && d.default.shareGameData.partyModelCount > 0) {
                            d.default.shareGameData.partyModelCount = d.default.shareGameData.partyModelCount - 1;
                            var e = "Left:" + d.default.shareGameData.partyModelCount + "";
                            this.node.getChildByName("rightBtnNode").getChildByName("cLabel").getComponent(cc.Label).string = e;
                            var t = {
                                partyModelCount: d.default.shareGameData.partyModelCount
                            };
                            r.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: r.default.OpenId,
                                data_info: JSON.stringify(t)
                            }, function (e, t) {
                                console.log(" gameData.shareGameData.partyModelCount", d.default.shareGameData.partyModelCount)
                            }),
                                d.default.shareGameData.isFuritPartyMode = !0,
                                d.default.shareGameData.partyMoney = 0,
                                d.default.shareGameData.partyHealthy = 2,
                                r.default.destroyAuthorizeBtn(),
                                cc.director.loadScene("gameScene")
                        }
                    }
                    ,
                    t.prototype.startAct = function (e, t) {
                        if (1 == e) {
                            console.log("----startAct--------------------------", (cc.winSize.height - 1136) / 2),
                                this.node.getChildByName("misiionBarNode").runAction(cc.moveTo(.3, cc.v2(this.node.getChildByName("misiionBarNode").x, cc.winSize.height / 2 - 90))),
                                this.node.getChildByName("misiionBarNode").runAction(cc.scaleTo(.3, .6)),
                                this.node.getChildByName("logo").runAction(cc.moveTo(.4, cc.v2(this.node.getChildByName("logo").x, cc.winSize.height + 150))),
                                this.node.getChildByName("btnNode").runAction(cc.moveTo(.3, cc.v2(this.node.getChildByName("btnNode").x, .5 * -cc.winSize.height - 100))),
                                this.curWeapon.getComponent(cc.Animation).stop("curWeapon"),
                                this.curWeapon.runAction(cc.sequence(cc.moveTo(.3, cc.v2(this.curWeapon.x, -320 - (cc.winSize.height - 1136) / 2)), cc.callFunc(function () {
                                    t()
                                }))),
                                this.node.getChildByName("leftGame").runAction(cc.moveBy(.3, cc.v2(-150, this.node.getChildByName("leftGame").y))),
                                this.node.getChildByName("LeftNode1").runAction(cc.moveBy(.3, cc.v2(-150, this.node.getChildByName("leftGame").y))),
                                this.node.getChildByName("rightBtnNode").runAction(cc.moveBy(.3, cc.v2(150, this.node.getChildByName("rightBtnNode").y))),
                                this.node.getChildByName("oneGame").runAction(cc.moveBy(.3, cc.v2(150, this.node.getChildByName("rightBtnNode").y)))
                        }
                    }
                    ,
                    t.prototype.editorCB = function (e, t) {
                        var o = this;
                        console.log("----", e.string, t);
                        var a = {};
                        1 == t ? (d.default.shareGameData.all_FriutTick += parseInt(e.string),
                            d.default.shareGameData.cur_getFriutTick = 0,
                            a = {
                                all_FriutTick: d.default.shareGameData.all_FriutTick
                            }) : (d.default.shareGameData.all_phoneMoney += parseInt(e.string),
                                a = {
                                    all_phoneMoney: d.default.shareGameData.all_phoneMoney
                                }),
                            r.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                user_id: r.default.OpenId,
                                data_info: JSON.stringify(a)
                            }, function (e, t) {
                                o.node.getChildByName("LeftNode1").getChildByName("huaFeiBtn").getChildByName("cLabel").getComponent(cc.Label).string = d.default.shareGameData.all_phoneMoney.toFixed(2)
                            })
                    }
                    ,
                    t.prototype.suondTestBtnCB = function () { }
                    ,
                    __decorate([n(cc.Node)], t.prototype, "sbtn", void 0),
                    __decorate([n(cc.Node)], t.prototype, "vbtn", void 0),
                    __decorate([n(cc.Node)], t.prototype, "curWeapon", void 0),
                    __decorate([n(cc.Node)], t.prototype, "wxNode", void 0),
                    __decorate([n(cc.Node)], t.prototype, "storeNode", void 0),
                    __decorate([n(cc.Node)], t.prototype, "dayNode", void 0),
                    __decorate([n(cc.Node)], t.prototype, "leftnode", void 0),
                    __decorate([n(cc.SpriteAtlas)], t.prototype, "kinfeSpAtlas", void 0),
                    t = __decorate([i], t)
            } (cc.Component);
        o.default = l,
            cc._RF.pop()
    }
        , {
        "./event": "event",
        "./gameData": "gameData",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    storeHead: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "92fc3dLEzlPd6hJthW4sLMl", "storeHead"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("../gameData")
            , i = cc._decorator
            , n = i.ccclass
            , s = i.property
            , r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.bgArry = [],
                        t.state = 0,
                        t.curID = 0,
                        t.page = 0,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.init = function (e, t, o) {
                        this.curID = e,
                            this.node.getChildByName("sp").getComponent(cc.Sprite).spriteFrame = o,
                            this.page = t,
                            5 == t && (this.node.getChildByName("sp").rotation = 0)
                    }
                    ,
                    t.prototype.showTipsnode = function (e) {
                        this.state = e,
                            this.node.getChildByName("select").active = !1,
                            3 == e && (this.node.getChildByName("select").active = !0);
                        var t = 0;
                        4 == e && (t = 1),
                            this.node.getComponent(cc.Sprite).spriteFrame = this.bgArry[t],
                            1 == e ? (this.node.getChildByName("sp").color = cc.color(100, 100, 100),
                                this.node.color = cc.color(100, 100, 100),
                                this.node.scale = .9) : (this.node.getChildByName("sp").color = cc.color(255, 255, 255),
                                    this.node.color = cc.color(255, 255, 255),
                                    this.node.scale = 1)
                    }
                    ,
                    t.prototype.isShowUsingTip = function () {
                        for (var e = !1, t = 0; t < a.default.skinMap.length; t++) {
                            var o = a.default.skinMap[t];
                            if (this.curID == o.id && 1 == o.status) {
                                e = !0;
                                break
                            }
                        }
                        e ? this.showLock() : (this.showPrice(),
                            this.page),
                            this.curID == a.default.shareGameData.curSkinID && this.showUsing()
                    }
                    ,
                    t.prototype.showPrice = function () {
                        this.showTipsnode(1)
                    }
                    ,
                    t.prototype.showUsing = function () {
                        this.showTipsnode(3)
                    }
                    ,
                    t.prototype.showLock = function () {
                        this.showTipsnode(2)
                    }
                    ,
                    t.prototype.showSelect = function () {
                        this.showTipsnode(4)
                    }
                    ,
                    t.prototype.addEvent = function () {
                        this.node.on(cc.Node.EventType.TOUCH_END, this.touchHead, this)
                    }
                    ,
                    t.prototype.touchHead = function () {
                        if (console.log("this.state--", this.state),
                            1 != this.state) {
                            var e = new cc.Event.EventCustom("select", !0);
                            e.setUserData(this.node),
                                this.node.dispatchEvent(e)
                        }
                    }
                    ,
                    __decorate([s(cc.SpriteFrame)], t.prototype, "bgArry", void 0),
                    t = __decorate([n], t)
            } (cc.Component);
        o.default = r,
            cc._RF.pop()
    }
        , {
        "../gameData": "gameData"
    }],
    store: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "06fcd8utANN2KDt3wXXjPBK", "store"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("../gameData")
            , i = e("../gameConfig")
            , n = e("../soundMrg")
            , s = e("../weChatApi/WXApi")
            , r = cc._decorator
            , c = r.ccclass
            , d = r.property
            , l = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.getNode = null,
                        t.headItem = null,
                        t.content = null,
                        t.content2 = null,
                        t.priceLb = null,
                        t.n1 = null,
                        t.n2 = null,
                        t.goGameFc = null,
                        t.itemsArry = [],
                        t.closeFCB = null,
                        t.isFinshBuy = !0,
                        t.isRequst = !1,
                        t.curPage = 0,
                        t.maxPage = 5,
                        t.curSelectID = 0,
                        t.curWeapon = null,
                        t.curSelectWeapon = null,
                        t.allKnifeTexturePlist = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () {
                        this.node.on("select", function (e) {
                            var t = e.getUserData();
                            e.stopPropagation(),
                                this.curSelectID = t.getComponent("storeHead").curID,
                                this.curSelectWeapon && this.curSelectWeapon.getComponent("storeHead").showTipsnode(2),
                                this.curSelectWeapon = t,
                                this.eqWeaponBtn()
                        }, this),
                            this.node.on("useHead", function (e) {
                                var t = e.getUserData();
                                e.stopPropagation(),
                                    this.useHead(t.getComponent("storeHead").curID)
                            }, this)
                    }
                    ,
                    t.prototype.onEnable = function () {
                        this.node.getChildByName("useWeaponBtn").active = !1
                    }
                    ,
                    t.prototype.updataMoney = function () {
                        var e = this;
                        console.log("\u66f4\u65b0\u91d1\u5e01\u6570", a.default.shareGameData.gold),
                            this.priceLb.getComponent(cc.Label).string = a.default.shareGameData.gold.toString(),
                            this.scheduleOnce(function () {
                                e.node.getChildByName("momenyBg").width = 100 + e.priceLb.width
                            })
                    }
                    ,
                    t.prototype.updataTick = function () {
                        this.n1.getChildByName("viewBtn").getChildByName("cLabel1").getComponent(cc.Label).string = "Left:" + a.default.shareGameData.t_video + ""
                    }
                    ,
                    t.prototype.init = function () {
                        s.default.CloseAd(),
                            this.isFinshBuy = !0,
                            this.updataTick();
                        for (var e = 0; e < this.n1.getChildByName("btnNode").children.length; e++) {
                            if (e < 4)
                                (c = this.n1.getChildByName("btnNode").children[e]).getChildByName("cost").getComponent(cc.Label).string = i.default.storeConfig_.json.pageCostList[e]
                        }
                        this.updataMoney(),
                            this.updataBtnState(this.curPage);
                        var t = i.default.storeConfig_.json.storeList;
                        this.content.children.forEach(function (e) {
                            e.removeAllChildren()
                        }),
                            this.itemsArry = [];
                        var o = 0
                            , n = -1;
                        for (e = 0; e < t.length; e++) {
                            if ((c = t[e]).page > 0) {
                                n < c.page - 1 && (n = c.page - 1,
                                    o = 0);
                                var r = cc.instantiate(this.headItem);
                                c.ID == a.default.shareGameData.curSkinID && (this.curWeapon = r),
                                    r.setParent(this.content.children[n]),
                                    r.position = cc.v2(o % 4 * 105 - 157.5, 172 - 106 * Math.floor(o / 4)),
                                    r.getComponent("storeHead").init(c.ID, c.page, this.allKnifeTexturePlist.getSpriteFrame("a" + c.ID)),
                                    r.getComponent("storeHead").addEvent(),
                                    r.getComponent("storeHead").isShowUsingTip(),
                                    this.itemsArry.push(r),
                                    o += 1
                            }
                        }
                        this.content2.children.forEach(function (e) {
                            e.removeAllChildren()
                        }),
                            o = 0,
                            n = -1;
                        for (e = 0; e < t.length; e++) {
                            var c;
                            if ((c = t[e]).page < 0) {
                                n < Math.abs(c.page) - 1 && (n = Math.abs(c.page) - 1,
                                    o = 0);
                                r = cc.instantiate(this.headItem);
                                c.ID == a.default.shareGameData.curSkinID && (this.curWeapon = r),
                                    r.setParent(this.content2.children[n]),
                                    r.position = cc.v2(o % 4 * 105 - 157.5, 172 - 106 * Math.floor(o / 4)),
                                    r.getComponent("storeHead").init(c.ID, c.page, this.allKnifeTexturePlist.getSpriteFrame("a" + c.ID)),
                                    r.getComponent("storeHead").addEvent(),
                                    r.getComponent("storeHead").isShowUsingTip(),
                                    o += 1
                            }
                        }
                        this.curSelectID = a.default.shareGameData.curSkinID,
                            this.isEqWeapon(a.default.shareGameData.curSkinID),
                            this.node.getChildByName("curWeapon").getComponent(cc.Sprite).spriteFrame = this.allKnifeTexturePlist.getSpriteFrame("a" + a.default.shareGameData.curSkinID)
                    }
                    ,
                    t.prototype.setGoGamefc = function (e) {
                        this.goGameFc = e
                    }
                    ,
                    t.prototype.gotoGameBtn = function () {
                        this.goGameFc && (this.goGameFc(this.curSelectID),
                            this.goGameFc = null)
                    }
                    ,
                    t.prototype.selectUIBtn = function (e, t) {
                        1 == t ? (this.n1.active = !0,
                            this.n2.active = !1) : (this.n1.active = !1,
                                this.n2.active = !0)
                    }
                    ,
                    t.prototype.isEqWeapon = function (e) {
                        this.updataEqBtn(!1)
                    }
                    ,
                    t.prototype.updataEqBtn = function (e) {
                        this.node.getChildByName("useWeaponBtn").active = e,
                            this.node.getChildByName("curWeaponTip").active = !e
                    }
                    ,
                    t.prototype.eqWeaponBtn = function () {
                        this.useHead(this.curSelectID),
                            this.updataEqBtn(!1),
                            this.curWeapon.getComponent("storeHead").showTipsnode(2),
                            this.curSelectWeapon && (this.curSelectWeapon.getComponent("storeHead").showTipsnode(3),
                                this.curWeapon = this.curSelectWeapon,
                                this.curSelectWeapon = null)
                    }
                    ,
                    t.prototype.useHead = function (e) {
                        var t = this;
                        s.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_game_data", {
                            user_id: s.default.OpenId,
                            key: "cur_arms_id",
                            data_info: e
                        }, function () {
                            console.log("\u4f7f\u7528\u5934\u50cf", e),
                                a.default.shareGameData.curSkinID = e;
                            for (var o = 0; o < t.itemsArry.length; o++) {
                                t.itemsArry[o].getComponent("storeHead").isShowUsingTip()
                            }
                            t.node.getChildByName("curWeapon").getComponent(cc.Sprite).spriteFrame = t.allKnifeTexturePlist.getSpriteFrame("a" + a.default.shareGameData.curSkinID)
                        })
                    }
                    ,
                    t.prototype.setCloseCB = function (e) {
                        this.closeFCB = e
                    }
                    ,
                    t.prototype.closeCB = function () {
                        this.closeFCB && (this.closeFCB(),
                            this.closeFCB = null),
                            this.node.getParent().active = !1,
                            s.default.OpenAd()
                    }
                    ,
                    t.prototype.lOrRPage = function (e, t) {
                        2 == t ? this.curPage < this.maxPage - 1 && (this.curPage += 1,
                            this.n1.getChildByName("PageView").getComponent(cc.PageView).scrollToPage(this.curPage, .3),
                            this.updataBtnState(this.curPage)) : 1 == t && this.curPage > 0 && (this.curPage -= 1,
                                this.n1.getChildByName("PageView").getComponent(cc.PageView).scrollToPage(this.curPage, .3),
                                this.updataBtnState(this.curPage))
                    }
                    ,
                    t.prototype.turnPageCB = function (e, t) {
                        var o = e.node.getComponent(cc.PageView).getCurrentPageIndex();
                        console.log("\u9875\u6570", o),
                            this.curPage = o,
                            this.updataBtnState(o)
                    }
                    ,
                    t.prototype.updataBtnState = function (e) {
                        var t = this.n1.getChildByName("btnNode");
                        t.children.forEach(function (e) {
                            e.active = !1
                        }),
                            1 == a.default.shareGameData.isAllWeapon(e + 1) ? t.children[t.children.length - 1].active = !0 : t.children[e].active = !0,
                            this.n1.getChildByName("viewBtn").active = 4 != e
                    }
                    ,
                    t.prototype.romdonBuyCB = function (e, t) {
                        if (0 != this.isFinshBuy) {
                            s.default.wondersdk.statevent("\u6b66\u5668\u8d2d\u4e70_" + t),
                                n.default.suondMgrShader.playEffectSound(n.soundType.Btn);
                            var o = i.default.storeConfig_.json.pageCostList[t - 1];
                            this.isBuy(o, t)
                        }
                    }
                    ,
                    t.prototype.isBuy = function (e, t) {
                        var o = this;
                        if (a.default.shareGameData.gold >= e) {
                            this.isFinshBuy = !1;
                            for (var n = [], r = (i.default.storeConfig_.json,
                                0); r < a.default.skinMap.length; r++) {
                                var c = a.default.skinMap[r];
                                c.page == t && 0 == c.status && n.push(c.id)
                            }
                            var d = n[Math.floor(Math.random() * n.length)];
                            a.default.shareGameData.addOneSkinData(d),
                                console.log("\u672a\u4e70\u7684---", n.length, n),
                                a.default.shareGameData.gold -= e;
                            var l = {
                                gold: a.default.shareGameData.gold,
                                package_map: a.default.skinMap
                            };
                            console.log("\u8d2d\u4e70\u76ae\u80a4-----1111\uff1a", l),
                                s.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                    user_id: s.default.OpenId,
                                    data_info: JSON.stringify(l)
                                }, function (e, a) {
                                    o.updataMoney(),
                                        o.buyAct(t, d),
                                        o.updataBtnState(t - 1)
                                })
                        } else
                            console.log("\u91d1\u5e01\u4e0d\u8db3\uff1a", e),
                                a.default.shareGameData.showTip(5, 2)
                    }
                    ,
                    t.prototype.buyAct = function (e, t) {
                        for (var o, n = this, s = 0, r = -1, c = i.default.storeConfig_.json.pageCount[e - 1], d = !1, l = 0; l < a.default.skinMap.length; l++) {
                            var u = a.default.skinMap[l];
                            if (u.page == e && (-1 == r && (r = l),
                                0 == d && (s += 1),
                                t == u.id && (d = !0)),
                                u.page > e)
                                break
                        }
                        o = r + c - 1;
                        var h = 0;
                        s < 5 && (h = 5 - s);
                        console.log(r, o, s, h),
                            console.log("\u7b2c\u4e00\u8f6e\u51cf\u901f", h);
                        var p = 0
                            , f = function (e) {
                                var a = m.itemsArry[e];
                                h >= o - e && (p += .2),
                                    .22 + p,
                                    a.stopAllActions();
                                var i = a.scale;
                                e == o - 1 ? a.runAction(cc.sequence(cc.delayTime(.1 * (e - r) + p), cc.scaleTo(.06, i + .15), cc.scaleTo(.06, i), cc.callFunc(function () {
                                    p -= .2,
                                        h = h > 0 ? s : 5,
                                        console.log("\u7b2c2\u8f6e\u51cf\u901f", h);
                                    for (var e = r; e < r + s; e++) {
                                        var o = n.itemsArry[e];
                                        h >= r + s - e && (p += .2),
                                            .2 + p;
                                        var a = o.scale;
                                        o.stopAllActions(),
                                            e == r + s - 1 ? o.runAction(cc.sequence(cc.delayTime(.1 * (e - r) + p), cc.scaleTo(.06, i + .15), cc.scaleTo(.06, i), cc.callFunc(function () {
                                                for (var e = 0; e < n.itemsArry.length; e++) {
                                                    var o = n.itemsArry[e];
                                                    if (o.getComponent("storeHead").curID == t) {
                                                        o.getComponent("storeHead").showLock();
                                                        break
                                                    }
                                                }
                                                var a = n.itemsArry[r + s - 1];
                                                a.getChildByName("sp").stopAllActions(),
                                                    a.getChildByName("sp").runAction(cc.sequence(cc.rotateBy(.3, 360), cc.callFunc(function () {
                                                        n.isFinshBuy = !0
                                                    })))
                                            }))) : o.runAction(cc.sequence(cc.delayTime(.1 * (e - r) + p), cc.scaleTo(.06, a + .15), cc.scaleTo(.06, a)))
                                    }
                                }))) : a.runAction(cc.sequence(cc.delayTime(.1 * (e - r) + p), cc.scaleTo(.06, i + .15), cc.scaleTo(.06, i)))
                            }
                            , m = this;
                        for (l = r; l < o; l++)
                            f(l)
                    }
                    ,
                    t.prototype.shareBtnCB = function (e, t) {
                        //todo  视频解锁

                        var o = this
                            , i = function (e) {
                                var t = {};
                                1 == e ? (a.default.shareGameData.t_video -= 1,
                                    t.t_video = a.default.shareGameData.t_video) : (a.default.shareGameData.gold += 666,
                                        a.default.shareGameData.t_share -= 1,
                                        t.t_share = a.default.shareGameData.t_share),
                                    t.gold = a.default.shareGameData.gold,
                                    o.updataTick(),
                                    o.isBuy(0, o.curPage + 1),
                                    s.default.HttpPost("/index.php/api/shui_guo_da_shi/Save_multi_game_data", {
                                        user_id: s.default.OpenId,
                                        data_info: JSON.stringify(t)
                                    }, function (e, t) {
                                        console.log("\u6210\u529f\u9886\u53d6\u4f53\u9a8c\u6e38\u620f\u7684\u5956\u52b1")
                                    })
                            };
                        1 == t ? 1 == a.default.shareGameData.isAllWeapon(this.curPage + 1) ? a.default.shareGameData.showTip(22, 2) : a.default.shareGameData.t_video > 0 ? (s.default.wondersdk.statevent("\u6b66\u5668\u8d2d\u4e70_\u89c6\u9891\u5206\u4eab"),
                            s.default.OpenAdVides(function () {
                                i(t)
                            })) : a.default.shareGameData.showTip(18, 2) : a.default.shareGameData.t_share > 0 ? (s.default.wondersdk.statevent("\u6b66\u5668\u8d2d\u4e70_\u666e\u901a\u5206\u4eab"),
                                s.default.OpenShare(1, {}, !1, !1, function () {
                                    i(t)
                                })) : a.default.shareGameData.showTip(18, 2)
                    }
                    ,
                    __decorate([d(cc.Prefab)], t.prototype, "getNode", void 0),
                    __decorate([d(cc.Prefab)], t.prototype, "headItem", void 0),
                    __decorate([d(cc.Node)], t.prototype, "content", void 0),
                    __decorate([d(cc.Node)], t.prototype, "content2", void 0),
                    __decorate([d(cc.Node)], t.prototype, "priceLb", void 0),
                    __decorate([d(cc.Node)], t.prototype, "n1", void 0),
                    __decorate([d(cc.Node)], t.prototype, "n2", void 0),
                    __decorate([d(cc.SpriteAtlas)], t.prototype, "allKnifeTexturePlist", void 0),
                    t = __decorate([c], t)
            } (cc.Component);
        o.default = l,
            cc._RF.pop()
    }
        , {
        "../gameConfig": "gameConfig",
        "../gameData": "gameData",
        "../soundMrg": "soundMrg",
        "../weChatApi/WXApi": "WXApi"
    }],
    surprisedNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "41f6bW8jyhPHafBStHWcSHD", "surprisedNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./gameData")
            , n = e("./soundMrg")
            , s = cc._decorator
            , r = s.ccclass
            , c = s.property
            , d = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.allKnifeTexturePlist = null,
                        t.styleSpf = [],
                        t.iconSpf = [],
                        t.cNode = null,
                        t.label = null,
                        t.cCount = 0,
                        t.nType = 1,
                        t.callBack = null,
                        t.closecallBack = null,
                        t
                }
                return __extends(t, e),
                    t.prototype.start = function () { }
                    ,
                    t.prototype.showUI = function (e, t, o) {
                        var s = this;
                        void 0 === t && (t = 1),
                            void 0 === o && (o = !1),
                            this.nType = t,
                            this.label.string = "X" + e,
                            0 == a.default.isShowViewIcon ? this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getChildByName("icon").active = !1 : this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getChildByName("icon").active = o,
                            1 == t ? (n.default.suondMgrShader.playEffectSound(n.soundType.money),
                                this.cNode.getChildByName("txt_01").getComponent(cc.Label).string = "Good Shoot",
                                this.cNode.getChildByName("txt_09").getComponent(cc.Label).string = "Good Shoot! ! !",
                                this.cNode.getChildByName("txt_06").getComponent(cc.Label).string = "Surprise",
                                this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getComponent(cc.Sprite).spriteFrame = this.styleSpf[0]) : 2 == t ? (n.default.suondMgrShader.playEffectSound(n.soundType.money),
                                    this.cNode.getChildByName("txt_01").getComponent(cc.Label).string = "Congratulations",
                                    this.cNode.getChildByName("txt_09").getComponent(cc.Label).string = "A lot of gold",
                                    this.cNode.getChildByName("txt_06").getComponent(cc.Label).string = "",
                                    this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getComponent(cc.Sprite).spriteFrame = this.styleSpf[1]) : 3 == t ? (n.default.suondMgrShader.playEffectSound(n.soundType.money),
                                        this.label.string = e + "\u5143",
                                        this.cNode.getChildByName("icon_jinbi_02").scale = 2,
                                        this.cNode.getChildByName("icon_jinbi_02").getComponent(cc.Sprite).spriteFrame = this.iconSpf[1],
                                        this.cNode.getChildByName("txt_01").getComponent(cc.Label).string = "Congratulations",
                                        this.cNode.getChildByName("txt_09").getComponent(cc.Label).string = "",
                                        this.cNode.getChildByName("txt_06").getComponent(cc.Label).string = "\u8bdd\u8d39\u603b\u989d\uff1a" + i.default.shareGameData.all_phoneMoney + "\u5143",
                                        this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getComponent(cc.Sprite).spriteFrame = this.styleSpf[1]) : 4 == t ? (n.default.suondMgrShader.playEffectSound(n.soundType.money),
                                            this.cNode.getChildByName("icon_jinbi_02").scale = 2,
                                            this.cNode.getChildByName("icon_jinbi_02").getComponent(cc.Sprite).spriteFrame = this.iconSpf[2],
                                            this.cNode.getChildByName("txt_01").getComponent(cc.Label).string = "Congratulations",
                                            this.cNode.getChildByName("txt_09").getComponent(cc.Label).string = "Large fruit circle",
                                            this.cNode.getChildByName("txt_06").getComponent(cc.Label).string = "",
                                            this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getComponent(cc.Sprite).spriteFrame = this.styleSpf[1]) : 5 == t ? (n.default.suondMgrShader.playEffectSound(n.soundType.money),
                                                this.cNode.getChildByName("txt_01").getComponent(cc.Label).string = "Congratulations",
                                                this.cNode.getChildByName("txt_09").getComponent(cc.Label).string = "Fruit Party",
                                                this.cNode.getChildByName("txt_06").getComponent(cc.Label).string = "A lot of gold",
                                                this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getComponent(cc.Sprite).spriteFrame = this.styleSpf[2]) : 6 == t ? (this.label.string = "x1",
                                                    n.default.suondMgrShader.playEffectSound(n.soundType.money),
                                                    this.cNode.getChildByName("icon_jinbi_02").scale = 1.3,
                                                    this.cNode.getChildByName("icon_jinbi_02").getComponent(cc.Sprite).spriteFrame = this.allKnifeTexturePlist.getSpriteFrame("a" + e),
                                                    this.cNode.getChildByName("txt_01").getComponent(cc.Label).string = "Mission",
                                                    this.cNode.getChildByName("txt_09").getComponent(cc.Label).string = "Powerful weapon",
                                                    this.cNode.getChildByName("txt_06").getComponent(cc.Label).string = "",
                                                    this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getComponent(cc.Sprite).spriteFrame = this.styleSpf[1]) : 7 == t && (n.default.suondMgrShader.playEffectSound(n.soundType.money),
                                                        this.cNode.getChildByName("txt_01").getComponent(cc.Label).string = "Surprise",
                                                        this.cNode.getChildByName("txt_09").getComponent(cc.Label).string = "One more",
                                                        this.cNode.getChildByName("txt_06").getComponent(cc.Label).string = "",
                                                        this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").getComponent(cc.Sprite).spriteFrame = this.styleSpf[0]),
                            this.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").stopAllActions(),
                            this.node.getChildByName("pic_tanchuang_bg").scale = 0,
                            this.node.getChildByName("pic_tanchuang_bg").stopAllActions(),
                            this.node.getChildByName("pic_tanchuang_bg").runAction(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1), cc.callFunc(function () {
                                s.node.getChildByName("pic_tanchuang_bg").getChildByName("videoButton").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.2, 1.1), cc.scaleTo(.2, 1))))
                            })).easing(cc.easeIn(1)))
                    }
                    ,
                    t.prototype.closeCB = function () {
                        n.default.suondMgrShader.playEffectSound(n.soundType.Btn),
                            this.node.removeFromParent(),
                            this.closecallBack && (this.closecallBack(),
                                this.closecallBack = null)
                    }
                    ,
                    t.prototype.setclosecallBack = function (e) {
                        this.closecallBack = e
                    }
                    ,
                    t.prototype.setCallBack = function (e) {
                        this.callBack = e
                    }
                    ,
                    t.prototype.getCB = function () {
                        n.default.suondMgrShader.playEffectSound(n.soundType.Btn),
                            5 != this.nType && this.node.removeFromParent(),
                            this.callBack && this.callBack()
                    }
                    ,
                    __decorate([c(cc.SpriteAtlas)], t.prototype, "allKnifeTexturePlist", void 0),
                    __decorate([c(cc.SpriteFrame)], t.prototype, "styleSpf", void 0),
                    __decorate([c(cc.SpriteFrame)], t.prototype, "iconSpf", void 0),
                    __decorate([c(cc.Node)], t.prototype, "cNode", void 0),
                    __decorate([c(cc.Label)], t.prototype, "label", void 0),
                    t = __decorate([r], t)
            } (cc.Component);
        o.default = d,
            cc._RF.pop()
    }
        , {
        "./gameData": "gameData",
        "./soundMrg": "soundMrg",
        "./weChatApi/WXApi": "WXApi"
    }],
    threeGet: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "9de06kSV0JDHqjSrQpaaPar", "threeGet"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = e("./weChatApi/WXApi")
            , i = e("./gameData")
            , n = e("./knife")
            , s = e("./gameScene")
            , r = e("./event")
            , c = cc._decorator
            , d = c.ccclass
            , l = (c.property,
                function (e) {
                    function t() {
                        var t = null !== e && e.apply(this, arguments) || this;
                        return t.shareType = 0,
                            t.isGame = !1,
                            t
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.onEnable = function () { }
                        ,
                        t.prototype.onDisable = function () {
                            cc.director.resume()
                        }
                        ,
                        t.prototype.setTextureSp = function (e) { }
                        ,
                        t.prototype.setShareType = function (e) {
                            var t = this;
                            this.shareType = e,
                                this.node.getChildByName("bg").getChildByName("videoButton").stopAllActions(),
                                this.node.getChildByName("bg").scale = 0,
                                this.node.getChildByName("bg").stopAllActions(),
                                this.node.getChildByName("bg").runAction(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1), cc.callFunc(function () {
                                    t.node.getChildByName("bg").getChildByName("videoButton").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.2, 1.1), cc.scaleTo(.2, 1))))
                                })).easing(cc.easeIn(1)))
                        }
                        ,
                        t.prototype.closeCB = function () {
                            a.default.wondersdk.statevent("Avatar Close"),
                                this.node.active = !1,
                                1 == this.shareType && i.default.shareGameData.curExperienceSkinID > 0 && (s.default.shareGameScene.showTip(3, !1),
                                    i.default.shareGameData.curExperienceUseCount = 5,
                                    n.default.shareKnife.setKindfSkin(i.default.shareGameData.curExperienceSkinID))
                        }
                        ,
                        t.prototype.shareThreeKinfeCB = function (e, t) {
                            var o = this;
                            a.default.wondersdk.statevent("Avatar Vedio");
                            var r = function () {
                                o.node.active = !1,
                                    0 == o.shareType && (i.default.shareGameData.isThree = !0,
                                        i.default.shareGameData.curThreeCount = 5,
                                        n.default.shareKnife.clreaKinef(),
                                        n.default.shareKnife.resetKinfe(),
                                        n.default.shareKnife.initCountTip(),
                                        s.default.shareGameScene.showTip(1, !1))
                            }
                                , c = parseInt(t);
                            1 == c ? a.default.OpenShare(1, {}, !1, !1, function () {
                                r()
                            }) : 2 == c && (cc.director.pause(),
                                a.default.OpenAdVides(function () {
                                    r()
                                }))
                        }
                        ,
                        t.prototype.shareWeaponCB = function (e, t) {
                            var o = this
                                , c = function () {
                                    o.node.active = !1,
                                        1 == o.shareType && a.default.HttpPost("/api/sgkx/unLockSkin", {
                                            open_id: a.default.OpenId,
                                            skin_id: i.default.shareGameData.curExperienceSkinID
                                        }, function (e, t) {
                                            n.default.shareKnife.setKindfSkin(i.default.shareGameData.curExperienceSkinID),
                                                i.default.shareGameData.curSkinID = i.default.shareGameData.curExperienceSkinID,
                                                i.default.shareGameData.setSkinState(i.default.shareGameData.curSkinID, 1),
                                                i.default.shareGameData.curExperienceSkinID = null,
                                                s.default.shareGameScene.showTip(2, !1)
                                        })
                                };
                            if (1 == a.default.isBaiDu) {
                                var d = parseInt(t);
                                1 == d ? a.default.OpenShare(1, {}, !1, !1, function () {
                                    c(),
                                        e.addEventPos(r.eventID.mission_weapon_share)
                                }) : 2 == d && a.default.OpenAdVides(function () {
                                    c(),
                                        e.addEventPos(r.eventID.mission_weapon_video)
                                })
                            } else
                                c()
                        }
                        ,
                        t = __decorate([d], t)
                } (cc.Component));
        o.default = l,
            cc._RF.pop()
    }
        , {
        "./event": "event",
        "./gameData": "gameData",
        "./gameScene": "gameScene",
        "./knife": "knife",
        "./weChatApi/WXApi": "WXApi"
    }],
    tipNode: [function (e, t, o) {
        "use strict";
        cc._RF.push(t, "e3fa0+/LVhNqbS/2sEJvXjg", "tipNode"),
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
        var a = cc._decorator
            , i = a.ccclass
            , n = (a.property,
                function (e) {
                    function t() {
                        var t = null !== e && e.apply(this, arguments) || this;
                        return t.callBack = null,
                            t
                    }
                    return __extends(t, e),
                        t.prototype.start = function () { }
                        ,
                        t.prototype.setCallBack = function (e) {
                            this.callBack = e
                        }
                        ,
                        t.prototype.showTip = function (e, t) {
                            var o = this;
                            void 0 === t && (t = !1);
                            var a = 2 * e - 1 - 1;
                            4 == e ? a = 6 : 5 == e ? a = 7 : 6 == e ? a = 8 : e >= 9 ? a = e : 1 == t && (a = 2 * e - 1),
                                this.node.active = !0,
                                this.node.getChildByName("cLabel").getComponent(cc.Label).string = ["Get X5 with three swords", "Three swords with one hair", "Unlock new weapon", "Have this weapon", "Get experience with three swords with one hair", "End experience with three swords with one hair", "Resurrected", "Insufficient gold coin", "Content loading, etc. will try again", "Watch the video, then reward!", "Unfortunately, almost beat BOSS!", "Congratulations on getting new Weapons!", "Not enough fruit!", "The balance is insufficient!", "Successful exchange!", "It has been converted!", "Sorry, it hasn't been unlocked yet!", "Signed in today!", "Today's number has been exhausted", "Recording time is too short, please re-record", "Sharing failure", "Congratulations on getting 500 gold coins", "Current page weapons have been unlocked", "Today's reward opportunities have been used up, please try again tomorrow."][a],
                                this.node.opacity = 0,
                                this.scheduleOnce(function () {
                                    o.node.getChildByName("sp").width = o.node.getChildByName("cLabel").getContentSize().width + 50,
                                        o.node.opacity = 255,
                                        o.node.stopAllActions(),
                                        o.node.runAction(cc.moveBy(1.5, cc.v2(0, 100))),
                                        o.node.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(.5), cc.callFunc(function () {
                                            o.node.active = !1,
                                                o.callBack && (o.callBack(),
                                                    o.callBack = null)
                                        })))
                                }, .1)
                        }
                        ,
                        t = __decorate([i], t)
                } (cc.Component));
        o.default = n,
            cc._RF.pop()
    }
        , {}]
}, {}, ["Changemodel", "achItemTip", "config", "interceptor", "md5", "baohe", "baozhi", "bgEfc", "WonderJsSdk", "boss", "bossComeNode", "bossConbom", "bossNode", "conbomNode", "cutFood", "dayItem", "dayNode", "douyinhezi", "efc1", "efcPrefab", "event", "food", "foodArry", "friutTickStore", "gameConfig", "gameData", "gameOver", "gameScene", "huaFeiNode", "knife", "loading", "luckShoot", "luckyRotary", "misiionBarNode", "missionItem", "partNode", "passFoodReport", "passNode", "rankNode", "resurrection", "setingNode", "soundMrg", "start", "isBuy", "store", "storeHead", "surprisedNode", "threeGet", "tipNode", "bottomGame", "gameHead", "leftGame", "oneGame", "WXApi"]);
