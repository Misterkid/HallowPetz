class Ghost extends Pet
{
    constructor(name)
    {
        var loader = new THREE.TextureLoader();
        var map = loader.load("assets/textures/ghost_test.png");
        super(map,4,8,name);
        this.petId = 1;
        //Standard ghost stuff here
    }
    OnUpdate(camera)
    {
        super.OnUpdate(camera);
    }
}