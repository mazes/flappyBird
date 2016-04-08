window.Game = (function() {
    'use strict';

    /**
    * Main game class.
    * @param {Element} el jQuery element containing the game.
    * @constructor
    */
    var Game = function(el) {
        this.el = el;
        this.counter = 0;
        this.player = new window.Player(this.el.find('.Player'), this);
        this.score = new window.Score(this.el.find('.Scoreboard'), this);
        this.audioController = new window.AudioController();
        this.isPlaying = false;
        this.genPipes = false;
        this.pipesOnScreen = [];
        this.Pipe = new window.Pipe(this);
        this.Pipe.generatePipes();
        this.PIPESPAWNTIME = 90;
        this.muteButton = document.getElementById('mute');
        this.muteButton.onclick = this.audioController.mute;

        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
    };

    /**
    * Runs every frame. Calculates a delta and allows each game
    * entity to update itself.
    */
    Game.prototype.onFrame = function() {
        // Check if the game loop should stop.
        if(!this.isPlaying){
            return;
        }
        // Calculate how long since last frame in seconds.
        var now = +new Date() / 1000,
        delta = now - this.lastFrame;
        this.lastFrame = now;

        // Update game entities.
        this.player.onFrame(delta);

        if(this.genPipes){
            this.counter++;
            if(this.counter === this.PIPESPAWNTIME){
                this.pipesOnScreen.push(this.Pipe.spawnPipe());
                this.counter = 0;
            }
        }
        // Request next frame.
        window.requestAnimationFrame(this.onFrame);
    };

    /**
    * Starts a new game.
    */
    Game.prototype.start = function() {
        this.reset();
        this.startAnimation();
        // Restart the onFrame loop
        this.lastFrame = +new Date() / 1000;
        window.requestAnimationFrame(this.onFrame);
        this.isPlaying = true;
    };

    /**
    * Resets the state of the game so a new game can be started.
    */
    Game.prototype.reset = function() {
        this.score.score = 0;
        this.counter = 0;
        this.genPipes = false;
        this.cleanUpPipes();
        $('#score').html(this.score.score);
        this.player.reset();
    };

    /**
    * Signals that the game is over.
    */
    Game.prototype.gameover = function() {
        this.isPlaying = false;
        this.audioController.dead();
        this.stopAnimation();

        // Should be refactored into a Scoreboard class.
        this.score.showScoreBoard();
    };


    Game.prototype.stopAnimation = function() {
        this.el.find('*').addClass('stopAnimation');
    };

    Game.prototype.startAnimation = function() {
        this.el.find('*').removeClass('stopAnimation');
    };

    Game.prototype.cleanUpPipes = function() {
        for(var i = 0; i < this.pipesOnScreen.length; i++){
            $(this.pipesOnScreen[i].pTop).remove();
            $(this.pipesOnScreen[i].pBot).remove();
        }

        this.pipesOnScreen = [];
    };

    Game.prototype.removePipeIfOutOfScreen = function() {
        var gameOffset = $(this.el).offset().left - 68;
        for(var i = 0; i < this.pipesOnScreen.length; i++){
            if($(this.pipesOnScreen[i].pTop).offset().left - gameOffset <= 0){
                $(this.pipesOnScreen[i].pTop).remove();
                $(this.pipesOnScreen[i].pBot).remove();
                this.pipesOnScreen.splice(i,1);
            }
        }
    };

    /**
    * Some shared constants.
    */
    Game.prototype.WORLD_WIDTH = 102.4;
    Game.prototype.WORLD_HEIGHT = 57.6;

    return Game;
})();
