class ObjectLoader
{
    constructor()
    {
        this.manager = new THREE.LoadingManager();
        this.tLoader = new THREE.ImageLoader( this.manager );
        this.loadedObjects = {};

        this.oLoader = new THREE.OBJLoader( this.manager );
    }
    //Import Object
    ImportObject(objectPath, texturePath, pos, scale, rotate)
    {
        //console.log(pos);
        var cloned = this.GetObjectClone(objectPath);
        if(cloned != null)
        {
            this.SetObjectVars(cloned,pos,scale,rotate);

            this.OnObjectLoadDone = new CustomEvent('onobjectloaddone', {'detail': cloned });
            document.dispatchEvent(this.OnObjectLoadDone);
            return;
        }

        var texture = new THREE.Texture();
         {
            this.tLoader.load(texturePath, function (image) {
                //console.log(image);
                texture.image = image;
                texture.needsUpdate = true;

            });
        }

       /* console.log(texture);
        console.log(objectPath);
        console.log(texturePath);*/

        this.oLoader.load(objectPath ,(object)=>{this.OnObjectLoad(object, texture, pos, scale, rotate,objectPath);});
    }
    SetObject(path,object)
    {;
        this.loadedObjects[path] = object;
    }
    GetObjectClone(path)
    {
        var object = this.loadedObjects[path];
        if(object == null)
        {
            return null;
        }
        return object.clone();
    }
    SetObjectVars(object,pos, scale, rotate)
    {
        object.scale.set(scale.x,scale.y,scale.z);
        object.castShadow = true;
        object.position.set(pos.x, pos.y, pos.z);
        if(typeof rotate !== "undefined"){
            object.rotateX(rotate.x);
            object.rotateY(rotate.y);
            object.rotateZ(rotate.z);
        }
    }
    OnObjectLoad(object, texture, pos, scale, rotate,objectPath)
    {
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

               child.material.map = texture;
               child.castShadow = true;

            }
        } );
        /*console.log(scale);
        console.log(pos);*/
/*
        object.scale.set(scale.x,scale.y,scale.z);
        object.castShadow = true;
        object.position.set(pos.x, pos.y, pos.z);
        if(typeof rotate !== "undefined"){
            object.rotateX(rotate.x);
            object.rotateY(rotate.y);
            object.rotateZ(rotate.z);
        }
*/
        this.SetObjectVars(object,pos,scale,rotate);

        this.SetObject(objectPath,object);
        this.OnObjectLoadDone = new CustomEvent('onobjectloaddone', {'detail': object });
        document.dispatchEvent(this.OnObjectLoadDone);
    }
}