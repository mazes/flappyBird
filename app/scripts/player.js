window.Player = (function() {
    'use strict';

    var Controls = window.Controls;

    // All these constants are in em's, multiply by 10 pixels
    // for 1024x576px canvas.
    var SPEED = 40; // * 10 pixels per second
    var DROPSPEED = 25;
    var WIDTH = 5;
    var HEIGHT = 5;
    var INITIAL_POSITION_X = 30;
    var INITIAL_POSITION_Y = 25;

    var Player = function(el, game) {
        this.el = el;
        this.game = game;
        this.pos = { x: 0, y: 0 };
        this.lastFrameScore = false;
    };

    /**
    * Resets the state of the player for a new game.
    */
    Player.prototype.reset = function() {
        this.pos.x = INITIAL_POSITION_X;
        this.pos.y = INITIAL_POSITION_Y;
    };

    Player.prototype.onFrame = function(delta) {
        if (Controls.keys.down) {
            this.pos.y += delta * SPEED;
        }
        if (Controls.keys.up){
            this.pos.y -= delta * SPEED;
            this.isPlaying = true;
            this.game.genPipes = true;
        }
        else if (Controls.keys.space){
            this.pos.y -= delta * SPEED;
            this.isPlaying = true;
            this.game.genPipes = true;
        }
        else{
            if(this.game.genPipes){
                this.pos.y += delta * DROPSPEED;
            }
        }

        this.checkCollisionWithBounds();
        for(var i = 0; i < this.game.pipesOnScreen.length; i++){
            this.checkCollisionWithPipes(this.game.pipesOnScreen[i]);
            this.game.score.checkForScore(this.game.pipesOnScreen[i], this.el);
        }
        this.game.removePipeIfOutOfScreen();
        // Update UI
        this.el.css('transform', 'translate3d(' + this.pos.x + 'em, ' + this.pos.y + 'em, 0)');
    };

    Player.prototype.checkCollisionWithBounds = function() {
        if (this.pos.x < 0 ||
            this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
            this.pos.y < 0 ||
            this.pos.y + HEIGHT > this.game.WORLD_HEIGHT-6) {
            return this.game.gameover();
        }
    };

    Player.prototype.checkCollisionWithPipes = function(pipe) {
        var x1 = $(this.el).offset().left;
        var y1 = $(this.el).offset().top;
        var h1 = $(this.el).outerHeight(false);
        var w1 = $(this.el).outerWidth(false);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $(pipe.pTop).offset().left;
        var y2 = $(pipe.pTop).offset().top;
        var h2 = $(pipe.pTop).outerHeight(true);
        var w2 = $(pipe.pTop).outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;
        var x3 = $(pipe.pBot).offset().left;
        var y3 = $(pipe.pBot).offset().top;
        var h3 = $(pipe.pBot).outerHeight(true);
        var w3 = $(pipe.pBot).outerWidth(true);
        var b3 = y3 + h3;
        var r3 = x3 + w3;

        if ((b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) && (b1 < y3 || y3 > b3 || r1 < x3 || x1 > r3)) {
            return false;
        }
        return this.game.gameover();
    };

    return Player;

})();
