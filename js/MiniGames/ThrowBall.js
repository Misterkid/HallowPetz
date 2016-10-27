/**
 * Created by quget on 24-10-16.
 */
class ThrowBall
{
    constructor(gameContainer)
    {
        //img.style.left = xPos + document.body.scrollLeft;
        //img.style.top = yPos + document.body.scrollTop;
        var createdElement = document.createElement('img');
        createdElement.src = 'assets/textures/ball.png';
        createdElement.className = "miniball";
        this.speed = 100;
       // this.gameContainer
        this.img = gameContainer.appendChild(createdElement);//document.body.appendChild(createdElement);

        this.OnBallMoving = new Event('onballmoving');
        this.OnBallHitWall = new Event('onballhitwall');

        //document.getElementsByTagName('canvas')[0].width;
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.position = new THREE.Vector3((this.canvas.width - 30) * 0.5,(this.canvas.height - 30) * 0.5,0);
        this.speedVector = new THREE.Vector3();
        this.velocity = new THREE.Vector3(0,0,0);

        this.size = 64;
        this.img.style.width = this.size + "px";

        this.img.style.left = this.position.x;
        this.img.style.top = this.position.y;
        this.img.style.position = "absolute";
        this.img.style.zIndex = "10";
        this.img.onclick = ()=>{this.OnClick();}
        this.isHidden = true;
        this.img.style.visibility = "hidden";

    }
    Show()
    {
        this.isHidden = false;
        this.img.style.visibility = "visible";
        console.log(this.canvas);
    }
    Hide()
    {
        this.isHidden = true;
        this.img.style.visibility = "hidden";
        this.velocity.set(0,0,0);
        this.position = new THREE.Vector3((this.canvas.width - this.size) * 0.5,(this.canvas.height - this.size) * 0.5,0);
    }
    OnClick()
    {
        var xRand = qUtils.GetRandomBetweenInt(-this.speed,this.speed);
        var yRand = qUtils.GetRandomBetweenInt(-this.speed,this.speed);
        this.velocity = new THREE.Vector3(xRand * 25,yRand * 25,0);
    }
    OnUpdate(e)
    {
        if(this.isHidden)
            return;

        this.velocity.multiplyScalar(0.99);
        if(this.velocity.length() < 20)
        {
            this.velocity.set(0,0,0);//stop
        }
        else
        {
            //In beweging
            //Send event to main
            document.dispatchEvent(this.OnBallMoving);

        }
        this.position.add(this.speedVector.copy(this.velocity).multiplyScalar(DeltaTime));
        this.img.style.left = this.position.x +"px";
        this.img.style.top = this.position.y + "px";

        if(this.position.x > this.canvas.width - this.size
            || this.position.x < 0)
        {
            this.velocity.x *= -1;
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);
            document.dispatchEvent(this.OnBallHitWall);
        }
        if(this.position.y < 0
            || this.position.y > this.canvas.height - this.size)
        {
            this.velocity.y *= -1;
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);
            document.dispatchEvent(this.OnBallHitWall);
        }
    }
}