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
        //this.CreateEnvirement();
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
        this.hud.muteAmbButton.onclick = (e) =>{this.OnAmbMute(e)};
        this.hud.fullScreenButton.onclick = (e) => {this.OnFullScreenClick(e)};
        this.hud.menuButton.onclick = (e) => {this.OnShowMenuClick(e)};
        this.hud.funButton.onclick = (e) => {this.OnBallBtnClick(e)};
        this.hud.sleepButton.onclick = (e) => {this.OnSlapenClick(e)};
        this.hud.eatButton.onclick = (e) => {this.OnEten1Click(e)};

        //Save before closing,refreshing etc...
        window.onbeforeunload = (e) => {this.OnBeforeUnload(e)};
        this.sceneRenderer.Render();//Start rendering

        settings.Load();
        this.bgmMixer = new BGMMixer();
        this.bgmMixer.muted = settings.bgmMuted;
        this.bgmMixer.Shuffle();//Start

        this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
        this.hud.petRenameField.value = this.userPet.name;

        this.dummyMaxLoad = 4;
        this.dummyLoadCount = 0;
        this.LoadDummies();
        //this.CreateEnvirement();
/*
        this.ambient = document.createElement('audio');
        this.ambient.appendChild(audioSources.dayAmbient);
        this.ambient.volume = 0.3;
        this.ambient.loop = true;
        this.ambient.play();
*/
        this.ambient = new AmbientMixer();
        console.log(settings.ambMuted);
        if(!settings.ambMuted)
            this.ambient.Switch(true);


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
        this.AddPresentPosition(2, -1.5, 5);
        this.AddPresentPosition(3, -1.5, 7);
        this.AddPresentPosition(5, -1.5, 7);
        this.AddPresentPosition(9, -1.5, 2);
        this.AddPresentPosition(10,-1.5,9);
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
        if(this.dummyLoadCount == this.dummyMaxLoad - 1)
        {
            this.dummyLoadCount++;
           // this.objectL.ImportObject('assets/models/fench.obj', 'assets/textures/ColorsheetFenceBrown.png', new THREE.Vector3(0,0,0), 1, 0);
            this.CreateEnvirement();
        }
        else if(this.dummyLoadCount < this.dummyMaxLoad - 1)
        {
            this.dummyLoadCount++;
        }
        else
        {
           this.sceneRenderer.AddObject(e.detail);
        }
    }

    OnRenderUpdate(e)
    {

        //this.AnimateSpotLight();


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
    LoadDummies()
    {
        var badPos = new THREE.Vector3(-10,-10,-10);
        this.dummyMaxLoad = 8;// - 1;
        this.objectL.ImportObject('assets/models/fench.obj', 'assets/textures/ColorsheetFenceBrown.png', badPos, 1);
        this.objectL.ImportObject('assets/models/boom.obj', 'assets/textures/colorsheettreenormal.png', badPos, 1)
        this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal2.png', badPos, 1);
        this.objectL.ImportObject('assets/models/Moon.obj', 'assets/textures/yellow.png', badPos, 1);
        this.objectL.ImportObject('assets/models/cloud.obj', 'assets/textures/colorsheettreenormal.png', badPos, 1);
        this.objectL.ImportObject('assets/models/cloud2.obj', 'assets/textures/colorsheettreenormal.png', badPos, 1 );
        this.objectL.ImportObject('assets/models/Church.obj', 'assets/textures/concretetext.png', badPos, 1);
        this.objectL.ImportObject('assets/models/mountain2.obj', 'assets/textures/concretetext.png', badPos, 1);

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


        //Creating Fenches
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
        //Creating Tree's
        for(var i = 0; i < 75; i++) {
            var k = qUtils.GetRandomBetweenInt(15, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(-50, 50);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(30, 40);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            if(0 == qUtils.GetRandomBetweenInt(0,1))
                this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal2.png', this.boomPos, this.boomScale, this.boomRotate );
            else
                this.objectL.ImportObject('assets/models/boom.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }

        for(var i = 0; i < 75; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(-50, 50);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(-32, -22);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            if(0 == qUtils.GetRandomBetweenInt(0,1))
                this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal2.png', this.boomPos, this.boomScale, this.boomRotate );
            else
                this.objectL.ImportObject('assets/models/boom.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }

        for(var i = 0; i < 50; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(-22, -40);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(-20, 20);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            if(0 == qUtils.GetRandomBetweenInt(0,1))
                this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal2.png', this.boomPos, this.boomScale, this.boomRotate );
            else
                this.objectL.ImportObject('assets/models/boom.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }

        for(var i = 0; i < 50; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 25)/1000;
            var x = qUtils.GetRandomBetweenInt(50, 60);
            var y = -2;
            var z = qUtils.GetRandomBetweenInt(-20, 20);
            this.boomPos = new THREE.Vector3(x, y, z);
            this.boomScale = new THREE.Vector3(k, k, k);
            this.boomRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            if(0 == qUtils.GetRandomBetweenInt(0,1))
                this.objectL.ImportObject('assets/models/boom2.obj', 'assets/textures/colorsheettreenormal2.png', this.boomPos, this.boomScale, this.boomRotate );
            else
                this.objectL.ImportObject('assets/models/boom.obj', 'assets/textures/colorsheettreenormal.png', this.boomPos, this.boomScale, this.boomRotate );
        }

        //moon
        this.moonPos = new THREE.Vector3(0, 25,-100);
        this.moonScale = new THREE.Vector3(10,10,10);
        this.objectL.ImportObject('assets/models/Moon.obj', 'assets/textures/yellow.jpg', this.moonPos, this.moonScale);

        //church
        var cScale = 0.3;
        this.churchPos = new THREE.Vector3(35,-3.2,20);
        this.churchScale = new THREE.Vector3(cScale,cScale,cScale);
        this.churchRotate = new THREE.Vector3(0,qUtils.DegToRad(-90), 0);
        this.objectL.ImportObject('assets/models/Church.obj', 'assets/textures/concretetext.png', this.churchPos, this.churchScale, this.churchRotate);

        //pumpkin
        var pScale = 0.05;
        this.pumpkinPos = new THREE.Vector3(30,-2.5,15);
        this.pumpkinScale = new THREE.Vector3(pScale,pScale,pScale);
        this.pumpkinRotate = new THREE.Vector3(0,qUtils.DegToRad(0), 0);
        this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.pumpkinPos, this.pumpkinScale, this.pumpkinRotate);
        this.pumpkinPos = new THREE.Vector3(30,-2.5,25);
        this.objectL.ImportObject('assets/models/pumpkin.obj', 'assets/textures/orange.png', this.pumpkinPos, this.pumpkinScale, this.pumpkinRotate);


        //Clouds
        for(var i = 0; i < 25; i++) {
            var k = qUtils.GetRandomBetweenInt(10, 20)/10;
            var x = qUtils.GetRandomBetweenInt(-100, 100);
            var y = qUtils.GetRandomBetweenInt(12, 18);
            var z = qUtils.GetRandomBetweenInt(-100, 100);
            this.cloudPos = new THREE.Vector3(-x, y, -z);
            this.cloudScale = new THREE.Vector3(k, k, k);
            this.cloudRotate = new THREE.Vector3(0,qUtils.DegToRad(qUtils.GetRandomBetweenInt(0,360)), 0);
            this.objectL.ImportObject('assets/models/cloud.obj', 'assets/textures/colorsheettreenormal.png', this.cloudPos, this.cloudScale, this.cloudRotate );
        }

        for(var i = 0; i < 25; i++) {
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
        this.graveTexture = new Array('assets/textures/concretetext.png', 'assets/textures/concretetext2.png')
        for(var i = 0; i < 3; i++) {
            var gScale = 0.15;
            var x = -18;
            var y = -2.0;
            var z = -18;
            this.gravePos = new THREE.Vector3(x+(6*i), y, z);
            this.graveScale = new THREE.Vector3(gScale, gScale, gScale);
            this.graveRotate = new THREE.Vector3(0,qUtils.DegToRad(90),0);
            if(0 == qUtils.GetRandomBetweenInt(0,1))
                this.objectL.ImportObject('assets/models/gravestone.obj', this.graveTexture[qUtils.GetRandomBetweenInt(0,1)], this.gravePos, this.graveScale, this.graveRotate );
            else
                this.objectL.ImportObject('assets/models/stone_grave.obj', this.graveTexture[qUtils.GetRandomBetweenInt(0,1)], this.gravePos, this.graveScale, this.graveRotate );

            for(var k = 0; k < 4; k++){
                this.gravePos = new THREE.Vector3(x+(6*i),y, z+(10*k));
                //this.graveRotate = new THREE.Vector3(0,0, 0);
                if(0 == qUtils.GetRandomBetweenInt(0,1))
                    this.objectL.ImportObject('assets/models/gravestone.obj', this.graveTexture[qUtils.GetRandomBetweenInt(0,1)], this.gravePos, this.graveScale, this.graveRotate );
                else
                    this.objectL.ImportObject('assets/models/stone_grave.obj', this.graveTexture[qUtils.GetRandomBetweenInt(0,1)], this.gravePos, this.graveScale, this.graveRotate );

            }
        }

        //Pumpkin
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

        //Mountains
        var gScale = 70;
        var x = -150;
        var y = -2.5;
        var z = 150;
        this.gravePos = new THREE.Vector3(x, y, z);
        this.graveScale = new THREE.Vector3(gScale, gScale, gScale);
        this.graveRotate = new THREE.Vector3(qUtils.DegToRad(0),0, 0);
        this.objectL.ImportObject('assets/models/mountain.obj', 'assets/textures/concretetext.png', this.gravePos, this.graveScale, this.graveRotate );

        //Mountains
        var gScale = 70;
        var x = 150;
        var y = -2.5;
        var z = 100;
        this.gravePos = new THREE.Vector3(x, y, z);
        this.graveScale = new THREE.Vector3(gScale, gScale, gScale);
        this.graveRotate = new THREE.Vector3(qUtils.DegToRad(0),0, 0);
        this.objectL.ImportObject('assets/models/mountain2.obj', 'assets/textures/concretetext.png', this.gravePos, this.graveScale, this.graveRotate );

        //Mountains
        var gScale = 70;
        var x = -150;
        var y = -2.5;
        var z = -100;
        this.gravePos = new THREE.Vector3(x, y, z);
        this.graveScale = new THREE.Vector3(gScale, gScale, gScale);
        this.graveRotate = new THREE.Vector3(qUtils.DegToRad(0),0, 0);
        this.objectL.ImportObject('assets/models/mountain2.obj', 'assets/textures/concretetext.png', this.gravePos, this.graveScale, this.graveRotate );
    }
    CreateSkydome()
    {

        this.skyDayColor = 0x78E6FF;
        this.skyNightColor = 0x003366;

        this.skyGeo = new THREE.SphereGeometry(4000, 25, 25);
        this.skyDayMaterial = new THREE.MeshBasicMaterial( { color: this.skyNightColor } );


        this.sky = new THREE.Mesh(this.skyGeo, this.skyDayMaterial);
        this.sky.material.side = THREE.BackSide;
        this.sceneRenderer.AddObject(this.sky);

    }
    CreateLights()
    {
        this.nightColor = 0x003366;
        this.dayColor = 0xFFFFFF;
        this.ambientDayIntensity = 0.7;
        this.ambientNightIntensity = 1.5;
        this.light = new THREE.AmbientLight( this.nightColor, this.ambientNightIntensity);

        this.light.position.set( 0, 10, 1 );
        this.sceneRenderer.AddObject(this.light);

/*        this.spotLight = new THREE.SpotLight( 0xFFFFFF,0 );

        this.spotLight.position.set( 150, 10, 150 ); //y = 50
        this.spotLight.castShadow = true;
        this.spotLight.shadowDarkness =  0.5;
        this.spotLight.angle = 240;




        this.sceneRenderer.AddObject( this.spotLight );*/

        //Light on Moon/Sun
        this.moonLighting = new THREE.SpotLight( 0xFFFFFF,1);
        this.moonLighting.position.set( 0, 25, -70 );
        this.moonLighting.penumbra = 0;
        this.moonLighting.angle = 0.4;
        this.moonLighting.distance = 1000;
        this.moonLighting.decay = 0;

        //Moon target
        this.geometry = new THREE.BoxGeometry(1,1,1);
        this.material = new THREE.MeshBasicMaterial(0xFFFFFF);
        this.lighttarget = new THREE.Mesh(this.geometry,this.material);
        this.lighttarget.position.set(0, 39,-100);
        this.lighttarget.receiveShadow = false;
        this.lighttarget.castShadow = false;
        this.lighttarget.visible = false;
        this.sceneRenderer.AddObject(this.lighttarget);

        this.moonLighting.target = this.lighttarget;
        this.sceneRenderer.AddObject( this.moonLighting );
        this.sceneRenderer.AddObject(this.moonLighting.target);

        //Moon Sun Light
        this.moonLight = new THREE.SpotLight(this.nightColor, 1.0);
        this.moonLight.position.set( 0, 25, -70 );
        this.moonLight.castShadow = true;
        this.moonLight.shadowDarkness =  1;
        //this.moonLight.angle = 240;

        this.sceneRenderer.AddObject( this.moonLight );


    }

    DayLight()
    {
        this.light.color.setHex(this.dayColor);
        this.light.intensity = this.ambientDayIntensity;
        this.moonLight.color.setHex(this.dayColor);
        this.sky.material.color.setHex(this.skyDayColor);
    }

    NightLight()
    {
        this.light.color.setHex(this.nightColor);
        this.light.intensity = this.ambientNightIntensity;
        this.moonLight.color.setHex(this.nightColor);
        this.sky.material.color.setHex(this.skyNightColor);
    }

/*    AnimateSpotLight(){
        var angle	= Date.now()/1000 * Math.PI;
// angle	= Math.PI*2
        this.spotLight.position.x	= Math.cos(angle*-0.1)*20;
        //this.spotLight.position.y	= 10 + Math.sin(angle*0.5)*6;
        this.spotLight.position.z	= Math.sin(angle*-0.1)*20;
        //this.spotLight.target(this.userPet);
    }*/

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
            this.throwBall.Hide();

            this.DayLight();
            // moet nog iets toegevoegd worden zodat je kan zien dat hij slaapt
        }
        else
        {
            this.userPet.asleep = false;
            this.isDag = true;
            this.NightLight();
        }
        if(!settings.ambMuted)
            this.ambient.Switch(this.isDag);

        this.PlaySound(audioSources.lightSwitch);
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
        this.PlaySound(audioSources.explosion);
        this.userPet.AddFood(1);
    }
    OnMouseObjectClick(e)
    {
        //CLICK
        this.userPet.headPoint2d = this.WorldToScreen(this.userPet.headPoint);
        e.detail.OnClick(e.detail);
        if(e.detail.uuid == this.userPet.uuid)
        {
            if(this.throwBall.isHidden && !this.hud.menuIsShown)
            {
                //easter egg
                if (this.userPet.name.toLowerCase() == "michael")
                {
                    this.PlaySound(audioSources.eggHatch);
                    this.userPet.AddToJoy(-10);
                }
                else
                {
                    this.PlaySound(audioSources.petClick);
                }
                //cheat
                if (this.userPet.name.toLowerCase() == "eduard")
                {
                    this.userPet.foodCount += 100;
                }
                else if (this.userPet.name.toLowerCase() == "kelly")
                {
                    this.userPet.AddToJoy(10);
                }
                else if (this.userPet.name.toLowerCase() == "sandra")
                {
                    this.userPet.AddToEnergy(10);

                }
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
        if(keyboard.GetKey('b'))
        {
            this.userPet.foodCount ++;
        }

    }
    OnAmbMute(e)
    {
        if(settings.ambMuted)
        {
            settings.ambMuted = false;
            this.ambient.Switch(this.isDag);
        }
        else
        {
            settings.ambMuted = true;
            this.ambient.Stop();
        }
        settings.Save();
    }
    OnEffectsMute(e)
    {
        if(settings.sfxMuted)
        {
            settings.sfxMuted = false;
        }
        else
        {
            settings.sfxMuted = true;
        }
        settings.Save();
    }
    OnBGMMute(e)
    {
        if(settings.bgmMuted)
        {
            settings.bgmMuted = false;
            this.bgmMixer.muted = settings.bgmMuted;
            this.bgmMixer.Shuffle();
        }
        else
        {
            settings.bgmMuted = true;
            this.bgmMixer.muted = settings.bgmMuted;
            this.bgmMixer.Stop();
        }
        settings.Save();
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
        if(settings.sfxMuted == false)
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
        qUtils.RemoveObjectFromArray(this.clickableObjects,this.userPet);

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