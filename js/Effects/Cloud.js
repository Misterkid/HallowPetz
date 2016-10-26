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
        material.depthWrite = false;
        material.depthTest = false;
        material.transparent = true;
        super(geometry,material);
        this.renderOrder = 4;
        var randomTime = qUtils.GetRandomBetweenInt(4000,4000);
        this.timer = setInterval((e)=>{this.OnTimerEnd(e);},randomTime);

        var randDirX =  qUtils.GetRandomBetweenInt(-10,10);
        var randDirY = qUtils.GetRandomBetweenInt(-10,10);
        var randDirZ = qUtils.GetRandomBetweenInt(-10,10);
        this.dir = new THREE.Vector3(randDirX,randDirY,randDirZ);
    }
    OnUpdate(camera)
    {
        this.position.set(this.position.x + (this.dir.x * DeltaTime),this.position.y + (this.dir.y * DeltaTime),this.position.z + (this.dir.z * DeltaTime));
        this.lookAt(camera.position);
        //this.position.translateX(this.dir.x * DeltaTime);
        //this.position.translateX(this.dir.y * DeltaTime);
    }
    OnTimerEnd(e)
    {
        this.OnTimerEnd = new CustomEvent('oncloudtimerend', { 'detail': this });
        document.dispatchEvent(this.OnTimerEnd);
        window.clearInterval(this.timer);
    }

}