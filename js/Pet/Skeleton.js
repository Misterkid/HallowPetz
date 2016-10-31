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
        this.headPoint = new THREE.Vector3(0,5,0);
        this.headPoint2d = new THREE.Vector3(1280 * 0.5,720 * 0.5,0);
        //Standard skeleton stuff here
    }
    OnUpdate(camera)
    {
        super.OnUpdate(camera);
    }
}