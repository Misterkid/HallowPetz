class CloudExplosion
{
    constructor(sceneRenderer)
    {
        this.clouds = new Array();
        this.loader = new THREE.TextureLoader();
        this.sceneRenderer = sceneRenderer;

    }
    CreateExplosion(cloudCount,position,diffrence)
    {
        //this.clouds = new Array();
        var map = this.loader.load("assets/textures/skull.png");
        for(var i = 0; i < cloudCount; i++)
        {

            var cloud = new Cloud(map,2,2);
            cloud.position.set(position.x,position.y,position.z);
            this.clouds.push(cloud);
            this.sceneRenderer.AddObject(cloud);
        }
    }
    OnUpdate(camera)
    {
        for(var i = 0; i < this.clouds.length; i++)
        {
            this.clouds[i].OnUpdate(camera);
        }
    }
}