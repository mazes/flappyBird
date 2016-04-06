
/**
 * Bootstrap and start the game.
 */
$(function() {
    'use strict';

    var game = new window.Game($('.GameCanvas'));
    game.start();

    var audio = document.getElementById('background_audio');
    document.getElementById('mute').addEventListener('click', function (e){
        e = e || window.event;
        audio.muted = !audio.muted;
        e.preventDefault();
    }, false);
});
