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
        /*
        var randomTime = qUtils.GetRandomBetweenInt(4000,4000);
        this.timer = setInterval((e)=>{this.OnTimerEnd(e);},randomTime);
        */
        var randDirX =  qUtils.GetRandomBetweenInt(-10,10);
        var randDirY = qUtils.GetRandomBetweenInt(-10,10);
        var randDirZ = qUtils.GetRandomBetweenInt(-10,10);
        this.dir = new THREE.Vector3(randDirX,randDirY,randDirZ);

        this.timeCount = 0;
        this.maxTimeCount = 2;

        this.isDead = false;
    }
    OnUpdate(camera)
    {

        if(this.isDead)
            return;
        this.position.set(this.position.x + (this.dir.x * DeltaTime),this.position.y + (this.dir.y * DeltaTime),this.position.z + (this.dir.z * DeltaTime));
        this.lookAt(camera.position);

        if(this.timeCount >= this.maxTimeCount)
        {
            this.OnTimerEnd = new CustomEvent('oncloudtimerend', { 'detail': this });
            document.dispatchEvent(this.OnTimerEnd);
            this.isDead = true;
            return;
        }
        else
        {
            this.timeCount += (1 * DeltaTime);
        }
        //this.position.translateX(this.dir.x * DeltaTime);
        //this.position.translateX(this.dir.y * DeltaTime);
    }
    /*
    OnTimerEnd()
    {
        this.OnTimerEnd = new CustomEvent('oncloudtimerend', { 'detail': this });
        document.dispatchEvent(this.OnTimerEnd);
    }*/
    /*
    OnTimerEnd(e)
    {
        this.OnTimerEnd = new CustomEvent('oncloudtimerend', { 'detail': this });
        document.dispatchEvent(this.OnTimerEnd);
        window.clearInterval(this.timer);
    }*/

}