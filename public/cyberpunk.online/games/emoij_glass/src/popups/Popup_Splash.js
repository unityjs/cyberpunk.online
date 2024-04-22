var Splash
function Popup_Splash() {
    var self = Popups.add("Splash", { onMouseDown: onMouseDown, animation: "fade", animationOut: "cut", onShow: onShow, onHide: onHide, update: update, hasBlackCover: false })
    var sprites = self.sprites
    var isFirstTime = true; var pencil = sprites.Splash_logo_pencil
    var giftBtn = sprites.Splash_store_button
    giftBtn.x = Canvas.RIGHT - 15
    var timeField = Texts.spawnBitmap("font3", { y: giftBtn.y + 130, x: giftBtn.x - 70, size: 35, text: " ", tint:000000, parent: self })
    pencil.anchor.set(0, 1)
    pencil.x -= pencil.width / 2
    pencil.y += pencil.height / 2
    var pencilX = pencil.x - 10
    var hasGift
    Texts.spawnBitmap("font3", { achorX: 1, text: "v1.96", x: Canvas.LEFT + 150, y: giftBtn.y + 200, fontSize: 30, tint: 0x0084ff, parent: self })
    function onMouseDown(button) {
        var id = button.atlasId
        if (id == "Splash_play_button") {
            Levels.setLastUnlocked()
            Engine.startGame()
            return
        }
        if (id == "Splash_social_button") { return }
        if (id == "Splash_shop_button") return Popups.show("Shop")
        if (id == "Splash_store_button") return collectGift()
    }
    var count1 = 0
    var count2 = 0
    var count3 = 0
    var count4 = 0
    var count5 = 0
    var count6 = 0
    function update() {
        count1 += .1
        count2 += .08
        count3 += .06
        count4 += .04
        count5 += .13
        var s1 = Math.sin(count1) * .01
        var s2 = Math.sin(count2) * .04
        var s3 = Math.sin(count3) * .04
        var s4 = Math.sin(count4) * 4
        var s5 = Math.sin(count5) * 20
        sprites.Splash_logo_emojis.scale.set(1 + s1, 1 + s1)
        sprites.Splash_logo_emoji.angle += s2
        sprites.Splash_logo_emoji.scale.set(1 - s2 * .2, 1 + s2 * .2)
        sprites.Splash_logo_glass.angle += s3
        sprites.Splash_logo_glass.scale.set(1 + s3 * .2, 1 - s3 * .2)
        pencil.x = pencilX + s4
        pencil.angle = s5
        if (count6++ < 50) return
        count6 = 0
        if (!hasGift) return
        Animation.bounceScaleFloor(giftBtn)
        self.addChild(Particles.shockwave({ x: giftBtn.x - 80, y: giftBtn.y }, { texture: "condense", scale: 1.6, alpha: .5, tint: 0xfeaa07 }))
    }
    function onHide() { }
    function onShow() {
        Cancel("checkWin")
        count1 = Random.decimal()
        count2 = Random.decimal()
        count3 = Random.decimal()
        count4 = Random.decimal()
        count5 = Random.decimal()
        sprites.Splash_logo_emoji.angle = sprites.Splash_logo_glass.angle = 0
        resumeTimer()
        Connector.checkSubscribeBot()
        if (!isFirstTime) return
        isFirstTime = false; var ah = Data.increase("_h")
        if (ah > 5) ah = Data.set("_h", 0)
        console.log("HOME?", ah); if (ah != 1) return; Connector.addHomeShortcut()
        if(window.parent != window){
            window.parent.setLoadReport({type:"loadReady"},()=>{})
        }
    }
    function collectGift() {
        Tracking.dailyPrize()
        Coins.collect(Cursor, 50)
        Data.set("gc", DateUtils.getTime())
        log("COLLECT GIFT ON TIME", Data.get("gc"))
        Sounds.play("gift")
        resumeTimer()
    }
    function resumeTimer() {
        var date = Data.get("gc")
        var seconds = DateUtils.secondsFrom(date)
        hasGift = seconds > 3600 * 4
        log("resumeTimer?", date, seconds, hasGift)
        if (hasGift) return enableGift()
        giftBtn.disable()
        giftBtn.alpha = .4
        Tick.startTimer(onTimer)
    }
    function enableGift() {
        giftBtn.enable()
        timeField.text = " "
        giftBtn.alpha = 1
        Tick.stop(onTimer)
    }
    function onTimer() {
        var seconds = 3600 * 4 - DateUtils.secondsFrom(Data.get("gc"))
        timeField.text = StringUtil.seconds(seconds)
        if (seconds <= 0) enableGift()
    }
    function play(id) {
        return
        Engine.startGame()
    }
}
Pool.register("Popup_Splash", Popup_Splash)