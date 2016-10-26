/**
 * Created by quget on 26-10-16.
 */
class Death extends Pet
{
    constructor(map,width,height,name)
    {
        super(map,width,height,name);
        this.isDead = true;
        this.petId = -1;//dead
    }
    Update(camera)
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