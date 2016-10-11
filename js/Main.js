/**
 * Created by quget on 10-10-16.
 */
class Main
{
    constructor()
    {
        this.sceneRenderer = new SceneRenderer();
        this.sceneRenderer.CreateScene();
        //Texture loader, Keep using this.loader to avoid making more loaders!
        this.loader = new THREE.TextureLoader();
        this.CreateLights();// You will see the light!
        //Ghost making test
        var geomatry = new THREE.PlaneGeometry(1,2);
        var material = new THREE.MeshLambertMaterial();
        material.map = this.loader.load("assets/textures/test.png");
        this.ghost = new Ghost(geomatry,material);
        this.ghost.position.set(0,0,-5);
        this.sceneRenderer.AddObject(this.ghost);
        //End Test
        //Listen to events at the end of this constructor.
        document.addEventListener("onrenderupdate",(e)=> {this.OnRenderUpdate(e);});
        document.addEventListener("oncollisionupdate",(e)=> {this.OnCollisionUpdate(e);});
        this.sceneRenderer.Render();
    }
    CreateLights()
    {
        var light = new THREE.AmbientLight( 0xffffff,0.5);
        light.position.set( 0, 1, 1 );
        this.sceneRenderer.AddObject(light);
    }
    //On Every frame do actions here. This is the main loop.
    OnRenderUpdate(e)
    {
        this.ghost.Update(this.sceneRenderer.camera);
    }
    //On Every frame after RenderUpdate do COLLISION detection here.
    OnCollisionUpdate(e)
    {

    }
}
new Main();