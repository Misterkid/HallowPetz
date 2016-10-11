class QUtils
{
    constructor()
    {

    }
    DegToRad(deg)
    {
        return (deg * Math.PI) /180;
    }
    WriteHTML(someText,element)
    {
        var createdElement = document.createElement(element);
        createdElement.innerHTML = someText;
        return document.body.appendChild(createdElement);
    }
}
let qUtils = new QUtils();