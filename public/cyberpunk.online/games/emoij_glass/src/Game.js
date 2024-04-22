var Game = new function () {
    var self = this
    var isDebug = true
    var isFirstTime = true
    self.onCreate = function () {
        Matter.enable()
        new Background()
        new Header_Top()
        new PencilPhysics()
        new Finger()
        new Popup_Shop()
        Levels.fill()
        if (Data.config.dataLocation != "local") return; Sprites.get("white", { parent: Canvas.marquee, color: 0xe6e6e6, width: 20, height: Canvas.HEIGHT, x: Canvas.LEFT })
        Sprites.get("white", { parent: Canvas.marquee, color: 0xe6e6e6, width: 20, height: Canvas.HEIGHT, x: Canvas.RIGHT })
        Sprites.get("white", { parent: Canvas.marquee, color: 0xe6e6e6, height: 20, width: Canvas.WIDTH, y: Canvas.TOP })
        Sprites.get("white", { parent: Canvas.marquee, color: 0xe6e6e6, height: 20, width: Canvas.WIDTH, y: Canvas.BOTTOM })
    }
    self.onShow = function () {
        LevelLogic.reset()
        return
        game.sound.mute = true
        Delay(function () { Popups.show("Over") }, 200)
    }
    self.onStart = function () { Canvas.screen.visible = true }
    self.onShowGame = function () {
        Data.set("currentScreen", "game")
        LevelLogic.start()
    }
    self.onGameOver = function () { }
    self.onPause = function () {
        console.log("self.onPause...")
    }
    self.onPlay = function () { }
    self.update = function () { }
    self.onContinue = function () { Engine.play() }
}
function checkFB() {
    log(Data.config.dataLocation)
    if (Data.config.dataLocation != "local") return true
    log("SHOW oVERLAY")
    Popups.overlay("Dialog", { text: "Play on Facebook?", buttonText: "go!", callback: function (bool) { if (bool) window.open(Data.config.entryPointURL); } })
}