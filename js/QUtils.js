class QUtils
{
    constructor()
    {

    }
    DegToRad(deg)
    {
        return (deg * Math.PI) /180;
    }
    GetCookie(cookieName)
    {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++)
        {
            var c = ca[i];
            while (c.charAt(0) == ' ')
            {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0)
            {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    GetRandomBetweenInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    DeleteAllCookies()
    {
        var cookie = document.cookie.split(';');
        for (var i = 0; i < cookie.length; i++)
        {

            var chip = cookie[i],
                entry = chip.split("="),
                name = entry[0];

            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
    SetCookie(cookieName, cookieValue, exdays = 31)
    {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }
    DeleteCookie(name)
    {
        this.SetCookie(name,"",-1);
    }
    WriteHTML(someText,element)
    {
        var createdElement = document.createElement(element);
        createdElement.innerHTML = someText;
        return document.body.appendChild(createdElement);
    }
}
let qUtils = new QUtils();