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

        //Pet making test
        var map =  this.loader.load("assets/textures/ghost_test.png");
        this.ghost = new Ghost(map,1,2);

        this.ghost.position.set(0,0,-5);
        this.sceneRenderer.AddObject(this.ghost);
        //End Test

        //Listen to events at the end of this constructor.
        document.addEventListener("onrenderupdate",(e)=> {this.OnRenderUpdate(e);});
        document.addEventListener("oncollisionupdate",(e)=> {this.OnCollisionUpdate(e);});
        this.sceneRenderer.Render();//Start rendering
    }
    //On Every frame do actions here. This is the main loop.
    OnRenderUpdate(e)
    {
        this.ghost.Update(this.sceneRenderer.camera);//Pet.Update looks at camera, update it each frame.
    }
    //On Every frame after RenderUpdate do COLLISION detection here.
    OnCollisionUpdate(e)
    {

    }

    CreateLights()
    {
        var light = new THREE.AmbientLight( 0xffffff,0.5);
        light.position.set( 0, 1, 1 );
        this.sceneRenderer.AddObject(light);
    }
}
new Main();