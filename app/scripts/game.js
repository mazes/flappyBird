
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
        this.audioController = new window.AudioController();
        this.isPlaying = false;
        this.genPipes = false;
        this.pipesOnScreen = [];
        this.Pipe = new window.Pipe(this);
        this.Pipe.generatePipes();
        this.score = 0;
        this.highScore = 0;

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
		if (!this.isPlaying) {
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
            if(this.counter === 120){
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
        this.score = 0;
        this.counter = 0;
        this.genPipes = false;
        $('#score').html(this.score);
		this.player.reset();
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;

        // TODO MAKE AUDIO CONTROLLER?
        /*var audio = new Audio('/sound/BossDeath.ogg');
        audio.play();*/
        this.audioController.dead();

				this.stopAnimation();

        // Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
        this.setScores();
        console.log(this.highScore, this.score);
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
                    that.cleanUpPipes();
					that.start();
				});
	};


	Game.prototype.stopAnimation = function() {
		this.el.find('*').addClass('stopAnimation');
		console.log('animation stopeed!');
	};

	Game.prototype.startAnimation = function() {
		this.el.find('*').removeClass('stopAnimation');
		console.log('animation started');
	};

    Game.prototype.setScores = function() {
        $('#currentScore').html(this.score);
        if( this.score > this.highScore){
            this.highScore = this.score;
        }
        $('#highScore').html(this.highScore);
    };

    Game.prototype.cleanUpPipes = function() {
        for(var i = 0; i < this.pipesOnScreen.length; i++){
            $(this.pipesOnScreen[i].pTop).remove();
            $(this.pipesOnScreen[i].pBot).remove();
        }
    };
	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();
