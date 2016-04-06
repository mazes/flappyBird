window.Pipe = (function() {
    'use strict';
    var Pipe = function(game) {
        this.game = game;
        this.el = $('#pipe');
        this.currentPipes = [];
        this.index = 0;
    };

    Pipe.prototype.spawnPipe = function(){
        var pipe = this.currentPipes[this.index];
        this.el.append(pipe.pTop);
        this.el.append(pipe.pBot);
        this.index++;
    };

    Pipe.prototype.createPipe = function() {
        var pTop = document.createElement('div');
        var pBot = document.createElement('div');
        pTop.className = 'pTop';
        pBot.className = 'pBot';

        var max = 35.2; // The maximum height of the bottom pipe
        var min = 14.0; // The minimum height of the bottom pipe

        var height = Math.floor(Math.random() * (max - min) + min);
        pBot.style.height = height + 'em';
        pTop.style.height = (this.game.WORLD_HEIGHT - (height + 14.4)) + 'em';

        var pipe = {
            pBot: pBot,
            pTop: pTop
        };

        this.currentPipes.push(pipe);
    };

    Pipe.prototype.generatePipes = function(){
        for(var i = 0; i < 50; i++){
            this.createPipe();
        }
    };


    return Pipe;
})();
