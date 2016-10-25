/**
 * Created by quget on 24-10-16.
 */
class MiniGame
{
    constructor()
    {
        //img.style.left = xPos + document.body.scrollLeft;
        //img.style.top = yPos + document.body.scrollTop;
        var createdElement = document.createElement('img');
        createdElement.src = 'assets/textures/ball.png';
        createdElement.className = "miniball";
        this.speed = 100;
        this.img = document.body.appendChild(createdElement);
        this.position = new THREE.Vector3((1280 - 30) * 0.5,(720 - 30) * 0.5,0);
        this.speedVector = new THREE.Vector3();
        this.velocity = new THREE.Vector3(0,0,0);

        this.img.style.left = this.position.x;
        this.img.style.top = this.position.y;
        this.img.style.position = "absolute";
        this.img.style.zIndex = "10";
        this.img.onclick = ()=>{this.OnClick();}
    }
    OnClick()
    {
        var xRand = qUtils.GetRandomBetweenInt(-this.speed,this.speed);
        var yRand = qUtils.GetRandomBetweenInt(-this.speed,this.speed);
        this.velocity = new THREE.Vector3(xRand * 25,yRand * 25,0);
    }
    OnUpdate(e)
    {
        this.velocity.multiplyScalar(0.99);
        if(this.velocity.length() < 2)
        {
            this.velocity.set(0,0,0);//stop
        }
        this.position.add(this.speedVector.copy(this.velocity).multiplyScalar(DeltaTime));
        this.img.style.left = this.position.x +"px";
        this.img.style.top = this.position.y + "px";

        if(this.position.x > 1280 - 30
            || this.position.x < 0)
        {
            this.velocity.x *= -1;
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);

        }
        if(this.position.y < 0
            || this.position.y > 720 - 30)
        {
            this.velocity.y *= -1;
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);
        }
    }
}