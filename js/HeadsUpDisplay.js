class HeadsUpDisplay
{
    //All the html hud stuff here!
    constructor()
    {
        this.hudDiv =  document.getElementsByClassName("hud")[0];
        this.funButton = document.getElementsByClassName("ball_btn")[0];
        this.sleepButton = document.getElementsByClassName("slapen")[0];
        this.eatButton = document.getElementsByClassName("eten1")[0];
        this.petNameLabel =  document.getElementsByClassName("pet_name")[0];

        this.emotionCloud = document.getElementsByClassName("emotion_cloud")[0];

        //bars
        this.hungerBar = document.getElementsByClassName("honger")[0];
        this.energyBar = document.getElementsByClassName("energie")[0];
        this.joyBar = document.getElementsByClassName("plezier")[0];

        //Grave
        this.grave = document.getElementsByClassName("grave")[0];
        //Count
        this.foodCount = document.getElementsByClassName("food_count")[0];

        this.sleepEmoticon = document.getElementsByClassName("sleep_emoticon")[0];
        this.sleepEmoticon.style.visibility = "hidden";
        //menu
        this.menuItems = document.getElementsByClassName("menu_obj");
        this.petRenameField = document.getElementsByClassName("pet_rename")[0];
        this.savePetButton = document.getElementsByClassName("save_pet")[0];
        this.resetPetButton = document.getElementsByClassName("test_reset")[0];
        this.muteSFXButton = document.getElementsByClassName("effects_mute")[0];
        this.muteBGMButton =  document.getElementsByClassName("bgm_mute")[0];
        this.muteAmbButton =  document.getElementsByClassName("ambient_mute")[0];
        this.fullScreenButton = document.getElementsByClassName("full_screen")[0];
        this.menuButton = document.getElementsByClassName("show_hide")[0];
    }
    OnUpdate(userPet)
    {
        this.petNameLabel.innerText = userPet.name;
        this.foodCount.innerText = userPet.foodCount;
        this.Createbarmeter(userPet);
        if(!userPet.isDead)
            this.Sleep(userPet);

        //Apperently from bottom with % works fine... ohhh okay
       // this.grave.style.top = (userPet.headPoint2d.y + 40) +  'px';
        this.grave.style.left = (userPet.headPoint2d.x - 50 )+ 'px';

    }
    Sleep(userPet)
    {

        this.sleepEmoticon.style.top = userPet.headPoint2d.y - this.sleepEmoticon.height + 'px';
        this.sleepEmoticon.style.left = userPet.headPoint2d.x + (this.sleepEmoticon.width /2) + 'px';
        if(userPet.asleep)
        {
            this.sleepEmoticon.style.visibility = "visible";
            this.eatButton.disabled = true;
            this.funButton.disabled = true;
        }
        else
        {
            this.sleepEmoticon.style.visibility = "hidden";
            this.eatButton.disabled = false;
            this.funButton.disabled = false;
        }

    }
    Dead(userPet)
    {
        this.grave.style.visibility = "visible";
        this.emotionCloud.style.visibility = "hidden";
        this.grave.innerHTML = "<p>" + userPet.name +  "</p>";
        this.eatButton.disabled = true;
        this.funButton.disabled = true;
        this.sleepButton.disabled = true;
    }
    Alive()
    {

        this.funButton.style.visibility = "visible";
        this.eatButton.style.visibility = "visible";
        this.sleepButton.style.visibility = "visible";
        this.grave.style.visibility = "hidden";
        this.eatButton.disabled = false;
        this.funButton.disabled = false;
        this.sleepButton.disabled = false;
    }
    ShowHideMenu(throwBall,userPet)
    {
       // var menuItems = document.getElementsByClassName("menu_obj");
        for(var i = 0; i < this.menuItems.length; i ++)
        {
            if( this.menuItems[i].style.visibility == "hidden")
            {
                this.menuItems[i].style.visibility = "visible";
               // this.throwBall.Hide();
                throwBall.Hide();
            }
            else
            {
                this.menuItems[i].style.visibility = "hidden";
            }
        }
        if(userPet.isDead)
        {
            this.petRenameField.style.visibility ="hidden";
        }
    }
    Createbarmeter(userPet)
    {
        //Saves a ton of performance when character is dead
        if(userPet.isDead)
            return;

        this.emotionCloud.style.visibility = "hidden";
        this.emotionCloud.style.top = userPet.headPoint2d.y - this.emotionCloud.height + 'px';
        this.emotionCloud.style.left = userPet.headPoint2d.x + (this.emotionCloud.width /2) + 'px';
        // honger
        if (Math.floor(userPet.hunger) < 101)
        {
            if (Math.floor(userPet.hunger) >= 95)
            {this.hungerBar.src = "assets/textures/100.png"}
            else if (Math.floor(userPet.hunger) >= 85 && Math.floor(userPet.hunger) < 95)
            {this.hungerBar.src = "assets/textures/90.png"}
            else if (Math.floor(userPet.hunger) >= 75 && Math.floor(userPet.hunger) < 85)
            {this.hungerBar.src = "assets/textures/80.png"}
            else if (Math.floor(userPet.hunger) >= 65 && Math.floor(userPet.hunger) < 75)
            {this.hungerBar.src = "assets/textures/70.png"}
            else if (Math.floor(userPet.hunger) >= 55 && Math.floor(userPet.hunger) < 65)
            {this.hungerBar.src = "assets/textures/60.png"}
            else if (Math.floor(userPet.hunger) >= 45 && Math.floor(userPet.hunger) < 55)
            {this.hungerBar.src = "assets/textures/50.png"}
            else  if (Math.floor(userPet.hunger) >= 35 && Math.floor(userPet.hunger) < 45)
            {this.hungerBar.src = "assets/textures/40.png"}
            else if (Math.floor(userPet.hunger) >= 25 && Math.floor(userPet.hunger) < 35)
            {this.hungerBar.src = "assets/textures/30.png"}
            else if (Math.floor(userPet.hunger) >= 15 && Math.floor(userPet.hunger) < 25)
            {this.hungerBar.src = "assets/textures/20.png"}
            else if (Math.floor(userPet.hunger) >= 5 && Math.floor(userPet.hunger) < 15)
            {this.hungerBar.src = "assets/textures/10.png"
                // document.getElementsByClassName("honger1")[0].style.visibility = "visible";}
                ,this.emotionCloud.src = "assets/textures/honger.png"
                ,this.emotionCloud.style.visibility = "visible";}
            else if (Math.floor(userPet.hunger) <5)
            {this.hungerBar.src = "assets/textures/0.png"
                //document.getElementsByClassName("honger1")[0].style.visibility = "visible";}
                ,this.emotionCloud.src = "assets/textures/honger.png"
                ,this.emotionCloud.style.visibility = "visible";}
        }

        //energie
        if (Math.floor(userPet.energy) < 101)
        {
            if (Math.floor(userPet.energy) >= 95)
            {this.energyBar.src = "assets/textures/100.png"}
            else if (Math.floor(userPet.energy) >= 85 && Math.floor(userPet.energy) < 95)
            {this.energyBar.src = "assets/textures/90.png"}
            else if (Math.floor(userPet.energy) >= 75 && Math.floor(userPet.energy) < 85)
            {this.energyBar.src = "assets/textures/80.png"}
            else if (Math.floor(userPet.energy) >= 65 && Math.floor(userPet.energy) < 75)
            {this.energyBar.src = "assets/textures/70.png"}
            else if (Math.floor(userPet.energy) >= 55 && Math.floor(userPet.energy) < 65)
            {this.energyBar.src = "assets/textures/60.png"}
            else if (Math.floor(userPet.energy) >= 45 && Math.floor(userPet.energy) < 55)
            {this.energyBar.src = "assets/textures/50.png"}
            else if (Math.floor(userPet.energy) >= 35 && Math.floor(userPet.energy) < 45)
            {this.energyBar.src = "assets/textures/40.png"}
            else if (Math.floor(userPet.energy) >= 25 && Math.floor(userPet.energy) < 35)
            {this.energyBar.src = "assets/textures/30.png"}
            else if (Math.floor(userPet.energy) >= 15 && Math.floor(userPet.energy) < 25)
            {this.energyBar.src = "assets/textures/20.png"}
            else if (Math.floor(userPet.energy) >= 5 && Math.floor(userPet.energy) < 15)
            {this.energyBar.src = "assets/textures/10.png"
                //document.getElementsByClassName("energie1")[0].style.visibility = "visible";}
                ,this.emotionCloud.src = "assets/textures/slapen.png"
                ,this.emotionCloud.style.visibility = "visible";}
            else if (Math.floor(userPet.energy) <5)
            {this.energyBar.src = "assets/textures/0.png"
                //document.getElementsByClassName("energie1")[0].style.visibility = "visible";}
                ,this.emotionCloud.src = "assets/textures/slapen.png"
                ,this.emotionCloud.style.visibility = "visible";}
        }

        // plezier
        if (Math.floor(userPet.joy) < 101)
        {
            if (Math.floor(userPet.joy) > 95)
            {this.joyBar.src = "assets/textures/100.png"}
            else if (Math.floor(userPet.joy) >= 85 && Math.floor(userPet.joy) < 95)
            {this.joyBar.src = "assets/textures/90.png"}
            else if (Math.floor(userPet.joy) >= 75 && Math.floor(userPet.joy) < 85)
            {this.joyBar.src = "assets/textures/80.png"}
            else if (Math.floor(userPet.joy) >= 65 && Math.floor(userPet.joy) < 75)
            {this.joyBar.src = "assets/textures/70.png"}
            else if (Math.floor(userPet.joy) >= 55 && Math.floor(userPet.joy) < 65)
            {this.joyBar.src = "assets/textures/60.png"}
            else if (Math.floor(userPet.joy) >= 45 && Math.floor(userPet.joy) < 55)
            {this.joyBar.src = "assets/textures/50.png"}
            else if (Math.floor(userPet.joy) >= 35 && Math.floor(userPet.joy) < 45)
            {this.joyBar.src = "assets/textures/40.png"}
            else if (Math.floor(userPet.joy) >= 25 && Math.floor(userPet.joy) < 35)
            {this.joyBar.src = "assets/textures/30.png"}
            else if (Math.floor(userPet.joy) >= 15 && Math.floor(userPet.joy) < 25)
            {this.joyBar.src = "assets/textures/20.png"}
            else if (Math.floor(userPet.joy) >= 5 && Math.floor(userPet.joy) < 15)
            {this.joyBar.src = "assets/textures/10.png"
                //document.getElementsByClassName("plezier1")[0].style.visibility = "visible";}
                ,this.emotionCloud.src = "assets/textures/plezier.png"
                ,this.emotionCloud.style.visibility = "visible";}
            else if (Math.floor(userPet.joy) <5)
            {this.joyBar.src = "assets/textures/0.png"
                //document.getElementsByClassName("plezier1")[0].style.visibility = "visible";}
                ,this.emotionCloud.src = "assets/textures/plezier.png"
                ,this.emotionCloud.style.visibility = "visible";}
        }
    }
}