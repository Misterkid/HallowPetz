/**
 * Created by quget on 11-10-16.
 */
class Pet extends THREE.Mesh
{
    constructor(map,width,height)
    {


        var geometry = new THREE.PlaneGeometry(width,height);
        var material = new THREE.MeshLambertMaterial();
        material.map = map;//this.loader.load("assets/textures/ghost_test.png");
        super(geometry,material);
        //Standard pet stuff here
    }
    Update(camera)
    {
        this.lookAt(camera.position);
    }
}