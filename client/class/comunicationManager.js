class ComunicationManager
{
    constructor()
    {
        this.UrlMain = "http://127.0.0.1:8200/"

    }


    httpGet(url, callback)
    {
        var request = new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if (request.readyState==4 && request.status==200)
            {
                if(callback != undefined)
                {
                    callback(JSON.parse(request.response));
                }
            }
        }
        request.open("GET", this.UrlMain+url, true);
        request.send();
    }


    httpPost(url, data, callback)
    {
        var request = new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if (request.readyState==4 && request.status==200)
            {
                if(callback != undefined)
                {
                    callback(JSON.parse(request.response));
                }
            }
        }
        request.open("POST", this.UrlMain+url, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send( $.param(data) );
    }
}