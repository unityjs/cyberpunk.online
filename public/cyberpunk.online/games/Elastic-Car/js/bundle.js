(function() {
    "use strict";
    class Utils {
        constructor() {}
        addClickEvent(btn, caller, cb, soundId) {
            btn.offAllCaller(caller);
            if (btn instanceof Laya.Button) {
                let callback = function(event) {
                    event.stopPropagation();
                    if (cb) cb.call(caller, event);
                };
                btn.on(Laya.Event.CLICK, caller, callback);
            } else {
                let scaleTime = 60;
                let wRatio = 1;
                let aX = btn.anchorX;
                let aY = btn.anchorY;
                let posX = btn.x * wRatio;
                let posY = btn.y * wRatio;
                let sX = btn.scaleX * wRatio;
                let sY = btn.scaleX * wRatio;
                let sSize = .9 * wRatio;
                let cbDown = function(event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, {
                        scaleX: sSize,
                        scaleY: sSize
                    }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_DOWN, caller, cbDown);
                let cbUp = function(event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, {
                        scaleX: sX,
                        scaleY: sY
                    }, scaleTime);
                    if (cb) cb.call(caller, event);
                    (soundId === 0 || soundId) && LayaSample.soundMgr.play(soundId);
                };
                btn.on(Laya.Event.MOUSE_UP, caller, cbUp);
                let cbOut = function(event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, {
                        scaleX: sX,
                        scaleY: sY
                    }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_OUT, caller, cbOut);
            }
        }
        getRGB(_hexColor) {
            var color = [], rgb = [];
            let hexColor = _hexColor.replace(/#/, "");
            if (hexColor.length == 3) {
                var tmp = [];
                for (var i = 0; i < 3; i++) {
                    tmp.push(hexColor.charAt(i) + hexColor.charAt(i));
                }
                hexColor = tmp.join("");
            }
            for (var i = 0; i < 3; i++) {
                color[i] = "0x" + hexColor.substr(i * 2, 2);
                rgb.push(parseInt(color[i]));
            }
            return new Laya.Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
        }
        getRGBA(_hexColor, alpha) {
            let _alpha = alpha != 0 || !alpha ? 1 : alpha;
            var color = [], rgb = [];
            let hexColor = _hexColor.replace(/#/, "");
            if (hexColor.length == 3) {
                var tmp = [];
                for (var i = 0; i < 3; i++) {
                    tmp.push(hexColor.charAt(i) + hexColor.charAt(i));
                }
                hexColor = tmp.join("");
            }
            for (var i = 0; i < 3; i++) {
                color[i] = "0x" + hexColor.substr(i * 2, 2);
                rgb.push(parseInt(color[i]));
            }
            return new Laya.Vector4(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, _alpha);
        }
        tweenShake(target, tweenTimer) {
            let timeLine = new Laya.TimeLine();
            let pivotX = target.pivotX;
            target.pivotX = target.width / 2;
            timeLine.addLabel("shake1", 0).to(target, {
                rotation: target.rotation + 5
            }, 50, null, 0).addLabel("shake2", 0).to(target, {
                rotation: target.rotation - 6
            }, 50, null, 0).addLabel("shake3", 0).to(target, {
                rotation: target.rotation - 13
            }, 50, null, 0).addLabel("shake4", 0).to(target, {
                rotation: target.rotation + 3
            }, 50, null, 0).addLabel("shake5", 0).to(target, {
                rotation: target.rotation - 5
            }, 50, null, 0).addLabel("shake6", 0).to(target, {
                rotation: target.rotation + 2
            }, 50, null, 0).addLabel("shake7", 0).to(target, {
                rotation: target.rotation - 8
            }, 50, null, 0).addLabel("shake8", 0).to(target, {
                rotation: target.rotation + 3
            }, 50, null, 0).addLabel("shake9", 0).to(target, {
                rotation: 0
            }, 50, null, 0);
            if (!tweenTimer) {
                timeLine.on(Laya.Event.COMPLETE, this, function() {
                    timeLine.destroy();
                    target.rotation = 0;
                    target.pivotX = pivotX;
                });
            } else {
                Laya.timer.once(500, this, function() {
                    timeLine.destroy();
                    target.rotation = 0;
                    target.pivotX = pivotX;
                });
            }
            timeLine.play(0, true);
        }
        compareVersion(v1, v2) {
            v1 = v1.split(".");
            v2 = v2.split(".");
            const len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push("0");
            }
            while (v2.length < len) {
                v2.push("0");
            }
            for (let i = 0; i < len; i++) {
                const num1 = parseInt(v1[i]);
                const num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                } else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }
        setMaterial(model) {}
        format(timestamp) {
            function add0(m) {
                return m < 10 ? "0" + m : m;
            }
            var time = new Date(timestamp);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var date = time.getDate();
            return year + "-" + add0(month) + "-" + add0(date);
        }
        loadSubpackage(loadName, caller, cb) {
            if (Laya.Browser.onWeiXin) {
                wx["loadSubpackage"]({
                    name: loadName,
                    success: function(res) {
                        console.log("分包已加载成功： " + loadName);
                        cb.call(caller, res, true);
                    },
                    fail: function(res) {
                        console.error("分包加载失败： " + loadName);
                        cb.call(caller, res, false);
                    }
                });
            }
        }
        getRandoms(amount, max, min = 0) {
            let totalArray = [];
            let targetArray = [];
            for (var i = min; i < max; i++) {
                totalArray.push(i);
            }
            totalArray = totalArray.sort(() => Math.random() - Math.random());
            for (var i = 0; i < amount; i++) {
                targetArray.push(totalArray[i]);
            }
            return targetArray;
        }
    }
    class StorageMgr {
        constructor() {
            this._userData = null;
            this._userDataKey = "tian";
            this.init();
        }
        init() {
            this._userData = {
                isPlaySound: true,
                isPlayVibrate: true,
                isNoAds: false,
                levelID: 0,
                isCollect: false,
                level: 1
            };
            this.readStorage();
            this.initGameStatus();
            if (this._userData.isNoAds == undefined) this._userData.isNoAds = false;
        }
        readStorage() {
            let jsonUserData = Laya.LocalStorage.getItem(this._userDataKey);
            if (jsonUserData) this._userData = JSON.parse(jsonUserData);
        }
        writeStorage() {
            if (this._userData) Laya.LocalStorage.setItem(this._userDataKey, JSON.stringify(this._userData));
        }
        removeStorage() {
            Laya.LocalStorage.removeItem(this._userDataKey);
        }
        isNoAds() {
            return this._userData.isNoAds;
        }
        setNoAds(isNoAds) {
            this._userData.isNoAds = isNoAds;
            this.writeStorage();
        }
        isPlaySound() {
            return this._userData.isPlaySound;
        }
        setPlaySound(isPlaySound) {
            this._userData.isPlaySound = isPlaySound;
            this.writeStorage();
            if (isPlaySound) LayaSample.soundMgr.playBGM(); else LayaSample.soundMgr.stopBGM();
        }
        isPlayVibrate() {
            return this._userData.isPlayVibrate;
        }
        setPlayVibrate(isPlayVibrate) {
            this._userData.isPlayVibrate = isPlayVibrate;
            this.writeStorage();
        }
        setCollect(collect) {
            this._userData.isCollect = collect;
            this.writeStorage();
        }
        isCollect() {
            return this._userData.isCollect;
        }
        initGameStatus() {
            if (!this._userData.gameStatus) {
                this._userData.gameStatus = {};
            }
            if (!this._userData.gameStatus.maxLevel) {
                this._userData.gameStatus.maxLevel = 1;
            }
            if (!this._userData.gameStatus.maxScore) {
                this._userData.gameStatus.maxScore = 0;
            }
            if (!this._userData.gameStatus.gold) {
                this._userData.gameStatus.gold = 0;
            }
            if (!this._userData.signinTime) {
                this._userData.signinTime = 0;
            }
            if (!this._userData.skinTipsTime) {
                this._userData.skinTipsTime = 0;
            }
            this.writeStorage();
        }
        isSkinTips() {
            return Math.floor(this._userData.skinTipsTime / 86400) != Math.floor(Date.parse(new Date().toString()) / 864e5);
        }
        setSkinTips(isShow) {
            this._userData.skinTipsTime = isShow ? 0 : Math.floor(Date.parse(new Date().toString()) / 1e3);
            this.writeStorage();
        }
        setSigninTime(signinTime) {
            this._userData.signinTime = signinTime;
            this.writeStorage();
        }
        isSignin() {
            let isSignin = true;
            let signinTime = this._userData.signinTime;
            if (signinTime < 2) {
                isSignin = true;
            } else if (signinTime < 3) {
                isSignin = false;
            } else {
                isSignin = Math.floor(signinTime / 86400) == Math.floor(Date.parse(new Date().toString()) / 864e5);
            }
            return isSignin;
        }
        getSigninTime() {
            return this._userData.signinTime;
        }
        getGameStatus() {
            return this._userData.gameStatus;
        }
        setMaxLevel(level) {
            if (this._userData.gameStatus.maxLevel < level) {
                this._userData.gameStatus.maxLevel = level;
                this.writeStorage();
            }
        }
        getMaxLevel() {
            return this._userData.gameStatus.maxLevel;
        }
        addGold(gold) {
            this._userData.gameStatus.gold += gold;
            this.writeStorage();
        }
        setMaxScore(maxScore) {
            if (this._userData.gameStatus.maxScore < maxScore) {
                this._userData.gameStatus.maxScore = maxScore;
                this.writeStorage();
            }
        }
    }
    class SoundMgr {
        constructor() {
            this._bgmCtx = null;
            this._soundType = [ "horn1", "horn2", "horn3", "lose", "xingshi", "chaoche", "lianxu1", "lianxu2", "lianxu3", "lianxu4", "lianxu5", "daoju", "jiasu", "zuigaosu" ];
            this.hornTime = 0;
            this.hornLen = 2e3;
            this.ishasbuff = false;
            this.hasCarsound = false;
            this._pathRoot = "res/sound/";
            this._soundCtx = {};
            this._soundFile = [];
            for (var key in this._soundType) {
                let sound = this._soundType[key];
                this._soundFile.push(sound);
            }
        }
        init() {
            let path = this._pathRoot;
            let soundFile = this._soundFile;
            let soundCount = this._soundFile.length;
            let file = "";
            for (let i = 0; i < soundCount; ++i) {
                file = soundFile[i];
                let innerAudioContext = new Laya.SoundChannel();
                innerAudioContext.url = path + file + ".mp3";
                Laya.SoundManager.addChannel(innerAudioContext);
                this._soundCtx[file] = true;
            }
        }
        play(name, loop = 1) {
            if (this._soundCtx[name] && LayaSample.storageMgr.isPlaySound()) {
                Laya.SoundManager.playSound(this._pathRoot + name + ".mp3", loop);
            }
        }
        stop(name) {
            if (this._soundCtx[name]) {
                Laya.SoundManager.stopSound(this._pathRoot + name + ".mp3");
            }
        }
        playBGM() {
            let url = this._pathRoot + "bgm" + ".mp3";
            if (Laya.Browser.onWeiXin) {
                if (this._bgmCtx != null) {
                    this._bgmCtx.stop();
                    this._bgmCtx.destroy();
                    this._bgmCtx = null;
                }
                this._bgmCtx = wx.createInnerAudioContext();
                this._bgmCtx.src = url;
                this._bgmCtx.loop = true;
                LayaSample.storageMgr.isPlaySound() && this._bgmCtx.play();
            } else {
                Laya.SoundManager.stopMusic();
                Laya.SoundManager.playMusic(url, 0);
            }
        }
        stopBGM() {
            if (Laya.Browser.onWeiXin) {
                this._bgmCtx != null && this._bgmCtx.stop();
            } else {
                Laya.SoundManager.stopMusic();
            }
        }
        stopAll() {
            Laya.SoundManager.stopAll();
            this.stopBGM();
        }
        PlayHorn() {
            if (Laya.Browser.now() - this.hornTime > this.hornLen) {
                var soundName = "horn" + (1 + (Math.random() * 3 | 0));
                this.play(soundName);
                this.hornTime = Laya.Browser.now();
                this.hornLen = 5e3 + Math.random() * 8e3;
            }
        }
        stopHorn() {
            this.stop("horn1");
            this.stop("horn2");
            this.stop("horn3");
        }
        playHasBuff() {
            if (!this.ishasbuff) {
                this.play("zuigaosu", 1);
                this.ishasbuff = true;
            }
        }
        stopHasBuff() {
            if (this.ishasbuff) {
                this.stop("zuigaosu");
                this.ishasbuff = false;
            }
        }
        playCarSound(type) {
            if (!this.hasCarsound) {
                this.stopCarSound();
                this.play(type, 0);
                this.carsound = type;
            } else {
                if (this.carsound != type) {
                    this.stopCarSound();
                    this.play(type, 0);
                    this.carsound = type;
                }
            }
            this.hasCarsound = true;
        }
        stopCarSound() {
            if (this.hasCarsound) {
                this.stop("xingshi");
                this.stop("jiasu");
            }
            this.hasCarsound = false;
        }
    }
    class MD5 {
        static hex_md5(s) {
            return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
        }
        static b64_md5(s) {
            return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz));
        }
        static str_md5(s) {
            return this.binl2str(this.core_md5(this.str2binl(s), s.length * this.chrsz));
        }
        static hex_hmac_md5(key, data) {
            return this.binl2hex(this.core_hmac_md5(key, data));
        }
        static b64_hmac_md5(key, data) {
            return this.binl2b64(this.core_hmac_md5(key, data));
        }
        static str_hmac_md5(key, data) {
            return this.binl2str(this.core_hmac_md5(key, data));
        }
        static md5_vm_test() {
            return this.hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
        }
        static core_md5(x, len) {
            x[len >> 5] |= 128 << len % 32;
            x[(len + 64 >>> 9 << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        }
        static md5_cmn(q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        }
        static md5_ff(a, b, c, d, x, s, t) {
            return this.md5_cmn(b & c | ~b & d, a, b, x, s, t);
        }
        static md5_gg(a, b, c, d, x, s, t) {
            return this.md5_cmn(b & d | c & ~d, a, b, x, s, t);
        }
        static md5_hh(a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        static md5_ii(a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
        }
        static core_hmac_md5(key, data) {
            var bkey = this.str2binl(key);
            if (bkey.length > 16) bkey = this.core_md5(bkey, key.length * this.chrsz);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 909522486;
                opad[i] = bkey[i] ^ 1549556828;
            }
            var hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
            return this.core_md5(opad.concat(hash), 512 + 128);
        }
        static safe_add(x, y) {
            var lsw = (x & 65535) + (y & 65535);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 65535;
        }
        static bit_rol(num, cnt) {
            return num << cnt | num >>> 32 - cnt;
        }
        static str2binl(str) {
            var bin = Array();
            var mask = (1 << this.chrsz) - 1;
            for (var i = 0; i < str.length * this.chrsz; i += this.chrsz) bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << i % 32;
            return bin;
        }
        static binl2str(bin) {
            var str = "";
            var mask = (1 << this.chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += this.chrsz) str += String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
            return str;
        }
        static binl2hex(binarray) {
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 15);
            }
            return str;
        }
        static binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (binarray[i >> 2] >> 8 * (i % 4) & 255) << 16 | (binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 255) << 8 | binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 255;
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += this.b64pad; else str += tab.charAt(triplet >> 6 * (3 - j) & 63);
                }
            }
            return str;
        }
    }
    MD5.hexcase = 0;
    MD5.b64pad = "";
    MD5.chrsz = 8;
    class Dict {
        constructor() {
            this.items = {};
        }
        has(key) {
            return key in this.items;
        }
        set(key, value) {
            this.items[key] = value;
        }
        remove(key) {
            if (this.has(key)) {
                delete this.items[key];
                return true;
            }
            return false;
        }
        get(key) {
            return this.has(key) ? this.items[key] : undefined;
        }
        values() {
            var values = [];
            for (var key in this.items) {
                if (this.has(key)) {
                    values.push(this.items[key]);
                }
            }
            return values;
        }
        getItems() {
            return this.items;
        }
        size() {
            return Object.keys(this.items).length;
        }
        clear() {
            this.items = {};
        }
        keys() {
            return Object.keys(this.items);
        }
    }
    class NetMgr {
        constructor() {
            this.isTokenActive = false;
            this._connectCount = 0;
            this.messageDict = new Dict();
        }
        request(method, parm, cb) {
            if (method == NetMgr.apiLogin) ; else if (this.isTokenActive && NetMgr.token) {
                parm.token = NetMgr.token;
            } else {
                console.error("Token is null or token inactive. Request api" + method);
                this.reconnect();
                return;
            }
            let httpRequest = new Laya.HttpRequest();
            httpRequest.once(Laya.Event.COMPLETE, this, this.response);
            httpRequest.once(Laya.Event.ERROR, this, this.errorHandler);
            httpRequest.on(Laya.Event.PROGRESS, this, this.progressHandler);
            this.messageDict.set(method, {
                method: method,
                parm: parm,
                cb: cb,
                httpObj: httpRequest
            });
            let url = NetMgr.host + method;
            let data = this.setParmData(parm);
            httpRequest.send(url, data, "post", "json", [ "Content-Type", "application/json;charset=UTF-8" ]);
        }
        urlEncode(param) {
            if (param == null) return "";
            let paramStr = "";
            let keys = new Array();
            for (let k in param) {
                keys.push(k);
            }
            keys = keys.sort();
            for (let i = 0, count = keys.length; i < count; ++i) {
                paramStr += keys[i] + "=" + encodeURIComponent(param[keys[i]]);
                if (i != count - 1) {
                    paramStr += "&";
                }
            }
            return paramStr;
        }
        setParmData(parm) {
            parm.apiKey = NetMgr.apiKey;
            parm.timestamp = Date.parse(new Date().toString()) / 1e3;
            parm.apiSign = "";
            if (NetMgr.token) parm.token = NetMgr.token;
            let hash_data = "";
            let key_arr = new Array();
            for (let k in parm) {
                key_arr.push(k);
            }
            key_arr = key_arr.sort();
            for (let i = 0; i < key_arr.length; i++) {
                hash_data += encodeURIComponent(parm[key_arr[i]]);
            }
            let apiSign = MD5.hex_hmac_md5(NetMgr.apiSecret, hash_data);
            parm.apiSign = apiSign;
            return parm;
        }
        errorHandler(res) {
            console.error("you HTTP error：", res);
            this.reconnect();
        }
        progressHandler(res) {}
        response(data) {
            let path = data["path"];
            let requData = this.messageDict.get(path);
            if (path == NetMgr.apiLogin) {
                switch (data.code) {
                  case 0:
                    this._requData && LayaSample.netMgr.request(this._requData.method, this._requData.parm, this._requData.cb);
                    this.connected(data.result.token);
                    break;

                  default:
                    break;
                }
            } else {
                switch (data.code) {
                  case 200:
                    this._requData = requData;
                    this.unconnect();
                    this.reconnect();
                    break;

                  default:
                    break;
                }
            }
            if (requData && requData.cb) {
                requData.cb(data);
            }
        }
        connected(token) {
            this._requData = null;
            this._connectCount = 0;
            NetMgr.token = token;
            this.isTokenActive = true;
        }
        unconnect() {
            this.isTokenActive = false;
        }
        reconnect() {
            console.log("reconnect!!!");
            let self = this;
            self._connectCount += 1;
            if (self._connectCount < 3) {
                console.error("this net error" + self._connectCount + " time");
                setTimeout(s => {
                    LayaSample.wxMgr.login();
                }, self._connectCount * 1e3);
            } else {
                self._connectCount = 0;
            }
        }
    }
    //NetMgr.deviceType = "wxapp";
    //NetMgr.apiLogin = "v10/common/temporaryLogin";
    //NetMgr.host = "https://xcx6.chuoew.cn/";
    //NetMgr.apiKey = "JFQRN8iJ0o366R73";
    //NetMgr.apiSecret = "7hTBhx2zhEcR4HTD";
    NetMgr.deviceType = "";
    NetMgr.apiLogin = "";
    NetMgr.host = "";
    NetMgr.apiKey = "";
    NetMgr.apiSecret = "";
    NetMgr.token = null;
    class WxMgr {
        constructor() {
            this.cate = 0;
        }
        init() {
            this.preTime = 0;
            this.buttonAuthorize1 = null;
            this._shareStartTime = new Date().getTime() + 86e3;
            this._isCreateWxInfoBtn = false;
            if (Laya.Browser.onWeiXin) {
                let sysInfo = window["wx"].getSystemInfoSync();
                LayaSample.commonData.wxsysInfo = sysInfo;
                this._regisiterWXCallback();
                this.getLaunchOption();
                this.showShareMenuWithTicket(true);
                this.login();
            }
        }
        login() {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let self = LayaSample.wxMgr;
            let wxx = window["wx"];
            wxx.login({
                success: function(loginRes) {
                    let param = self.getLaunchOptions();
                    param.code = loginRes.code;
                    param.late_version = LayaSample.commonData.currentVersion;
                    LayaSample.netMgr.request(NetMgr.apiLogin, param, function(res) {
                        if (res.code !== 0) {
                            console.error("code login fault. code:" + res.code);
                        } else {
                            console.log("登录成功了啊", res);
                            let result = res.result;
                            self.createWxInfoBtn1(result.userInfo.avatar);
                            self.setLoginInfo(result);
                            self.setUserInfo(result.userInfo);
                            self.worldRank(1, false);
                            self._regisiterWXShareCallback();
                            LayaSample.commonData.needShowGuide = res.result.userInfo.max_score == 0;
                        }
                        LayaSample.glEvent.event("successLogin");
                    });
                },
                fail: function() {},
                complete: function() {}
            });
        }
        getLaunchOptions() {
            let param = {};
            let launchOptions = LayaSample.commonData.launchOptions;
            if (launchOptions.scene) {
                param.scene_id = launchOptions.scene;
            }
            if (launchOptions.referrerInfo && launchOptions.referrerInfo.appId) {
                param.appid = launchOptions.referrerInfo.appId;
            }
            if (launchOptions.query) {
                if (launchOptions.query.id) param.share_user_id = parseInt(launchOptions.query.id);
                if (launchOptions.query.share_id) param.share_id = parseInt(launchOptions.query.share_id);
                if (launchOptions.query.channel) param.channel = launchOptions.query.channel;
            } else if (launchOptions.referrerInfo && launchOptions.referrerInfo.extraData && launchOptions.referrerInfo.extraData.channel) {
                param.channel = launchOptions.referrerInfo.extraData.channel;
            }
            return param;
        }
        createWxInfoBtn1(avatar) {
            let needWxAuthorize = avatar == "";
            LayaSample.commonData.needWxAuthorize = needWxAuthorize;
            if (needWxAuthorize == false || this._isCreateWxInfoBtn) {
                return;
            }
            this._isCreateWxInfoBtn = true;
            let self = LayaSample.wxMgr;
            let sysInfo = LayaSample.commonData.wxsysInfo;
            let dialogWidth = sysInfo.screenWidth;
            let dialogHeight = sysInfo.screenHeight;
            let wxLeft = (sysInfo.screenWidth - dialogWidth) / 2;
            let wxTop = (sysInfo.screenHeight - dialogHeight) / 2;
            let buttonStyle = {
                left: wxLeft,
                top: wxTop,
                width: dialogWidth,
                height: dialogHeight,
                lineHeight: dialogHeight,
                backgroundColor: "#00000000",
                color: "#ffffffff",
                textAlign: "center",
                fontSize: 16,
                borderRadius: 4
            };
            let wxx = window["wx"];
            self.buttonAuthorize1 = wxx.createUserInfoButton({
                type: "text",
                text: "",
                style: buttonStyle,
                withCredentials: true
            });
            self.showAuthorizeBtn(true);
            self.buttonAuthorize1.onTap(res3 => {
                var curTime = new Date().getTime();
                var datat = Math.floor((curTime - self.preTime) / 1e3);
                self.preTime = curTime;
                if (datat < 1) {
                    return;
                }
                if (res3.userInfo) {
                    var param = {};
                    param.encrypted_data = res3.encryptedData;
                    param.iv = res3.iv;
                    LayaSample.netMgr.request("v10/common/authorizedLogin", param, function(res) {
                        if (res.code !== 0) {
                            console.error("authorized login fault. code:" + res.code);
                        } else {
                            self.setUserInfo(res.result);
                        }
                    });
                } else {
                    console.log("用户取消了授权");
                }
                LayaSample.commonData.needWxAuthorize = false;
                self.showAuthorizeBtn(false);
            });
        }
        getSkinData(callback) {
            var param = {};
            LayaSample.netMgr.request("v10/skin/lists", param, function(res) {
                if (res.code != 0) {
                    console.error("skin lists error!", res);
                } else {
                    let data = res.result.roleSkinList;
                    for (let i = 0; i < 4; ++i) {
                        if (data[i].is_default == 1) ;
                    }
                    LayaSample.commonData.roleSkinList = res.result.roleSkinList;
                    LayaSample.commonData.pillarSkinList = res.result.pillarSkinList;
                    if (callback != undefined) {
                        callback(res);
                    }
                }
            });
        }
        setLoginInfo(data) {
            let shareConfig = data.versionConfig;
            LayaSample.commonData.showRevivalCard = false;
            if (shareConfig.version == LayaSample.commonData.currentVersion) {
                LayaSample.commonData.showRevivalCard = shareConfig.share != "0";
            }
            LayaSample.commonData.lateWay = shareConfig.late_way;
            LayaSample.commonData.isAdDelay = shareConfig.delay == "1";
            LayaSample.commonData.adTime = shareConfig.banner_interval ? shareConfig.banner_interval : LayaSample.commonData.adTime;
            LayaSample.commonData.latencyTime = LayaSample.commonData.isAdDelay ? shareConfig.latency_time : 0;
            LayaSample.commonData.moveTime = LayaSample.commonData.isAdDelay ? shareConfig.move_time : 0;
            LayaSample.commonData.show_box = shareConfig.show_box == 1;
            LayaSample.commonData.delay_num = shareConfig.delay_num;
            LayaSample.commonData.show_video = shareConfig.show_video == 1;
            let shareContent = data.shareContent;
            let shareCount = shareContent.length;
            let shareType = 0;
            LayaSample.commonData.shareInfo = {};
            for (let i = 0; i < shareCount; ++i) {
                shareType = shareContent[i].share_type;
                let share = LayaSample.commonData.shareInfo[shareType];
                if (!share) {
                    share = [];
                    LayaSample.commonData.shareInfo[shareType] = share;
                }
                share.push(shareContent[i]);
            }
            LayaSample.commonData.wxappList = {};
            for (const item of data.wxappList) {
                let wxapp = LayaSample.commonData.wxappList[item.category];
                if (!wxapp) {
                    wxapp = [];
                    LayaSample.commonData.wxappList[item.category] = wxapp;
                }
                if (Laya.Browser.onIOS && item.is_box == 1) ; else {
                    wxapp.push(item);
                }
            }
        }
        setUserInfo(userInfo) {
            LayaSample.commonData.userInfo = userInfo;
            if (userInfo.last_sign_time) {
                LayaSample.storageMgr.setSigninTime(userInfo.last_sign_time);
            }
            LayaSample.commonData.isCheckSignin = true;
            let gameStatus = LayaSample.storageMgr.getGameStatus();
            userInfo.pass = 0;
            let level = userInfo.pass < gameStatus.maxLevel ? gameStatus.maxLevel : userInfo.pass;
            let score = userInfo.max_score < gameStatus.maxScore ? gameStatus.maxScore : userInfo.max_score;
            LayaSample.glEvent.event("updateCoin", {});
            if (score) {
                this.settlementLevel(score);
            }
        }
        showAuthorizeBtn(bshow) {
            if (!this.buttonAuthorize1) return;
            if (bshow) {
                this.buttonAuthorize1.show();
            } else {
                this.buttonAuthorize1.hide();
            }
        }
        getLaunchOption() {
            let wxx = window["wx"];
            LayaSample.commonData.launchOptions = wxx.getLaunchOptionsSync();
        }
        showToast(title, duration) {
            if (!window["wx"]) return;
            let wxx = window["wx"];
            wxx.showToast({
                title: title,
                duration: duration,
                icon: "none"
            });
        }
        hideToast() {
            if (!window["wx"]) return;
            window["wx"].hideToast();
        }
        _regisiterWXShareCallback() {
            let self = LayaSample.wxMgr;
            if (Laya.Browser.onWeiXin && NetMgr.token) {
                let wxx = window["wx"];
                wxx.onShareAppMessage(function() {
                    let shareData = self.getShareContent(1);
                    let shareObj = {
                        title: shareData.share_title,
                        imageUrl: shareData.share_img,
                        query: "share_id=" + shareData.share_id + "&share_type=" + shareData.share_type + "&id=" + LayaSample.commonData.userInfo.id,
                        success: function(res) {},
                        fail: function() {}
                    };
                    self._upShareInfo(shareData.share_id);
                    return shareObj;
                });
            }
        }
        settlementLevel(score) {
            let gameStatus = LayaSample.storageMgr.getGameStatus();
            let self = LayaSample.wxMgr;
            if (gameStatus.maxScore < score) {
                self._submitScroe(score);
                LayaSample.storageMgr.setMaxScore(score);
                let param = {};
                param.score = score;
                param.use_time = Math.floor(LayaSample.commonData.useTime / 1e3);
                LayaSample.netMgr.request("v10/user/pass", param, function(res) {
                    if (res.code == 0) {
                        console.log("上传分数成功");
                        LayaSample.commonData.userInfo.max_score = res.result;
                    }
                });
            }
        }
        buySkin(type, callback) {
            var param = {};
            param.type = type;
            LayaSample.netMgr.request("v10/skin/randBuy", param, function(res) {
                if (callback != undefined) {
                    callback(res);
                }
            });
        }
        changeSkin(type, skin_id) {
            var param = {};
            param = type;
            param = skin_id;
            LayaSample.netMgr.request("v10/skin/switchSkin", param, function(res) {});
        }
        worldRank(page, bshow = true) {
            var param = {
                page: page
            };
            LayaSample.netMgr.request("v10/user/worldRanking", param, function(res) {
                if (res.code == 0) {
                    if (bshow) {
                        LayaSample.glEvent.event("draw_world_rank_event", {
                            data: res.result,
                            page: page
                        });
                    }
                    LayaSample.commonData.gameList = res.result;
                } else {
                    console.error("get world ranking error:", res, page);
                }
            });
        }
        _submitScroe(score) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let wxx = window["wx"];
            let openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: "submit_scroe",
                score: score
            });
            LayaSample.glEvent.event("submit_scroe_event", {});
        }
        showFriendRank(isShow) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            LayaSample.glEvent.event("show_friend_rank_event", {
                isShow: isShow
            });
            let tag = isShow ? "open_friend_rank" : "close_friend_rank";
            let wxx = window["wx"];
            let openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: tag
            });
        }
        destroyFriendRank() {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let wxx = window["wx"];
            let openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: "destroy_friend_rank"
            });
        }
        showLiteRank(isShow) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let tag = isShow ? "open_lite_rank" : "close_lite_rank";
            let wxx = window["wx"];
            let openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: tag
            });
            LayaSample.glEvent.event("show_lite_rank_event", {
                isShow: isShow
            });
        }
        showOverFriendTips(isShow) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let tag = isShow ? "open_over_friend" : "close_over_friend";
            let wxx = window["wx"];
            let openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: tag,
                score: LayaSample.commonData.newScore
            });
            LayaSample.glEvent.event("over_friend_event", {
                isShow: isShow
            });
        }
        showLoopFriendTips(isShow) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let tag = isShow ? "open_loop_friend" : "close_loop_friend";
            let wxx = window["wx"];
            let openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: tag,
                score: LayaSample.commonData.newScore
            });
            LayaSample.glEvent.event("loop_over_event", {
                isShow: isShow
            });
        }
        restartGame() {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let wxx = window["wx"];
            var openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: "restart_game"
            });
        }
        showFirstFriendTips(isShow) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let tag = isShow ? "open_first_friend" : "close_first_friend";
            let wxx = window["wx"];
            let openDataContext = wxx.getOpenDataContext();
            openDataContext.postMessage({
                cmd: tag,
                score: 0
            });
        }
        onFrientMouseEvent(event) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let wxx = window["wx"];
            wxx.getOpenDataContext().postMessage(event);
        }
        playVibrateShort() {
            if (!Laya.Browser.onWeiXin || !LayaSample.storageMgr.isPlayVibrate()) return;
            window["wx"].vibrateShort({
                success: function() {},
                fail: function() {},
                complete: function() {}
            });
        }
        playVibrateLong() {
            if (!Laya.Browser.onWeiXin || !LayaSample.storageMgr.isPlayVibrate()) return;
            window["wx"].vibrateLong({
                success: function() {},
                fail: function() {},
                complete: function() {}
            });
        }
        showShareMenuWithTicket(ticket) {
            if (!window["wx"]) return;
            window["wx"].showShareMenu({
                withShareTicket: ticket,
                success: function() {},
                fail: () => {},
                complete: () => {}
            });
        }
        _regisiterWXCallback() {
            if (Laya.Browser.onWeiXin) {
                let wxx = window["wx"];
                wxx.offShow(this.onShowEvent);
                wxx.onShow(this.onShowEvent);
                wxx.offHide(this.onHideEvent);
                wxx.onHide(this.onHideEvent);
            }
        }
        onShowEvent(res) {
            let self = LayaSample.wxMgr;
            LayaSample.soundMgr.stopAll();
            LayaSample.soundMgr.playBGM();
            LayaSample.commonData.isSleep = false;
            LayaSample.glEvent.event("wakeWx", {});
            if (self._statuShareGame) {
                self._statuShareGame = false;
                let shareEndTime = new Date().getTime();
                let sleepTimer = shareEndTime - self._shareStartTime;
                let isShare = sleepTimer < 2500 ? false : true;
                if (isShare) self._upShareInfo(self._shareId);
                LayaSample.glEvent.event("backShare", {
                    isShare: isShare,
                    shareId: self._shareId
                });
                self._shareStartTime = new Date().getTime() + 86e3;
            }
        }
        onHideEvent() {
            LayaSample.commonData.isSleep = true;
            LayaSample.soundMgr.stopAll();
            LayaSample.glEvent.event("sleepWx", {});
        }
        openOtherApp(appid, appCat, cate = 0) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            const gameCate = LayaSample.commonData.wxappList[appCat];
            let _appPath = "";
            let tepID = -1;
            let adID = -1;
            if (gameCate) {
                for (const item of gameCate) {
                    if (item.app_id == appid) {
                        tepID = item.wx_id;
                        adID = item.ad_id;
                        _appPath = item.app_path;
                        break;
                    }
                }
            }
            this.cate = cate;
            let wxx = window["wx"];
            let self = LayaSample.wxMgr;
            wxx.navigateToMiniProgram({
                appId: appid,
                path: _appPath,
                success: function(res) {
                    if (tepID == -1) {
                        console.error("click app not find id,for appid:", appid);
                        return;
                    }
                    LayaSample.netMgr.request("v10/common/clickWxapp", {
                        wx_id: tepID,
                        ad_id: adID,
                        type: 1
                    }, function(res) {
                        if (res.code !== 0) {
                            console.error("log goto wxapp fault. code:" + res);
                        }
                    });
                },
                fail: function() {
                    LayaSample.netMgr.request("v10/common/clickWxapp", {
                        wx_id: tepID,
                        ad_id: adID,
                        type: 0
                    }, function(res) {
                        if (res.code !== 0) ;
                    });
                    if (self.cate == 2) {
                        Laya.Scene.open("views/wxapp.scene", false);
                        LayaSample.glEvent.event("wxapp_close_view");
                    }
                },
                complete: () => {}
            });
        }
        getWxappList(cat) {
            var dataList = LayaSample.commonData.wxappList[cat];
            let data = [];
            if (dataList) {
                for (let item of dataList) {
                    let newItem = {};
                    newItem.app_img = item.app_img;
                    newItem.app_id = item.app_id;
                    newItem.category = item.category;
                    newItem.weight = item.weight;
                    data.push(newItem);
                }
                data.sort((a, b) => a.weight - b.weight);
            }
            return data;
        }
        shareFriend(shareType, checkShareStatus) {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            let shareObj;
            let self = LayaSample.wxMgr;
            let shareData = self.getShareContent(shareType);
            if (checkShareStatus) {
                self._shareStartTime = new Date().getTime();
                self._statuShareGame = true;
                self._shareId = shareData.share_id;
            }
            shareObj = {
                title: shareData.share_title,
                imageUrl: shareData.share_img,
                query: "share_id=" + shareData.share_id + "&share_type=" + shareData.share_type + "&id=" + LayaSample.commonData.userInfo.id,
                success: function(res) {},
                fail: function() {},
                complete: function() {}
            };
            let wxx = window["wx"];
            wxx.shareAppMessage(shareObj);
        }
        getShareContent(shareType) {
            let shareArray = LayaSample.commonData.shareInfo[shareType];
            let shareData = {
                share_title: "老铁快帮我点点，差一点就过关了",
                share_img: "",
                share_id: 1,
                share_type: shareType
            };
            if (shareArray) {
                shareData = shareArray[Math.floor(Math.random() * shareArray.length)];
            }
            return shareData;
        }
        upViewVideoInfo(ad_status, cate) {
            let param = {};
            param.ad_type = cate;
            param.type = ad_status;
            LayaSample.netMgr.request("v10/user/viewVideo", param, function(res) {
                if (res.code !== 0) {
                    console.error("upload video info error.");
                }
            });
        }
        _upShareInfo(share_id) {
            let param = {};
            param.share_id = share_id;
            LayaSample.netMgr.request("v10/user/recordShare", param, function(res) {
                if (res.code !== 0) {
                    console.error("upload user share fault.");
                }
            });
        }
        getSignData(caller, cb) {
            let param = {};
            LayaSample.netMgr.request("v10/activity/signPrize", param, function(res) {
                if (res.code !== 0) {
                    console.error("get sign data fault.");
                } else {
                    LayaSample.commonData.signin = res.result;
                    if (cb) cb.call(caller, res.result);
                }
            });
        }
        getSignPrize(caller, cb, isDouble) {
            let self = LayaSample.wxMgr;
            let param = {};
            param.double = isDouble ? 1 : 0;
            LayaSample.netMgr.request("v10/activity/getSignPrize", param, function(res) {
                if (res.code !== 0) {
                    self.showToast(res.msg, 2e3);
                } else {
                    LayaSample.commonData.signin = res.result;
                    if (cb) cb.call(caller, res.result);
                }
            });
        }
        getDiskData(caller, cb) {
            let self = LayaSample.wxMgr;
            let param = {};
            LayaSample.netMgr.request("v10/activity/turntablePrize", param, function(res) {
                if (res.code !== 0) {
                    self.showToast(res.msg, 2e3);
                } else {
                    if (cb) cb.call(caller, res.result);
                }
            });
        }
        getDiskPrize(caller, cb, prizeType, shareId) {
            let self = LayaSample.wxMgr;
            let param = {};
            param.type = prizeType;
            if (prizeType == 1) param.share_content_id = shareId;
            LayaSample.netMgr.request("v10/activity/luckDraw", param, function(res) {
                if (res.code !== 0) {
                    self.showToast(res.msg, 2e3);
                } else {
                    if (cb) cb.call(caller, res.result);
                }
            });
        }
        getDiskDouble(caller, cb, param) {
            let self = LayaSample.wxMgr;
            LayaSample.netMgr.request("v10/activity/prizeDouble", param, function(res) {
                if (res.code !== 0) {
                    self.showToast(res.msg, 2e3);
                } else {
                    if (cb) cb.call(caller, res.result);
                }
            });
        }
        openCustomerService() {
            if (!Laya.Browser.onWeiXin) return;
            let wxx = window["wx"];
            wxx.openCustomerServiceConversation({
                sessionFrom: "会话来源",
                showMessageCard: false,
                sendMessageTitle: "会话内消息卡片标题",
                sendMessagePath: "会话内消息卡片路径",
                sendMessageImg: "会话内消息卡片图片路径",
                success: function(res) {},
                fail: function(e) {},
                complete: function(e) {}
            });
        }
    }
    class ConfigMgr {
        constructor() {
            this.bannerAdID = "adunit-8a60bfdf46fa7327";
            this.videoAdID = "adunit-68d264191b001482";
            this.interAdID = "adunit-xxxx";
            this.skinCfg = [];
        }
        init() {}
        clear3DRes(res, callback) {
            for (let i = 0; i < res.length; ++i) {
                let resource = Laya.loader.getRes(res[i].url);
                if (resource) {
                    resource.releaseResource(true);
                }
                Laya.Loader.clearRes(res[i].url);
            }
        }
        getVideoId() {
            return this.videoAdID;
        }
        getBannerId() {
            return this.bannerAdID;
        }
        getInterId() {
            return this.interAdID;
        }
        getSkinCfg() {
            return this.skinCfg;
        }
        getSkinByIndex(index) {
            return this.skinCfg[index];
        }
    }
    class BaseAd {
        init() {}
        getBannerCount() {
            return 0;
        }
        getBannerItem() {}
        setBannerItem() {}
        showBannerAd() {}
        hideBannerAd() {}
        setBannerAdWidth(width) {}
        setBannerAdTop(top) {}
        getBannerAd() {}
        showVideoAd(category) {}
        getVideoAd() {}
        loadVideoAd() {}
        showInterstitialAd() {}
        getInterstitialAd() {}
    }
    class WxAd extends BaseAd {
        constructor() {
            super(...arguments);
            this._loadBanner = 1;
            this._loadDelay = 0;
            this._loadInterval = 5;
            this.lastTime = 0;
            this.loadAdFirst = true;
        }
        init() {
            this._videoAd = null;
            this._interAd = null;
            this._bannerItem = null;
            this._bannerList = [];
            this._bannerError = 0;
            this._videoCate = -1;
            this._isCreateInter = false;
            if (Laya.Browser.onWeiXin) {
                const version = LayaSample.commonData.wxsysInfo.SDKVersion;
                this._isCreateInter = LayaSample.utils.compareVersion(version, "2.6.0") >= 0;
                Laya.timer.loop(1e3, this, this.loadBannerAd);
                this.getBannerAd();
                this.getVideoAd();
            }
        }
        loadBannerAd() {
            if (LayaSample.gameMgr.isPlay) return;
            let time = 5e3;
            if (this._bannerList.length == 3) {
                this.loadAdFirst = false;
            }
            if (LayaSample.commonData.adTime > time) {
                time = LayaSample.commonData.adTime;
            }
            if (this.loadAdFirst) {
                time = 2e3;
            }
            let relTime = new Date().valueOf();
            if (this._bannerList.length < 3 && relTime - this.lastTime > time) {
                this.lastTime = relTime;
                this.getBannerAd();
            }
        }
        getBannerCount() {
            return this._bannerList.length;
        }
        getBannerItem() {
            return this._bannerItem;
        }
        setBannerItem() {
            if (!Laya.Browser.onWeiXin) return;
            if (LayaSample.commonData.isNoAds) return;
            if (!LayaSample.commonData.existBannerAd) return;
            let count = this._bannerList.length;
            let banner = null;
            if (count < 1) {
                banner = null;
            } else if (count == 1) {
                banner = this._bannerList[0];
            } else {
                this._bannerList[0].ad.destroy();
                this._bannerList.shift();
                for (let i = 0, count = this._bannerList.length; i < count; ++i) {
                    this._bannerList[i].index = i;
                }
                banner = this._bannerList[0];
            }
            this._bannerItem = banner;
        }
        showBannerAd() {
            let banner = this.getBannerItem();
            if (!Laya.Browser.onWeiXin) return;
            if (!banner) return;
            if (LayaSample.commonData.isNoAds) return;
            if (!LayaSample.commonData.existBannerAd) return;
            if (LayaSample.commonData.watchVideo) return;
            banner.ad.show().then(() => {
                LayaSample.glEvent.event("showAd", {
                    adtype: "banner",
                    index: banner.index
                });
            }).catch(err => {});
        }
        hideBannerAd() {
            for (let i = 0, count = this._bannerList.length; i < count; ++i) {
                if (!this._bannerList[i]) {
                    continue;
                }
                this._bannerList[i].ad.hide();
            }
        }
        setBannerAdWidth(width) {
            let banner = this.getBannerItem();
            if (banner && width) {
                let sysInfo = LayaSample.commonData.wxsysInfo;
                let left = (sysInfo.screenWidth - width) / 2;
                banner.ad.style.width = width;
                banner.ad.style.left = left;
            }
        }
        setBannerAdTop(top) {
            let banner = this.getBannerItem();
            if (banner && top !== undefined) {
                banner.ad.style.top = top;
            }
        }
        getBannerAd() {
            if (!Laya.Browser.onWeiXin) return;
            if (LayaSample.commonData.isSleep) return;
            if (this._bannerList.length > 2) return;
            let self = this;
            let sysInfo = LayaSample.commonData.wxsysInfo;
            let width = sysInfo.screenWidth;
            let left = (sysInfo.screenWidth - width) / 2;
            let top = sysInfo.screenHeight * .86;
            let bannerItem = {
                width: width,
                height: sysInfo.screenHeight - top,
                top: top,
                index: -1
            };
            let bannerAd = wx["createBannerAd"]({
                adUnitId: LayaSample.configMgr.getBannerId(),
                style: {
                    left: left,
                    top: top,
                    width: width
                }
            });
            bannerItem.ad = bannerAd;
            bannerAd.onLoad(() => {
                LayaSample.commonData.existBannerAd = true;
                LayaSample.glEvent.event("loadAd", {
                    adtype: "banner",
                    isLoad: true
                });
                let index = self._bannerList.push(bannerItem);
                bannerItem.index = index - 1;
                self._bannerError = 0;
            });
            bannerAd.onError(function(err) {
                self._bannerError += 1;
                if (self._bannerError > 3) {
                    self._bannerError = 3;
                    LayaSample.commonData.existBannerAd = false;
                }
                LayaSample.glEvent.event("loadAd", {
                    adtype: "banner",
                    isLoad: false
                });
            });
            bannerAd.onResize(function(res) {
                if (!bannerAd) return;
                let realHeight = bannerAd.style.realHeight + .1;
                if (sysInfo.model.startsWith("iPhone X")) realHeight += 40 / Laya.Browser.height * GameConfig.height;
                bannerAd.style.top = sysInfo.screenHeight - realHeight;
                bannerItem.width = bannerAd.style.realWidth;
                bannerItem.height = realHeight;
                LayaSample.glEvent.event("ad_resize_event", {
                    adtype: "banner",
                    index: bannerItem.index
                });
            });
        }
        showVideoAd(category) {
            let videoAd = this._videoAd;
            if (!Laya.Browser.onWeiXin || !videoAd) {
                LayaSample.wxMgr.showToast("暂无视频，请稍后再试", 2e3);
                LayaSample.glEvent.event("ad_video_close_event_home");
                return;
            }
            this._videoCate = category;
            LayaSample.wxMgr.upViewVideoInfo(0, category);
            videoAd.show().then(() => {
                LayaSample.commonData.watchVideo = true;
            }).catch(err => {
                LayaSample.glEvent.event("ad_video_close_event_home");
                LayaSample.wxMgr.showToast("暂无视频，请稍后再试", 2e3);
                videoAd.load().then(() => videoAd.show());
            });
        }
        getVideoAd() {
            if (!Laya.Browser.onWeiXin) return;
            if (!wx["createRewardedVideoAd"]) {
                LayaSample.commonData.existVideoAd = false;
                return;
            }
            let videoAd = this._videoAd;
            if (videoAd) {
                videoAd.offLoad(this._onLoadVideo);
                videoAd.offError(this._onErrorVideo);
                videoAd.offClose(this._onCloseVideo);
            }
            videoAd = wx["createRewardedVideoAd"]({
                adUnitId: LayaSample.configMgr.getVideoId()
            });
            videoAd.onLoad(this._onLoadVideo);
            videoAd.onError(this._onErrorVideo);
            videoAd.onClose(this._onCloseVideo);
            this._videoAd = videoAd;
        }
        loadVideoAd() {
            if (!Laya.Browser.onWeiXin) return;
            if (!this._videoAd) return;
            this._videoAd.load();
        }
        _onLoadVideo() {
            LayaSample.commonData.existVideoAd = true;
            LayaSample.glEvent.event("loadAd", {
                adtype: "video",
                isLoad: true
            });
        }
        _onErrorVideo(err) {
            console.error("video load error", err);
            LayaSample.commonData.existVideoAd = false;
            LayaSample.glEvent.event("loadAd", {
                adtype: "video",
                isLoad: false
            });
            LayaSample.glEvent.event("ad_video_close_event_home");
        }
        _onCloseVideo(res) {
            LayaSample.commonData.watchVideo = false;
            let isEnded = res && res.isEnded || res === undefined ? true : false;
            if (isEnded) {
                LayaSample.wxMgr.upViewVideoInfo(1, this._videoCate);
            }
            LayaSample.glEvent.event("videoAdClose", {
                isEnded: isEnded
            });
            LayaSample.glEvent.event("ad_video_close_event_home");
        }
        showInterstitialAd() {
            let interAd = this._interAd;
            if (!this._isCreateInter) return;
            if (!interAd) return;
            interAd.show().then(() => {
                LayaSample.commonData.watchInter = true;
            }).catch(err => {
                console.error("showInterstitialAd show error", err);
                LayaSample.glEvent.event("ad_inter_close_event", {});
            });
        }
        getInterstitialAd() {
            if (!this._isCreateInter) return;
            if (!wx["createInterstitialAd"]) return;
            let interAd = this._interAd;
            if (interAd) {
                interAd.offLoad(this._onLoadInterstitial);
                interAd.offError(this._onErrorInterstitial);
                interAd.offClose(this._onCloseInterstitial);
            }
            interAd = wx["createInterstitialAd"]({
                adUnitId: LayaSample.configMgr.getInterId()
            });
            interAd.onLoad(this._onLoadInterstitial);
            interAd.onError(this._onErrorInterstitial);
            interAd.onClose(this._onCloseInterstitial);
            this._interAd = interAd;
        }
        _onLoadInterstitial() {
            console.log("_onLoadInterstitial 加载成功");
            LayaSample.commonData.existInterAd = true;
            LayaSample.glEvent.event("loadAd", {
                adtype: "inter",
                isLoad: true
            });
        }
        _onErrorInterstitial(err) {
            console.error("_onErrorInterstitial 加载错误", err);
            LayaSample.commonData.existInterAd = false;
            LayaSample.glEvent.event("loadAd", {
                adtype: "inter",
                isLoad: false
            });
        }
        _onCloseInterstitial(evt) {
            console.error("_onCloseInterstitial 关闭", evt);
            LayaSample.glEvent.event("ad_inter_close_event", {});
        }
    }
    class GameMgr {
        constructor() {
            this._isPlay = false;
            this._isPause = false;
            this._isOver = false;
            this._isPressed = false;
        }
        get isPlay() {
            return this._isPlay;
        }
        set isPlay(value) {
            this._isPlay = value;
        }
        get isOver() {
            return this._isOver;
        }
        set isOver(value) {
            this._isOver = value;
        }
        get isPause() {
            return this._isPause;
        }
        set isPause(value) {
            this._isPause = value;
            Laya.timer.scale = value ? 0 : 1;
        }
        get isPressed() {
            return this._isPressed;
        }
        set isPressed(value) {
            this._isPressed = value;
        }
    }
    class TweenMgr extends Laya.Script {
        toAlpha(target, alpha, duration, isLoop = false, startAlpha = 1) {
            target.alpha = startAlpha;
            alpha1();
            function alpha1() {
                let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
                Laya.Tween.to(target, {
                    alpha: alpha
                }, duration, null, handler);
            }
            function alpha2() {
                Laya.Tween.to(target, {
                    alpha: 1
                }, duration, null, Laya.Handler.create(this, alpha1));
            }
        }
        toScale(target, scale, duration, isReset, isLoop = false, scaley = scale) {
            target.scaleX = 1;
            target.scaleY = 1;
            scale1();
            function scale1() {
                let handler = isLoop || isReset ? new Laya.Handler(this, scale2) : null;
                Laya.Tween.to(target, {
                    scaleX: scaley,
                    scaleY: scaley
                }, duration, null, handler);
            }
            function scale2() {
                let handler = isLoop ? new Laya.Handler(this, scale1) : null;
                Laya.Tween.to(target, {
                    scaleX: 1,
                    scaleY: 1
                }, duration, null, handler);
            }
        }
        toPosition(target, pos, duration, isLoop = false, type = 0) {
            Laya.Tween.clearAll(target);
            let curPos = new Laya.Vector2(target.x, target.y);
            pos1();
            function pos1() {
                if (isLoop) {
                    switch (type) {
                      case 0:
                        var handler = new Laya.Handler(this, pos2);
                        break;

                      case 1:
                        var handler = new Laya.Handler(this, pos3);
                        break;
                    }
                }
                Laya.Tween.to(target, {
                    x: pos.x,
                    y: pos.y
                }, duration, null, handler);
            }
            function pos2() {
                Laya.Tween.to(target, {
                    x: curPos.x,
                    y: curPos.y
                }, duration, null, Laya.Handler.create(this, pos1));
            }
            function pos3() {
                target.x = curPos.x;
                target.y = curPos.y;
                pos1();
            }
        }
        fromAlpha(target, alpha, duration, isLoop = false) {
            target.alpha = 1;
            alpha1();
            function alpha1() {
                let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
                Laya.Tween.from(target, {
                    alpha: alpha
                }, duration, null, handler);
            }
            function alpha2() {
                Laya.Tween.from(target, {
                    alpha: 1
                }, duration, null, Laya.Handler.create(this, alpha1));
            }
        }
        fromScale(target, scale, duration, isLoop = false) {
            scale1();
            function scale1() {
                let handler = isLoop ? new Laya.Handler(this, scale2) : null;
                Laya.Tween.from(target, {
                    scaleX: scale,
                    scaleY: scale
                }, duration, null, handler);
            }
            function scale2() {
                Laya.Tween.from(target, {
                    scaleX: 1,
                    scaleY: 1
                }, duration, null, Laya.Handler.create(this, scale1));
            }
        }
    }
    class GameModel {
        constructor() {
            this.mainCarPos = new Laya.Vector3();
            this.mainCarScale = new Laya.Vector2(0, .7);
        }
        setMainCar(car) {
            this.mainCarPos.setValue(car.transform.position.x, car.transform.position.y, car.transform.position.z);
        }
        updateMainCarLen(carLen) {
            this.mainCarScale.y = carLen;
        }
        updateMainCarWidth(carWidth) {
            this.mainCarScale.x = carWidth;
        }
    }
    GameModel.I = new GameModel();
    class MoveInfo {
        constructor() {
            this.accelerateZ = 0;
            this.targetPos = 0;
        }
    }
    class EffectMgr {
        constructor() {}
        init(effect) {
            this.FX_XC_Crash_Screen = effect.getChildByName("FX_XC_Crash_Screen");
            this.FX_XC_GoldenCar = effect.getChildByName("FX_XC_GoldenCar");
            this.FX_XC_Ptc = effect.getChildByName("FX_XC_Ptc");
            var len = effect.numChildren;
            for (let index = 0; index < len; index++) {
                this.compileShader(effect.getChildAt(index).getChildAt(0));
                effect.getChildAt(index).active = false;
            }
        }
        compileShader(model) {
            if (model instanceof Laya.ShuriKenParticle3D) {
                var shuriKenParticle3D = model;
                var render = shuriKenParticle3D.particleRenderer;
                var materials = render.materials;
                var spriteDefine = render._defineDatas.value;
                var publicDefine = 0;
                var materialDefine = 0;
                for (var i = 0; i < materials.length; i++) {
                    var mater = materials[i];
                    var marData = mater._defineDatas;
                    publicDefine = 1 & ~mater._disablePublicDefineDatas.value;
                    materialDefine = mater._defineDatas.value;
                    if (mater._shader) {
                        Laya.Shader3D.compileShader(mater._shader._name, 0, 0, publicDefine, spriteDefine, materialDefine);
                    }
                    console.log(publicDefine, spriteDefine, materialDefine);
                }
            }
            if (model._children) {
                for (var i = 0; i < model._children.length; i++) {
                    this.compileShader(model._children[i]);
                }
            }
        }
    }
    EffectMgr.I = new EffectMgr();
    class Top3DSceneMgr {
        constructor() {
            this.pos = new Laya.Vector3(546, 105, 0);
            this._translate = new Laya.Vector3(0, 0, 0);
            this.speedUiFlag = false;
        }
        init() {
            this.scene = new Laya.Scene3D();
            Laya.stage.addChild(this.scene);
            this.camera = new Laya.Camera(0, 0, 1e3);
            this.scene.addChild(this.camera);
            this.camera.transform.rotate(new Laya.Vector3(0, 0, 0), false, false);
            this.camera.transform.translate(new Laya.Vector3(0, 0, -10));
            this.camera.orthographic = true;
            this.camera.orthographicVerticalSize = 10;
            this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            var directionLight = new Laya.DirectionLight();
            this.scene.addChild(directionLight);
            this.pos.setValue(GameModel.I.scorePos.x, GameModel.I.scorePos.y, 0);
            this.camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
            EffectMgr.I.FX_XC_Ptc.transform.position = this._translate;
        }
        showPtc() {
            Top3DSceneMgr.I.addChild(EffectMgr.I.FX_XC_Ptc);
            EffectMgr.I.FX_XC_Ptc.active = true;
        }
        hidePtc() {
            Top3DSceneMgr.I.removeChild(EffectMgr.I.FX_XC_Ptc);
        }
        initSpeedUIPos(img) {
            this.pos.setValue(img.x + img.width / 2, img.y + img.height / 2, 0);
            this.camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
        }
        showAddSpeed() {
            if (!this.speedUiFlag) {
                this.speedUiFlag = true;
            }
        }
        hideAddSpeed() {
            if (this.speedUiFlag) {
                this.speedUiFlag = false;
            }
        }
        addChild(node) {
            this.scene.addChild(node);
        }
        removeChild(node) {
            this.scene.removeChild(node);
        }
    }
    Top3DSceneMgr.I = new Top3DSceneMgr();
    class Car extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.speedZ = 0;
            this.isStart = false;
            this.tempV3 = new Laya.Vector3(0, 0, -510);
            this.hasBuff = false;
        }
        onAwake() {
            this.move = new Laya.Vector3();
            this.car = this.owner;
            this.effect = this.car.getChildAt(0);
            this.speedEffect = this.car.getChildByName("FX_XC_Speed");
            this.smokeEffect = this.car.getChildByName("FX_XC_Crash_Smoke");
            this.FX_XC_Pass1 = this.car.getChildByName("FX_XC_Pass1");
            this.FX_XC_Pass2 = this.car.getChildByName("FX_XC_Pass2");
            EffectMgr.I.compileShader(this.speedEffect);
            EffectMgr.I.compileShader(this.smokeEffect);
            this.effect.active = false;
            this.FX_XC_Pass1.active = false;
            this.FX_XC_Pass2.active = false;
            this.speedEffect.active = false;
            this.smokeEffect.active = false;
        }
        start() {
            if (!this.isStart) {
                this.effect.active = true;
                this.isStart = true;
                LayaSample.soundMgr.playCarSound("xingshi");
            }
        }
        reset() {
            this.smokeEffect.active = false;
        }
        onUpdate() {
            if (LayaSample.gameMgr.isOver || !LayaSample.gameMgr.isPlay) return;
            this.speedZ = LayaSample.speedZ;
            this.move.setValue(0, 0, this.speedZ);
            this.car.transform.translate(this.move, false);
            GameModel.I.setMainCar(this.car);
        }
        showPass(type) {
            if (type == 0) {
                this.FX_XC_Pass1.active = true;
            } else {
                this.FX_XC_Pass2.active = true;
            }
            Laya.timer.clear(this, this.hidePass);
            Laya.timer.once(150, this, this.hidePass);
        }
        hidePass() {
            this.FX_XC_Pass1.active = false;
            this.FX_XC_Pass2.active = false;
        }
        addBuff() {
            LayaSample.soundMgr.play("daoju");
            this.speedEffect.active = true;
            this.hasBuff = true;
            Laya.timer.clear(this, this.removeBuff);
            Laya.timer.once(4e3, this, this.removeBuff);
            LayaSample.soundMgr.playCarSound("jiasu");
        }
        removeBuff() {
            this.speedEffect.active = false;
            this.hasBuff = false;
            LayaSample.glEvent.event("remove_buff");
            LayaSample.soundMgr.playCarSound("xingshi");
        }
        hit() {
            LayaSample.wxMgr.playVibrateLong();
            LayaSample.soundMgr.play("lose");
            LayaSample.gameMgr.isOver = true;
            this.isStart = false;
            this.effect.active = false;
            Top3DSceneMgr.I.addChild(EffectMgr.I.FX_XC_Crash_Screen);
            EffectMgr.I.FX_XC_Crash_Screen.active = true;
            this.smokeEffect.active = true;
            EffectMgr.I.FX_XC_Crash_Screen.transform.position = this.tempV3;
            LayaSample.glEvent.event("stop_game");
            Laya.timer.once(1e3, this, function() {
                Top3DSceneMgr.I.removeChild(EffectMgr.I.FX_XC_Crash_Screen);
                LayaSample.glEvent.event("gameOver");
            });
        }
    }
    class AICar extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.moveInfo = new MoveInfo();
            this.realWidth = 0;
            this.realLen = 1;
            this.repMat = new Laya.PBRStandardMaterial();
            this.f = true;
            this.dirX = 1;
            this.mType = 0;
            this.centerPos = [ 2.25, .75, -.75, -2.25 ];
            this._outPos = new Laya.Vector3();
            this.isBuffCar = false;
            this.turnLeft = new Laya.Vector3(0, 15, 0);
            this.turnRight = new Laya.Vector3(0, -15, 0);
            this.straight = Laya.Vector3._ZERO;
            this.dir = 0;
            this.lerpRot = new Laya.Vector3();
            this._delayChange = 0;
        }
        onAwake() {
            this.mainCarComp = GameModel.I.mainCarComp;
            this.moveTypeList = [ 1, 3, 2 ];
            this.reset();
            this.moveV3 = new Laya.Vector3();
            this.car = this.owner;
        }
        reset() {
            this.eventTime = 1 + Math.random() * 5;
            this.moveInfo.accelerateZ = 0;
            this.moveInfo.canMoveX = false;
        }
        init(pWidth, pLen) {
            this.realWidth = pWidth;
            this.realLen = pLen;
            this.aiCars = LayaSample.modelCreator.aiCars;
        }
        initRefresh() {
            this.hasAddScore = false;
        }
        onUpdate() {
            if (LayaSample.gameMgr.isOver) {
                if (AICar.hitCar == this) {
                    return;
                }
                this.moveV3.x = 0;
                this.car.transform.translate(this.moveV3, false);
                return;
            }
            this.eventTime -= Laya.timer.delta / 1e3;
            if (this.eventTime < 0) {
                if (this.mType == 0) {
                    this.mType = this.moveTypeList[Math.random() * this.moveTypeList.length | 0];
                    this.eventTime = 1 + Math.random() * 5;
                    switch (this.mType) {
                      case 1:
                        this.moveInfo.accelerateZ = Math.random() * .1;
                        break;

                      case 3:
                        this.moveInfo.accelerateZ = -(Math.random() * Math.max(0, this.moveInfo.speedZ - .01));
                        break;

                      case 2:
                        this.moveInfo.canMoveX = true;
                        this.eventTime = 1 + Math.random() * .5;
                        let cPos = this.car.transform.position;
                        LayaSample.soundMgr.PlayHorn();
                        if (Math.abs(cPos.x) > 1.5) {
                            if (cPos.x > 0) {
                                this.dirX = -1;
                            } else {
                                this.dirX = 1;
                            }
                        } else {
                            if (Math.random() > .5) {
                                this.dirX = -1;
                            } else {
                                this.dirX = 1;
                            }
                        }
                        this.moveInfo.speedX = this.dirX * 1.5 / (this.eventTime * 60);
                        this.moveInfo.accelerateZ = Math.random() * .1;
                        break;
                    }
                } else {
                    this.mType = 0;
                    this.reset();
                }
            }
            this.moveFun2();
            let mcPos = GameModel.I.mainCarPos;
            let mcScale = GameModel.I.mainCarScale;
            let cPos = this.car.transform.position;
            if (mcPos.z - cPos.z > 7) {
                LayaSample.modelCreator.recoverAiCar(this.car);
                return;
            }
            if (!this.hasAddScore && mcPos.z > cPos.z) {
                this.hasAddScore = true;
                if (LayaSample.speedZ - this.moveInfo.speedZ > .3) {
                    var disX = Math.abs(mcPos.x - cPos.x);
                    var score = 0;
                    if (disX < .9) {
                        score = 10;
                    } else if (disX < 1.8) {
                        score = 5;
                    }
                    if (this.mainCarComp.hasBuff) {
                        score = 10;
                    }
                    if (score > 0) {
                        if (score == 5) {
                            GameModel.I.mainCarComp.showPass(0);
                            LayaSample.glEvent.event("add_score", 5);
                            LayaSample.soundMgr.play("chaoche");
                        } else {
                            if (Laya.Browser.now() - AICar.overtakeTime < 3e3) {
                                AICar.overtakeCount++;
                                if (AICar.overtakeCount > 5) {
                                    AICar.overtakeCount = 5;
                                }
                            } else {
                                AICar.overtakeCount = 1;
                            }
                            LayaSample.soundMgr.play("lianxu" + AICar.overtakeCount);
                            score = AICar.overtakeCount * score;
                            console.log("", score);
                            AICar.overtakeTime = Laya.Browser.now();
                            GameModel.I.mainCarComp.showPass(1);
                            LayaSample.glEvent.event("add_score", score);
                            this.flyFontScore(score);
                        }
                        LayaSample.wxMgr.playVibrateShort();
                    }
                }
            }
            if (Math.abs(mcPos.z - cPos.z) > this.realLen + mcScale.y) {
                return;
            }
            if (Math.abs(mcPos.x - cPos.x) > this.realWidth + mcScale.x - .2) {
                return;
            }
            if (this.isBuffCar) {
                GameModel.I.mainCar.getComponent(Car).addBuff();
                LayaSample.modelCreator.recoverAiCar(this.car);
                LayaSample.glEvent.event("add_buff");
                return;
            }
            if (this.mainCarComp.hasBuff) {
                return;
            }
            GameModel.I.mainCar.getComponent(Car).hit();
                AICar.hitCar = this;
                console.log("123")
         //  if (LayaSample.speedZ - this.moveInfo.speedZ > .3) {
         //      GameModel.I.mainCar.getComponent(Car).hit();
         //      AICar.hitCar = this;
         //  } else {
         //      if (mcPos.x - cPos.x > 0) {
         //          this.moveV3.setValue(-.1, 0, 0);
         //      } else {
         //          this.moveV3.setValue(.1, 0, 0);
         //      }
         //      this.car.transform.translate(this.moveV3, false);
         //  }
        }
        flyFontScore(val) {
            var scoreImg;
            var font;
            if (val == 10) {
                scoreImg = Laya.Pool.getItemByClass("score_image_FLAG", Laya.Image);
                scoreImg.skin = "ui/common/chaoche.png";
            } else if (val > 10) {
                scoreImg = Laya.Pool.getItemByClass("score_image_FLAG", Laya.Image);
                scoreImg.skin = "ui/common/lianxuchaoche.png";
            }
            if (scoreImg) {
                if (scoreImg.numChildren == 0) {
                    font = new Laya.FontClip("ui/common/scroe2.png", "1234567890+");
                    font.x = 271;
                    font.y = 18;
                    scoreImg.addChild(font);
                } else {
                    font = scoreImg.getChildAt(0);
                }
                font.value = "+" + val;
                scoreImg.alpha = 1;
                scoreImg.pos(17, 464);
                Laya.stage.addChild(scoreImg);
                scoreImg.alpha = .5;
                Laya.Tween.to(scoreImg, {
                    y: scoreImg.y - 100,
                    alpha: 1
                }, 200);
                Laya.Tween.to(scoreImg, {
                    y: scoreImg.y - 150,
                    alpha: .3
                }, 200, null, Laya.Handler.create(this, function() {
                    scoreImg.removeSelf();
                    Laya.Pool.recover("score_image_FLAG", scoreImg);
                }), 800);
            }
        }
        moveFun2() {
            let cPos = this.car.transform.position;
            let canX = false;
            var nowTime = Laya.Browser.now();
            for (const key in this.aiCars) {
                let element = this.aiCars[key];
                if (element != this.car) {
                    let tPos = element.transform.position;
                    let tAiCar = element.getComponent(AICar);
                    if (tPos.z - cPos.z < this.realLen + tAiCar.realLen + 1) {
                        if (Math.abs(cPos.x - tPos.x) < this.realWidth + tAiCar.realWidth + .5) {
                            if (!this.moveInfo.speedX) {
                                this.moveInfo.speedX = .04;
                            }
                            if (cPos.x > tPos.x) {
                                this.moveInfo.speedX = Math.abs(this.moveInfo.speedX);
                            } else {
                                this.moveInfo.speedX = -Math.abs(this.moveInfo.speedX);
                            }
                            canX = true;
                            this._delayChange = nowTime + 600;
                            break;
                        }
                    }
                }
            }
            if (this.moveInfo.canMoveX || canX) {
                this.moveV3.setValue(this.moveInfo.speedX, 0, this.moveInfo.speedZ + this.moveInfo.accelerateZ);
            } else {
                if (nowTime > this._delayChange && (cPos.x % .75 != 0 || cPos.x % 1.5 == 0)) {
                    var mx = .01;
                    var targetPos = 1e3;
                    for (let index = 0; index < this.centerPos.length; index++) {
                        const element = this.centerPos[index];
                        if (Math.abs(cPos.x - element) < Math.abs(cPos.x - targetPos)) {
                            targetPos = element;
                        }
                    }
                    if (Math.abs(targetPos - cPos.x) < .01) {
                        mx = Math.abs(targetPos - cPos.x);
                    }
                    if (targetPos > cPos.x) {
                        mx = mx;
                    } else {
                        mx = -mx;
                    }
                    this.moveV3.setValue(mx, 0, this.moveInfo.speedZ + this.moveInfo.accelerateZ);
                } else {
                    this.moveV3.setValue(0, 0, this.moveInfo.speedZ + this.moveInfo.accelerateZ);
                }
            }
            this.car.transform.translate(this.moveV3, false);
            cPos = this.car.transform.position;
            this.canTurn = true;
            if (cPos.x + this.realWidth > 3) {
                cPos.x = 3 - this.realWidth;
                this.car.transform.position = cPos;
                this.moveV3.x = 0;
                this.canTurn = false;
            }
            if (cPos.x - this.realWidth < -3) {
                cPos.x = -3 + this.realWidth;
                this.car.transform.position = cPos;
                this.moveV3.x = 0;
                this.canTurn = false;
            }
        }
        turnCar(moveV3) {
            var temp = 0;
            if (moveV3.x == 0) {
                temp = 0;
            } else if (moveV3.x > 0) {
                temp = 1;
            } else {
                temp = 2;
            }
            if (temp == this.dir) {
                return;
            }
            this.dir = temp;
            var tV3;
            switch (this.dir) {
              case 0:
                tV3 = this.straight;
                break;

              case 1:
                tV3 = this.turnLeft;
                break;

              case 2:
                tV3 = this.turnRight;
                break;
            }
            var tween = Laya.Tween.to(this.lerpRot, {
                y: tV3.y
            }, 300, null, null, null, true);
            tween.update = new Laya.Handler(this, function() {
                this.car.transform.localRotationEuler = this.lerpRot;
            });
        }
        moveFun() {
            let cPos;
            if (this.moveInfo.canMoveX) {
                cPos = this.car.transform.position;
                let canX = true;
                for (const key in this.aiCars) {
                    let element = this.aiCars[key];
                    if (element != this.car) {
                        let tPos = element.transform.position;
                        let tAiCar = element.getComponent(AICar);
                        if (Math.abs(tPos.z - cPos.z) < this.realLen + tAiCar.realLen + .2) {
                            if ((cPos.x - tPos.x) * this.dirX < this.realWidth + tAiCar.realWidth - .5) {
                                canX = false;
                                break;
                            }
                        }
                    }
                }
                if (canX) {
                    this.moveV3.setValue(this.moveInfo.speedX, 0, this.moveInfo.speedZ + this.moveInfo.accelerateZ);
                } else {
                    this.moveV3.setValue(0, 0, this.moveInfo.speedZ + this.moveInfo.accelerateZ);
                }
            } else {
                this.moveV3.setValue(0, 0, this.moveInfo.speedZ + this.moveInfo.accelerateZ);
            }
            this.car.transform.translate(this.moveV3, false);
            cPos = this.car.transform.position;
            if (cPos.x + this.realWidth > 3) {
                cPos.x = 3 - this.realWidth;
                this.car.transform.position = cPos;
            }
            if (cPos.x - this.realWidth < -3) {
                cPos.x = -3 + this.realWidth;
                this.car.transform.position = cPos;
            }
        }
        randomEvent() {}
        changeColor(flag) {
            return;
            if (this.f == flag) {
                return;
            }
            if (flag) {
                this.car.getChildAt(0).getChildByName("Role").getChildByName("hulihuanxiong").skinnedMeshRenderer.material = this.orgMat;
            } else {
                this.car.getChildAt(0).getChildByName("Role").getChildByName("hulihuanxiong").skinnedMeshRenderer.material = this.repMat;
            }
        }
    }
    AICar.overtakeCount = 1;
    AICar.overtakeTime = 0;
    AICar.hitCar = null;
    class CarInfo {}
    class ModelCreator extends Laya.Script3D {
        constructor() {
            super();
            this.roads = [];
            this.constructs = [];
            this.bikeComps = [];
            this.carInfos = [];
            this.aiCars = [];
            this.carRoadWidth = 6 / 4;
            this.cheDic = {};
            this.offset = 0;
            this.constructsArray = [];
        }
        init(scene) {
            this.scene = scene;
            let models = Laya.loader.getRes("res/scenes/Conventional/ModelScene.ls");
            this.constructsPrefab = models.getChildByName("Constructions");
            let len = this.constructsPrefab.numChildren;
            for (let index = 0; index < len; index++) {
                var elm = this.constructsPrefab.getChildAt(index);
                this.constructs.push(elm);
            }
            this.setChes();
        }
        setChes() {
            this.cheModels = Laya.Loader.getRes("jsonConfig/CheConfig.json");
            let models = Laya.loader.getRes("res/scenes/Conventional/ModelScene.ls");
            if (!models) return;
            this.cheGO = models.getChildByName("che");
            let len = this.cheGO.numChildren;
            for (let index = 0; index < len; index++) {
                var info = new CarInfo();
                info.model = this.cheGO.getChildAt(index);
                var cInfo = this.cheModels[index];
                if (cInfo.name != info.model.name) {
                    console.log("车模型的数据没对上", cInfo.name, info.model.name);
                }
                info.realWidth = cInfo.width * .5;
                info.realLen = cInfo.len * .5;
                if (cInfo.name.startsWith("che")) {
                    this.carInfos.push(info);
                } else {
                    this.cheDic[cInfo.name] = info;
                }
            }
        }
        createAiCar(count, offset) {
            let wdAdd = -3;
            let tspeedZ = Math.random() * .4;
            for (let index = 0; index < count; index++) {
                let carInfo = this.carInfos[index];
                let model = Laya.Pool.getItemByCreateFun("car_ai" + index.toString, function() {
                    return Laya.Sprite3D.instantiate(carInfo.model);
                }, this);
                model.name = index.toString();
                wdAdd += carInfo.realWidth;
                model.transform.position = new Laya.Vector3(wdAdd, 0, offset);
                wdAdd += carInfo.realWidth + .2 + Math.random();
                let comp = model.getComponent(AICar);
                if (!comp) {
                    comp = model.addComponent(AICar);
                    comp.moveInfo.speedZ = tspeedZ + Math.random() * .001;
                    if (Math.random() > .7) {
                        comp.moveInfo.speedX = .06 * Math.random();
                        comp.moveInfo.canMoveX = true;
                    }
                    comp.init(carInfo.realWidth, carInfo.realLen);
                } else {
                    comp.moveInfo.speedZ = tspeedZ + Math.random() * .001;
                }
                comp.initRefresh();
                this.aiCars.push(model);
                this.scene.addChild(model);
            }
        }
        createAiCar2(offset, isBuffCar = false) {
            if (this.aiCars.length > 60) {
                return;
            }
            let wdAdd = -2.25;
            let posNum = Math.random() * 4 | 0;
            let roadPos = wdAdd + posNum * 1.5;
            let tspeedZ = .05 + Math.random() * .4;
            let index = Math.random() * this.carInfos.length | 0;
            let carInfo = this.carInfos[index];
            let model;
            if (isBuffCar) {
                model = Laya.Pool.getItemByCreateFun("buff_car", function() {
                    return Laya.Sprite3D.instantiate(this.cheDic["daojuche"].model);
                }, this);
            } else {
                model = Laya.Pool.getItemByCreateFun("car_ai" + index.toString, function() {
                    return Laya.Sprite3D.instantiate(carInfo.model);
                }, this);
            }
            model.name = index.toString();
            model.transform.position = new Laya.Vector3(roadPos, 0, offset);
            let comp = model.getComponent(AICar);
            if (!comp) {
                comp = model.addComponent(AICar);
                comp.moveInfo.speedZ = tspeedZ + Math.random() * .001;
                if (Math.random() > .7) {
                    comp.moveInfo.speedX = .05 * Math.random();
                }
                comp.init(carInfo.realWidth, carInfo.realLen);
            } else {
                comp.moveInfo.speedZ = tspeedZ + Math.random() * .001;
            }
            comp.isBuffCar = isBuffCar;
            comp.initRefresh();
            this.aiCars.push(model);
            this.scene.addChild(model);
        }
        recoverAiCar(aiCar) {
            this.aiCars.splice(this.aiCars.indexOf(aiCar), 1);
            Laya.Pool.recover("car_ai" + aiCar.name, aiCar);
            aiCar.removeSelf();
        }
        createRoad(target, road, length, factor) {
            let roadItem = Laya.Pool.getItemByCreateFun("road", function() {
                return Laya.Sprite3D.instantiate(road);
            });
            this.scene.addChild(roadItem);
            let pos = road.transform.position.clone();
            roadItem.transform.position = new Laya.Vector3(pos.x, pos.y, pos.z + length * factor);
            this.roads.push(roadItem);
        }
        recoverAllAiCar() {
            for (var i = 0; i < this.aiCars.length; i++) {
                let aiCar = this.aiCars[i];
                Laya.Pool.recover("car_ai" + aiCar.name, aiCar);
                aiCar.removeSelf();
            }
            this.aiCars.length = 0;
        }
        recoverRoad() {
            for (var i = 0; i < this.roads.length; i++) {
                let roadItem = this.roads[i];
                Laya.Pool.recover("road", roadItem);
                this.scene.removeChild(roadItem);
            }
            this.roads.length = 0;
        }
        recoverAll() {
            this.recoverRoad();
            this.clearConstructs();
            this.recoverAllAiCar();
        }
        random() {
            let randomNum = Math.floor(Math.random() * 1e3 % 13.45);
            return Math.random() > .5 ? randomNum : -randomNum;
        }
        randomCreateConstructs(offset) {
            this.offset = offset;
            let randomNum = Math.random() * this.constructs.length | 0;
            let constructs = this.constructs[randomNum];
            let clone = Laya.Sprite3D.instantiate(constructs);
            clone.transform.position = new Laya.Vector3(0, 0, this.offset - 21 * randomNum);
            this.scene.addChild(clone);
            this.constructsArray.push(clone);
        }
        createConstruct(model) {
            let construct = this.constructsPrefab.getChildByName(model.name);
            let clone = Laya.Sprite3D.instantiate(construct);
            this.scene.addChild(clone);
            clone.transform.position = new Laya.Vector3(Number(model.position.x), 0, Number(model.position.z) + this.offset);
            if (model.position.x < 0) {
                clone.transform.rotationEuler = new Laya.Vector3(0, -90, 0);
                clone.transform.scale = new Laya.Vector3(-1, 1, 1);
            } else {
                clone.transform.rotationEuler = new Laya.Vector3(0, 90, 0);
                clone.transform.scale = new Laya.Vector3(1, 1, 1);
            }
            this.constructsArray.push(clone);
        }
        clearConstructs() {
            this.constructsArray.forEach(element => {
                element.destroy();
            });
            this.constructsArray = [];
        }
    }
    class commonData {
        constructor() {
            this.newScore = 1;
            this.newLevel = 1;
            this.goonCount = 0;
            this.isGame = false;
            this.isSleep = false;
            this.watchVideo = false;
            this.watchInter = false;
            this.useTime = 1e3;
            this.gameList = null;
            this.currentVersion = "6";
            this.showRevivalCard = false;
            this.needWxAuthorize = false;
            this.userInfo = {};
            this.existInterAd = false;
            this.existVideoAd = false;
            this.existBannerAd = false;
            this.isNoAds = false;
            this.isAdDelay = false;
            this.adTime = 1e3;
            this.latencyTime = 900;
            this.moveTime = 1e3;
            this.topView = "";
            this.shareInfo = {};
            this.launchOptions = {};
            this.wxappList = {};
            this.wxsysInfo = {};
            this.roleSkinList = [];
            this.pillarSkinList = [];
            this.roleSkinIndex = 0;
            this.skinGameCount = 0;
            this.signin = null;
            this.isCheckSignin = false;
            this.lateWay = 0;
            this.needShowGuide = false;
            this.gameCount = 0;
            this.isShowSkin = false;
            this.skinIncome = 0;
            this.skinScore = 0;
            this.gameStartCount = 0;
            this.show_video = false;
            this.delay_num = [];
            this.show_box = false;
            this.move_time = 1e3;
            this.isHideFaultClick = true;
            this.completeFaultClick = false;
        }
    }
    class LayaSample {
        static get gameMgr() {
            return this._gameMgr;
        }
        static get glEvent() {
            return this._eventListener;
        }
        static get soundMgr() {
            if (this._soundMgr === undefined) {
                this._soundMgr = new SoundMgr();
            }
            return this._soundMgr;
        }
        static get storageMgr() {
            if (this._storageMge === undefined) {
                this._storageMge = new StorageMgr();
            }
            return this._storageMge;
        }
        static get netMgr() {
            return this._netMgr;
        }
        static get commonData() {
            return this._commonData;
        }
        static get utils() {
            return this._utils;
        }
        static get tweenMgr() {
            return this._tweenMgr;
        }
        static get configMgr() {
            if (this._configMgr === undefined) {
                this._configMgr = new ConfigMgr();
            }
            return this._configMgr;
        }
        static get adMgr() {
            if (this._adMgr === undefined) {
                this._adMgr = this.wxAd;
            }
            return this._adMgr;
        }
        static set adMgr(value) {
            this._adMgr = value;
        }
        static get wxMgr() {
            if (this._wxMgr === undefined) {
                this._wxMgr = new WxMgr();
            }
            return this._wxMgr;
        }
        static get wxAd() {
            if (this._wxAd === undefined) {
                this._wxAd = new WxAd();
            }
            return this._wxAd;
        }
        static get modelCreator() {
            if (this._modelCreator === undefined) {
                this._modelCreator = new ModelCreator();
            }
            return this._modelCreator;
        }
    }
    LayaSample._eventListener = new Laya.EventDispatcher();
    LayaSample._gameMgr = new GameMgr();
    LayaSample._netMgr = new NetMgr();
    LayaSample._utils = new Utils();
    LayaSample._tweenMgr = new TweenMgr();
    LayaSample._commonData = new commonData();
    LayaSample.speedZ = 0;
    LayaSample.roadWidth = 3;
    LayaSample.screen = {
        realPxRatio: 0,
        offsetTop: 0,
        allScreen: false
    };
    class BaseView extends Laya.Scene {
        constructor() {
            super();
            this._maxBottom = 264;
            this._minBottom = 60;
        }
        onAwake() {
            this.initData();
            this.initUI();
            this.initEvent();
            this.initEventBase();
            this.initSize();
            this.initBanner();
        }
        onOpened(data) {
            if (!LayaSample.commonData.existInterAd) return;
            if (LayaSample.commonData.isAdDelay) {
                if (this.url == "views/home.scene" || this.url == "views/rank.scene") LayaSample.adMgr.showInterstitialAd();
            } else {
                if (this.url == "views/clearing.scene" || this.url == "views/rank.scene") LayaSample.adMgr.showInterstitialAd();
            }
        }
        onClosed() {
            Laya.timer.clearAll(this);
            LayaSample.glEvent.offAllCaller(this);
        }
        initData() {
            this._isOpen = true;
            LayaSample.commonData.topView = this.url;
        }
        initUI() {}
        initEvent() {}
        initEventBase() {
            LayaSample.glEvent.on("loadAd", this, this.onLoadAdEvent);
            LayaSample.glEvent.on("showAd", this, this.onShowAdEvent);
        }
        getChild(name, object) {
            if (!object) object = this;
            return object.getChildByName(name);
        }
        initSize() {
            if (!Laya.Browser.onWeiXin) return;
            let view = this;
            view.height = Laya.stage.height;
            let offsetTop = LayaSample.screen.offsetTop;
            let pixelRatio = LayaSample.screen.realPxRatio;
            let sysInfo = LayaSample.commonData.wxsysInfo;
            let btm = 0;
            for (let index = 0; index < view._children.length; index++) {
                let node = view._children[index];
                let posY = node.y + offsetTop;
                if (node.name == "topPanel") {
                    if (sysInfo.statusBarHeight >= 30 && LayaSample.screen.allScreen) {
                        posY = sysInfo.statusBarHeight * pixelRatio;
                    } else {
                        posY = 30;
                    }
                    let collectHand = node.getChildByName("collectHand");
                    if (collectHand) {
                        collectHand.visible = !LayaSample.storageMgr.isCollect();
                        LayaSample.tweenMgr.toPosition(collectHand, new Laya.Vector3(300, 0), 1e3, true);
                    }
                }
                node.y = posY;
                if (node.name == "bottomPanel" || node.name == "bottomui") {
                    btm = LayaSample.commonData.isAdDelay && node.name == "bottomPanel" ? this._minBottom : this._maxBottom;
                    if (sysInfo && sysInfo.model.startsWith("iPhone X")) {
                        btm += 40;
                    }
                    node.bottom = btm;
                }
            }
        }
        initBanner() {
            if (!Laya.Browser.onWeiXin) return;
            if (this.url != "views/login.scene" && this.url != "views/game.scene") {
                Laya.timer.clear(this, this.refreshBannerAd);
                this.refreshBannerAd();
            }
        }
        refreshBannerAd() {
            if (this.url == "views/game.scene") return;
            if (this.url != "views/home.scene") {
                this.resetBannerAd();
                LayaSample.adMgr.setBannerItem();
            } else if (!this._isOpen) {
                LayaSample.adMgr.setBannerItem();
            }
            if (!LayaSample.adMgr.getBannerItem()) LayaSample.adMgr.setBannerItem();
            this._isOpen = false;
            LayaSample.adMgr.hideBannerAd();
            if (LayaSample.commonData.isAdDelay) {
                Laya.timer.clear(this, this.reappearBannerAd);
                Laya.timer.once(LayaSample.commonData.latencyTime, this, this.reappearBannerAd);
            } else {
                this.reappearBannerAd();
            }
            if (this.url == "views/home.scene") {
                LayaSample.commonData.isNoAds = true;
                LayaSample.adMgr.hideBannerAd();
            }
        }
        reappearBannerAd() {
            LayaSample.adMgr.showBannerAd();
        }
        resetBannerAd() {
            let banner = LayaSample.adMgr.getBannerItem();
            if (!banner) return;
            let beforeWidth = banner.width;
            let beforeHeight = banner.height;
            let clientWidth = Laya.Browser.clientWidth;
            if (beforeWidth == clientWidth) return;
            this._isResizeAd = true;
            LayaSample.adMgr.setBannerAdWidth(clientWidth);
        }
        tweenAd() {
            let banner = LayaSample.adMgr.getBannerItem();
            if (!banner) return;
            let bnWidth = banner.width;
            let bnHeight = banner.height;
            let pxRatio = LayaSample.screen.realPxRatio;
            let realAdHeight = Math.floor(bnHeight * pxRatio);
            for (let i = 0; i < this._children.length; ++i) {
                let view = this._children[i];
                if (view.name == "bottomPanel") {
                    if (bnHeight && view.bottom < realAdHeight) {
                        Laya.Tween.to(view, {
                            bottom: realAdHeight
                        }, LayaSample.commonData.moveTime, Laya.Ease.expoInOut, Laya.Handler.create(this, () => {}), 0, true);
                    }
                }
                if (view.name == "middlePanel" && bnHeight) {
                    let heightCont = view.y + view.height + realAdHeight;
                    if (heightCont > Laya.stage.height) {
                        view.y = view.y - (heightCont - Laya.stage.height);
                    }
                }
            }
        }
        onLoadAdEvent(event) {
            switch (event.adtype) {
              case "video":
                if (!event.isLoad) ;
                break;

              case "banner":
                if (event.isLoad) ;
                break;

              default:
                break;
            }
        }
        onShowAdEvent(evt) {
            if (evt && evt.adtype != "banner") {
                return;
            }
            this.tweenAd();
        }
    }
    class ClearingView extends BaseView {
        initData() {
            if (!Laya.Browser.onWeiXin) {
                return;
            }
            console.log("上传分数：" + LayaSample.commonData.newLevel + "," + LayaSample.commonData.newScore);
            LayaSample.wxMgr.settlementLevel(LayaSample.commonData.newScore);
            if (LayaSample.adMgr.getBannerCount() < 2) LayaSample.adMgr.getBannerAd();
            if (!LayaSample.commonData.existVideoAd) LayaSample.adMgr.loadVideoAd();
        }
        initUI() {
            let bottomPanel = this.getChild("bottomPanel");
            this.btnBack = this.getChild("btnBack", bottomPanel);
            this.btnPlay = this.getChild("btnPlay", bottomPanel);
            this.btnShare = this.getChild("btnShare", bottomPanel);
            this.btnGameL1 = this.getChild("btnGameL1");
            this.btnGameL2 = this.getChild("btnGameL2");
            this.btnGameR1 = this.getChild("btnGameR1");
            this.btnGameR2 = this.getChild("btnGameR2");
            let score = this.getChild("score");
            this.fontScore = this.getChild("fontScore", score); 
            this.fontScore.value = LayaSample.commonData.newScore.toString();
            this.savescore(parseInt(LayaSample.commonData.newScore.toString()));
            this.setWxapp(0);
            this.setWxapp(1);
            this.setWxapp(2);
            this.setWxapp(3);
        }
        savescore(score){
            var bestScore=Laya.LocalStorage.getJSON("bestScore");
            if(bestScore.bestScore<score){
                bestScore.bestScore=score;
                Laya.LocalStorage.setJSON("bestScore",bestScore);
            }

        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnShare, this, this.onShareClick);
            LayaSample.utils.addClickEvent(this.btnPlay, this, this.onPlayGameClick);
            LayaSample.utils.addClickEvent(this.btnBack, this, this.onBackClick);
            LayaSample.utils.addClickEvent(this.btnGameL1, this, this.onWxgameClick);
            LayaSample.utils.addClickEvent(this.btnGameR1, this, this.onWxgameClick);
            this.btnGameL2 && LayaSample.utils.addClickEvent(this.btnGameL2, this, this.onWxgameClick);
            this.btnGameR2 && LayaSample.utils.addClickEvent(this.btnGameR2, this, this.onWxgameClick);
            LayaSample.glEvent.on("backShare", this, this.onShareBackEvent);
            LayaSample.glEvent.on("wakeWx", this, this.onWxWakeEvent);
            LayaSample.glEvent.on("appliteShow", this, this.onWxWakeEvent);
            LayaSample.glEvent.on("wxapp_close_view", this, () => {
                this.closeView2();
            });
        }
        closeView2() {
            LayaSample.glEvent.event("gameInit", {
                isPlay: false
            });
            this.close();
        }
        onWxgameClick(event) {
            let appid = event.target.appData.appid;
            if (appid && appid != "") {
                LayaSample.wxMgr.openOtherApp(appid, event.target.appData.appIndex, 2);
            } else console.log("appid error.");
        }
        onShareClick() {
            LayaSample.wxMgr.shareFriend(0, true);
        }
        onPlayGameClick() {
          //  this.close();
          //  GameController.getInstance().getGamelist().visible=false;
          //  let isShow = LayaSample.storageMgr.isSkinTips();
          //  if (isShow && LayaSample.commonData.existVideoAd) {
          //      let data = {};
          //      data.target = "views/home.scene";
          //      Laya.Scene.open("views/freeSkin.scene", false, data, Laya.Handler.create(this, v => {}));
          //  } else {
          //      LayaSample.glEvent.event("gameInit", {
          //          isPlay: true
          //      });
          //  }



            GameController.getInstance().stopGame();
            platform.getInstance().showInterstitial(()=>{
                this.close();
                GameController.getInstance().getGamelist().visible=false;
                let isShow = LayaSample.storageMgr.isSkinTips();
                if (isShow && LayaSample.commonData.existVideoAd) {
                    let data = {};
                    data.target = "views/home.scene";
                    Laya.Scene.open("views/freeSkin.scene", false, data, Laya.Handler.create(this, v => {}));
                } else {
                    LayaSample.glEvent.event("gameInit", {
                        isPlay: true
                    });
                }
                GameController.getInstance().resumeGame();
                if(LayaSample.storageMgr.isPlaySound()){
                    window.WebAudioEngine.playMusic("res/sound/bgm.mp3");
                }
                //LayaSample.storageMgr.isPlaySound()
            })
        }
        onBackClick() {
            GameController.getInstance().getGamelist().visible=false;
            LayaSample.glEvent.event("gameInit", {
                isPlay: false
            });
            this.onWxWakeEvent();
        }
        onOpenView() {
            this.close();
            this.showRank(false);
        }
        showRank(isShow) {
            LayaSample.wxMgr.showLiteRank(isShow);
        }
        onWxWakeEvent() {
            LayaSample.commonData.isNoAds = true;
            Laya.Scene.open("views/home.scene", false, laya.utils.Handler.create(this, this.close));
        }
        onShareBackEvent(event) {
            if (event.isShare) {
                console.log("分享成功");
            } else {
                console.log("分享失败");
            }
        }
        setWxapp(appIndex) {
            let appList = LayaSample.wxMgr.getWxappList(3);
            if (!appList) return;
            let appCount = appList.length;
            if (appCount == 0) return;
            if (!appList[appIndex]) return;
            let appData = {
                appid: appList[appIndex].app_id,
                appIndex: 0
            };
            let btnGame = null;
            switch (appIndex) {
              case 0:
                btnGame = this.btnGameL1;
                break;

              case 1:
                btnGame = this.btnGameR1;
                break;

              case 2:
                btnGame = this.btnGameL2;
                break;

              case 3:
                btnGame = this.btnGameR2;
                break;

              default:
                return;
            }
            if (btnGame == null) return;
            btnGame.visible = true;
            btnGame.skin = appList[appIndex].app_img;
            btnGame.appData = appData;
            Laya.timer.loop(3e3, this, function() {
                appIndex++;
                if (appIndex >= appCount) {
                    appIndex = 0;
                }
                if (!appList[appIndex]) return;
                appData.appid = appList[appIndex].app_id;
                btnGame.skin = appList[appIndex].app_img;
                btnGame.appData = appData;
                LayaSample.utils.tweenShake(btnGame, null);
            });
        }
    }
    class AppBanner extends Laya.Script {
        constructor() {
            super();
            this._appCount = -1;
            this._appIndex = 0;
            this.repeatX = 0;
        }
        onStart() {
            this.initData();
            this.initUI();
            this.setBanner();
            this.setPanelBottom();
            this.initEvent();
            Laya.timer.loop(3e3, this, this.nextBanner);
        }
        initData() {
            this.data = LayaSample.wxMgr.getWxappList(this.category);
            this._appCount = this.data.length;
        }
        initUI() {
            this.banner.visible = false;
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.banner, this, this.onBannerClick, 14);
            LayaSample.glEvent.on("loadAd", this, this.onAdLoadEvent);
        }
        onDisable() {
            Laya.timer.clear(this, this.nextBanner);
            LayaSample.glEvent.off("loadAd", this, this.onAdLoadEvent);
        }
        setBanner() {
            let btn = this.banner;
            if (this._appCount > 0) {
                let info = this.data[this._appIndex];
                btn.skin = info.app_img;
                btn.appid = info.app_id;
            }
            btn.visible = !LayaSample.commonData.existBannerAd && !LayaSample.commonData.isNoAds && this._appCount > 0;
        }
        nextBanner() {
            let index = this._appIndex;
            index++;
            if (index >= this._appCount) index = 0;
            this._appIndex = index;
            this.setBanner();
        }
        onAdLoadEvent(evt) {
            if (evt.adtype != "banner") return;
            this.setBanner();
            this.setPanelBottom();
        }
        setPanelBottom() {
            if (this.panel && !LayaSample.commonData.existBannerAd && this._appCount > 0) {
                this.panel.bottom = this.banner.height;
                let sysInfo = LayaSample.commonData.wxsysInfo;
                if (sysInfo && sysInfo.model.startsWith("iPhone X")) {
                    this.panel.bottom = this.banner.height + 40;
                }
            }
        }
        onBannerClick(event) {
            let appid = event.target.appid;
            if (appid && appid != "") LayaSample.wxMgr.openOtherApp(appid, this.category); else console.log("this appid error!!!");
        }
    }
    class CollectView extends BaseView {
        onAwake() {
            LayaSample.commonData.isNoAds = true;
            LayaSample.adMgr.hideBannerAd();
            super.onAwake();
        }
        initUI() {
            this.btnCancel = this.getChild("btnCancel");
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnCancel, this, this.cancelClick);
        }
        cancelClick() {
            this.close();
            LayaSample.commonData.isNoAds = false;
            LayaSample.adMgr.showBannerAd();
        }
    }
    class FirstIncomeView extends BaseView {
        initUI() {
            this.btnBack = this.getChildByName("btnBack");
            LayaSample.adMgr.hideBannerAd();
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnBack, this, this.onBackClick);
            LayaSample.glEvent.on("wxapp_close_view", this, () => {
                this.closeView();
            });
        }
        closeView() {
            this.close();
        }
        onBackClick() {
            this.close();
        }
    }
    class AppItem extends Laya.Box {
        constructor() {
            super();
            this.icon = null;
            this.initItem();
        }
        onDisable() {}
        initItem() {
            if (!AppItem.appPrefab) {
                console.error("this app prefab is null!!");
                return;
            }
            let item = Laya.Pool.getItemByCreateFun("appItem", AppItem.appPrefab.create, AppItem.appPrefab);
            this.icon = item.getChildByName("icon");
            this.icon.width = AppItem.appWidth;
            this.icon.height = AppItem.appHeight;
            item.size(AppItem.appWidth, AppItem.appHeight);
            this.addChild(item);
        }
        setItemInfo(data) {
            if (data == null) {
                return;
            }
            this.icon.loadImage(data.app_img);
            this.appId = data.app_id;
        }
    }
    AppItem.appWidth = 128;
    AppItem.appHeight = 128;
    class AppLite extends Laya.Script {
        constructor() {
            super();
            this.appCount = -1;
            this.needClearTimer = false;
            this.cate = 0;
            this.ind = 0;
            this.prevInd = 0;
            this.renderCount = 4;
            this.speed = 3e3;
        }
        closeComp() {
            Laya.timer.clearAll(this);
            this.panel.visible = false;
            console.log("hide---");
            this.isHide = true;
        }
        onDisable() {
            
            Laya.timer.clearAll(this);
            this.panel.visible = false;
            console.log("hide---");
        }
        onStart() {
            if (this.isHide) return;
            this.initData();
            this.initUI();
            this.initList();
        }
        initUI() {
            let isShow = this.appCount != 0;
            this.list.visible = isShow;
            this.panel.visible = isShow;
        }
        initData() {
            AppItem.appWidth = this.appWidth;
            AppItem.appHeight = this.appHeight;
            AppItem.appPrefab = this.appPrefab;
            this.data = LayaSample.wxMgr.getWxappList(this.category);
            this.appCount = this.data.length;
            if (this.appCount <= 6) {
                return;
            }
            let i = 0;
            let weightCount = 0;
            for (i = 0; i < this.appCount; ++i) {
                weightCount += this.data[i].weight;
            }
            let weightItem = [];
            let weight = 0;
            for (i = 0; i < this.appCount; ++i) {
                weight += this.data[i].weight;
                weightItem[i] = {};
                weightItem[i].index = i;
                weightItem[i].weight = weight / weightCount;
            }
            let dataList = [];
            let probability = 0;
            let finish = false;
            let offset = 0;
            for (let j = 0; j < this.appCount; ++j) {
                probability = Math.random() * weightItem[weightItem.length - 1].weight;
                finish = false;
                for (i = 0; i < weightItem.length; ++i) {
                    if (!finish && probability <= weightItem[i].weight) {
                        finish = true;
                        dataList.push(this.data[weightItem[i].index]);
                        if (i + 1 < weightItem.length) {
                            offset = weightItem[i + 1].weight - weightItem[i].weight;
                        }
                    }
                    if (finish && i + 1 < weightItem.length) {
                        weightItem[i + 1].weight -= offset;
                        weightItem[i] = weightItem[i + 1];
                    }
                }
                weightItem.length -= 1;
            }
            this.data = dataList;
        }
        getData(weightItem, probability) {
            for (var i = 0; i < weightItem.length; ++i) {
                if (probability > weightItem[i]) ;
            }
        }
        initList() {
            let list = this.list;
            if (list != null) {
                list.itemRender = AppItem;
                list.vScrollBarSkin = "";
                list.selectEnable = true;
                list.renderHandler = new Laya.Handler(this, this.updateItem);
                list.mouseHandler = new Laya.Handler(this, this.onSelect);
                this.renderCount = list.repeatX * list.repeatY;
            }
            list.array = this.data;
            if (this.category == 1) {
                Laya.timer.once(1e3, this, this.moveList);
            }
        }
        moveList() {
            this.needClearTimer = false;
            if (this.list) {
                let len = (this.list.array.length + 2) / 3;
                if (len < 3) return;
                let ti = len * 3 - 6;
                this.list.tweenTo(ti, 3e3 * (ti - this.list.startIndex - 1), new Laya.Handler(this, this.moveList1));
            }
        }
        moveList1() {
            let len = (this.list.array.length + 2) / 3;
            if (len < 3) return;
            let ti = len * 3 - 6;
            this.list.tweenTo(0, 3e3 * ti, new Laya.Handler(this, this.moveList));
        }
        updateItem(cell, index) {
            cell.setItemInfo(cell.dataSource);
        }
        onSelect(e, index) {
            if (index < 0) return;
            if (e.type == "mouseup") {
                var data = this.list.getItem(index);
                if (data != null) {
                    LayaSample.wxMgr.openOtherApp(data.app_id, data.category, this.cate);
                }
            }
            if (this.category == 1) {
                if (this.needClearTimer) {
                    Laya.timer.clear(this, this.moveList);
                }
                this.needClearTimer = true;
                if (this.list.startIndex < 3) {
                    Laya.timer.once(1e3, this, this.moveList);
                } else {
                    Laya.timer.once(1e3, this, this.moveList1);
                }
            }
            this.list.selectedIndex = -1;
        }
        _setData(_data) {
            this.ind = 0;
            if (this.panel != null) {
                if (this.data == null || this.data.length == 0) {
                    this.panel.visible = false;
                } else {
                    this.panel.visible = true;
                }
            }
            this.list.array = this.data;
            if (this.data.length > this.renderCount) {
                Laya.timer.frameOnce(1, this, this._tweenToNext);
            }
        }
        _tweenToNext() {
            Laya.timer.clearAll(this);
            this.ind = Math.max(this.list.repeatY, this.list.startIndex);
            if (this.ind == this.prevInd) {
                this.ind += this.list.repeatY;
            }
            if (this.ind > this.appCount) {
                this.list.scrollTo(0);
                this.ind = this.list.repeatY;
            }
            this.prevInd = this.ind;
            this.list.tweenTo(this.ind, this.speed - 10);
            Laya.timer.once(this.speed, this, this._tweenToNext);
        }
        _copyEndDataToStart(data) {
            this.appCount = data.length;
            if (data.length > this.renderCount) {
                for (let index = 0; index < this.renderCount; index++) {
                    const element = data[data.length - index - 1];
                    data.unshift(element);
                }
            }
        }
    }
    class skinItem extends Laya.Box {
        constructor() {
            super();
            this.icon = null;
            this.getTypeTag = null;
            this.initItem();
        }
        onDisable() {}
        initItem() {
            if (!skinItem.itemPrefab) {
                console.error("this app prefab is null!!!");
                return;
            }
            let item = Laya.Pool.getItemByCreateFun("SkinItem", skinItem.itemPrefab.create, skinItem.itemPrefab);
            this.icon = item.getChildByName("skinIcon");
            this.getTypeTag = item.getChildByName("typeTag");
            this.icon.size(skinItem.iconWidth, skinItem.iconHeight);
            this.icon.pos(skinItem.iconOffset.x, skinItem.iconOffset.y);
            this.addChild(item);
        }
        setItemInfo(data) {
            if (data == null) {
                return;
            }
            this.icon.skin = data.iconPath;
            this.getTypeTag.skin = data.tagPath;
        }
    }
    skinItem.itemPrefab = null;
    skinItem.iconWidth = 150;
    skinItem.iconHeight = 157.5;
    skinItem.iconOffset = Laya.Vector2.ZERO;
    class SkinView extends BaseView {
        constructor() {
            super();
            this.itemCount = 0;
            this.itemIndex = 0;
            this.skinItemPath = "prefab/freeSkinItem.json";
            this.skinData = [];
        }
        onAwake() {
            LayaSample.commonData.isNoAds = false;
            super.onAwake();
            Laya.loader.load(this.skinItemPath, Laya.Handler.create(this, this.initList), null, Laya.Loader.PREFAB);
            LayaSample.commonData.isShowSkin = false;
        }
        onOpened(data) {
            if (data && data.isPlay) {
                this.isPlay = data.isPlay;
                LayaSample.gameMgr.isPlay = false;
               // console.log("设置isPlay:", LayaSample.gameMgr.isPlay);
            }
        }
        initUI() {
            let content = this.getChild("content");
            this.skinList = this.getChild("skinList", content);
            let bottomPanel = this.getChild("bottomPanel");
            this.btnVideo = this.getChild("btnVideo", bottomPanel);
            this.btnVideo.visible = true;
            this.btnTips = this.getChild("btnTips");
            this.btnBack = this.getChild("btnBack", bottomPanel);
            this.tipsTag = this.getChild("tag", this.btnTips);
            this.tipsTag.visible = !LayaSample.storageMgr.isSkinTips();
            LayaSample.tweenMgr.toScale(this.btnVideo, 1.1, 500, true, true);
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnVideo, this, this.onVideoClick, 14);
            LayaSample.utils.addClickEvent(this.btnTips, this, this.onTipsClick, 14);
            LayaSample.utils.addClickEvent(this.btnBack, this, this.onBackClick, 14);
            LayaSample.glEvent.on("videoAdClose", this, this.onVideoCloseEvent);
            LayaSample.glEvent.on("loadAd", this, this.onAdLoadEvent);
        }
        onClosed() {
            super.onClosed();
            if (this.isPlay) {
                LayaSample.gameMgr.isPlay = true;
                //console.log("修改isPlay", LayaSample.gameMgr.isPlay);
            }
        }
        onDisable() {
            LayaSample.glEvent.off("videoAdClose", this, this.onVideoCloseEvent);
            LayaSample.glEvent.off("loadAd", this, this.onAdLoadEvent);
        }
        initData() {
            this.itemCount = 4;
            this.skinData = [];
            for (let i = 0; i < this.itemCount; ++i) {
                let data = {
                    id: i + 1,
                    iconPath: "ui/common/skin_" + (i + 1) + ".png",
                    tagPath: "ui/common/icon_7.png"
                };
                this.skinData.push(data);
            }
        }
        initList() {
            skinItem.iconOffset = new Laya.Vector2(29, 8);
            skinItem.itemPrefab = Laya.loader.getRes(this.skinItemPath);
            let list = this.skinList;
            list.itemRender = skinItem;
            list.selectEnable = true;
            list.selectHandler = new Laya.Handler(this, this.onSelect);
            list.renderHandler = new Laya.Handler(this, this.updateItem);
            list.array = this.skinData;
        }
        updateItem(cell, index) {
            cell.setItemInfo(cell.dataSource);
        }
        onSelect(index) {
            if (index < 0) return;
            this.itemIndex = index + 1;
            LayaSample.adMgr.showVideoAd(0);
            this.skinList.selectedIndex = -1;
        }
        onVideoClick() {
            this.itemIndex = Math.floor(Math.random() * 4);
            LayaSample.adMgr.showVideoAd(0);
        }
        onBackClick() {
            this.itemIndex = 0;
            LayaSample.glEvent.event("skinChange", {
                index: this.itemIndex,
                isPlay: true
            });
            LayaSample.glEvent.event("gameInit", {
                isPlay: true
            });
            LayaSample.commonData.isNoAds = true;
            LayaSample.adMgr.hideBannerAd();
            this.close();
        }
        onAdLoadEvent(evt) {}
        onVideoCloseEvent(evt) {
            if (!evt.isEnded) {
                LayaSample.wxMgr.showToast("视频未观看完", 2e3);
            } else {
                this.changeSkin();
                LayaSample.commonData.isNoAds = true;
                LayaSample.adMgr.hideBannerAd();
            }
        }
        changeSkin() {
            LayaSample.commonData.isShowSkin = false;
            LayaSample.glEvent.event("skinChange", {
                index: this.itemIndex,
                isPlay: true
            });
            this.close();
        }
        onTipsClick() {
            let isShow = LayaSample.storageMgr.isSkinTips();
            this.tipsTag.visible = isShow;
            LayaSample.storageMgr.setSkinTips(!isShow);
        }
    }
    SkinView.skinDic = {
        0: "role",
        1: "pifu01",
        2: "pifu02",
        3: "pifu03",
        4: "pifu04"
    };
    class CameraFollow extends Laya.Script3D {
        init() {
            this.camera.transform.position = this.orgPos;
            this.camera.transform.rotationEuler = this.orgRot;
            this.moveRotation = this.camera.transform.rotationEuler.clone();
            this.offset.setValue(this.orgOffset.x, this.orgOffset.y, this.orgOffset.z);
            this.camera.fieldOfView = 74.9;
        }
        onAwake() {
            this.camera = this.owner;
            this.orgPos = this.camera.transform.position.clone();
            this.orgRot = this.camera.transform.rotationEuler.clone();
            this.offset = new Laya.Vector3();
            this.movePosition = new Laya.Vector3(0, 0, .1);
            this.moveRotation = this.camera.transform.rotationEuler.clone();
            let scene = Laya.stage.getChildAt(0);
            this.target = scene.getChildByName("role");
            Laya.Vector3.subtract(this.camera.transform.position, this.target.transform.position, this.offset);
            this.orgOffset = this.offset.clone();
        }
        onLateUpdate() {
            Laya.Vector3.add(this.offset, this.target.transform.position, this.movePosition);
            this.movePosition.x = this.orgPos.x;
            this.camera.transform.position = this.movePosition;
        }
    }
    class GameView extends BaseView {
        constructor() {
            super(...arguments);
            this.carWidth = .6;
            this.carRealWidth = .6;
            this.isInited = false;
            this.speedBarHeight = 414;
            this.speedBarRect = new Laya.Rectangle(0, 414, 88, 100);
            this.score = 0;
            this.clickImageIndex = 0;
            this.clickImagePath = "ui/qq_ui/baoxiang/clickanim_00";
            this.levelLen = 30;
            this.levelNum = 1;
            this.currentLevel = 1;
            this.startNum = 2;
            this.buffCarCount = 200;
            this.buffCarAdd = 220;
            this.showCount = 0;
            this.maxDis = 0;
            this.speedFactor = .8;
            this.runChangeDis = 820;
            this.runChangeSign = 1;
            this.runChangeCount = 0;
            this.runScoreCount = 50;
            this.runChangeFunArray = [ Laya.Ease.expoInOut, Laya.Ease.expoIn, Laya.Ease.expoInOut, Laya.Ease.quintInOut, Laya.Ease.circIn, Laya.Ease.quintInOut ];
            this.runChangeFunArray2 = [ "Laya.Ease.expoInOut", "Laya.Ease.expoIn", "Laya.Ease.quintInOut", "Laya.Ease.circIn" ];
            this.isShowAds = false;
        }
        initData() {
            this.targetPos = new Laya.Vector3();
            this.lerpPos = new Laya.Vector3();
            this.targetRot = new Laya.Vector3();
            this.lerpRot = new Laya.Vector3();
            this.scaleV3 = new Laya.Vector3(1, 1, 1);
        }
        initUI() {
            let topPanel = this.getChild("topPanel");
            this.lbLevel = this.getChild("lbLevel", topPanel);
            this.visible = false;
            this._gameRank = topPanel.getChildByName("rank");
            this._gameRank.visible = false;
            this.speedBarContainer = this.getChild("barspeedCont");
            this.speedBarContainer.visible = false;
            this.speedBar = this.speedBarContainer.getChildByName("speedBar");
            this.jiaUiEffect = this.speedBarContainer.getChildByName("barEffect");
            this.fontScore = this.getChild("fontScore");
            this.guide = this.getChild("guide");
            this.guide.visible = false;
            this.btnGameL1 = this.getChild("btnGameL1");
            this.btnGameR1 = this.getChild("btnGameR1");
            this.setSpeedBar(.5);
            GameModel.I.scorePos = new Laya.Vector2(this.fontScore.x + this.fontScore.width / 2 + 20, this.fontScore.y + 20);
            this.overRankSet();
            this.loadScene();
            this.loadModels();
            this.setFog();
            this.setWxapp(0);
            this.setWxapp(1);
            this.gameList = this.getChild("gameList");
            this.faultClick = this.getChild("faultClick");
            this.btnFaultClick = this.getChild("btnFaultClick", this.faultClick);
            this.faultProgress = this.getChild("faultClickPogress", this.faultClick);
            this.scaleImage_1 = this.getChild("clickBg_1", this.faultClick);
            this.scaleImage_2 = this.getChild("clickBg_2", this.faultClick);
            this.scaleImage_3 = this.getChild("clickBg_3", this.faultClick);
            this.faultClick.visible = false;
            LayaSample.utils.addClickEvent(this.btnFaultClick, this, this.onfaultClick);
        }
        setSpeedBar(val) {
            let h = this.speedBarHeight * val;
            this.speedBarRect.y = this.speedBarHeight - h;
            this.speedBarRect.height = h;
            this.speedBar.scrollRect = this.speedBarRect;
            this.speedBar.y = this.speedBarRect.y;
            if (val > .95) {
                LayaSample.soundMgr.playHasBuff();
                this.jiaUiEffect.play();
                this.jiaUiEffect.visible = true;
            } else {
                LayaSample.soundMgr.stopHasBuff();
                this.jiaUiEffect.stop();
                this.jiaUiEffect.visible = false;
            }
        }
        initEvent() {
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUpEvent);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDownEvent);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveEvent);
            LayaSample.utils.addClickEvent(this.btnGameL1, this, this.onWxgameClick);
            LayaSample.utils.addClickEvent(this.btnGameR1, this, this.onWxgameClick);
            LayaSample.glEvent.on("gameInit", this, this.initGameEvent);
            LayaSample.glEvent.on("gameOver", this, this.overGameEvent);
            LayaSample.glEvent.on("gamePlay", this, this.onPlayGameEvent);
            LayaSample.glEvent.on("gameGoon", this, this.onGoonGameEvent);
            LayaSample.glEvent.on("skinChange", this, this.changeSkin);
            LayaSample.glEvent.on("add_score", this, this.onAddScore);
            LayaSample.glEvent.on("add_buff", this, this.onAddBuff);
            LayaSample.glEvent.on("remove_buff", this, this.onRemoveBuff);
            LayaSample.glEvent.on("stop_game", this, this.stopGame);
        }
        loadScene() {
            let scene = Laya.loader.getRes("res/scenes/Conventional/ModelScene.ls");
            Laya.stage.addChild(scene);
            Laya.stage.setChildIndex(scene, 0);
            this.mainScene = scene;
            this.mainScene["enableMyAni"] = true;
            this.mainCamera = scene.getChildByName("Main Camera");
            LayaSample.mainCamera = this.mainCamera;
            let cameraFollow = this.mainCamera.addComponent(CameraFollow);
            LayaSample.modelCreator.init(this.mainScene);
            EffectMgr.I.init(scene.getChildByName("effect"));
            Top3DSceneMgr.I.init();
            Top3DSceneMgr.I.initSpeedUIPos(this.speedBarContainer);
        }
        onWxgameClick(event) {
            let appid = event.target.appData.appid;
            if (appid && appid != "") {
                LayaSample.wxMgr.openOtherApp(appid, event.target.appData.appIndex, 0);
            } //else console.log("appid error.");
        }
        createLevelCar() {
            this.carPos = this.car.transform.position;
            if (this.carPos.z > this.levelLen * (this.levelNum - this.startNum)) {
                this.levelNum++;
                var count = Math.ceil(this.carPos.z / 400);
                for (let index = 0; index < count; index++) {
                    LayaSample.modelCreator.createAiCar2(this.levelLen * this.levelNum);
                }
                if (this.carPos.z > this.buffCarCount) {
                    LayaSample.modelCreator.createAiCar2(this.levelLen * this.levelNum, true);
                    this.buffCarCount = this.buffCarCount + this.buffCarAdd;
                    this.buffCarAdd += 20;
                }
            }
        }
        levelInit() {}
        loadModels() {
            this.car = this.mainScene.getChildByName("role");
            this.carComp = this.car.addComponent(Car);
            GameModel.I.mainCar = this.car;
            GameModel.I.mainCarComp = this.carComp;
            GameModel.I.setMainCar(this.car);
            var info = LayaSample.modelCreator.cheDic["role"];
            this.carWidth = info.realWidth;
            GameModel.I.updateMainCarWidth(this.carWidth);
            GameModel.I.updateMainCarLen(info.realLen - .2);
        }
        setFog() {
            let scene = this.mainScene;
            scene.enableFog = true;
            scene.fogColor = LayaSample.utils.getRGB("#7BBDBD");
            scene.fogStart = 20;
            scene.fogRange = 80;
        }
        setFriendRank() {
            this.rankPanel = this.getChildByName("topPanel").getChildByName("rankPanel");
            if (window["wx"] && window["sharedCanvas"]) {
                window["sharedCanvas"].width = 65;
                window["sharedCanvas"].height = 65;
            }
            LayaSample.wxMgr.showFirstFriendTips(true);
            this.rankPanel.visible = true;
            Laya.timer.once(3e3, this, this.hideIcon);
        }
        hideIcon() {
            LayaSample.wxMgr.showFirstFriendTips(false);
            this.rankPanel.visible = false;
        }
        showFriendRank() {
            return;
            if (window["wx"] && window["sharedCanvas"]) {
                window["sharedCanvas"].width = 65;
                window["sharedCanvas"].height = 65;
            }
            this._gameRank.visible = false;
            LayaSample.wxMgr.showLoopFriendTips(true);
            Laya.timer.once(1e3, this, this.lateShowRank);
        }
        lateShowRank() {
            if (this._gameRank) {
                this._gameRank.visible = true;
                this._gameRank.alpha = 1;
                Laya.timer.once(2e3, this, this.closeGameRank);
            }
        }
        closeGameRank() {
            let self = this;
            Laya.Tween.to(this._gameRank, {
                alpha: 0
            }, 1e3, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                self._gameRank.visible = false;
                self._gameRank.alpha = 1;
            }), 0, true);
        }
        overRankSet() {
            this.overPlayer = this.getChildByName("topPanel").getChildByName("overPlayer");
            this.overPlayer.visible = false;
            if (!LayaSample.commonData.gameList || LayaSample.commonData.gameList.list.length < 2) return;
            let list = LayaSample.commonData.gameList.list;
            this.showList = this.getRankList(list);
            this.userIcon = LayaSample.commonData.gameList.userInfo.avatar;
        }
        getRankList(list) {
            let arr = new Array(20);
            if (list.length <= 22) {
                for (let i = 0; i < list.length - 2; ++i) {
                    arr[list.length - 3 - i] = list[i + 2];
                }
                arr.length = list.length - 2;
                return arr;
            }
            let ti = Math.floor((list.length - 2) / 20);
            let tj = Math.floor((list.length - 2) % 20);
            for (let i = 0; i < 20; ++i) {
                arr[19 - i] = list[i * ti + Math.floor(Math.random() * ti) + 2];
            }
            return arr;
        }
        showWorldRankIcon() {
            if (!this.showList) return;
            {
                if (this.showCount >= this.showList.length) return;
                let icon = this.showList[this.showCount].avatar;
                this.showCount++;
                if (this.userIcon == icon || !icon) return;
                this.overPlayer.skin = icon;
                this.overPlayer.visible = true;
                Laya.timer.once(3e3, this, () => {
                    this.overPlayer.visible = false;
                });
            }
        }
        setWorldRank() {
            this.rankPanel = this.getChildByName("topPanel").getChildByName("rankPanel");
            if (!LayaSample.commonData.gameList || LayaSample.commonData.gameList.list.length < 2) return;
            let list = LayaSample.commonData.gameList.list;
            this.rankPanel.visible = true;
            this.rankPanel.getChildByName("icon").visible = true;
            if (list[0].avatar == LayaSample.commonData.gameList.userInfo.avatar) {
                this.rankPanel.getChildByName("icon").texture = list[1].avatar;
            } else {
                this.rankPanel.getChildByName("icon").texture = list[0].avatar;
            }
            Laya.timer.once(3e3, this, this.hideIcon);
        }
        onMouseDownEvent(evt) {
            if (LayaSample.gameMgr.isOver || !LayaSample.gameMgr.isPlay) return;
            LayaSample.gameMgr.isPressed = true;
            this.originPosX = evt.stageX;
            this.originPosY = evt.stageY;
            this.carComp.start();
            this.guide.visible = false;
            Laya.timer.clear(this, this.frameUpdateRolePos);
            Laya.timer.frameLoop(1, this, this.frameUpdateRolePos);
        }
        onMouseUpEvent() {
            LayaSample.gameMgr.isPressed = false;
        }
        onMouseMoveEvent(evt) {
            if (LayaSample.gameMgr.isOver) {
                return;
            }
            if (LayaSample.gameMgr.isPressed) {
                let posLimit = 2.95;
                let sLen = 200;
                let sFactor = .3 / sLen;
                let speedFactor = .45 / sLen;
                if (evt.stageX != this.originPosX) {
                    let pos = this.car.transform.position.clone();
                    let rot = this.car.transform.rotationEuler.clone();
                    let disX = evt.stageX - this.originPosX;
                    let disY = evt.stageY - this.originPosY;
                    if (disY > sLen) {
                        disY = sLen;
                    }
                    if (disY < -sLen) {
                        disY = -sLen;
                    }
                    if (this.carComp.hasBuff) {
                        disY = -sLen;
                    }
                    LayaSample.speedZ = .5 - disY * speedFactor;
                    this.setSpeedBar(LayaSample.speedZ / .95);
                    this.scaleV3.setValue(1 + disY * sFactor, 1 - disY * sFactor, 1);
                    this.carRealWidth = (1 + disY * sFactor) * this.carWidth;
                    this.car.transform.localScale = this.scaleV3;
                    GameModel.I.updateMainCarWidth(this.carRealWidth);
                    if (disX > 0 && this.maxDis < 0 || disX < 0 && this.maxDis > 0) this.maxDis = 0;
                    if (Math.abs(disX) > Math.abs(this.maxDis)) {
                        this.maxDis = disX;
                    }
                    pos.x -= .1 * this.maxDis * this.speedFactor;
                    rot.y -= disX / 10;
                    if (pos.x >= posLimit) {
                        pos.x = posLimit - this.carRealWidth / 2;
                    } else if (pos.x <= -posLimit) {
                        pos.x = -posLimit + this.carRealWidth / 2;
                    }
                    this.targetPos = pos;
                    this.car.transform.rotationEuler = rot;
                    this.originPosX = evt.stageX;
                }
            }
        }
        frameUpdateRolePos() {
            if (LayaSample.gameMgr.isOver) {
                Laya.timer.clear(this, this.frameUpdateRolePos);
                return;
            }
            this.targetPos.setValue(this.targetPos.x, this.car.transform.position.y, this.car.transform.position.z);
            Laya.Vector3.lerp(this.car.transform.position, this.targetPos, .07, this.lerpPos);
            this.car.transform.position = this.lerpPos;
            this.targetRot.setValue(this.car.transform.rotationEuler.x, this.targetRot.y, this.targetRot.z);
            Laya.Vector3.lerp(this.car.transform.rotationEuler, this.targetRot, .05, this.lerpRot);
            this.car.transform.rotationEuler = this.lerpRot;
            if (!LayaSample.gameMgr.isPressed && Math.abs(this.lerpRot.y) < .01) {
                Laya.timer.clear(this, this.frameUpdateRolePos);
            }
            if (!LayaSample.gameMgr.isPressed && Math.abs(this.lerpPos.x - this.targetPos.x) < .01) {
                this.maxDis = 0;
            }
        }
        onAddScore(evt) {
            this.addScore(evt);
        }
        onAddBuff() {
            this.setSpeedBar(1);
        }
        onRemoveBuff() {}
        addScore(val) {
            this.score += val;
            LayaSample.commonData.newScore = this.score;
            this.fontScore.value = this.score.toString();
        }
        resetScore() {
            this.addScore(-this.score);
        }
        initGameEvent(evt) {
            if (!this.isPrepareGame) {
                LayaSample.commonData.gameStartCount++;
            }
            this.isPrepareGame = true;
            if (evt.isPlay) {
                LayaSample.commonData.isNoAds = true;
                LayaSample.adMgr.hideBannerAd();
                this.visible = true;
            } else {
                this.visible = false;
            }
            //console.log("修改isPlay", LayaSample.gameMgr.isPlay);
            LayaSample.modelCreator.recoverAll();
            this.resetScore();
            this.carComp.reset();
            AICar.hitCar = null;
            this.levelNum = 1;
            this.roadNum = 1;
            let roadLength = 21;
            let endCreate = 2;
            LayaSample.speedZ = 0;
            this.buffCarCount = 200;
            this.buffCarAdd = 220;
            this.setSpeedBar(.001);
            this.runChangeDis = 850;
            this.runScoreCount = 50;
            var funIndex = Math.random() * this.runChangeFunArray.length | 0;
            this.runChangeFun = this.runChangeFunArray[funIndex];
            this.runFunName = this.runChangeFunArray2[funIndex];
            //console.log("运行的方法：", this.runFunName);
            //console.log("修改成功");
            this.runChangeCount = this.runChangeDis;
            this.runChangeSign = Math.random() > .5 ? 1 : -1;
            this.car.transform.rotationEuler = this.targetRot;
            for (let index = 0; index < this.startNum; index++) {
                this.levelNum++;
                LayaSample.modelCreator.createAiCar(1 + Math.random() * 3 | 0, this.levelLen * this.levelNum);
            }
            //console.log(" 新的一个开始");
            let road = this.mainScene.getChildByName("lu");
            this.levelInit();
            var addLen = 8;
            for (let index = 0; index < addLen; index++) {
                LayaSample.modelCreator.createRoad(null, road, roadLength, this.roadNum + endCreate + index);
                LayaSample.modelCreator.randomCreateConstructs(roadLength * (this.roadNum + endCreate + index));
            }
            endCreate += addLen;
            this.car.transform.position = new Laya.Vector3(0, 0, 0);
            this.car.transform.localScale = new Laya.Vector3(1, 1, 1);
            if (this.isInited == false) {
                var runFun = [ Laya.Ease.backInOut, Laya.Ease.quartIn, Laya.Ease.quartInOut, Laya.Ease.circIn ];
                Laya.timer.frameLoop(1, this, function() {
                    if (LayaSample.gameMgr.isOver) {
                        return;
                    }
                    if (this.car.transform.position.z > roadLength * this.roadNum) {
                        this.roadNum++;
                        LayaSample.modelCreator.createRoad(this.bike, road, roadLength, this.roadNum + endCreate - 1);
                        LayaSample.modelCreator.randomCreateConstructs(roadLength * (this.roadNum + endCreate - 1));
                    }
                    var f = false;
                    if (this.car.transform.position.z > this.runChangeDis) {
                        console.log(3.14 * 4 + this.runChangeSign * this.runChangeFun(this.car.transform.position.z % this.runChangeCount / this.runChangeCount, 0, 1, 1) * 3.14 * 4);
                        var funIndex = Math.random() * this.runChangeFunArray.length | 0;
                        this.runChangeFun = this.runChangeFunArray[funIndex];
                        this.runFunName = this.runChangeFunArray2[funIndex];
                        //console.log("运行的方法：", this.runFunName);
                        this.runChangeDis += this.runChangeCount;
                        this.runChangeSign = Math.random() > .5 ? 1 : -1;
                        f = true;
                    }
                    if (this.car.transform.position.z > this.runScoreCount) {
                        LayaSample.glEvent.event("add_score", 1);
                        this.runScoreCount += 50;
                    }
                    var xval = this.runChangeSign * this.runChangeFun(this.car.transform.position.z % this.runChangeCount / this.runChangeCount, 0, 1, 1) * 3.14 * 4;
                    if (f) {
                        console.log("---------:", xval);
                    }
                    this.mainScene["myTime"] = xval;
                    this.createLevelCar();
                });
                this.isInited = true;
            }
            console.log("evt.isPlay", evt.isPlay);
            this.initGameEvt = evt;
            this.faultClickModel();
        }
        startGame() {
            this.isPrepareGame = false;
            let evt = this.initGameEvt;
            if (evt.isPlay) {
                this.guide.visible = true;
            } else {
                this.guide.visible = false;
            }
            this.speedBarContainer.visible = true;
            LayaSample.gameMgr.isOver = false;
            LayaSample.gameMgr.isPlay = evt.isPlay;
           // console.log("修改isPlay", LayaSample.gameMgr.isPlay);
        }
        expoIn(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        }
        onPlayGameEvent() {
            this.guide.visible = true;
            LayaSample.commonData.isNoAds = true;
            LayaSample.adMgr.hideBannerAd();
            LayaSample.gameMgr.isPlay = true;
            LayaSample.commonData.skinGameCount++;
            LayaSample.gameMgr.isPlay = true;
            this.visible = true;
            this.setFriendRank();
            Laya.timer.loop(1e4, this, this.showFriendRank);
        }
        onGoonGameEvent() {
            LayaSample.commonData.isNoAds = true;
            LayaSample.adMgr.hideBannerAd();
            LayaSample.commonData.goonCount++;
            LayaSample.gameMgr.isOver = false;
            LayaSample.gameMgr.isPlay = true;
            this.visible = true;
            this.carComp.reset();
            AICar.hitCar = null;
            Laya.timer.loop(1e4, this, this.showFriendRank);
        }
        changeSkin(evt) {
            var info = LayaSample.modelCreator.cheDic[SkinView.skinDic[evt.index]];
            this.car.getChildByName("role").meshFilter.sharedMesh = info.model.meshFilter.sharedMesh;
            this.car.getChildByName("role").meshRenderer.material = info.model.meshRenderer.material;
            this.carWidth = info.realWidth;
            GameModel.I.updateMainCarWidth(this.carWidth);
            GameModel.I.updateMainCarLen(info.realLen - .2);
        }
        overGameEvent() {
            LayaSample.commonData.isNoAds = false;
            LayaSample.gameMgr.isOver = true;
            LayaSample.gameMgr.isPlay = false;
            //console.log("设置isPlay:", LayaSample.gameMgr.isPlay);
            Laya.timer.clear(this, this.showFriendRank);
            this.setSpeedBar(.001);
            LayaSample.soundMgr.stopCarSound();
            LayaSample.soundMgr.stopHorn();
            LayaSample.speedZ = 0;
            Laya.timer.clear(this, this.frameUpdateRolePos);
            this.visible = false;
            Top3DSceneMgr.I.hideAddSpeed();
            if (LayaSample.commonData.goonCount > 0) {
                LayaSample.commonData.goonCount = 0;
                Laya.Scene.open("views/clearing.scene", false);
                GameController.getInstance().getGamelist().visible=true;
            } else Laya.Scene.open("views/over.scene", false);
        }
        stopGame() {
            this.setSpeedBar(.001);
        }
        setWxapp(appIndex) {
            let appList = LayaSample.wxMgr.getWxappList(0);
            if (!appList) return;
            let appCount = appList.length;
            if (appCount == 0) return;
            if (!appList[appIndex]) return;
            let appData = {
                appid: appList[appIndex].app_id,
                appIndex: 0
            };
            let btnGame = null;
            switch (appIndex) {
              case 0:
                btnGame = this.btnGameL1;
                break;

              case 1:
                btnGame = this.btnGameR1;
                break;

              default:
                return;
            }
            if (btnGame == null) return;
            btnGame.visible = true;
            btnGame.skin = appList[appIndex].app_img;
            btnGame.appData = appData;
            Laya.timer.loop(3e3, this, function() {
                appIndex++;
                if (appIndex >= appCount) {
                    appIndex = 0;
                }
                if (!appList[appIndex]) return;
                appData.appid = appList[appIndex].app_id;
                btnGame.skin = appList[appIndex].app_img;
                btnGame.appData = appData;
                LayaSample.utils.tweenShake(btnGame, null);
            });
        }
        showFaultClick() {
            console.log("showFaultClick delay_num:", LayaSample.commonData.delay_num);
            console.log("showFaultClick show_box:", LayaSample.commonData.show_box);
            console.log("showFaultClick gameStartCount:", LayaSample.commonData.gameStartCount);
            if (LayaSample.commonData.delay_num.length == 0) return false;
            if (LayaSample.commonData.show_box) {
                if (LayaSample.commonData.delay_num.length == 1 && LayaSample.commonData.delay_num[0] == 0) {
                    return true;
                }
                let tmp = LayaSample.commonData.delay_num;
                for (let i = 0; i < tmp.length; i++) {
                    if (LayaSample.commonData.gameStartCount == tmp[i]) return true;
                }
            }
            return false;
        }
        faultClickImgChiange() {
            this.clickImageIndex++;
            this.clickImageIndex = this.clickImageIndex % 8;
            this.faultClick.skin = this.clickImagePath + this.clickImageIndex + ".png";
        }
        onReduceProgress() {
            let reduceNum = this.faultProgress.value;
            if (reduceNum >= .02) {
                reduceNum -= .02;
            }
            if (reduceNum < 0) {
                reduceNum = 0;
            }
            if (reduceNum > .99) {
                reduceNum = .99;
            }
            this.faultProgress.value = reduceNum;
        }
        onfaultClick() {
            this.faultProgress.value += .1;
            let openNum = Math.random() / 4 + .5;
            if (this.faultProgress.value >= .4 && this.faultProgress.value > openNum) {
                this.faultClickComplete();
            }
        }
        faultClickComplete() {
            if (LayaSample.commonData.completeFaultClick) return;
            LayaSample.commonData.completeFaultClick = true;
            LayaSample.commonData.isHideFaultClick = true;
            LayaSample.commonData.isNoAds = false;
            if (this.isShowAds == false) {
                LayaSample.wxAd.showBannerAd();
                this.isShowAds = true;
            }
            Laya.timer.once(1500, this, function() {
                this.faultClick.visible = false;
                this.faultProgress.value = 0;
                LayaSample.commonData.isHideFaultClick = true;
                LayaSample.wxAd.hideBannerAd();
                if (this.guide.visible == false) {
                    this.faultClickShowGuide();
                }
            });
            Laya.timer.once(3e3, this, function() {
                LayaSample.wxAd.hideBannerAd();
                this.isShowAds = false;
                Laya.timer.clear(this, this.faultClickImgChiange);
                Laya.timer.clear(this, this.onReduceProgress);
            });
        }
        faultClickModel() {
            let flag = this.showFaultClick();
            console.log("faultClickModel flag:", flag);
            if (flag) {
                console.log("faultClickModel  isHideFaultClick:", LayaSample.commonData.isHideFaultClick);
                if (this.gameList) {
                    this.gameList.visible = false;
                }
                LayaSample.commonData.completeFaultClick = false;
                LayaSample.commonData.isHideFaultClick = false;
                this.faultClickHideGuide();
                this.faultProgress.value = 0;
                this.faultClick.visible = true;
                Laya.timer.loop(100, this, this.faultClickImgChiange);
                Laya.timer.loop(100, this, this.onReduceProgress);
                LayaSample.utils.tweenShake(this.scaleImage_1, null);
                LayaSample.utils.tweenShake(this.scaleImage_2, null);
                LayaSample.utils.tweenShake(this.scaleImage_3, null);
            } else {
                LayaSample.commonData.isHideFaultClick = true;
                this.faultClickShowGuide();
                this.faultClick.visible = false;
            }
        }
        faultClickShowGuide() {
            if (this.gameList) {
                this.gameList.visible = true;
            }
            this.startGame();
        }
        faultClickHideGuide() {
            this.speedBarContainer.visible = false;
        }
    }
    class GuideComp extends Laya.Script {
        constructor() {
            super();
            this.startPos = 1095;
            this.endPos = 808;
            this.count = 0;
            this.sign = .02;
            this.isShow = true;
        }
        onUpdate() {
            if (this.owner.visible) {
                this.count += this.sign;
                if (this.count >= 1) {
                    this.sign = -.02;
                }
                if (this.count <= 0) {
                    this.sign = .02;
                }
                this.finger.y = this.startPos - (this.startPos - this.endPos) * this.count;
                this.carImg.scaleX = .8 - .6 * this.count;
                this.carImg.scaleY = .8 + .3 * this.count;
            }
        }
    }
    class HoldView extends BaseView {
        constructor() {
            super(...arguments);
            this.sdfdf = 1;
            this._loadNum = 0;
            this._isLoadFinish = false;
            this.barWidthsdff = 425;
        }
        onAwake() {
            super.onAwake();
            if (!Laya.Browser.onWeiXin) {
                this.loadRes();
            } else {
                LayaSample.utils.loadSubpackage("scenes", this, function(target, isSuccess) {
                    if (isSuccess) {
                        this.loadRes();
                    }
                });
            }
            this.getChild("hold1");
            this.getChild("hold2");
            this.getChild("hold3");
            this.getChild("hold4");
            this.getChild("hold5");
            this.getChild("hold6");
            this.getChild("hold7");
            this.getChild("hold8");
            this.getChild("bad1");
            this.getChild("bad2");
            this.getChild("bad3");
            this.getChild("bad4");
            this.getChild("accs");
            this.getChild("aeew");
            this.getChild("wecv");
            this.getChild("sdfg34");
            this.getChild("sdfg43");
            this.getChild("ert343");
            this.getChild("dsfvbg3");
            this.getChild("sdfge");
            this.getChild("tyui");
            this.getChild("dfgr");
            this.getChild("tyui");
            this.getChild("yui65");
            this.getChild("hgjk");
            this.getChild("ttyu");
            this.getChild("fgf");
            this.getChild("dh45");
            this.getChild("hdrty");
            this.getChild("sdf");
            this.getChild("wer");
            this.getChild("hdf234ghr");
            this.getChild("hdfdfgghr");
            this.getChild("ert");
            this.getChild("wwq2");
            this.getChild("df");
            this.getChild("345fg");
            this.getChild("wer3");
            this.getChild("fgher");
            this.getChild("ere");
            this.getChild("dfgvb");
            this.getChild("fgj");
            this.getChild("sdew");
            this.getChild("sfge443");
            this.getChild("sdfgr");
            this.getChild("swer3");
            this.getChild("tryu4");
            this.getChild("sdfg342");
            this.getChild("ert34");
            this.getChild("a234");
            this.getChild("ert3wer45");
            this.getChild("sadf");
            this.getChild("sdfg");
            this.getChild("vbnf");
            this.getChild("ertklyu345");
            this.getChild("tyu56");
            this.getChild("tyu452");
            this.getChild("fghee");
            this.getChild("kui");
            this.getChild("asdqw");
            this.getChild("fgh4");
            this.getChild("fgh4");
            this.getChild("ertrty345");
            this.getChild("dfgh");
            this.getChild("dfgh6");
            this.getChild("ddg");
            this.getChild("asdf2w2");
            this.getChild("sdfg32");
            this.getChild("hg");
            this.getChild("yu4");
            this.getChild("rey3");
            this.getChild("tyr4");
            this.getChild("tuy7");
            this.getChild("dfg34");
            this.getChild("sdfg23");
            this.getChild("tr2");
            this.getChild("nn2");
            this.getChild("dd4");
            this.getChild("erkk3t345");
            this.getChild("sdf2");
            this.getChild("ert4");
            this.getChild("tyu3");
            this.getChild("qw432");
            this.getChild("4tr");
            this.getChild("ert23");
            this.getChild("uio5");
            this.getChild("ert2");
            this.getChild("yy12");
        }
        onOpened() {
            LayaSample.configMgr.init();
            LayaSample.soundMgr.init();
            LayaSample.wxMgr.init();
            LayaSample.adMgr.init();
        }
        initUI() {
            let viewLoad = this.getChildByName("viewsaasdfLoad");
            this.lblPreswerr = viewLoad.getChildByName("lblssPres");
            this.barPreswere = viewLoad.getChildByName("barPrfsfes");
            this.wwerr = this.barPreswere.getChildAt(0);
        }
        initEvent() {
            LayaSample.glEvent.on("finishLoad", this, this.onLoadFinish);
        }
        onLoadFinish(evt) {
            this._loadNum++;
            if (this._loadNum >= this.sdfdf) {
                this.wwerr.width = 1 * this.barWidthsdff;
                this.lblPreswerr.text = "40%";
                this.loadFinished = true;
                this.loadGameScene();
            }
        }
        onLoading(pres) {
            let loadPercent = (this._loadNum + pres) / (this.sdfdf + 1);
            this.wwerr.width = loadPercent * this.barWidthsdff;
            this.lblPreswerr.text = Math.floor(loadPercent * 100) + "%";
        }
        loadRes() {
            let resource = [];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish, [ {
                target: "3dres"
            } ], false), Laya.Handler.create(this, this.onLoading, null, false));
            Laya.loader.on(Laya.Event.ERROR, this, err => {
                console.error("has error:", err);
            });
        }
        loadGameScene() {
            if (Laya.Browser.onWeiXin) {
                if (this.loadFinished) {
                    this.openGameScene();
                }
            } else {
                this.openGameScene();
            }
        }
        openGameScene() {
            Laya.Scene.open("views/game.scene", false, Laya.Handler.create(this, view => {
                Laya.Scene.open("views/collect.scene", false, Laya.Handler.create(this, view => {
                    this.close();
                }));
            }));
        }
    }
    class HomeView extends BaseView {
        constructor() {
            super(...arguments);
            this.soundSkin = "ui/common/btn_sound_";
            this.vibrateSkin = "ui/common/btn_vibrate_";
        }
        onAwake() {
            super.onAwake();
            this.setWxapp(0);
            this.setWxapp(1);
            this.setWxapp(2);
            this.setWxapp(3);
            //Laya.Scene.open("views/firstIncome.scene", false, Laya.Handler.create(this, v => {}));
        }
        initUI() {
            console.log("init")
            this.list=this.getChild("list");
            platform.getInstance().initList(this.list)
            let topPanel = this.getChild("topPanel");
            let bottomUi = this.getChild("bottomui");
            this.btnSound = this.getChild("btnSound", topPanel);
            this.setSound(LayaSample.storageMgr.isPlaySound());
            this.btnVibrate = this.getChild("btnVibrate", topPanel);
            this.setVibrate(LayaSample.storageMgr.isPlayVibrate());
            this.btnPlay = this.getChild("btnPlay", bottomUi);
            this.btnRank = this.getChild("btnRank", bottomUi);
            this.btnShare = this.getChild("btnShare", bottomUi);
            this.btnSvrvice = this.getChild("btnSvrvice", bottomUi);
            this.btnCollect = this.getChild("btnCollect", bottomUi);
            this.btnGameL = this.getChild("btnGameL", topPanel);
            this.btnGameR = this.getChild("btnGameR", topPanel);
            this.btnGameL2 = this.getChild("btnGameL2", topPanel);
            this.btnGameR2 = this.getChild("btnGameR2", topPanel);
            let collectHand = this.getChild("collectHand", topPanel);
            if (collectHand) {
                collectHand.visible = true;
               // LayaSample.tweenMgr.toPosition(collectHand, new Laya.Vector3(300, 0), 1e3, true);
            }
            if(this.score==undefined){
               this.creatbestscore();
               this.readscore();

            }

        }
        creatbestscore(){
            var text = new Laya.Text();
            text.fontSize=50;
            text.width=200;
            text.hright=150;
            text.text="Best Score"
            this.addChild(text);
            text.x=150;
            text.y=500;
            text.color="#FFFFFF";
            this.score=new Laya.Text();
            this.score.fontSize=50;
            this.score.width=200;
            this.score.hright=150;
            this.score.text="100"
            text.addChild(this.score);
            
            this.score.y=50;
            this.score.x=30;
            this.score.align="center";
            this.score.color="#FFFFFF";
            
        }
        readscore(){
            var a = Laya.LocalStorage.getJSON("bestScore");
            if(a==null){
                a={"bestScore":0};
                Laya.LocalStorage.setJSON("bestScore",a);
            }
            this.score.text=a.bestScore;
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnVibrate, this, this.onVibrateClick);
            LayaSample.utils.addClickEvent(this.btnSound, this, this.onSoundClick);
            LayaSample.utils.addClickEvent(this.btnPlay, this, this.onPlayGameClick);
            LayaSample.utils.addClickEvent(this.btnRank, this, this.onRankClick);
            LayaSample.utils.addClickEvent(this.btnSvrvice, this, this.onSvrviceClick);
            LayaSample.utils.addClickEvent(this.btnShare, this, this.onShareClick);
            LayaSample.utils.addClickEvent(this.btnCollect, this, this.onCollectClick);
            LayaSample.utils.addClickEvent(this._btnMore, this, this.onMoreClick);
            LayaSample.utils.addClickEvent(this.btnGameL, this, this.onWxgameClick);
            LayaSample.utils.addClickEvent(this.btnGameR, this, this.onWxgameClick);
            this.btnGameL2 && LayaSample.utils.addClickEvent(this.btnGameL2, this, this.onWxgameClick);
            this.btnGameR2 && LayaSample.utils.addClickEvent(this.btnGameR2, this, this.onWxgameClick);
            LayaSample.glEvent.on("wxapp_close_view", this, () => {
                this.closeView();
            });
            LayaSample.glEvent.on("ad_video_close_event_home", this, this.playGame);
        }
        closeView() {
            this.close();
        }
        onMoreClick() {
          //  Laya.Scene.open("views/firstIncome.scene", false, Laya.Handler.create(this, v => {}));
        }
        setSound(status) {
            //sound
            let statusStr = status ? "on.png" : "off.png";
            this.btnSound.skin = this.soundSkin + statusStr;
            laya.media.SoundManager.muted = !status;
            
            LayaSample.storageMgr.setPlaySound(status);
            if(laya.media.SoundManager.muted==true){
                window.WebAudioEngine.stopAll();

            }else{
                window.WebAudioEngine.playMusic("res/sound/bgm.mp3");
            }
        }
        setVibrate(status) {
            let statusStr = status ? "on.png" : "off.png";
            this.btnVibrate.skin = this.vibrateSkin + statusStr;
            LayaSample.storageMgr.setPlayVibrate(status);
        }
        onSoundClick() {
            this.setSound(!LayaSample.storageMgr.isPlaySound());
        }
        onVibrateClick() {
            this.setVibrate(!LayaSample.storageMgr.isPlayVibrate());
        }
        playGame() {
            console.log("playGame");
            let isShow = LayaSample.storageMgr.isSkinTips();
            if (isShow && LayaSample.commonData.skinGameCount % 3 == 0 && LayaSample.commonData.existVideoAd) {
                let data = {};
                data.target = "views/home.scene";
                Laya.Scene.open("views/freeSkin.scene", false, data, Laya.Handler.create(this, v => {
                    this.close();
                }));
            } else {
                this.close();
                LayaSample.glEvent.event("gameInit", {
                    isPlay: true
                });
            }
        }
        onPlayGameClick() {
            

            GameController.getInstance().stopGame();
            var cb = ()=>{
              if (LayaSample.commonData.show_video) {
                  LayaSample.wxAd.showVideoAd(0);
                  return;
              }
              this.playGame();
              GameController.getInstance().resumeGame();
              if(LayaSample.storageMgr.isPlaySound()){
                  window.WebAudioEngine.playMusic("res/sound/bgm.mp3");
              }
              //LayaSample.storageMgr.isPlaySound()
          };
          if (location.href.indexOf('danfa') === -1) {
            platform.getInstance().showInterstitial(cb)
          } else {
            cb();
          }

            
        }
        onRankClick() {
            let data = {};
            data.target = "views/home.scene";
            Laya.Scene.open("views/rank.scene", false, data, Laya.Handler.create(this, v => {
                this.close();
            }));
        }
        onSvrviceClick() {
            LayaSample.wxMgr.openCustomerService();
        }
        onShareClick() {
            LayaSample.wxMgr.shareFriend(0, false);
        }
        onWxgameClick(event) {
            let appid = event.target.appData.appid;
            if (appid && appid != "") LayaSample.wxMgr.openOtherApp(appid, event.target.appData.appIndex, 2); else console.log("you appid error.");
        }
        onCollectClick() {
            Laya.Scene.open("views/collect.scene", false);
        }
        setWxapp(appIndex) {
            let appList = LayaSample.wxMgr.getWxappList(0);
            if (!appList) return;
            let appCount = appList.length;
            if (appCount == 0) return;
            if (!appList[appIndex]) return;
            let appData = {
                appid: appList[appIndex].app_id,
                appIndex: 0
            };
            let btnGame = null;
            switch (appIndex) {
              case 0:
                btnGame = this.btnGameL;
                break;

              case 1:
                btnGame = this.btnGameR;
                break;

              case 2:
                btnGame = this.btnGameL2;
                break;

              case 3:
                btnGame = this.btnGameR2;
                break;

              default:
                return;
            }
            if (btnGame == null) return;
            btnGame.visible = true;
            btnGame.skin = appList[appIndex].app_img;
            btnGame.appData = appData;
            Laya.timer.loop(3e3, this, function() {
                appIndex++;
                if (appIndex >= appCount) {
                    appIndex = 0;
                }
                if (!appList[appIndex]) return;
                appData.appid = appList[appIndex].app_id;
                btnGame.skin = appList[appIndex].app_img;
                btnGame.appData = appData;
                LayaSample.utils.tweenShake(btnGame, null);
            });
        }
    }
    class WxgameList extends Laya.Script {
        constructor() {
            super();
            this.needClearTimer = false;
            this.cate = 0;
        }
        onAwake() {
            this.index = 0;
            this.initList();
        }
        onEnable() {}
        initList() {
            this.list.array = [];
            this.list.renderHandler = new Laya.Handler(this, this.onRender);
            this.list.mouseHandler = new Laya.Handler(this, this.onMouseHandler);
            this.list.hScrollBarSkin = "";
            this.data = LayaSample.wxMgr.getWxappList(this.category);
            if (!this.data || this.data.length < 1) {
                this.panel.visible = false;
                return;
            }
            this.panel.visible = true;
            this.setListArray();
            Laya.timer.once(3e3, this, this.setListArray);
        }
        setListArray() {
            let data = [];
            for (let i = 0; i < 5; i++) {
                data.push(this.data[this.index % this.data.length]);
                this.index++;
            }
            this.adData = data;
            this.list.array = this.adData;
            this.list.refresh();
            Laya.timer.once(3e3, this, this.setListArray);
        }
        onRender(cell, index) {
            let img = cell.getChildAt(0);
            img.skin = this.adData[index].app_img;
        }
        onMouseHandler(e, index) {
            if (e.type == "mouseup") {
                var data = this.adData[index];
                this.btnSkipMiniGame(data.app_id);
            }
        }
        btnSkipMiniGame(appid) {
            LayaSample.wxMgr.openOtherApp(appid, 0, this.cate);
        }
    }
    class LoginView extends BaseView {
        constructor() {
            super(...arguments);
            this._loadCount = 1;
            this._loadNum = 0;
            this._isLoadFinish = false;
            this.barWidth = 425;
        }
        onAwake() {
            super.onAwake();
            if (!Laya.Browser.onWeiXin) {
                this.loadRes();
            } else {
                LayaSample.utils.loadSubpackage("scenes", this, function(target, isSuccess) {
                    if (isSuccess) {
                        this.loadRes();
                    }
                });
            }
        }
        onOpened() {
            LayaSample.configMgr.init();
            LayaSample.soundMgr.init();
            LayaSample.wxMgr.init();
            LayaSample.adMgr.init();
            LayaSample.utils.loadSubpackage("sound", this, function(target, isSuccess) {});
        }
        initUI() {
            let viewLoad = this.getChildByName("viewLoad");
            this.lblPres = viewLoad.getChildByName("lblPres");
            this.barPres = viewLoad.getChildByName("barPres");
            this.barVal = this.barPres.getChildAt(0);
        }
        initEvent() {
            LayaSample.glEvent.on("finishLoad", this, this.onLoadFinish);
        }
        onLoadFinish(evt) {
            this._loadNum++;
            if (this._loadNum >= this._loadCount) {
                this.lblPres.text = "100%";
                this.barPres.value = 1;
                this.loadFinished = true;
                this.loadGameScene();
            }
        }
        onLoading(pres) {
            let loadPercent = (this._loadNum + pres) / (this._loadCount + 1);
            this.barPres.value = loadPercent;
            this.lblPres.text = Math.floor(loadPercent * 100) + "%";
        }
        loadRes() {
            let resource = [ {
                url: "res/scenes/Conventional/ModelScene.ls",
                clas: Laya.Scene,
                priority: 1
            }, {
                url: "jsonConfig/CheConfig.json",
                clas: Laya.Loader.JSON,
                priority: 1
            } ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish, [ {
                target: "3dres"
            } ], false), Laya.Handler.create(this, this.onLoading, null, false));
            Laya.loader.on(Laya.Event.ERROR, this, err => {
                //console.log(err)
                //console.error("load 3dres error:", err);
                
            });
        }
        loadGameScene() {
            if (Laya.Browser.onWeiXin) {
                if (this.loadFinished) {
                    this.openGameScene();
                }
            } else {
                this.openGameScene();
            }
        }
        openGameScene() {
            Laya.Scene.open("views/game.scene", false, Laya.Handler.create(this, view => {
                Laya.Scene.open("views/home.scene", false, Laya.Handler.create(this, view => {
                    this.close();
                }));
            }));
        }
    }
    class MyStudyView extends BaseView {
        constructor() {
            super(...arguments);
            this.flag = false;
        }
        onAwake() {
            LayaSample.commonData.isNoAds = true;
            LayaSample.adMgr.hideBannerAd();
            super.onAwake();
        }
        initUI() {
            this.btnCancel = this.getChild("asdwe");
            this.btnCancel = this.getChild("234");
            this.btnCancel = this.getChild("wer");
            this.btnCancel = this.getChild("tttty");
            this.btnCancel = this.getChild("eed3");
            this.btnCancel = this.getChild("dd322");
            this.btnCancel = this.getChild("ky4");
            this.btnCancel = this.getChild("dr3");
            this.btnCancel = this.getChild("453");
            this.btnCancel = this.getChild("5asdf3");
            this.btnCancel = this.getChild("rwef");
            this.btnCancel = this.getChild("ert4");
            this.btnCancel = this.getChild("5467");
            this.btnCancel = this.getChild("ghjrt");
            this.btnCancel = this.getChild("wqwe");
            this.btnCancel = this.getChild("iiop");
            this.btnCancel = this.getChild("mty53");
            this.btnCancel = this.getChild("jhtr");
            this.btnCancel = this.getChild("erew");
            this.btnCancel = this.getChild("werff");
            this.btnCancel = this.getChild("fdbtr");
            this.btnCancel = this.getChild("wer23");
            this.btnCancel = this.getChild("fgh43");
            this.btnCancel = this.getChild("ftss");
            this.btnCancel = this.getChild("hkuy");
            this.btnCancel = this.getChild("dsd");
            this.btnCancel = this.getChild("ve4g");
            this.btnCancel = this.getChild("df45");
            this.btnCancel = this.getChild("dg4");
            this.btnCancel = this.getChild("hjh5");
            this.btnCancel = this.getChild("ss4");
            this.btnCancel = this.getChild("heew23");
            this.btnCancel = this.getChild("sdfe");
            this.btnCancel = this.getChild("dfgsfdg");
            this.btnCancel = this.getChild("dfggfg");
            this.btnCancel = this.getChild("dfsss");
            this.btnCancel = this.getChild("ffewr");
            this.btnCancel = this.getChild("sdfewr");
            this.btnCancel = this.getChild("sdffwert");
            this.btnCancel = this.getChild("sdf43");
            this.btnCancel = this.getChild("hallo");
            this.btnCancel = this.getChild("h1");
            this.btnCancel = this.getChild("h3");
            this.btnCancel = this.getChild("asdew2");
            this.btnCancel = this.getChild("aa3");
            this.btnCancel = this.getChild("bb2");
            this.btnCancel = this.getChild("cc3");
            this.btnCancel = this.getChild("dd3");
            this.btnCancel = this.getChild("ff2");
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnCancel, this, this.cancelClick);
            console.log("you have initEvent");
        }
        cancelClick() {
            this.close();
            LayaSample.commonData.isNoAds = false;
            LayaSample.adMgr.showBannerAd();
            console.log("you have cancelClick");
        }
        asldf() {
            console.log("asldf is click");
        }
        asdf() {
            {
                {
                    console.log("me 33");
                }
            }
            console.log("这是一个打印");
        }
        showUI() {
            if (this.flag) {
                console.log("好事成双");
            } else {
                console.log("来了吗？");
            }
            var array = [ 1, 3, 6 ];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                console.log(element);
            }
            console.log("执行完成！");
        }
        showGame() {
            if (this.fly) {
                console.log("开启游戏");
            } else {
                console.log("闭关中！");
            }
            switch (this.fly) {
              case this.che:
                console.log("选中的是车");
                break;
            }
        }
    }
    class OverView extends BaseView {
        constructor() {
            super(...arguments);
            this.overTime = 10;
            this.bshowVideo = false;
        }
        onAwake() {
            this.bshowVideo = false;
            super.onAwake();
        }
        onOpened() {
            this.isStartTimer = true;
            this.closeView();
        }
        onWxWakeEvent() {
            if (!this.bshowVideo) {
                this.isStartTimer = true;
            }
        }
        onWxSleepEvent() {
            this.isStartTimer = false;
        }
        initData() {
            if (LayaSample.adMgr.getBannerCount() < 2) LayaSample.adMgr.getBannerAd();
            if (!LayaSample.commonData.existVideoAd) LayaSample.adMgr.loadVideoAd();
            Laya.timer.loop(1e3, this, this.onTimerStart);
        }
        initUI() {
            this.btnShare = this.getChild("btnShare");
            this.btnVideo = this.getChild("btnVideo");
            this.btnShare.visible = LayaSample.commonData.showRevivalCard;
            this.btnVideo.visible = LayaSample.commonData.existVideoAd;
            let bottomPanel = this.getChild("bottomPanel");
            this.btnSkip = this.getChild("btnSkip", bottomPanel);
            if (LayaSample.commonData.lateWay == 1) {
                this.btnSkip.x = Math.random() * 1e3 % 440 + 20;
            }
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnShare, this, this.onShareClick);
            LayaSample.utils.addClickEvent(this.btnVideo, this, this.onVideoClick);
            LayaSample.utils.addClickEvent(this.btnSkip, this, this.onSkipClick);
            LayaSample.glEvent.on("sleepWx", this, this.onWxSleepEvent);
            LayaSample.glEvent.on("wakeWx", this, this.onWxWakeEvent);
            LayaSample.glEvent.on("backShare", this, this.onShareBackEvent);
            LayaSample.glEvent.on("videoAdClose", this, this.onVideoCloseEvent);
            LayaSample.glEvent.on("wxapp_close_view", this, () => {
                this.closeView2();
            });
        }
        closeView2() {
            this.close();
        }
        onShareClick() {
            this.isStartTimer = false;
            LayaSample.wxMgr.shareFriend(0, true);
        }
        onVideoClick() {
            this.bshowVideo = true;
            this.isStartTimer = false;
            LayaSample.adMgr.showVideoAd(1);
        }
        onSkipClick() {
            if (LayaSample.commonData.existInterAd) {
                LayaSample.adMgr.showInterstitialAd();
            }
            this.closeView();
        }
        closeView() {
            LayaSample.adMgr.hideBannerAd();
            Laya.Scene.open("views/clearing.scene", false, Laya.Handler.create(this, view => {
                console.log("opppp")
                 platform.getInstance().initList(GameController.getInstance().getGamelist());
                 GameController.getInstance().getGamelist().visible=true;
                this.close();
            }));
        }
        onTimerStart() {
            if (this.overTime > 0) {
                if (this.isStartTimer) {
                    this.overTime -= 1;
                }
                return;
            }
            Laya.timer.clear(this, this.onTimerStart);
            this.onSkipClick();
        }
        onShareBackEvent(evt) {
            if (!evt.isShare) {
                LayaSample.wxMgr.showToast("分享失败", 2e3);
                this.isStartTimer = true;
            } else {
                console.log("!复活成功!");
                this.close();
                this.goonGame();
            }
        }
        onVideoCloseEvent(evt) {
            this.bshowVideo = false;
            if (!evt.isEnded) {
                LayaSample.wxMgr.showToast("看完视频才能复活", 2e3);
                this.isStartTimer = true;
            } else {
                this.close();
                this.goonGame();
            }
        }
        goonGame() {
            LayaSample.glEvent.event("gameGoon");
        }
    }
    class RankItem extends Laya.Box {
        constructor() {
            super();
            this.size(this.width, this.height);
            this.initUI();
        }
        initUI() {
            let prefab = Laya.loader.getRes("prefab/rankItem.json");
            let item = Laya.Pool.getItemByCreateFun("rankItem", prefab.create, prefab);
            this.imgBg = item.getChildByName("bg");
            this.lblName = item.getChildByName("lblName");
            this.lblScore = item.getChildByName("lblScore");
            this.lblRank = item.getChildByName("lblRank");
            this.imgAvatar = item.getChildByName("avatar");
            this.addChild(item);
        }
        setRankItem(itemData) {
            let name = itemData.user_nickname.length > 6 ? itemData.user_nickname.substr(0, 8) : itemData.user_nickname;
            this.lblName.text = name != "" ? name : "神秘玩家";
            let textSize = 28;
            let textStr = itemData.rank;
            if (itemData.rank == 0) {
                textSize = 24;
                textStr = "未上榜";
            }
            this.lblRank.fontSize = textSize;
            this.lblRank.text = textStr;
            this.lblScore.text = itemData.score || itemData.max_score;
            let avatarUrl = itemData.avatar != "" ? itemData.avatar : "ui/rank/avater_default.png";
            this.imgBg.loadImage(itemData.bgUrl);
            this.imgAvatar.loadImage(avatarUrl);
        }
    }
    class RankView extends BaseView {
        constructor() {
            super();
            this.rankBgList = [ "ui/rank/bg_rank_1.png", "ui/rank/bg_rank_1.png", "ui/rank/bg_rank_1.png" ];
            this.worldList = null;
            this.rankMe = null;
            this.btnBack = null;
            this.tabRank = null;
            this.friendList = null;
            this.existWorldRank = true;
            this.worldLoading = 0;
        }
        onAwake() {
            super.onAwake();
            LayaSample.commonData.isNoAds = true;
            LayaSample.adMgr.hideBannerAd();
            this.onRankFriend();
            this.pageWorldRank = 1;
            this.isLoadedWorldRank = false;
            LayaSample.wxMgr.worldRank(1);
            Laya.loader.load("prefab/rankItem.json", Laya.Handler.create(this, this.initList), null, Laya.Loader.PREFAB);
        }
        initUI() {
            let top = this.getChild("topPanel");
            this.btnBack = this.getChild("btnBack", top);
            this.tabRank = this.getChild("tabRank");
            this.world = this.getChild("world");
            this.worldList = this.getChild("list", this.world);
            this.rankMe = this.getChild("rankMe", this.world);
            this.friend = this.getChild("friend");
            this.friendList = this.getChild("list", this.friend);
            this.touchArea = this.getChild("touchArea", this.friend);
            this.touchArea.alpha = 0;
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnBack, this, this.onCloseClick, 12);
            this.tabRank.selectHandler = new Laya.Handler(this, this.onRankClick);
            LayaSample.glEvent.on("draw_world_rank_event", this, this.onDrawWorldrankEvent);
        }
        onClosed() {
            LayaSample.glEvent.off("draw_world_rank_event", this, this.onDrawWorldrankEvent);
            Laya.loader.clearRes("prefab/rankItem.json");
            this.clear();
        }
        initRankEvent(isOn) {
            if (!isOn) {
                this.touchArea.offAllCaller(this);
                this.touchArea.visible = false;
                this.friendList.visible = false;
                return;
            }
            this.touchArea.visible = true;
            this.friendList.visible = true;
            let startPos = 0;
            let startTime = 0;
            let rangeY = 0;
            let speed = 0;
            let pxRatio = LayaSample.commonData.wxsysInfo.pixelRatio ? LayaSample.commonData.wxsysInfo.pixelRatio : 1;
            if (!Laya.Browser.onWeiXin) return;
            this.touchArea.on(Laya.Event.MOUSE_DOWN, this, function(evt) {
                evt.stopPropagation();
                rangeY = 0;
                startTime = evt.nativeEvent.timeStamp;
                startPos = evt.nativeEvent.changedTouches[0].clientY;
                LayaSample.wxMgr.onFrientMouseEvent({
                    cmd: "touch_start"
                });
            });
            this.touchArea.on(Laya.Event.MOUSE_MOVE, this, function(evt) {
                evt.stopPropagation();
                rangeY = evt.nativeEvent.changedTouches[0].clientY - startPos;
                LayaSample.wxMgr.onFrientMouseEvent({
                    cmd: "touch_move",
                    deltaY: rangeY * pxRatio
                });
            });
            this.touchArea.on(Laya.Event.MOUSE_UP, this, function(evt) {
                evt.stopPropagation();
                speed = rangeY / (evt.nativeEvent.timeStamp - startTime);
                LayaSample.wxMgr.onFrientMouseEvent({
                    cmd: "touch_end",
                    speed: speed
                });
            });
            this.touchArea.on(Laya.Event.MOUSE_OUT, this, function(evt) {
                evt.stopPropagation();
                speed = rangeY / (evt.nativeEvent.timeStamp - startTime);
                LayaSample.wxMgr.onFrientMouseEvent({
                    cmd: "touch_cancel",
                    speed: speed
                });
            });
        }
        showList(isShow) {
            let show = isShow ? 1 : 0;
            this.worldList.alpha = show;
            this.rankMe.alpha = show;
        }
        initList() {
            let list = this.worldList;
            list.itemRender = RankItem;
            list.cacheContent = false;
            list.vScrollBarSkin = "";
            list.selectEnable = false;
            list.selectHandler = new Laya.Handler(this, this.onSelect);
            list.renderHandler = new Laya.Handler(this, this.updateItem);
            this.worldLoading++;
        }
        refreshList() {
            if (this.worldLoading >= 2) {
                this.worldList.refresh();
                if (this.rankMe.numChildren == 0) {
                    let item = new RankItem();
                    this.rankMe.addChild(item);
                    item.setRankItem(this.userRank);
                }
                Laya.timer.clear(this, this.refreshList);
            }
        }
        onRankClick(index) {
            if (index == 1) {
                this.onRankWorld();
            } else {
                this.onRankFriend();
            }
        }
        onRankFriend() {
            this.world.visible = false;
            this.friend.visible = true;
            this.friendList.visible = true;
            this.showList(false);
            this.initRankEvent(true);
            LayaSample.wxMgr.showFriendRank(true);
            if (window["wx"] && window["sharedCanvas"]) {
                var width = this.friendList.width;
                var height = this.friendList.height;
                window["sharedCanvas"].width = width;
                window["sharedCanvas"].height = height;
            }
        }
        onRankWorld() {
            this.world.visible = true;
            this.friend.visible = false;
            this.friendList.visible = false;
            this.showList(true);
            this.initRankEvent(false);
            LayaSample.wxMgr.showFriendRank(false);
            Laya.timer.loop(100, this, this.refreshList);
        }
        onDrawWorldrankEvent(evt) {
            this.worldLoading++;
            let page = evt.page;
            let pageData = {};
            let list = [];
            if (evt.data instanceof Array) {
                list = evt.data;
                pageData.data = {
                    list: list,
                    page: page
                };
            } else if (evt.data) {
                pageData = evt;
                list = evt.data.list;
                evt.data.userInfo.userId = evt.data.userInfo.id;
                evt.data.userInfo.bgUrl = this.rankBgList[2];
                delete evt.data.userInfo.id;
                this.userRank = evt.data.userInfo;
            } else {
                console.error("rank data is null.!!!");
                return;
            }
            if (list) {
                this.existWorldRank = list.length >= 20 ? true : false;
            } else {
                this.existWorldRank = false;
                return;
            }
            let dataCount = pageData.data.list.length;
            for (let i = 0; i < dataCount; ++i) {
                pageData.data.list[i].userId = pageData.data.list[i].id;
                let bgIndex = (pageData.data.list[i].rank - 1) % 2;
                pageData.data.list[i].bgUrl = this.rankBgList[bgIndex];
                delete pageData.data.list[i].id;
            }
            if (!this.rankData) {
                this.rankData = {};
            }
            this.pageWorldRank = page;
            this.rankData[page] = pageData;
            let rankDataList = [];
            for (let key in this.rankData) {
                rankDataList.push.apply(rankDataList, this.rankData[key].data.list);
            }
            this.worldList.updateArray(rankDataList);
            this.isLoadedWorldRank = true;
        }
        updateItem(cell, index) {
            cell.setRankItem(cell.dataSource);
            let page = this.pageWorldRank;
            if (index - 6 == 0 && page < 6) ; else if (index + 6 == this.worldList.length) {
                page = page + 1;
                let pageData = this.rankData[page];
                if (pageData) ; else if (this.isLoadedWorldRank && this.existWorldRank && page < 6) ;
            }
        }
        onSelect(index) {
            console.log("您选择的索引是：：" + index);
        }
        onCloseClick() {
            LayaSample.commonData.isNoAds = false;
            Laya.Scene.open("views/home.scene", false, laya.utils.Handler.create(this, v => {
                this.close();
            }));
        }
        clear() {
            LayaSample.wxMgr.showFriendRank(false);
            this.touchArea.offAllCaller(this);
            this.worldList.array = [];
            this.worldList.destroy();
        }
    }
    class RecommondView extends BaseView {
        initUI() {
            this.btnBack = this.getChild("btnBack");
            if (LayaSample.commonData.isAdDelay) {
                if (LayaSample.adMgr.getBannerCount() < 2) LayaSample.adMgr.getBannerAd();
                LayaSample.commonData.isNoAds = false;
                Laya.timer.once(600, this, this.showBanener);
                Laya.timer.once(2500, this, this.hidebanner);
            }
        }
        showBanener() {
            LayaSample.adMgr.setBannerItem();
            LayaSample.commonData.isNoAds = false;
            LayaSample.adMgr.showBannerAd();
        }
        hidebanner() {
            LayaSample.adMgr.hideBannerAd();
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnBack, this, this.onBackClick);
        }
        onBackClick() {
            Laya.Scene.open("views/wxapp.scene", false, Laya.Handler.create(this, view => {
                this.close();
            }));
        }
    }
    class AppLite2 extends Laya.Script {
        constructor() {
            super();
            this.appCount = -1;
            this.needClearTimer = false;
            this.cate = 0;
            this.ind = 0;
            this.prevInd = 0;
            this.renderCount = 4;
            this.speed = 3e3;
        }
        closeComp() {
            Laya.timer.clearAll(this);
            this.panel.visible = false;
            console.log("hide---");
            this.isHide = true;
        }
        onDisable() {
            Laya.timer.clearAll(this);
            this.panel.visible = false;
            console.log("hide---");
        }
        onStart() {
            if (this.isHide) return;
            this.initData();
            this.initUI();
            this.initList();
        }
        initUI() {
            let isShow = this.appCount != 0;
            this.list.visible = isShow;
            this.panel.visible = isShow;
        }
        initData() {
            AppItem.appWidth = this.appWidth;
            AppItem.appHeight = this.appHeight;
            AppItem.appPrefab = this.appPrefab;
            this.data = LayaSample.wxMgr.getWxappList(this.category);
            this.appCount = this.data.length;
            if (this.appCount <= 6) {
                return;
            }
            let i = 0;
            let weightCount = 0;
            for (i = 0; i < this.appCount; ++i) {
                weightCount += this.data[i].weight;
            }
            let weightItem = [];
            let weight = 0;
            for (i = 0; i < this.appCount; ++i) {
                weight += this.data[i].weight;
                weightItem[i] = {};
                weightItem[i].index = i;
                weightItem[i].weight = weight / weightCount;
            }
            let dataList = [];
            let probability = 0;
            let finish = false;
            let offset = 0;
            for (let j = 0; j < this.appCount; ++j) {
                probability = Math.random() * weightItem[weightItem.length - 1].weight;
                finish = false;
                for (i = 0; i < weightItem.length; ++i) {
                    if (!finish && probability <= weightItem[i].weight) {
                        finish = true;
                        dataList.push(this.data[weightItem[i].index]);
                        if (i + 1 < weightItem.length) {
                            offset = weightItem[i + 1].weight - weightItem[i].weight;
                        }
                    }
                    if (finish && i + 1 < weightItem.length) {
                        weightItem[i + 1].weight -= offset;
                        weightItem[i] = weightItem[i + 1];
                    }
                }
                weightItem.length -= 1;
            }
            this.data = dataList;
        }
        getData(weightItem, probability) {
            for (var i = 0; i < weightItem.length; ++i) {
                if (probability > weightItem[i]) ;
            }
        }
        onGameSkipSuccess() {
            this.data = LayaSample.wxMgr.getWxappList(this.category);
            this.appCount = this.data.length;
            let listNode = this.list;
            if (this.appCount > 0) {
                listNode.array = this.data;
            }
            if (this.category == 1) {
                Laya.timer.once(1e3, this, this.moveList);
            }
        }
        initList() {
            let list = this.list;
            if (list != null) {
                list.itemRender = AppItem;
                list.vScrollBarSkin = "";
                list.selectEnable = true;
                list.renderHandler = new Laya.Handler(this, this.updateItem);
                list.mouseHandler = new Laya.Handler(this, this.onSelect);
                this.renderCount = list.repeatX * list.repeatY;
            }
            list.array = this.data;
            Laya.timer.once(1e3, this, this.moveList);
        }
        moveList() {
            this.needClearTimer = false;
            if (this.list) {
                let len = (this.list.array.length + 1) / 2;
                if (len < 2) return;
                let ti = len * 2 - 4;
                this.list.tweenTo(ti, 3e3 * (ti - this.list.startIndex - 1), new Laya.Handler(this, this.moveList1));
            }
        }
        moveList1() {
            let len = (this.list.array.length + 1) / 2;
            if (len < 2) return;
            let ti = len * 2 - 4;
            this.list.tweenTo(0, 3e3 * ti, new Laya.Handler(this, this.moveList));
        }
        updateItem(cell, index) {
            cell.setItemInfo(cell.dataSource);
        }
        onSelect(e, index) {
            if (index < 0) return;
            if (e.type == "mouseup") {
                var data = this.list.getItem(index);
                if (data != null) {
                    LayaSample.wxMgr.openOtherApp(data.app_id, data.category, this.cate);
                }
            }
            if (this.category == 1) {
                if (this.needClearTimer) {
                    Laya.timer.clear(this, this.moveList);
                }
                this.needClearTimer = true;
                if (this.list.startIndex < 3) {
                    Laya.timer.once(1e3, this, this.moveList);
                } else {
                    Laya.timer.once(1e3, this, this.moveList1);
                }
            }
            this.list.selectedIndex = -1;
        }
        _setData(_data) {
            this.ind = 0;
            if (this.panel != null) {
                if (this.data == null || this.data.length == 0) {
                    this.panel.visible = false;
                } else {
                    this.panel.visible = true;
                }
            }
            this.list.array = this.data;
            if (this.data.length > this.renderCount) {
                Laya.timer.frameOnce(1, this, this._tweenToNext);
            }
        }
        _tweenToNext() {
            Laya.timer.clearAll(this);
            this.ind = Math.max(this.list.repeatY, this.list.startIndex);
            if (this.ind == this.prevInd) {
                this.ind += this.list.repeatY;
            }
            if (this.ind > this.appCount) {
                this.list.scrollTo(0);
                this.ind = this.list.repeatY;
            }
            this.prevInd = this.ind;
            this.list.tweenTo(this.ind, this.speed - 10);
            Laya.timer.once(this.speed, this, this._tweenToNext);
        }
        _copyEndDataToStart(data) {
            this.appCount = data.length;
            if (data.length > this.renderCount) {
                for (let index = 0; index < this.renderCount; index++) {
                    const element = data[data.length - index - 1];
                    data.unshift(element);
                }
            }
        }
    }
    class Wxapp extends Laya.Script {
        constructor() {
            super();
            this.repeatX = 0;
            this.appCount = -1;
        }
        onStart() {
            LayaSample.commonData.isNoAds = true;
            LayaSample.wxAd.hideBannerAd();
            this.initUI();
            this.initEvent();
            if (LayaSample.commonData.isAdDelay) {
                if (LayaSample.adMgr.getBannerCount() < 2) LayaSample.adMgr.getBannerAd();
                LayaSample.commonData.isNoAds = false;
                Laya.timer.once(1e3, this, this.showBanener);
                Laya.timer.once(1600, this, this.hidebanner);
            }
        }
        showBanener() {
            LayaSample.adMgr.setBannerItem();
            LayaSample.commonData.isNoAds = false;
            LayaSample.adMgr.showBannerAd();
        }
        hidebanner() {
            LayaSample.adMgr.hideBannerAd();
        }
        initUI() {
            this.view = this.owner;
            let view = this.view;
            view.height = Laya.stage.height;
            let offsetTop = LayaSample.screen.offsetTop;
            let pixelRatio = LayaSample.screen.realPxRatio;
            let sysInfo = LayaSample.commonData.wxsysInfo;
            let btm = 0;
            for (let index = 0; index < view._children.length; index++) {
                let node = view._children[index];
                let posY = node.y + offsetTop;
                if (node.name == "topPanel") {
                    if (sysInfo.statusBarHeight >= 30 && LayaSample.screen.allScreen) {
                        posY = sysInfo.statusBarHeight * pixelRatio;
                    } else {
                        posY = 30;
                    }
                }
                node.y = posY;
                if (node.name == "bottomPanel" || node.name == "bottomui") {
                    btm = 60;
                    node.bottom = btm;
                }
            }
        }
        initEvent() {
            LayaSample.utils.addClickEvent(this.btnPlay, this, this.onPlayGameClick, 14);
            LayaSample.utils.addClickEvent(this.btnBack, this, this.onBackClick, 14);
        }
        initData() {
            AppItem.appWidth = this.appWidth;
            AppItem.appHeight = this.appHeight;
            AppItem.appPrefab = this.appPrefab;
            this.data = LayaSample.wxMgr.getWxappList(this.category);
            this.appCount = this.data.length;
        }
        initList() {
            let list = this.list;
            if (list != null) {
                list.itemRender = AppItem;
                list.vScrollBarSkin = "";
                list.selectEnable = true;
                list.selectHandler = new Laya.Handler(this, this.onSelect);
                list.renderHandler = new Laya.Handler(this, this.updateItem);
                this.repeatX = list.repeatX;
                if (this.appCount > 0) {
                    list.array = this.data;
                    LayaSample.commonData.isNoAds = true;
                    LayaSample.adMgr.hideBannerAd();
                }
            }
        }
        updateItem(cell, index) {
            cell.setItemInfo(cell.dataSource);
        }
        onSelect(index) {
            if (index < 0) return;
            var data = this.list.getItem(index);
            if (data != null) {
                LayaSample.wxMgr.openOtherApp(data.app_id, data.category);
            }
            this.list.selectedIndex = -1;
        }
        onPlayGameClick() {
            this.view.close();
            LayaSample.glEvent.event("gameInit", {
                isPlay: false
            });
            let isShow = LayaSample.storageMgr.isSkinTips();
            if (isShow) {
                LayaSample.commonData.isNoAds = false;
                LayaSample.adMgr.hideBannerAd();
                let data = {};
                data.target = "views/home.scene";
                Laya.Scene.open("views/freeSkin.scene", false, data, Laya.Handler.create(this, v => {}));
            } else {
                LayaSample.glEvent.event("gamePlay");
            }
        }
        onBackClick() {
            Laya.Scene.open("views/home.scene", false, Laya.Handler.create(this, v => {
                this.view.close();
                LayaSample.commonData.isNoAds = true;
                LayaSample.glEvent.event("gameInit", {
                    isPlay: false
                });
                LayaSample.adMgr.showBannerAd();
            }));
        }
    }
    class GameConfig {
        constructor() {}
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scripts/views/ClearingView.ts", ClearingView);
            reg("scripts/uiComp/AppBanner.ts", AppBanner);
            reg("scripts/views/CollectView.ts", CollectView);
            reg("scripts/views/FirstIncomeView.ts", FirstIncomeView);
            reg("scripts/uiComp/AppLite.ts", AppLite);
            reg("scripts/views/SkinView.ts", SkinView);
            reg("scripts/views/GameView.ts", GameView);
            reg("scripts/uiComp/GuideComp.ts", GuideComp);
            reg("scripts/views/HoldView.ts", HoldView);
            reg("scripts/views/HomeView.ts", HomeView);
            reg("scripts/uiComp/WxgameList.ts", WxgameList);
            reg("scripts/views/LoginView.ts", LoginView);
            reg("scripts/views/MyStudyView.ts", MyStudyView);
            reg("scripts/views/OverView.ts", OverView);
            reg("scripts/views/RankView.ts", RankView);
            reg("scripts/views/RecommondView.ts", RecommondView);
            reg("scripts/uiComp/AppLite2.ts", AppLite2);
            reg("scripts/uiComp/Wxapp.ts", Wxapp);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "views/login.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();
    class Main {
        constructor() {
            let deviceAspectRatio = Laya.Browser.height / Laya.Browser.width;
            let _height = Laya.Browser.onMobile ? deviceAspectRatio * GameConfig.width : GameConfig.height;
            LayaSample.screen.realPxRatio = _height / Laya.Browser.clientHeight;
            LayaSample.screen.allScreen = deviceAspectRatio > 17 / 9 ? true : false;
            LayaSample.screen.offsetTop = (_height - GameConfig.height) / 2;
            console.log(GameConfig.width,_height)
            if (window["Laya3D"]) Laya3D.init(750, 1334); else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = "showall";
            console.log(GameConfig.screenMode)
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = "center";
            Laya.stage.alignH = "middle";
            //Laya.stage.useRetinalCanvas = true;
            Laya.MouseManager.multiTouchEnabled = false;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat) Laya.Stat.show();
            Laya.alertGlobalError = true;
           
            platform.getInstance().cargamesstartup("Elastic-Car",()=>{
               Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
               const yad = new Laya.Image();
               yad.skin = "car.png";
               yad.zOrder = 2e3;
               Laya.stage.addChild(yad);
               yad.on(Laya.Event.MOUSE_DOWN, yad, () => { console.log("qwewqeqewq"),platform.getInstance().navigate(); });
               yad.right=0;
               yad.top=0;
               
               
               yad.name="yad";

               
              

            })
            //Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();
})();