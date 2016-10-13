/**
 * Created by quget on 13-9-16.
 */
let DeltaTime = 0;
class SceneRenderer
{
    constructor()
    {
        this.OnRenderEvent = new Event('onrenderupdate');// on render update event
        this.OnCollisionUpdateEvent = new Event('oncollisionupdate');// on render update event
        this.clock = new THREE.Clock();
        this.deltaCurrent = 0;
        this.maxDeltaAdd = 60;
        this.avgDelta = 1/30;
        this.deltaTimes = new Array();

    }

    //Creates scene with camera and renderer! full browser size
    CreateScene()
    {
        this.scene = new THREE.Scene();
        //var aspect = window.innerWidth / window.innerHeight;
        var aspect = 1280 / 720;
        this.camera = new THREE.PerspectiveCamera(75,aspect,0.1,1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.antialias = true;
        //Shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.soft = true;
        this.renderer.shadowMap.CullFrontFaces = false;
        this.renderer.shadowMap.bias = 0.0039;
        this.renderer.shadowMap.darkness = 0.5;
        this.renderer.shadowMap.width = 1024;
        this.renderer.shadowMap.height = 1024;
        //end shadows
        this.renderer.setSize(window.innerWidth ,window.innerHeight);
        this.renderer.setClearColor(0x000000);
        document.body.appendChild(this.renderer.domElement);
        //Camera position
    }
    Render(e)
    {
        DeltaTime = this.clock.getDelta();

        if(DeltaTime > (this.avgDelta * 2))
        {
            DeltaTime = 0;
        }

       // this.CalcAvgDelta();
        //ToDo find a better way?  well it works like events :P
        document.dispatchEvent(this.OnRenderEvent);//Send update event to main class.
        document.dispatchEvent(this.OnCollisionUpdateEvent);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame((e) => {this.Render(e)});

    }
    CalcAvgDelta()
    {
        if(this.deltaCurrent >= this.maxDeltaAdd)
            this.deltaCurrent = 0;

        this.deltaTimes[this.deltaCurrent] = DeltaTime;
        this.deltaCurrent ++;

        var total = 0;
        for(var i = 0; i < this.deltaTimes.length; i++)
        {
            total += this.deltaTimes[i];
        }
        if(this.deltaTimes.length == 60)
            this.avgDelta = total / this.deltaTimes.length;
    }
    AddObject(object)
    {
        this.scene.add(object);
    }
    RemoveObject(object)
    {
        this.scene.remove(object);
    }
}
