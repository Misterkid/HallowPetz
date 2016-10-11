/**
 * Created by quget on 11-10-16.
 */
class Pet extends THREE.Mesh
{
    constructor(geometry,material)
    {
        super(geometry,material);
        //Standard pet stuff here
    }
    Update(camera)
    {
        this.lookAt(camera.position);
    }
}