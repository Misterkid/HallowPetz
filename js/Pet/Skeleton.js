/**
 * Created by quget on 11-10-16.
 */
class Skeleton extends Pet
{
    constructor(name)
    {
        var loader = new THREE.TextureLoader();
        var map = loader.load("assets/textures/skalet.png");
        super(map,4,8,name);
        this.petId = 3;
        //Standard skeleton stuff here
    }
    OnUpdate(camera)
    {
        super.OnUpdate(camera);
    }
}