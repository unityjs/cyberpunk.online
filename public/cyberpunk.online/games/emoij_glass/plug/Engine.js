var Engine
var game
var myEngine
var targetSize
function startEngine(w, h, renderMode) {
    targetSize = { width: w, height: h }
    var width = w
    var height = h
    var isHorizontal = width > height
    var isHorizontalWindow = window.innerWidth > window.innerHeight
    if (isHorizontal && isHorizontalWindow) {
        var ratio = window.innerHeight / window.innerWidth
        ratio > height / width ? height = (width * ratio) : width = height / ratio
    }
    if (!isHorizontal && !isHorizontalWindow) {
        var ratio = window.innerWidth / window.innerHeight
        ratio > width / height ? width = (height * ratio) : height = width / ratio
    }
    myEngine = new Phaser.Game(width, height, renderMode || Phaser.CANVAS)
    myEngine.state.add('Boot', Boot)
    myEngine.state.add('Preload', Preload)
    myEngine.state.add('Engine', Engine)
    myEngine.state.start('Boot')
}
function Boot() {
    var self = this
    var orientation
    self.init = function () {
        game = self.game
        game.stage.backgroundColor = "#FFFFFF"
        log("INIT BOOT")
        game = self.game
        self.input.maxPointers = 1
        self.stage.disableVisibilityChange = false
        self.game.renderer.renderSession.roundPixels = false
        self.scale.pageAlignHorizontally = true
        self.scale.pageAlignVertically = true
        self.game.renderer.renderSession.roundPixels = true
        self.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        self.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        self.scale.refresh()
    }
    self.preload = function () {
        self.game.load.crossOrigin = "anonymous"
        // self.game.load.script('webfont','plug/webfont.js')
        self.load.json('config', 'assets/config.json')
        self.load.image("preload_bg", "assets/images/preload_bg.png")
        self.load.image("preload_bar", "assets/images/preload_bar.png")
        self.load.image("preload_outline", "assets/images/preload_outline.png")
        self.load.image("preload_logo", "assets/images/preload_logo.png")
    }
    self.create = function () {
        Data.init(this.game.cache.getJSON('config'))
        self.state.start('Preload')
    }
}
function Preload() {
    var self = this
    var preloadBar
    self.preload = function () {
        new myTick()
        preloadBar = new PreloadBar()
        self.load.crossOrigin = 'anonymous'
        self.load.onFileComplete.removeAll(this)
        var config = Data.config
        game.plugins.add(PhaserNineSlice.Plugin)
        self.game.plugins.add(PhaserSpine.SpinePlugin)
        self.load.onFileComplete.add(preloadBar.onProgress, self)
        for (var n in config.atlas) self.load.atlasJSONHash(config.atlas[n], 'assets/atlas/' + config.atlas[n] + '.png', 'assets/atlas/' + config.atlas[n] + '.json')
        for (var n in config.images) self.load.image(config.images[n], 'assets/images/' + config.images[n] + ".png")
        for (var n in config.images) log("LOAD", config.images[n])
        for (var n in config.xml) self.load.xml(config.xml[n], 'assets/xml/' + config.xml[n] + ".xml")
        for (var n in config.spine) self.load.spine(config.spine[n], 'assets/spine/' + config.spine[n] + ".json")
        for (var n in config.fonts) self.load.bitmapFont(config.fonts[n], 'assets/fonts/' + config.fonts[n] + ".png", 'assets/fonts/' + config.fonts[n] + ".xml")
        for (var n in config.soundsprites) self.load.audiosprite(config.soundsprites[n], ['assets/soundsprites/' + config.soundsprites[n] + '.ogg', 'assets/soundsprites/' + config.soundsprites[n] + '.mp3'], 'assets/soundsprites/' + config.soundsprites[n] + '.json')
        for (var n in config.video) self.load.video(config.video[n], 'assets/video/' + config.video[n] + '.mp4')
        for (var n in config.webm) self.load.video(config.webm[n], 'assets/webm/' + config.webm[n] + '.webm')
        for (var n in config.physics) self.load.physics(config.physics[n], 'assets/physics/' + config.physics[n] + '.json')
        if (!config.positions) config.positions = {}
        for (var n in config.positions) {
            config.positions[n] = config.positions[n][n]
            config.positions[n].x = Math.abs(config.positions[n].x) - targetSize.width / 2
            config.positions[n].y = Math.abs(config.positions[n].y) - targetSize.height / 2
        }
    }
    self.create = function () {
        Sprites.index()
        Tick.start(waitForConnection)
    }
    function waitForConnection() {
        if (!Connector.isConnected) return
        Tick.stop(waitForConnection)
        Tick.start(waitForFonts)
    }
    function waitForFonts() {
        if (!Data.config.googleFonts) return goGame()
        if (!webFontsActive) return
        goGame()
    }
    function goGame() {
        preloadBar.remove()
        Callback.delay(doGoGame, 300)
    }
    function doGoGame() { self.state.start('Engine') }
}
function Engine() {
    var self = this
    self.isStarted
    var usedContinue
    self.init = function () {
        Engine = self
        game = self.game
        self.centerX = self.game.world.centerX
        self.centerY = self.game.world.centerY
        game.stage.disableVisibilityChange = Data.config.disableVisibilityChange
        if (!self.timesCreated) self.timesCreated = 0
        self.timesCreated++
    }
    self.create = function () {
        new myTick()
        new myCanvas()
        new Cursor()
        new myBlackCover()
        Sounds = new SoundEngine("sfx")
        Music = new SoundEngine("music", true)
        Game.onCreate()
        self.goSplash()
    }
    self.goSplash = function () {
        self.exitGame()
        Popups.show("Splash")
        if (self.firstLoadOnly) {
            self.firstLoadOnly = true
            var time = 700
            Canvas.popups.alpha = Canvas.hud.alpha = Canvas.aboveall.alpha = 0
            Animation.fadeIn(Canvas.popups, time)
            Animation.fadeIn(Canvas.hud, time)
            Animation.fadeIn(Canvas.aboveall, time)
        }
    }
    self.startGameVS = function () { self.startGame("versus") }
    self.startGame = function (gameMode) {
        Data.set("gameMode", gameMode || "solo", true)
        self.isPlaying = true
        Popups.hide()
        self.isStarted = false
        self.isInGame = true
        Engine.isPaused = true
        Delay(Cursor.enable, 400)
        if (Score) Score.reset()
        Animation.fadeIn(Canvas.screen)
        Game.onShowGame != null ? Game.onShowGame() : null
        self.play()
    }
    self.pause = function (skipPopup) {
        console.log("self.pause...")
        if (Engine.isPaused) return
        Engine.isPaused = true
        Callback.delay(function () { if (!skipPopup) Popups.show("Pause") }, self.isStarted ? 1 : 500)
        if (!self.isInGame) return
        if (Score) Score.hide()
        Tick.stop(Game.update)
        Game.onPause()
        Music.pause()
    }

    self.unpause = function () {
       // Game.onUnpause()
        self.play()
    }

    self.quit = function () { 
        Popups.overlay("Dialog", { text: "exit game?", buttoText: "yes, quit", callback: function (bool) { if (bool) self.goSplash() } }) 
    }
    self.play = function () {
        if (!Engine.isPaused) return
        Engine.isPaused = false
        Popups.hide()
        Callback.delay(function () {
            Tick.start(Game.update)
            Game.onPlay()
            Music.playGameMusic()
            if (!self.isStarted) Game.onStart()
            self.isStarted = true
        }, 1)
    }
    self.gameOver = function (delay) {
        if (!self.isPlaying) return
        self.isPlaying = false
        self.isInGame = false
        Engine.isPaused = true
        Cursor.disable()
        Music.playOverMusic()
        Connector.saveScore()
        Game.onGameOver()
        Sounds.play("gameover")
        Callback.delay(function () { Popups.show("Over") }, delay || 1000)
    }
    self.exit = function () {
        self.isPlaying = false
        self.isInGame = false
        Engine.isPaused = true
        Cursor.disable()
        Game.onGameOver()
        self.goSplash()
    }
    self.exitGame = function () {
        self.isPlaying = false
        Engine.isPaused = true
        if (Score) Score.hide()
        Music.playInterfaceMusic()
        self.isInGame = false
        Canvas.screen.visible = false
        usedContinue = false
        Game.onShow()
    }
    self.gameOverContinue = function () {
        if (self.isPaused) return
        if (usedContinue || !Score.score) return self.gameOver()
        usedContinue = self.isPaused = true
        Cursor.block()
        Delay(function () { Popups.show("Continue") }, 500)
    }
    var resizeListeners
    self.onOrientationChange = function (forceOrientation) {
        self.game.orientation = forceOrientation || self.game.scale.screenOrientation.split("-")[0]
        ga('send', { 'hitType': 'event', 'eventCategory': 'Game', 'eventAction': 'Change Orientation', 'eventLabel': self.game.orientation }); for (var n in resizeListeners) resizeListeners[n]()
    }
    self.onResize = function (callback) { resizeListeners.push(callback) }
    self.shake = function (x, y, duration) { Animation.shake(Canvas, { x: self.centerX, y: self.centerY }, x || 20, y || 20, duration || 500) }
}