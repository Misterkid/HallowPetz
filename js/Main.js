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
        this.CreateSkydome();
        this.CreateEnvirement();
        //Pet making test
        console.log(  document.cookie);
        this.userPet = null;//Need to load
        this.LoadPet();//Loaded
        this.userPet.SavePet();//saved
        this.userPet.position.set(0,0,0);
        this.sceneRenderer.AddObject(this.userPet);
        document.getElementsByClassName("pet_name")[0].value = this.userPet.name;
        //End Test

        //Listen to events at the end of this constructor.
        document.addEventListener("onrenderupdate",(e)=> {this.OnRenderUpdate(e);});
        document.addEventListener("oncollisionupdate",(e)=> {this.OnCollisionUpdate(e);});
        document.addEventListener("onpumpkinhatch",(e)=> {this.OnPumpkinHatch(e);});
        //Reset button
        document.getElementsByClassName("test_reset")[0].onclick = (e) => {this.OnResetClick(e)};
        //Save before closing,refreshing etc...
        window.onbeforeunload = (e) => {this.OnBeforeUnload(e)};
        this.sceneRenderer.Render();//Start rendering
    }
    //On Every frame do actions here. This is the main loop.
    OnRenderUpdate(e)
    {
        //Pet.Update looks at camera, update it each frame.
        this.userPet.Update(this.sceneRenderer.camera);
        //Our test meter!
        document.getElementsByClassName("test_stats")[0].innerText = "Name:" + this.userPet.name +  " h: " + Math.floor(this.userPet.hunger) + " e: " + Math.floor(this.userPet.energy) + " j: " + Math.floor(this.userPet.joy);

        //Rotate around the pet
        if(keyboard.GetKey('a'))
        {
            this.sceneRenderer.RotateCameraAround(this.userPet,1);
        }
        if(keyboard.GetKey('d'))
        {
            this.sceneRenderer.RotateCameraAround(this.userPet,-1);
        }

    }
    //On Every frame after RenderUpdate do COLLISION detection here.
    OnCollisionUpdate(e)
    {

    }
    OnBeforeUnload()
    {
        this.userPet.name = document.getElementsByClassName("pet_name")[0].value;//SetName
        this.userPet.SavePet();
    }
    CreateEnvirement()
    {
        var geometry = new THREE.PlaneGeometry(100,100);
        var material = new THREE.MeshLambertMaterial();
        material.color.setHex("0x77FF00");
        var mesh = new THREE.Mesh(geometry,material);
        mesh.rotateX(qUtils.DegToRad(-90));
        mesh.position.set(0,-2,0);
        this.sceneRenderer.AddObject(mesh);
    }

    CreateSkydome()
    {
        //SkyDome
        var skyGeo = new THREE.SphereGeometry(1000, 25, 25);
        var material = new THREE.MeshBasicMaterial();
        material.map = this.loader.load("assets/textures/skydome02.jpg");
        var sky = new THREE.Mesh(skyGeo, material);
        sky.position.set(0,0,0);
        sky.material.side = THREE.BackSide;
        this.sceneRenderer.AddObject(sky);
    }
    CreateLights()
    {
        var light = new THREE.AmbientLight( 0xffffff,0.5);
        light.position.set( 0, 1, 1 );
        this.sceneRenderer.AddObject(light);
    }
    OnResetClick(e)
    {
        this.ResetPet();
    }

    ResetPet()
    {
        //NewPet
        var result = confirm("Do you really want to reset?");
        if(result == true)
        {
            this.sceneRenderer.RemoveObject(this.userPet);
            var map = this.loader.load("assets/textures/pumpkin.png");
            this.userPet = new PumpkinEgg(map,1,2);
            this.userPet.SavePet();

            document.getElementsByClassName("pet_name")[0].value = this.userPet.name;
            this.sceneRenderer.AddObject(this.userPet);
        }
    }
    OnPumpkinHatch(e)
    {
        var id = qUtils.GetRandomBetweenInt(1,3);
        var newPet = this.userPet.Hatch(id.toString());
        this.sceneRenderer.RemoveObject(this.userPet);
        this.userPet = newPet;
        this.userPet.SavePet();
        this.sceneRenderer.AddObject(this.userPet);

    }
    LoadPet()
    {
        var petId = qUtils.GetCookie("pet_id");
        var map = this.loader.load("assets/textures/test.png");
        if(petId == null || petId == -1 || petId == "")
        {
            //NewPet
            this.userPet = new PumpkinEgg(map,1,2);
        }
        else
        {
            switch(petId)
            {
                case '0':
                    this.userPet = new PumpkinEgg(map,1,2);
                    break;
                case '1':
                    map = this.loader.load("assets/textures/ghost_test.png");
                    this.userPet = new Ghost(map,1,2);
                    break;
                case '2':
                    map = this.loader.load("assets/textures/zombie.png");
                    this.userPet = new Zombie(map,1,2);
                    break;
                case '3':
                    map = this.loader.load("assets/textures/skalet.png");
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
}
new Main();