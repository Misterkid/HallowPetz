/**
 * Created by quget on 2-10-16.
 */
class AudioSources
{
    constructor()
    {
        this.explosion = document.createElement('source');
        this.explosion.src = 'assets/sounds/explosion.wav';

        this.eggHatch = document.createElement('source');
        this.eggHatch.src = 'assets/sounds/hello.wav';

        this.ballHit = document.createElement('source');
        this.ballHit.src = 'assets/sounds/ballHit.wav';

        this.eating = document.createElement('source');
        this.eating.src = 'assets/sounds/eating.wav';

        this.lightSwitch = document.createElement('source');
        this.lightSwitch.src = 'assets/sounds/lightSwitch.wav';

        this.petClick = document.createElement('source');
        this.petClick.src = 'assets/sounds/woo.wav';

        this.dayAmbient = document.createElement('source');
        this.dayAmbient.src = 'assets/sounds/day.wav';

        this.nightAmbient = document.createElement('source');
        this.nightAmbient.src = 'assets/sounds/night.wav';
    }
}
let audioSources = new AudioSources();