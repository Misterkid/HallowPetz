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
        super(geometry,material);
        //Standard pet stuff here
        this.petId = -1;
        this.name = name;
        this.maxMeter = 100;//Max for all.
        //meters
        this.hunger = 100;
        this.hungerSteps = 0.5;
        this.joy = 100;
        this.joySteps = 0.3;
        this.energy = 100;
        this.energySteps = 0.7;

        var date = new Date();
        this.creationDate = date.getTime();
        this.startTime = date.getTime();
    }
    Update(camera)
    {
        this.lookAt(camera.position);
        this.DoSteps();
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
    }

    SavePet()
    {
        qUtils.SetCookie("pet_id",this.petId);
        qUtils.SetCookie("pet_name",this.name);
        qUtils.SetCookie("pet_hunger",this.hunger);
        qUtils.SetCookie("pet_joy",this.joy);
        qUtils.SetCookie("pet_energy",this.energy);
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
        this.hunger = qUtils.GetCookie("pet_hunger") - (this.hungerSteps * diffrence);
        this.joy = qUtils.GetCookie("pet_joy")- (this.joySteps * diffrence);
        this.energy = qUtils.GetCookie("pet_energy")- (this.energySteps * diffrence);
        this.creationDate = qUtils.GetCookie("pet_creation_date");
    }
}