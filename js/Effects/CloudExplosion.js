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
        this.clouds = new Array();
        var map = this.loader.load("assets/textures/skull.png");
        for(var i = 0; i < cloudCount; i++)
        {

            var cloud = new Cloud(map,2,2);
            //var randx = qUtils.GetRandomBetweenInt(-diffrence * 1000 ,diffrence * 1000);
            //var randy = qUtils.GetRandomBetweenInt(-diffrence * 1000 ,diffrence * 1000);
           // cloud.position.set(position.x + (randx / 1000),position.y + (randy / 1000),0);
            cloud.position.set(position.x,position.y,0);
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