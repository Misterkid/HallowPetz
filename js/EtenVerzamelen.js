class EtenVerzamelen extends THREE.Mesh
{

    constructor(geometry, material)
    {
        super(geometry, material);
        this.OnPresentClick = new Event('onpresentclick');
    }
    OnClick(e)
    {
        this.OnPresentClick = new CustomEvent('onpresentclick', { 'detail': e });
        document.dispatchEvent(this.OnPresentClick);
    }
}
