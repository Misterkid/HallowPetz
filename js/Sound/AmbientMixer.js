/**
 * Created by quget on 2-11-16.
 */
class AmbientMixer
{
    constructor()
    {
        this.ambient = document.createElement('audio');
        this.ambient.loop = true;
        this.ambient.volume = 0.3;
    }
    Switch(night)
    {
        this.Stop();
        this.Play(night);
    }
    Stop()
    {
        if(this.ambient.childElementCount > 0)
        {
            this.ambient.pause();
            this.ambient.currentTime = 0;
            this.ambient.removeChild(this.ambient.firstElementChild);
        }
    }
    Play(night)
    {
        if(night)
        {
            this.ambient.appendChild(audioSources.nightAmbient);
            this.ambient.load();
            this.ambient.volume = 0.3;
            this.ambient.play();
        }
        else
        {
            this.ambient.appendChild(audioSources.dayAmbient);
            this.ambient.load();
            this.ambient.volume = 1;
            this.ambient.play();
        }
    }
}