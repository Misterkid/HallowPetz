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
        //this.userPet.castShadow = true;
        this.sceneRenderer.AddObject(this.userPet);

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

        this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
    }


    //On Every frame do actions here. This is the main loop.

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
        this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
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

        this.AnimateSpotLight();


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
        var geometry = new THREE.PlaneGeometry(500,500);
        var material = new THREE.MeshPhongMaterial();
        material.color.setHex("0x77FF00");
        var mesh = new THREE.Mesh(geometry,material);
        mesh.rotateX(qUtils.DegToRad(-90));
        mesh.position.set(0,-2,0);
        mesh.receiveShadow = true;
        this.sceneRenderer.AddObject(mesh);



        this.aantalhekjes = 15;
        for(var i = 0; i < this.aantalhekjes; i++) {
            var k = 0.01;
            var x = -20;
            var y = -2;
            var z = -20;
            this.boomPos = new THREE.Vector3(x+(i*2.5), y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0, qUtils.DegToRad(180), 0);
            this.objectL.ImportObject('assets/models/fench.obj', 'assets/textures/ColorsheetFenceBrown.png', this.boomPos, this.boomScale, this.boomRotate);
            var x = -22.5;
            this.boomPos = new THREE.Vector3(x, y, (z+(i*2.5)));
            this.boomRotate = new THREE.Vector3(0, qUtils.DegToRad(-90), 0);
            this.objectL.ImportObject('assets/models/fench.obj', 'assets/textures/ColorsheetFenceBrown.png', this.boomPos, this.boomScale, this.boomRotate);
            var x = -20;
            this.boomPos = new THREE.Vector3(x+(i*2.5), y, z+(this.aantalhekjes*2.5));
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0, qUtils.DegToRad(180), 0);
            this.objectL.ImportObject('assets/models/fench.obj', 'assets/textures/ColorsheetFenceBrown.png', this.boomPos, this.boomScale, this.boomRotate);
            var x = -22.5;
            this.boomPos = new THREE.Vector3(x+(this.aantalhekjes*2.5), y, (z+(i*2.5)));
            this.boomRotate = new THREE.Vector3(0, qUtils.DegToRad(-90), 0);
            this.objectL.ImportObject('assets/models/fench.obj', 'assets/textures/ColorsheetFenceBrown.png', this.boomPos, this.boomScale, this.boomRotate);
        }

        for(var i = 0; i < 75; i++) {
            var k = qUtils.GetRandomBetweenInt(15, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(-50, 50);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(30, 40);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }

        for(var i = 0; i < 75; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(-50, 50);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(-32, -22);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }

        for(var i = 0; i < 50; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(-22, -40);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(-20, 20);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }

        for(var i = 0; i < 50; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(50, 60);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(-20, 20);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }


        this.moonPos = new THREE.Vector3(220, 500,-1000);
        this.moonScale = new THREE.Vector3(100,100,100);
        this.objectL.ImportObject('assets/models/Moon.obj', 'assets/textures/colorsheettreenormal.png', this.moonPos, this.moonScale);

        var cScale = 0.3;
        this.churchPos = new THREE.Vector3(35,-3.2,20);
        this.churchScale = new THREE.Vector3(cScale,cScale,cScale);
        this.churchRotate = new THREE.Vector3(0,qUtils.DegToRad(-90), 0);
        this.objectL.ImportObject('assets/models/Church.obj', 'assets/textures/concretetext.png', this.churchPos, this.churchScale, this.churchRotate);

        var pScale = 0.05;
        this.pumpkinPos = new THREE.Vector3(30,-2.5,15);
        this.pumpkinScale = new THREE.Vector3(pScale,pScale,pScale);
        this.pumpkinRotate = new THREE.Vector3(0,qUtils.DegToRad(0), 0);
        this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.pumpkinPos, this.pumpkinScale, this.pumpkinRotate);
        this.pumpkinPos = new THREE.Vector3(30,-2.5,25);
        this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.pumpkinPos, this.pumpkinScale, this.pumpkinRotate);


        //Clouds
        for(var i = 0; i < 75; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 20)/10;
            var x = qUtils.GetRandomBetweenInt(-100, 100);
            var y = qUtils.GetRandomBetweenInt(12, 18);
            var z = qUtils.GetRandomBetweenInt(-100, 100);
            this.cloudPos = new THREE.Vector3(-x, y, -z);
            this.cloudScale = new THREE.Vector3(k, k, k);
            this.cloudRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/cloud.obj', 'assets/textures/colorsheettreenormal.png', this.cloudPos, this.cloudScale, this.cloudRotate );
        }

        for(var i = 0; i < 75; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 20)/10;
            var x = qUtils.GetRandomBetweenInt(-100, 100);
            var y = qUtils.GetRandomBetweenInt(12, 18);
            var z = qUtils.GetRandomBetweenInt(-100, 100);
            this.cloudPos = new THREE.Vector3(-x, y, -z);
            this.cloudScale = new THREE.Vector3(k, k, k);
            this.cloudRotate = new THREE.Vector3(0,qUtils.GetRandomBetweenInt(0,360), 0);
            this.objectL.ImportObject('assets/models/cloud2.obj', 'assets/textures/colorsheettreenormal.png', this.cloudPos, this.cloudScale, this.cloudRotate );
        }


        //Graves
        for(var i = 0; i < 3; i++) {
            var gScale = 0.05;
            var x = -18;
            var y = -2.5;
            var z = -18;
            this.gravePos = new THREE.Vector3(x+(6*i), y, z);
            this.graveScale = new THREE.Vector3(gScale, gScale, gScale);
            this.graveRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.gravePos, this.graveScale, this.graveRotate );
            for(var k = 0; k < 6; k++){
                this.gravePos = new THREE.Vector3(x+(6*i),y, z+(6*k));
                this.graveRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
                this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.gravePos, this.graveScale, this.graveRotate );
            }
        }

        for(var i = 0; i < 8; i++) {
            var gScale = 0.05;
            var x = 22;
            var y = -2.5;
            var z = -15;
            this.gravePos = new THREE.Vector3(x+(6*i), y, z);
            this.graveScale = new THREE.Vector3(gScale, gScale, gScale);
            this.graveRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.gravePos, this.graveScale, this.graveRotate );
            for(var k = 0; k < 6; k++){
                this.gravePos = new THREE.Vector3(x+(6*i),y, z+(6*k));
                this.graveRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
                this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.gravePos, this.graveScale, this.graveRotate );
            }
        }

    }
    CreateSkydome()
    {


        var skyGeo = new THREE.SphereGeometry(4000, 25, 25);


        //var skytexture = THREE.ImageUtils.loadTexture( "assets/textures/milky.jpg" );


        var skymaterial = new THREE.MeshBasicMaterial( { color: 0x003366 } );


        var sky = new THREE.Mesh(skyGeo, skymaterial);
        sky.material.side = THREE.BackSide;
        this.sceneRenderer.AddObject(sky);
    }
    CreateLights()
    {
        //var light = new THREE.AmbientLight( 0x003366,0.5);
        var light = new THREE.AmbientLight( 0xFFFFFF,0.5);
        light.position.set( 0, 10, 1 );
        this.sceneRenderer.AddObject(light);

        //this.spotLight = new THREE.SpotLight( 0x003366,1 );
        this.spotLight = new THREE.SpotLight( 0xFFFFFF,1 );

        this.spotLight.position.set( 150, 10, 150 ); //y = 50
        this.spotLight.castShadow = true;
        this.spotLight.shadowDarkness =  1;
        this.spotLight.angle = 240;


        this.sceneRenderer.AddObject( this.spotLight );

        var spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        this.sceneRenderer.AddObject(spotLightHelper );

/*        this.spotLight2 = new THREE.SpotLight( 0x003366,1 );
        //this.spotLight2 = new THREE.SpotLight( 0xFFFFFF,0 );
        this.spotLight2.position.set( 20, 5, -40 );
        this.spotLight2.castShadow = true;
        this.spotLight2.shadowDarkness =  1;
        this.spotLight2.angle = 240;


        this.sceneRenderer.AddObject( this.spotLight2 );

        var spotLightHelper2 = new THREE.SpotLightHelper( this.spotLight2 );
        this.sceneRenderer.AddObject(spotLightHelper2 );*/

        /*this.moonLight = new THREE.SpotLight( 0xFFFFFF,0.5 );
        this.moonLight.position.set( 100, 450,-500 );
        this.moonLight.target.position.set(200,-130,400);
        this.sceneRenderer.AddObject(this.moonLight.target);
        this.moonLight.castShadow = true;
        this.moonLight.shadowDarkness =  1;
        this.moonLight.angle = qUtils.DegToRad(270);


        this.sceneRenderer.AddObject( this.moonLight );*/


        /*var moonLightHelper = new THREE.SpotLightHelper( this.moonLight );
        this.sceneRenderer.AddObject(moonLightHelper );*/
    }

    AnimateSpotLight(){
        var angle	= Date.now()/1000 * Math.PI;
// angle	= Math.PI*2
        this.spotLight.position.x	= Math.cos(angle*-0.1)*20;
        //this.spotLight.position.y	= 10 + Math.sin(angle*0.5)*6;
        this.spotLight.position.z	= Math.sin(angle*-0.1)*20;
        //this.spotLight.target(this.userPet);
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

            switch(this.userPet.petId)
            {
                case 1:
                    eten1.position.set(this.userPet.headPoint.x,this.userPet.headPoint.y - 2,0);
                    break;
                case 2:
                    eten1.position.set(this.userPet.headPoint.x,this.userPet.headPoint.y - 2.5,0);
                    break;

                default:
                    eten1.position.set(this.userPet.headPoint.x,this.userPet.headPoint.y,0);
                    break;
            }
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
        this.userPet.AddToHunger(10);
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
        this.sceneRenderer.RemoveObject(e.detail);
        qUtils.RemoveObjectFromArray(this.clickableObjects,e.detail);
        this.cloudExplosion.CreateExplosion(10,e.detail.position,0);
        this.userPet.AddFood(1);
    }
    OnMouseObjectClick(e)
    {
        //CLICK
        this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
        e.detail.OnClick(e.detail);
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
        if(keyboard.GetKey('b'))
        {
            this.userPet.foodCount ++;
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
        qUtils.RemoveObjectFromArray(this.clickableObjects,this.userPet);
        this.userPet = new Death(this.userPet.name);
        this.userPet.hunger = 0;
        this.userPet.joy = 100;
        this.userPet.energy = 0;
        this.userPet.SavePet();

        this.sceneRenderer.AddObject(this.userPet);
        this.clickableObjects.push(this.userPet);
        this.hud.Dead(this.userPet);

        this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
    }
    ResetPet()
    {
        //NewPet
        var result = confirm("Do you really want to reset?");
        if(result == true)
        {
            this.sceneRenderer.RemoveObject(this.userPet);
            qUtils.RemoveObjectFromArray(this.clickableObjects,this.userPet);
            this.userPet = new PumpkinEgg();
            this.userPet.SavePet();
            this.hud.petRenameField.value = this.userPet.name;
            this.sceneRenderer.AddObject(this.userPet);
            this.clickableObjects.push(this.userPet);
            this.hud.Alive();
            this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
            this.userPet.asleep = !this.isDag;
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
        this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
        //var explosion = new CloudExplosion(25,this.userPet.position,2,this.sceneRenderer);
    }
    OnCloudTimerEnd(e)
    {
        this.sceneRenderer.RemoveObject(e.detail);
        qUtils.RemoveObjectFromArray(this.cloudExplosion.clouds,e.detail);
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
    WorldToScreen( position )
    {
        var width = this.hud.hudDiv.offsetWidth, height = this.hud.hudDiv.offsetHeight;
        var widthHalf = width / 2;
        var heightHalf = height / 2;

        var pos = position.clone();
        pos.project(this.sceneRenderer.camera);
        pos.x = Math.round( (   pos.x + 1 ) * widthHalf );
        pos.y = Math.round( ( - pos.y + 1 ) * heightHalf );
        return new THREE.Vector3(pos.x,pos.y,0);
    }
}
new Main();