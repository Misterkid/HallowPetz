/**
 * Created by quget on 2-10-16.
 */
class AudioSources
{
    constructor()
    {
        this.eggHatch = document.createElement('source');
        this.eggHatch.src = 'assets/sounds/explosion.wav';
    }
}
let audioSources = new AudioSources();