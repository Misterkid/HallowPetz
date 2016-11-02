/**
 * Created by quget on 26-10-16.
 */
class BGMMixer
{
    constructor()
    {

        this.bgmList = new Array();
        for (var i = 0; i < 2; i++)
        {
            this.AddToBgm("assets/sounds/bgm0" + (i + 1) + ".wav");
        }
        this.bgm = document.createElement('audio');
        this.bgm.volume = 0.2;
        this.muted = false;
    }
    AddToBgm(path)
    {
        var bgm = document.createElement('source');
        bgm.src = path;
        this.bgmList.push(bgm);
    }

    OnBGMEnded(e)
    {
        this.Shuffle();
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }
    Stop()
    {
        if(this.bgm.childElementCount > 0)
        {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.bgm.removeChild(this.bgm.firstElementChild);
        }
    }
    Shuffle()
    {
        if(this.bgm.childElementCount == 0 && this.muted == false)
        {
            var bgmSound = this.bgmList[qUtils.GetRandomBetweenInt(0, this.bgmList.length - 1)];
            this.bgm.appendChild(bgmSound);
            this.bgm.addEventListener("onended", (e)=> {this.OnBGMEnded(e);});
            this.bgm.load();
            this.bgm.play();
        }
    }
}