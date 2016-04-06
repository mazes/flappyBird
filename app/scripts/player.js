window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 35; // * 10 pixels per second
    var DROPSPEED = 25;
	var WIDTH = 5;
	var HEIGHT = 5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
	};

	Player.prototype.onFrame = function(delta) {
		/*if (Controls.keys.right) {
			this.pos.x += delta * SPEED;
		}
		if (Controls.keys.left) {
			this.pos.x -= delta * SPEED;
		}*/
        if(this.game.genPipes){
            this.checkCollisionWithPipes(this.game.pipesOnScreen[0].pTop);
        }
		if (Controls.keys.down) {
			this.pos.y += delta * SPEED;
		}
		if (Controls.keys.up){
			this.pos.y -= delta * SPEED;
            this.game.genPipes = true;
		}
        else if (Controls.keys.space){
            this.pos.y -= delta * SPEED;
            this.game.genPipes = true;
        }
        else{
            if(this.game.genPipes){
                this.pos.y += delta * DROPSPEED;
            }
        }

		this.checkCollisionWithBounds();


		// Update UI
		this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT-6) {
			return this.game.gameover();
		}
	};

    Player.prototype.checkCollisionWithPipes = function ($div2) {
        var x1 = $(this.el).offset().left;
        var y1 = $(this.el).offset().top;
        var h1 = $(this.el).outerHeight(true);
        var w1 = $(this.el).outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;
        console.log('X1: ' + x1 + 'y1:' + y1 + 'x2:' + x2 + 'y2:' + y2);
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        }
        return this.game.gameover();
    };

    Player.prototype.removeOldPipes = function () {

    };

	return Player;

})();
