class Mouse
{
    constructor()
    {
        this.position = new THREE.Vector2(0,0);
        this.caster = new THREE.Raycaster();
        //this.camera = camera;
        this.isDown = false;
        this.wentUp = false;
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.Init();

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
        this.position.x = (e.clientX / this.canvas.width) * 2 -1;
        this.position.y = -(e.clientY / this.canvas.height) * 2 +1;
    }
    OnMouseUp(e)
    {
        this.wentUp = true;
    }
    OnMouseDown(e)
    {
        this.wentUp = false;
    }
    OnMouseRayUpdate(objects,camera)
    {
        //Raycast fun!
        this.caster.setFromCamera( this.position, camera );
        var collisions = this.caster.intersectObjects( objects );
        if(collisions[0] != null)
        {
            if(this.wentUp == true)
            {
                this.OnMouseObjectClick = new CustomEvent('onmouseobjectclick', { 'detail': collisions[0].object });
                document.dispatchEvent(this.OnMouseObjectClick);
            }
        }
        this.wentUp = false;
    }
}
//let mouse = new Mouse();
