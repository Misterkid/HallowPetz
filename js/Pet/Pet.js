/**
 * Created by quget on 11-10-16.
 */
class Pet extends THREE.Mesh//Is eigenlijk een mesh met meer opties!
{
    constructor(map,width,height,name = "no_name")
    {
        var geometry = new THREE.PlaneGeometry(width,height);
        var material = new THREE.MeshLambertMaterial();
        material.map = map;//this.loader.load("assets/textures/ghost_test.png");
        material.transparent = true;
        super(geometry,material);
        //Standard pet stuff here
        this.petId = -1;
        this.name = name;
        this.height = height;
        this.width = width;
        this.maxMeter = 100;//Max for all.
        //meters
        this.hunger = 100;
        this.hungerSteps = 0.5;
        this.joy = 100;
        this.joySteps = 0.3;
        this.energy = 100;
        this.energySteps = 0.7;
        this.timesClicked = 0;
        this.foodCount = 1;
        this.position.set(0,(height/2)-2,0);
        var date = new Date();
        this.creationDate = date.getTime();
        this.startTime = date.getTime();
        this.asleep = false;
        this.isDead = false;
        this.OnPetDead = new Event('onpetdead');
    }
    AddFood(add = 0)
    {

        this.foodCount =  this.foodCount + add;
        if(this.foodCount < 0)
            this.foodCount = 0;
    }
    AddToJoy(add)
    {
        this.joy += add;
        if(this.joy > this.maxMeter)
            this.joy = this.maxMeter;
    }
    AddToHunger(add)
    {
        this.hunger += add;
        if(this.hunger > this.maxMeter)
            this.hunger = this.maxMeter;
    }
    AddToEnergy(add)
    {
        this.energy += add;
        if(this.energy > this.maxMeter)
            this.energy = this.maxMeter;
    }
    OnClick()
    {
        this.timesClicked ++;
    }
    OnUpdate(camera)
    {
        this.lookAt(camera.position);
        this.DoSteps();
        this.sleepCheck();
    }
    sleepCheck()
    {
        if (this.asleep == true)
        {
            this.AddToEnergy(0.1 * DeltaTime);
        }
    }
    //Gebruikt de tijd om de meters per frame te updaten.
    //De stappen zijn per minuut
    DoSteps()
    {
        var date = new Date();
        var diffrence = date.getTime() - this.startTime;
        diffrence = (diffrence/1000)/60;//minutes

        if(this.hunger > 0)
            this.hunger -= (this.hungerSteps * diffrence);
        if(this.joy > 0)
            this.joy -= (this.joySteps * diffrence);
        if(this.energy > 0)
            this.energy -= (this.energySteps * diffrence);

        this.startTime = date.getTime();
        this.DeathCheck();
    }
    DeathCheck()
    {
        var count = 0;
        if(this.hunger <= 0)
        {
            count++;
            this.hunger = 0;
        }
        if(this.joy <= 0)
        {
            count++;
            this.joy = 0;
        }
        if(this.energy <= 0)
        {
            count++;
            this.energy = 0;

        }
        if(count >= 2 && this.isDead == false)
        {
            //Dead
            this.isDead = true;
            document.dispatchEvent(this.OnPetDead);
        }
    }
    SavePet()
    {
        qUtils.SetCookie("pet_id",this.petId);
        qUtils.SetCookie("pet_name",this.name);
        qUtils.SetCookie("pet_hunger",this.hunger);
        qUtils.SetCookie("pet_joy",this.joy);
        qUtils.SetCookie("pet_energy",this.energy);
        qUtils.SetCookie("pet_times_clicked",this.timesClicked );
        qUtils.SetCookie("pet_food_count",this.foodCount);
        var date = new Date();
        qUtils.SetCookie("pet_last_save",date.getTime());
        qUtils.SetCookie("pet_creation_date",this.creationDate);
    }
    //Laad onze pet in die gesaved is!
    LoadPet()
    {
        //qUtils.GetCookie("pet_id");
        var date = new Date();
        var diffrence = date.getTime() - qUtils.GetCookie("pet_last_save");
        diffrence = (diffrence/1000)/60;//minutes
        this.name = qUtils.GetCookie("pet_name");
        //Moeten natuurlijk ook de offline tijd berekenen.

        this.hunger =  parseFloat(qUtils.GetCookie("pet_hunger") - (this.hungerSteps * diffrence));
        this.joy =  parseFloat(qUtils.GetCookie("pet_joy")- (this.joySteps * diffrence));
        this.energy =  parseFloat(qUtils.GetCookie("pet_energy")- (this.energySteps * diffrence));
        //this.DeathCheck();
        this.timesClicked = qUtils.GetCookie("pet_times_clicked" );
        this.creationDate = qUtils.GetCookie("pet_creation_date");
        this.foodCount = parseInt(qUtils.GetCookie("pet_food_count"));
    }
}