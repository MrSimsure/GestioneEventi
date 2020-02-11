class ComunicationManager
{
    constructor()
    {
        this.sendType = null;
        this.sendTo = null;
    }


    loadNotifiche(callback)
    {
        let obj = 
        {
            eventID : eventManager.currEvent.id,
            userID  : profilo.id
        }

        httpPost("notificheGet", obj, function(ret)
        {
            callback(ret)         
        })
    }

    invitoAccetta(dom, callback)
    {
        let obj = 
        {
            userID      : dom.parentElement.getAttribute("data-id"),
            eventID     : dom.parentElement.getAttribute("data-event"),
            categoryID  : dom.parentElement.getAttribute("data-category"),
        }

        httpPost("invitoAccetta", obj, function()
        {
            callback(dom)
        })
    }


    invitoRifiuta(dom, callback)
    {
        let obj = 
        {
            userID      : dom.parentElement.getAttribute("data-id"),
            eventID     : dom.parentElement.getAttribute("data-event"),
            categoryID  : dom.parentElement.getAttribute("data-category"),
        }

        httpPost("invitoRimuovi", obj, function()
        {
            callback(dom)
        })
    }
    
}


msgType = 
{
    event    : 0,
    category : 1,
    user     : 2,
}