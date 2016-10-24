class Mouse
{
    constructor(camera)
    {
        this.position = new THREE.Vector2(0,0);
        this.caster = new THREE.Raycaster();
        this.camera = camera;
        this.isDown = false;
        this.wentUp = false;

    }
    Init()
    {
        document.addEventListener('mousemove', (e)=>
        {
            this.OnMouseMove(e);
        }, false);

        document.addEventListener('mousedown', (e)=>
        {
            this.OnMouseDown(e);
        }, false);
        document.addEventListener('touchstart', (e)=>
        {
            this.OnMouseDown(e);
        }, false);//Mobile support

        document.addEventListener("mouseup", (e)=>
        {
            this.OnMouseUp(e);
        }, false);
        document.addEventListener("touchend", (e)=>
        {
            this.OnMouseUp(e);
        }, false);//Mobile support;

    }
    OnMouseMove(e)
    {
        e.preventDefault();
        this.position.x = (e.clientX / window.innerWidth) * 2 -1;
        this.position.y = -(e.clientY / window.innerHeight) * 2 +1;


    }
    OnMouseUp(e)
    {
        this.isDown = false;
        this.wentUp = true;
    }
    OnMouseDown(e)
    {
        this.isDown = true;
        this.wentUp = false;
    }
    OnMouseRayUpdate(objects,camera)
    {
        //Raycast fun!
        this.caster.setFromCamera( this.position, camera );
        var collisions = this.caster.intersectObjects( objects );
        if(collisions[0] != null)
        {
        
        }
    }
}
