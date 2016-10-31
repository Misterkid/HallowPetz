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
        this.hud = new HeadsUpDisplay();
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
        //this.clickablePresent = new Array();
        this.presentSpawnPositions = new Array();
        this.SetPresentPosition();

        var randomTime = qUtils.GetRandomBetweenInt(10000,100000);
        this.PresentSpawnTimer = setInterval((e)=>{ this.SpawnPresent(e);},randomTime);

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
        document.addEventListener("onpresentclick",(e)=>{this.OnPresentClick(e);});
        document.addEventListener('webkitfullscreenchange',(e)=> {this.FullScreenChange(e);}, false);
        document.addEventListener('mozfullscreenchange',(e)=> {this.FullScreenChange(e);}, false);
        document.addEventListener('fullscreenchange', (e)=> {this.FullScreenChange(e);}, false);

        //Hud
        this.hud.savePetButton.onclick = (e) => {this.OnSaveClick(e)};
        this.hud.resetPetButton.onclick = (e) => {this.OnResetClick(e)};
        this.hud.muteSFXButton.onclick = (e) => {this.OnEffectsMute(e)};
        this.hud.muteBGMButton.onclick = (e) => {this.OnBGMMute(e)};
        this.hud.fullScreenButton.onclick = (e) => {this.OnFullScreenClick(e)};
        this.hud.menuButton.onclick = (e) => {this.OnShowMenuClick(e)};
        this.hud.funButton.onclick = (e) => {this.OnBallBtnClick(e)};
        this.hud.sleepButton.onclick = (e) => {this.OnSlapenClick(e)};
        this.hud.eatButton.onclick = (e) => {this.OnEten1Click(e)};

        //Save before closing,refreshing etc...
        window.onbeforeunload = (e) => {this.OnBeforeUnload(e)};
        this.sceneRenderer.Render();//Start rendering

        this.bgmMixer = new BGMMixer();
        this.bgmMixer.Shuffle();//Start
    }

    //On Every frame do actions here. This is the main loop.
    //Testing adding OBJ 3d object.
    CeateTeaPot()
    {
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
        this.hud.ShowHideMenu(this.throwBall,this.userPet);
    }

    OnFullScreenClick(e)
    {
        this.sceneRenderer.RequestFullScreen();
    }
    SetPresentPosition()
    {
        this.AddPresentPosition(2, 0, 5);
        this.AddPresentPosition(3, 0, 7);
        this.AddPresentPosition(5, 0, 7);
        this.AddPresentPosition(9, 0, 2);
        this.AddPresentPosition(10,0,9);
    }

    SpawnPresent()
    {
        var gPresent = new THREE.BoxGeometry(0.5,0.5,0.5);
        var mPresent = new THREE.MeshPhongMaterial();
        var etenObject = new EtenVerzamelen(gPresent, mPresent);
        var i = qUtils.GetRandomBetweenInt(0,this.presentSpawnPositions.length -1);

        clearInterval(this.PresentSpawnTimer);
        var randomTime = qUtils.GetRandomBetweenInt(10000,100000);
        this.PresentSpawnTimer = setInterval((e)=>{ this.SpawnPresent(e);},randomTime);

        for(var j = 0; j < this.clickableObjects.length; j++ )
        {
            if(this.presentSpawnPositions[i].x == this.clickableObjects[j].position.x,
                this.presentSpawnPositions[i].y == this.clickableObjects[j].position.y,
                this.presentSpawnPositions[i].z == this.clickableObjects[j].position.z)
            {
                return;
            }
        }
        etenObject.position.set(this.presentSpawnPositions[i].x,this.presentSpawnPositions[i].y,this.presentSpawnPositions[i].z);
        this.clickableObjects.push(etenObject);
        this.sceneRenderer.AddObject(etenObject);

    }

    AddPresentPosition(x,y,z)
    {
        var position = new THREE.Vector3(x,y,z);
        this.presentSpawnPositions.push(position);
    }

    OnObjectLoadDone(e)
    {
        this.sceneRenderer.AddObject(e.detail);
    }

    OnRenderUpdate(e)
    {
        //updates heads up display
        this.hud.OnUpdate(this.userPet);
        //Pet.OnUpdate looks at camera, update it each frame.
        this.userPet.OnUpdate(this.sceneRenderer.camera);
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
        this.hud.ShowHideMenu(this.throwBall,this.userPet);
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
        if(this.userPet.foodCount > 0)
        {
            var map = this.loader.load("assets/textures/eten1.png");
            var eten1 = new Eten(map, 1.5, 1);
            this.sceneRenderer.AddObject(eten1);
            this.updateObjects.push(eten1);
            this.PlaySound(audioSources.eating);
            this.userPet.AddFood(-1);
        }
    }
    OnEtenTimer(e)
    {
        this.updateObjects.slice(e.detail);//Ohhh...
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
        this.hud.ShowHideMenu(this.throwBall,this.userPet);
        this.ResetPet();
    }
    OnSaveClick(e)
    {
        this.hud.ShowHideMenu(this.throwBall,this.userPet);
        this.SavePet();
    }
    OnBeforeUnload()
    {
        this.SavePet();
    }
    SavePet()
    {
        this.userPet.name = this.hud.petRenameField.value;
        this.userPet.SavePet();
    }
    OnPresentClick(e)
    {
        this.RemoveClickAbleObject(e.detail);
        this.sceneRenderer.RemoveObject(e.detail);
        this.userPet.AddFood(1);
    }
    OnMouseObjectClick(e)
    {
        //CLICK
        e.detail.OnClick(e.detail);
    }
    RemoveClickAbleObject(object)
    {
        for(var i = 0; i < this.clickableObjects.length; i++)
        {
            if(object.uuid == this.clickableObjects[i].uuid)
            {
                this.clickableObjects.splice(i, 1);
                return;
            }
        }
    }
    OnBallMove(e)
    {
        //add 0.1 joy per second
        this.userPet.AddToJoy(0.75 * DeltaTime);
    }
    OnBallHitWall(e)
    {
        this.PlaySound(audioSources.ballHit);
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
        //this.clickableObjects.slice(this.userPet);
        this.RemoveClickAbleObject(this.userPet);
        this.userPet = new Death(this.userPet.name);
        this.userPet.hunger = 0;
        this.userPet.joy = 100;
        this.userPet.energy = 0;
        this.userPet.SavePet();

        this.sceneRenderer.AddObject(this.userPet);
        this.clickableObjects.push(this.userPet);
        this.hud.Dead(this.userPet);
    }
    ResetPet()
    {
        //NewPet
        var result = confirm("Do you really want to reset?");
        if(result == true)
        {
            this.sceneRenderer.RemoveObject(this.userPet);
            this.RemoveClickAbleObject(this.userPet);
            this.userPet = new PumpkinEgg();
            this.userPet.SavePet();
            document.getElementsByClassName("pet_name")[0].value = this.userPet.name;
            this.sceneRenderer.AddObject(this.userPet);
            this.clickableObjects.push(this.userPet);
            this.hud.Alive();
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

        newPet.Transfer(this.userPet);
        this.cloudExplosion.CreateExplosion(20,newPet.position,2);
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
            this.hud.Dead(this.userPet);
        }
    }
}
new Main();