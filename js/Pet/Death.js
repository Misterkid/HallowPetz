class Death extends Pet
{
    constructor(name)
    {
        var loader = new THREE.TextureLoader();
        var map = loader.load("assets/textures/grave.png");
        super(map,4,4,name);
        this.isDead = true;
        this.petId = -1;//dead
    }
    OnUpdate(camera)
    {
        this.lookAt(camera.position);
        //this.DoSteps();
    }
    DeathCheck()
    {
        if(this.hunger <= 0)
        {
            this.hunger = 0;
        }
        if(this.joy <= 0)
        {
            this.joy = 0;
        }
        if(this.energy <= 0)
        {
            this.energy = 0;
        }
    }
}