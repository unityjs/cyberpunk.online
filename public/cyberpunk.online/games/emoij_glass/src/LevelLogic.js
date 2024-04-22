var LevelLogic = new function () {
    var self = this
    var data
    var isPlaying
    var created
    var bar
    var bonus
    var starsBar
    var level
    var stars
    var isWinner
    var isRetry = 0
    var canRetry
    self.reset = function () {
        log("--------- RESET!")
        canRetry = false
        PencilPhysics.reset()
        PencilPhysics.setHead(Data.get("pencilHead"), Data.get("pencilTint"))
        Elements.reset()
        Emojis.reset()
        Glasses.reset()
        MovingPool.reset()
        Hints.reset()
        Finger.hide()
        Cancel("checkWin")
        Cancel("showHint")
    }
    self.retry = function (force) {
        console.log('retry ...'); HUHU_showInterstitialAd(); log("TRY RETRY?", canRetry)
        Tracking.retryLevel(Levels.id)
        if (!force && !canRetry) return
        isRetry = true
        canRetry = false
        Engine.startGame()
    }
    self.start = function () {
        console.log('start ...');
        HUHU_showInterstitialAd(); 
        self.reset()
        level = Levels.get()
        isWinner = false
        if (isRetry && !level.hint) DelayUnique("showHint", function () { Header_Top.showHint("friend"), 3000 })
        isRetry = false
        Header_Top.levelField.text = "Level " + (level.id + 1)
        bonus = 100
        isPlaying = false
        self.percent = 0
        Header_Top.setPercent(bonus)
        PencilPhysics.disable()
        Elements.spawn(level.data)
        Particles.clear()
        Animation.fadeIn(Canvas.game)
        if (level.id == 0) Finger.show({ x: -400, y: -0, rotation: -90, swipeToX: 300, swipeToY: 10, sprite: "fingerPencil" }, "swipeTo")
        Canvas.game.scale.set(1.1)
        Animation.scaleTo(Canvas.game, null, null, 500)
        if (level.id == 1 && Levels.data[2].isLocked) {
            Delay(function () {
                Popups.overlay("Howto")
                Tracking.tutorialFinished()
            }, 1000)
            return
        }
        self.enablePencil()
        if (level.hint || level.id == 0) { level.showHint() } else { DelayUnique("showHint", function () { Header_Top.showHint("hint") }, 7000) }
    }
    self.enablePencil = function () { DelayUnique("checkWin", function () { PencilPhysics.enable(onDrawComplete, onDrawUpdate) }, 500) }
    function onDrawComplete(shape) {
        Finger.hide()
        Cancel("showHint")
        if (!shape || isPlaying) return
        isPlaying = true
        canRetry = true
        Matter.startSprites()
    }
    function onDrawUpdate() {
        var amount = .60
        if (Levels.id >= 79) amount *= .75
        bonus -= amount
        Header_Top.setPercent(MathUtil.hardLimit(Math.round(bonus), 0, 100))
        stars = 3
        if (bonus < 67) stars = 2
        if (bonus < 33) stars = 1
    }
    self.updateFill = function (filled) {
        self.percent = filled * 100 / (20 * Glasses.pool.length)
        if (self.percent >= 100 && !isWinner) {
            isWinner = true
            endSequence()
            var coins = 25
            if (stars == 2) coins = 50
            if (stars == 3) coins = 100
            for (var n in Glasses.pool) {
                Particles.explodeObstacle(Glasses.pool[n], { texture: "coin", tint: 0xFFFFFF, scale: 2 })
                Coins.collect(Glasses.pool[n], coins / Glasses.pool.length, 0xFFFFFF)
            }
            Sounds.playRandom("minion_", 7, 1)
        }
    }
    self.emojiLost = function () { }
    self.onCannonEnd = function () {
        PencilPhysics.disable()
        if (isWinner) return; DelayUnique("checkWin", endSequence, 2000)
    }
    function endSequence() {
        canRetry = false
        DelayUnique("checkWin", function () {
            Animation.fadeOut(Canvas.game, 800)
            DelayUnique("checkWin", function () {
                if (isWinner) {
                    level.setStars(stars)
                    Particles.confetti()
                    canRetry = true
                    Tracking.levelCompleted(Levels.id)
                    Popups.show("Over")
                    log("END SEQUENCE", canRetry)
                } else {
                    Tracking.levelFailed(Levels.id)
                    LevelLogic.start()
                }
            }, 800)
        }, 3000)
    }
}