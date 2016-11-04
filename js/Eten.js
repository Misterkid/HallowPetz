class Eten extends THREE.Mesh//Is eigenlijk een mesh met meer opties!
{
    constructor (map,width,height)
    {
        var geometry = new THREE.PlaneGeometry(width,height);
        var material = new THREE.MeshBasicMaterial ();
        material.map = map; //this.loader.load("assets/textures/eten1.png");
        material.transparent = true;
        material.depthWrite = false;
        material.depthTest = false;
        super(geometry,material);
        this.renderOrder =5;
        this.position.set(0,3,0);
        this.scaling = 1;
        this.scaleSteps = 0.05;
        this.steps =5;
        this.stepsOptel =0;

        this.timer = setInterval((e)=>{this.OnTimerEnd(e);},500);

    }

    OnUpdate(camera)
    {
        this.lookAt(camera.position);
    }

    OnTimerEnd(e)
    {
        if (this.stepsOptel < this.steps)
        {
            this.scaling -= this.scaleSteps;
            var newY = (this.scaling - 1) + (this.height/2)-2;
            this.scale.set(this.scaling,this.scaling,1);
            this.stepsOptel += 1;
        }
        else
        {
            window.clearInterval(this.timer);
            this.OnTimerEnd = new CustomEvent('onetentimerend', { 'detail': this });
            document.dispatchEvent(this.OnTimerEnd)
        }
    }
}