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
        console.log(  document.cookie);
        this.userPet = null;//Need to load
        this.LoadPet();//Loaded
        this.userPet.SavePet();//saved
        this.userPet.position.set(0,0,-5);
        this.sceneRenderer.AddObject(this.userPet);
        document.getElementsByClassName("pet_name")[0].value = this.userPet.name;
        //End Test
        //Listen to events at the end of this constructor.
        document.addEventListener("onrenderupdate",(e)=> {this.OnRenderUpdate(e);});
        document.addEventListener("oncollisionupdate",(e)=> {this.OnCollisionUpdate(e);});
        this.sceneRenderer.Render();//Start rendering
    }
    //On Every frame do actions here. This is the main loop.
    OnRenderUpdate(e)
    {

        this.userPet.Update(this.sceneRenderer.camera);//Pet.Update looks at camera, update it each frame.

        if(keyboard.GetKey('s'))
        {
            this.userPet.name = document.getElementsByClassName("pet_name")[0].value;
            this.userPet.SavePet();
        }
    }
    //On Every frame after RenderUpdate do COLLISION detection here.
    OnCollisionUpdate(e)
    {

    }
    LoadPet()
    {
        var petId = qUtils.GetCookie("pet_id");
        var map = this.loader.load("assets/textures/test.png");
        if(petId == null || petId == -1 || petId == "")
        {
            //NewPet
            this.userPet = new PumpkinEgg(map,1,2);
            console.log("new pet");
        }
        else
        {
            switch(petId)
            {
                case '0':
                    this.userPet = new PumpkinEgg(map,1,2);
                    break;
                case '1':
                    map = this.loader.load("assets/textures/ghost_test.png")
                    this.userPet = new Ghost(map,1,2);
                    break;
                case '2':
                    this.userPet = new Zombie(map,1,2);
                    break;
                case '3':
                    this.userPet = new Skeleton(map,1,2);
                    break;
                default:
                    //Someone cheating most likely xD
                    console.log("cheater");
                    qUtils.DeleteAllCookies();
                    this.userPet = new PumpkinEgg(map,1,2);
                    return;
                    break;
            }
            this.userPet.LoadPet();
        }
    }
    CreateLights()
    {
        var light = new THREE.AmbientLight( 0xffffff,0.5);
        light.position.set( 0, 1, 1 );
        this.sceneRenderer.AddObject(light);
    }
}
new Main();