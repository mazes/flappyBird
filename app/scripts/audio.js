window.AudioController = (function() {
    'use strict';

    var AudioController = function(){
        this.playSounds = true;
        this.deathSound = new Audio('/sound/BossDeath.ogg');
        this.coinSound = new Audio('/sound/coin.wav');
        this.bgmusic = new Audio('/sound/background.mp3');
        this.bgmusic.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        this.bgmusic.play();
        this.mute = this.mute.bind(this);
        this.dead = this.dead.bind(this);
        this.coin = this.coin.bind(this);
    };

    AudioController.prototype.dead = function() {
        if(this.playSounds){
            this.deathSound.play();
        }
    };

    AudioController.prototype.coin = function() {
        if(this.playSounds){
            this.coinSound.play();
        }
    };

    AudioController.prototype.mute = function(){
        if(this.playSounds){
            this.playSounds = false;
            this.bgmusic.pause();
        }
        else{
            this.playSounds = true;
            this.bgmusic.play();
        }
    };

    return AudioController;
})();
