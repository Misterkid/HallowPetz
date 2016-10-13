/**
 * Created by quget on 11-10-16.
 */
class Zombie extends Pet
{
    constructor(map,width,height,name)
    {
        super(map,width,height,name);
        this.petId = 2;
        //Standard Zombie stuff here
    }
    Update(camera)
    {
        super.Update(camera);
    }
}