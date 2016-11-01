/**
 * Created by quget on 2-10-16.
 */
class AudioSources
{
    constructor()
    {
        this.eggHatch = document.createElement('source');
        this.eggHatch.src = 'assets/sounds/explosion.wav';

        this.ballHit = document.createElement('source');
        this.ballHit.src = 'assets/sounds/ballHit.wav';

        this.eating = document.createElement('source');
        this.eating.src = 'assets/sounds/eating.wav';

        this.lightSwitch = document.createElement('source');
        this.lightSwitch.src = 'assets/sounds/lightSwitch.wav';

        this.petClick = document.createElement('source');
        this.petClick.src = 'assets/sounds/woo.wav';
    }
}
let audioSources = new AudioSources();