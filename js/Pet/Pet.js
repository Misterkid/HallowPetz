/**
 * Created by quget on 11-10-16.
 */
class Pet extends THREE.Mesh
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
        this.stepPerMinute = 0.5;
        //meters
        this.hunger = 100;
        this.joy = 100;
        this.energy = 100;
    }
    Update(camera)
    {
        this.lookAt(camera.position);
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
    }
    LoadPet()
    {
        //qUtils.GetCookie("pet_id");
        var date = new Date();
        var diffrence = date.getTime() - qUtils.GetCookie("pet_last_save");
        diffrence = diffrence/1000;
        diffrence = diffrence/60;
        this.name = qUtils.GetCookie("pet_name");
        this.hunger = qUtils.GetCookie("pet_hunger") - (this.stepPerMinute * diffrence);
        this.joy = qUtils.GetCookie("pet_joy")- (this.stepPerMinute * diffrence);
        this.energy = qUtils.GetCookie("pet_energy")- (this.stepPerMinute * diffrence);
    }
}