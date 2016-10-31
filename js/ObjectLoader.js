class ObjectLoader
{
    constructor()
    {
        this.manager = new THREE.LoadingManager();
        this.tLoader = new THREE.ImageLoader( this.manager );

        this.oLoader = new THREE.OBJLoader( this.manager );
    }
    //Import Object
    ImportObject(objectPath, texturePath, pos, scale, rotate)
    {
        console.log(pos);
        var texture = new THREE.Texture();
        this.tLoader.load(texturePath, function ( image ) {
            //console.log(image);
            texture.image = image;
            texture.needsUpdate = true;

        } );

        console.log(texture);
        console.log(objectPath);
        console.log(texturePath);

        this.oLoader.load(objectPath ,(object)=>{this.OnObjectLoad(object, texture, pos, scale, rotate);});
    }

    OnObjectLoad(object, texture, pos, scale, rotate)
    {
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

               child.material.map = texture;
            }
        } );
        console.log(scale);
        console.log(pos);
        object.scale.set(scale.x,scale.y,scale.z);

        object.position.set(pos.x, pos.y, pos.z);
        if(typeof rotate !== "undefined"){
            object.rotateX(rotate.x);
            object.rotateY(rotate.y);
            object.rotateZ(rotate.z);
        }
        console.log(object);
        this.OnObjectLoadDone = new CustomEvent('onobjectloaddone', {'detail': object });
        document.dispatchEvent(this.OnObjectLoadDone);
    }
}