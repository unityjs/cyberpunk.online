var Sounds
var Music
function SoundEngine(name, isMusic) {
    var self = this
    var isMusicStarted = false
    var sounds = {}
    var name = name
    self.current = null
    var isMusic = isMusic
    var sprite
    self.volume = 1
    var isMuted = false
    var isStarted = false
    var startObject
    game.input.onDown.add(startEngine)
    Load.soundsprite(name, function () { sprite = game.sound.addSprite(name) })
    self.pause=function () {
        log("ON PAUSE!")
        if (!isMusic || !isStarted) return
        isStarted = false
        sounds[self.current].stop()
        self.current = null
        game.input.onDown.add(startEngine)
    }
    function startEngine() {
        if (isStarted || !sprite) return
        isStarted = true
        log("START ENTGINE!", startObject)
        if (startObject) self.play(startObject.name, startObject.vol, startObject.loop, startObject.onlyOne)
        game.input.onDown.remove(startEngine)
    }
    self.setMute = function (bool) {
        isMuted = bool
        self.volume = isMuted ? 0 : 1
        for (var n in sounds)
            if (sounds[n].isPlaying) sounds[n].volume = self.volume
    }
    self.setMute(Data.get(isMusic ? "muteMusic" : "muteSFX"))
    self.updateSounds = function () { game.sound.update() }
    self.onPauseGame = function () {
        game.sound.unsetMute()
        game.sound.resumeAll()
        game.sound._muted = false
    }
    self.setEnableSound = function (bool) { game.sound.masterGain.gain.value = bool ? 1 : 0 }
    self.playInterfaceMusic = function () { self.play(Data.config.interfaceMusic || "interface") }
    self.playOverMusic = function () { self.play(Data.config.overMusic || "interface") }
    self.playGameMusic = function () { self.play(Data.config.gameMusic || "game") }
    self.play = function (name, vol, loop, onlyOne) {
        if (!sprite) return
        startObject = { name: name, vol: vol, loop: loop, onlyOne: onlyOne }
        if (!isStarted) return
        if (isMusic) {
            if (self.current == name) return
            self.stop(self.current)
        }
        self.current = name
        var sound = sounds[name]
        if (sound && onlyOne && sound.isPlaying) return
        var volume = (vol || 1) * self.volume
        try { sound = sounds[name] = sprite.play(name, isMusic ? 0 : volume, isMusic || loop) } catch {
            log("BAD SOUND", name)
            return
        }
        if (isMusic) sound.fadeTo(1000, volume)
        return sound
    }
    self.playRandom = function (name, max, min, volume) { self.play(name + Random.value(max, min || 1), volume) }
    self.loop = function (name, volume) { return self.play(name, volume, true) }
    self.stop = function (name) {
        var name = name || self.current
        if (sounds[name]) sounds[name].stop()
        self.current = null
        return sounds[name]
    }
    self.fadeIn = function (name, loop) { self.play(name, 0, loop).fadeTo(1000, self.volume) }
    self.fadeOut = function (name) {
        var sound = sounds[name]
        if (!sound || !sound.isPlaying) return
        sound.fadeTo(1000, 0)
    }
}