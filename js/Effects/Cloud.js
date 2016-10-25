/**
 * Created by quget on 25-10-16.
 */
class Cloud extends THREE.Mesh
{
    constructor(map,width,height)
    {
        var geometry = new THREE.PlaneGeometry(width,height);
        var material = new THREE.MeshLambertMaterial();
        material.map = map;
        var randomTime = qUtils.GetRandomBetweenInt(1000,4000);
        this.timer = setInterval((e)=>{this.OnTimerEnd(e);},randomTime);
        super(geometry,material);
    }
    OnTimerEnd(e)
    {
        this.OnTimerEnd = new CustomEvent('oncloudtimerend', { 'detail': this });
        document.dispatchEvent(this.OnTimerEnd);
        window.clearInterval(this.timer);
    }

}