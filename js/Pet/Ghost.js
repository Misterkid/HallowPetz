/**
 * Created by quget on 11-10-16.
 */
class Ghost extends Pet
{
    constructor(map,width,height,name)
    {
        super(map,width,height,name);
        this.petId = 1;
        //Standard ghost stuff here
    }
    Update(camera)
    {
        super.Update(camera);
    }
}