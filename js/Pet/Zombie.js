class Zombie extends Pet
{
    constructor(name)
    {
        var loader = new THREE.TextureLoader();
        var  map = loader.load("assets/textures/zombie.png");
        super(map,4,8,name);
        this.petId = 2;
        //Standard Zombie stuff here
    }
    OnUpdate(camera)
    {
        super.OnUpdate(camera);
    }
}