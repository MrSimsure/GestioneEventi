class ComunicationManager
{
    constructor()
    {
        this.notifiche = [];
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
    
}