/**
 * Created by quget on 11-10-16.
 */
class Pet extends THREE.Mesh
{
    constructor(map,width,height,name = "no_name")
    {
        var geometry = new THREE.PlaneGeometry(width,height);
        var material = new THREE.MeshLambertMaterial();
        material.map = map;//this.loader.load("assets/textures/ghost_test.png");
        super(geometry,material);
        //Standard pet stuff here
        this.name = name;
    }
    Update(camera)
    {
        this.lookAt(camera.position);
    }
}