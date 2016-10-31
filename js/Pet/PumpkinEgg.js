class PumpkinEgg extends Pet
{
    constructor(name)
    {
        var loader = new THREE.TextureLoader();
        var map = loader.load("assets/textures/pumpkin.png");
        super(map,2,2,name);
        this.petId = 0;
        //Standard Egg stuff here
        this.hatchTimeMinutes = 0.5;
        this.OnPumpkinHatch = new Event('onpumpkinhatch');
        this.loader = new THREE.TextureLoader();
        this.isHatching = false;
        this.clicksToHatch = 25;
        this.scaling = 1;
        this.scaleSteps = 0.05;
        this.headPoint = new THREE.Vector3(this.position.x,0,0);
        this.headPoint2d = new THREE.Vector3(1280 * 0.5,720 * 0.5,0);
        //
    }
    OnUpdate(camera)
    {
        super.OnUpdate(camera);
        //this.TimedHatching();
        this.ClickHatching();
    }
    ClickHatching()
    {
        if(this.isHatching == false)
        {
            if(this.timesClicked == this.clicksToHatch)
            {
                document.dispatchEvent(this.OnPumpkinHatch);
                this.isHatching = true;
            }
        }
    }
    OnClick()
    {
        super.OnClick();
        this.scaling += this.scaleSteps;
        var newY = (this.scaling - 1) + (this.height/2)-2;
        this.position.set(0,newY,0);
        this.scale.set(this.scaling,this.scaling,1);

        this.headPoint.set(0,this.headPoint.y + this.scaleSteps,0);
    }
}