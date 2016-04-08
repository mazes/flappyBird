window.Score = (function() {
    'use strict';

    var Score = function(el, game) {
        this.el = el;
        this.game = game;
        this.score = 0;
        this.highScore = 0;
    };

    Score.prototype.showScoreBoard = function() {
        this.game.isPlaying = false;
        var that = this;
        this.setScores();
        this.el.addClass('is-visible');
        var reset = $('.Scoreboard-restart');
        reset.one('click', function() {
            that.resetGame();
        });
    };

    Score.prototype.setScores = function() {
        $('#currentScore').html(this.score);
        if( this.score > this.highScore){
            this.highScore = this.score;
        }
        $('#highScore').html(this.highScore);
    };

    Score.prototype.checkForScore = function(pipe, playerEl) {
        var pipeOffset = $(pipe.pTop).offset().left + 68 - $(playerEl).offset().left; //68 width of the pipe
        if(pipeOffset <= 0 && pipeOffset > -10){ // 10px range for laggy games still giving score
            if(!pipe.score){
                this.score++;
                this.game.audioController.coin();
                $('#score').html(this.score);
                pipe.score = 1;
            }
        }
    };

    Score.prototype.resetGame = function() {
        this.el.removeClass('is-visible');
        this.game.start();
    };

    return Score;

})();
