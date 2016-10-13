/**
 * Created by quget on 11-10-16.
 */
class Skeleton extends Pet
{
    constructor(map,width,height,name)
    {
        super(map,width,height,name);
        this.petId = 3;
        //Standard skeleton stuff here
    }
    Update(camera)
    {
        super.Update(camera);
    }
}