/**
 * Created by quget on 10-10-16.
 */
class Main
{
    constructor()
    {
        this.objectL = new ObjectLoader();
        this.sceneRenderer = new SceneRenderer();
        this.sceneRenderer.CreateScene();
        this.mouse = new Mouse();
        //Texture loader, Keep using this.loader to avoid making more loaders!
        this.loader = new THREE.TextureLoader();
        this.CreateLights();// You will see the light!
        this.CreateSkydome();
        this.CreateEnvirement();
        //Pet making test
        console.log( document.cookie);
        this.userPet = null;//Need to load
        this.LoadPet();//Loaded
        this.userPet.SavePet();//saved
        //this.userPet.position.set(0,-1,0);
        this.sceneRenderer.AddObject(this.userPet);
        this.CeateTeaPot();
        document.getElementsByClassName("pet_name")[0].value = this.userPet.name;
        //End Test
        this.clickableObjects = new Array();
        this.clickableObjects.push(this.userPet);
        this.updateObjects = new Array ();
        //Mini Game
        this.throwBall = new ThrowBall(this.sceneRenderer.gameContainer);
        this.isDag = true;

        //presents (food)
        this.clickablePresent = new Array();
        this.presentSpanPositions = new Array();
        //this.etenObject.position.set(2,1,5);
        //this.clickableObjects.push(this.etenObject);
        //this.clickablePresent.push(this.etenObject);

        this.SetPresentPosition();
        this.SpawnPresent();


        //End
        this.effectsMuted = false;
        //Explosion
        this.cloudExplosion = new CloudExplosion(this.sceneRenderer);
        //
        //Listen to events at the end of this constructor.
        document.addEventListener("onrenderupdate",(e)=> {this.OnRenderUpdate(e);});
        document.addEventListener("oncollisionupdate",(e)=> {this.OnCollisionUpdate(e);});
        document.addEventListener("onpumpkinhatch",(e)=> {this.OnPumpkinHatch(e);});
        document.addEventListener("onobjectloaddone",(e)=> {this.OnObjectLoadDone(e);});
        //Reset button
        document.addEventListener("onmouseobjectclick",(e)=>{this.OnMouseObjectClick(e);});
        document.addEventListener("onballmoving",(e)=>{this.OnBallMove(e);});
        document.addEventListener("onballhitwall",(e)=>{this.OnBallHitWall(e);});
        document.addEventListener("onetentimerend",(e)=>{this.OnEtenTimer(e);});
        document.addEventListener("oncloudtimerend",(e)=>{this.OnCloudTimerEnd(e);});
        document.addEventListener("onpetdead",(e)=>{this.OnPetDead(e);});
        //Menu stuff
        document.getElementsByClassName("save_pet")[0].onclick = (e) => {this.OnSaveClick(e)};
        document.getElementsByClassName("test_reset")[0].onclick = (e) => {this.OnResetClick(e)};
        document.getElementsByClassName("effects_mute")[0].onclick = (e) => {this.OnEffectsMute(e)};
        document.getElementsByClassName("bgm_mute")[0].onclick = (e) => {this.OnBGMMute(e)};
        document.getElementsByClassName("full_screen")[0].onclick = (e) => {this.OnFullScreenClick(e)};

        document.getElementsByClassName("show_hide")[0].onclick = (e) => {this.OnShowMenuClick(e)};
        document.getElementsByClassName("ball_btn")[0].onclick = (e) => {this.OnBallBtnClick(e)};
        document.getElementsByClassName("eten1")[0].onclick = (e) => {this.OnEten1Click(e)};
        document.getElementsByClassName("slapen")[0].onclick = (e) => {this.OnSlapenClick(e)};
        document.addEventListener('webkitfullscreenchange',(e)=> {this.FullScreenChange(e);}, false);
        document.addEventListener('mozfullscreenchange',(e)=> {this.FullScreenChange(e);}, false);
        document.addEventListener('fullscreenchange', (e)=> {this.FullScreenChange(e);}, false);


        //Save before closing,refreshing etc...
        window.onbeforeunload = (e) => {this.OnBeforeUnload(e)};
        this.sceneRenderer.Render();//Start rendering

        this.bgmMixer = new BGMMixer();
        this.bgmMixer.Shuffle();//Start
    }
    //On Every frame do actions here. This is the main loop.
    //Testing adding OBJ 3d object.
    CeateTeaPot() {
        this.boomPos =  new THREE.Vector3(10,10,0);
        this.boomScale = new THREE.Vector3(0.01,0.01,0.01);

        console.log(this.boomPos);
        this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale);


    }
    FullScreenChange(e)
    {
        if(this.sceneRenderer.isFullScreen)
        {
            this.sceneRenderer.isFullScreen = false;
            this.sceneRenderer.BackToNormal();
        }
        else
        {
            this.sceneRenderer.isFullScreen = true;
        }
        this.throwBall.Hide();
        this.ShowHideMenu();
    }

    OnFullScreenClick(e)
    {
        this.sceneRenderer.RequestFullScreen();
    }
    SetPresentPosition()
    {
        this.AddPresentPosition(2, 1, 5);
        this.AddPresentPosition(3, 1, 7);
        this.AddPresentPosition(5, 1, 7);
        this.AddPresentPosition(9, 1, 2);
        this.AddPresentPosition(10,1,9);
    }


    AddPresentPosition(x,y,z)
    {
        var position = new THREE.Vector3(x,y,z);
        this.presentSpanPositions.push(position);
    }
    
    OnObjectLoadDone(e)
    {
        this.sceneRenderer.AddObject(e.detail);
    }

    OnRenderUpdate(e)
    {
        //Pet.OnUpdate looks at camera, update it each frame.
        this.userPet.OnUpdate(this.sceneRenderer.camera);
        //Our test meter!
        document.getElementsByClassName("test_stats")[0].innerText =
            "Name: " + this.userPet.name ;

        this.Createbarmeter();

        //Rotate around the pet
        if(keyboard.GetKey('a'))
        {
            this.sceneRenderer.RotateCameraAround(this.userPet,1);
        }
        if(keyboard.GetKey('d'))
        {
            this.sceneRenderer.RotateCameraAround(this.userPet,-1);
        }
        this.throwBall.OnUpdate(e);
        this.cloudExplosion.OnUpdate(this.sceneRenderer.camera);

        for (var i=0; i<this.updateObjects.length; i++)
        {
            this.updateObjects[i].OnUpdate(this.sceneRenderer.camera);
        }
        this.Cheats();//Remove on release
    }
    //On Every frame after RenderUpdate do COLLISION detection here.
    OnCollisionUpdate(e)
    {
        this.mouse.OnMouseRayUpdate(this.clickableObjects,this.sceneRenderer.camera);
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
    OnShowMenuClick(e)
    {
        this.ShowHideMenu();
    }
    ShowHideMenu()
    {
        var menuItems = document.getElementsByClassName("menu_obj");
        for(var i = 0; i < menuItems.length; i ++)
        {
            if( menuItems[i].style.visibility == "hidden")
            {
                menuItems[i].style.visibility = "visible";
                this.throwBall.Hide();
            }
            else
            {
                menuItems[i].style.visibility = "hidden";
            }
        }
        if(this.userPet.isDead)
        {
            document.getElementsByClassName("pet_name")[0].style.visibility ="hidden";
        }
    }
    OnBallBtnClick(e)
    {
        if(this.throwBall.isHidden == false)
        {
            this.throwBall.Hide();
        }
        else
        {
            this.throwBall.Show();
        }
    }
    OnEten1Click (e)
    {
        var map = this.loader.load("assets/textures/eten1.png");
        var eten1 = new Eten (map,1.5,1);
        this.sceneRenderer.AddObject(eten1);
        this.updateObjects.push(eten1);
        this.PlaySound(audioSources.eating);
    }
    OnEtenTimer(e)
    {
        this.updateObjects.slice(e.detail);
        this.sceneRenderer.RemoveObject(e.detail);
        this.userPet.AddToHunger(3);
    }
    OnSlapenClick(e)
    {
        if(this.isDag == true)
        {
            this.userPet.asleep = true;
            this.isDag = false;
            // moet nog iets toegevoegd worden zodat je kan zien dat hij slaapt
        }
        else
        {
            this.userPet.asleep = false;
            this.isDag = true;
        }
        this.PlaySound(audioSources.lightSwitch);
        console.log(this.isDag);
    }
    OnResetClick(e)
    {
        this.ShowHideMenu();
        this.ResetPet();
    }
    OnSaveClick(e)
    {
        this.ShowHideMenu();
        this.SavePet();
    }
    OnBeforeUnload()
    {
        this.SavePet();
    }
    SavePet()
    {
        this.userPet.name = document.getElementsByClassName("pet_name")[0].value;//SetName
        this.userPet.SavePet();
    }

    SpawnPresent()
    {

        for( var i = 0; i< this.presentSpanPositions.length; i++)
        {
            var gPresent = new THREE.BoxGeometry(1,1,1);
            var mPresent = new THREE.MeshPhongMaterial();
            var etenObject = new EtenVerzamelen(gPresent, mPresent);

            //this.etenObject.position.set(2,0,5);
            etenObject.position.set(this.presentSpanPositions[i].x,this.presentSpanPositions[i].y,this.presentSpanPositions[i].z);
            this.clickableObjects.push(etenObject);
            this.clickablePresent.push(etenObject);
            this.sceneRenderer.AddObject(etenObject);
        }

    }

    OnMouseObjectClick(e)
    {
        //Userpet clicked
        if (e.detail.object.uuid == this.userPet.uuid)
        {
            this.userPet.OnClick();
            console.log("clicked");
        }
        for(var i = 0; i < this.clickablePresent.length; i++)
        {

            if(e.detail.object.uuid == this.clickablePresent[i].uuid)
            {

                this.clickablePresent[i].OnClick();
                this.sceneRenderer.RemoveObject(this.clickablePresent[i]);

                //this.clickableObjects.splice(this.clickablePresent[i]);
                //this.clickablePresent.splice(this.clickablePresent[i]);

                this.userPet.foodCount++;
                console.log(this.userPet.foodCount);
            }

        }
        console.log((e.detail.object.uuid));

    }
    OnBallMove(e)
    {
        //add 0.1 joy per second
        this.userPet.AddToJoy(0.5 * DeltaTime);
    }
    OnBallHitWall(e)
    {
        this.PlaySound(audioSources.ballHit);
    }
    Createbarmeter()
    {
        document.getElementsByClassName("honger1")[0].style.visibility = "hidden";
        document.getElementsByClassName("plezier1")[0].style.visibility = "hidden";
        document.getElementsByClassName("energie1")[0].style.visibility = "hidden";
        // honger
        if (Math.floor(this.userPet.hunger) < 101)
        {
            if (Math.floor(this.userPet.hunger) >= 95)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/100.png"}
            if (Math.floor(this.userPet.hunger) >= 85 && Math.floor(this.userPet.hunger) < 95)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/90.png"}
            if (Math.floor(this.userPet.hunger) >= 75 && Math.floor(this.userPet.hunger) < 85)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/80.png"}
            if (Math.floor(this.userPet.hunger) >= 65 && Math.floor(this.userPet.hunger) < 75)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/70.png"}
            if (Math.floor(this.userPet.hunger) >= 55 && Math.floor(this.userPet.hunger) < 65)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/60.png"}
            if (Math.floor(this.userPet.hunger) >= 45 && Math.floor(this.userPet.hunger) < 55)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/50.png"}
            if (Math.floor(this.userPet.hunger) >= 35 && Math.floor(this.userPet.hunger) < 45)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/40.png"}
            if (Math.floor(this.userPet.hunger) >= 25 && Math.floor(this.userPet.hunger) < 35)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/30.png"}
            if (Math.floor(this.userPet.hunger) >= 15 && Math.floor(this.userPet.hunger) < 25)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/20.png"}
            if (Math.floor(this.userPet.hunger) >= 5 && Math.floor(this.userPet.hunger) < 15)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/10.png"
                document.getElementsByClassName("honger1")[0].style.visibility = "visible";}
            if (Math.floor(this.userPet.hunger) <5)
            {document.getElementsByClassName("honger")[0].src = "assets/textures/0.png"
                document.getElementsByClassName("honger1")[0].style.visibility = "visible";}
        }

        //energie
        if (Math.floor(this.userPet.energy) < 101)
        {
            if (Math.floor(this.userPet.energy) >= 95)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/100.png"}
            if (Math.floor(this.userPet.energy) >= 85 && Math.floor(this.userPet.energy) < 95)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/90.png"}
            if (Math.floor(this.userPet.energy) >= 75 && Math.floor(this.userPet.energy) < 85)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/80.png"}
            if (Math.floor(this.userPet.energy) >= 65 && Math.floor(this.userPet.energy) < 75)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/70.png"}
            if (Math.floor(this.userPet.energy) >= 55 && Math.floor(this.userPet.energy) < 65)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/60.png"}
            if (Math.floor(this.userPet.energy) >= 45 && Math.floor(this.userPet.energy) < 55)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/50.png"}
            if (Math.floor(this.userPet.energy) >= 35 && Math.floor(this.userPet.energy) < 45)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/40.png"}
            if (Math.floor(this.userPet.energy) >= 25 && Math.floor(this.userPet.energy) < 35)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/30.png"}
            if (Math.floor(this.userPet.energy) >= 15 && Math.floor(this.userPet.energy) < 25)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/20.png"}
            if (Math.floor(this.userPet.energy) >= 5 && Math.floor(this.userPet.energy) < 15)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/10.png"
                document.getElementsByClassName("energie1")[0].style.visibility = "visible";}
            if (Math.floor(this.userPet.energy) <5)
            {document.getElementsByClassName("energie")[0].src = "assets/textures/0.png"
                document.getElementsByClassName("energie1")[0].style.visibility = "visible";}
        }

        // plezier
        if (Math.floor(this.userPet.joy) < 101)
        {
            if (Math.floor(this.userPet.joy) > 95)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/100.png"}
            if (Math.floor(this.userPet.joy) >= 85 && Math.floor(this.userPet.joy) < 95)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/90.png"}
            if (Math.floor(this.userPet.joy) >= 75 && Math.floor(this.userPet.joy) < 85)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/80.png"}
            if (Math.floor(this.userPet.joy) >= 65 && Math.floor(this.userPet.joy) < 75)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/70.png"}
            if (Math.floor(this.userPet.joy) >= 55 && Math.floor(this.userPet.joy) < 65)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/60.png"}
            if (Math.floor(this.userPet.joy) >= 45 && Math.floor(this.userPet.joy) < 55)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/50.png"}
            if (Math.floor(this.userPet.joy) >= 35 && Math.floor(this.userPet.joy) < 45)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/40.png"}
            if (Math.floor(this.userPet.joy) >= 25 && Math.floor(this.userPet.joy) < 35)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/30.png"}
            if (Math.floor(this.userPet.joy) >= 15 && Math.floor(this.userPet.joy) < 25)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/20.png"}
            if (Math.floor(this.userPet.joy) >= 5 && Math.floor(this.userPet.joy) < 15)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/10.png"
                document.getElementsByClassName("plezier1")[0].style.visibility = "visible";}
            if (Math.floor(this.userPet.joy) <5)
            {document.getElementsByClassName("plezier")[0].src = "assets/textures/0.png"
                document.getElementsByClassName("plezier1")[0].style.visibility = "visible";}
        }
    }
    Cheats()
    {
        if(keyboard.GetKey('c'))
        {
            this.userPet.AddToJoy(-25 * DeltaTime);
            this.userPet.AddToEnergy(-25 * DeltaTime);
            this.userPet.AddToHunger(-25 * DeltaTime);
        }
        if(keyboard.GetKey('v'))
        {
            this.userPet.AddToJoy(25 * DeltaTime);
            this.userPet.AddToEnergy(25 * DeltaTime);
            this.userPet.AddToHunger(25 * DeltaTime);
        }
    }
    OnEffectsMute(e)
    {
        if(this.effectsMuted)
        {
            this.effectsMuted = false;
        }
        else
        {
            this.effectsMuted = true;
        }
    }
    OnBGMMute(e)
    {
        if(this.bgmMixer.muted)
        {
            this.bgmMixer.Shuffle();
            this.bgmMixer.muted = false;
        }
        else
        {
            this.bgmMixer.Stop();
            this.bgmMixer.muted = true;
        }
    }
    OnPetDead(e)
    {
        this.sceneRenderer.RemoveObject(this.userPet);
        this.clickableObjects.splice(this.userPet);
        this.userPet = new Death(this.userPet.name);
        this.userPet.hunger = 0;
        this.userPet.joy = 100;
        this.userPet.energy = 0;
        this.userPet.SavePet();

        //document.getElementsByClassName("pet_name")[0].value = this.userPet.name;

        this.sceneRenderer.AddObject(this.userPet);
        this.clickableObjects.push(this.userPet);
        this.Dead();
    }
    Dead()
    {
        document.getElementsByClassName("ball_btn")[0].style.visibility = "hidden";
        document.getElementsByClassName("eten1")[0].style.visibility = "hidden";
        document.getElementsByClassName("grave")[0].style.visibility = "visible"
        document.getElementsByClassName("grave")[0].innerHTML = "<p>" + this.userPet.name +  "</p>";
        document.getElementsByClassName("slapen")[0].style.visibility = "hidden";
    }
    Alive()
    {
        document.getElementsByClassName("ball_btn")[0].style.visibility = "visible";
        document.getElementsByClassName("eten1")[0].style.visibility = "visible";
        document.getElementsByClassName("grave")[0].style.visibility = "hidden";
        document.getElementsByClassName("slapen")[0].style.visibility = "visible";
    }

    ResetPet()
    {
        //NewPet
        var result = confirm("Do you really want to reset?");
        if(result == true)
        {
            this.sceneRenderer.RemoveObject(this.userPet);
            this.clickableObjects.splice(this.userPet);
            this.userPet = new PumpkinEgg();
            this.userPet.SavePet();
            document.getElementsByClassName("pet_name")[0].value = this.userPet.name;
            this.sceneRenderer.AddObject(this.userPet);
            this.clickableObjects.push(this.userPet);
            this.Alive();
        }
    }
    PlaySound(audioSource)
    {
        if(this.effectsMuted == false)
        {
            new OneShotAudio(audioSource);
        }
    }
    OnPumpkinHatch(e)
    {
        var id = qUtils.GetRandomBetweenInt(1,3);
        var newPet = this.PetSelect(id.toString());//this.userPet.Hatch(id.toString());
        newPet.timesClicked = this.userPet.timesClicked;
        newPet.name = this.userPet.name;
        newPet.creationDate = this.userPet.creationDate;

        this.cloudExplosion.CreateExplosion(25,newPet.position,2);
        this.PlaySound(audioSources.eggHatch);

        this.sceneRenderer.RemoveObject(this.userPet);
        this.clickableObjects.splice(this.userPet);

        this.userPet = newPet;
        this.userPet.SavePet();
        this.sceneRenderer.AddObject(this.userPet);
        this.clickableObjects.push(this.userPet);
        //var explosion = new CloudExplosion(25,this.userPet.position,2,this.sceneRenderer);

    }
    OnCloudTimerEnd(e)
    {
        this.cloudExplosion.clouds.splice(e.detail);
        this.sceneRenderer.RemoveObject(e.detail);
    }
    PetSelect(petId)
    {
        var  map = this.loader.load("assets/textures/grave.png");
        switch(petId)
        {
            case '-1':
                return new Death();
                break;
            //case '0': break; //default and 0 is the same...
            case '1':
                return new Ghost();
                break;
            case '2':
                return new Zombie();
                break;

            case '3':
                return new Skeleton();
                break;

            default:
                return new PumpkinEgg();
                break;
        }
        return null;
    }
    LoadPet()
    {
        var petId = qUtils.GetCookie("pet_id");
        var newPet = this.PetSelect(petId);
        this.userPet = newPet;
        this.userPet.LoadPet();
        if(this.userPet.isDead == true)
        {
            this.Dead();
        }
    }
}
new Main();