/**
 * Created by quget on 24-10-16.
 */
class ThrowBall extends THREE.Mesh
{
    constructor()
    {
        var geomatry = new THREE.SphereGeometry(0.2,10);
        var material = new THREE.MeshBasicMaterial();
        material.depthWrite = false;
        material.depthTest = false;
        material.transparent = true;
        super(geomatry,material);
        this.renderOrder = 3;
        this.speedVector = new THREE.Vector3();
        this.velocity = new THREE.Vector3(0,0,0);
        //this.BallMesh = new THREE.Mesh(geomatry,material);
    }
    OnUpdate(e)
    {
        this.position.add(this.speedVector.copy(this.velocity).multiplyScalar(DeltaTime));
    }
    ToScreenPosition(camera)
    {
        var vector = new THREE.Vector3();

        var widthHalf = 0.5*1080;//renderer.context.canvas.width;
        var heightHalf = 0.5*720;//renderer.context.canvas.height;

        this.updateMatrixWorld();
        vector.setFromMatrixPosition(this.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;

        return {
            x: vector.x,
            y: vector.y
        };

    }
    OnCollisionUpdate(e,camera)
    {
        var screenPos = this.ToScreenPosition(camera);

        if(screenPos.x > 1080 - 2
            || screenPos.x < 0 + 2)
        {
           // console.log(screenPos);
            this.velocity.x *= -1;
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);

        }
        if(screenPos.y < 0 + 2
            || screenPos.y > 720 - 2)
        {
            //console.log(screenPos);
            this.velocity.y *= -1;
            this.position.set(this.position.x + this.velocity.x * DeltaTime,this.position.y + this.velocity.y * DeltaTime, this.position.z);
        }

    }
}