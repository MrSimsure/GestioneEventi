class EventManager
{
    constructor()
    {
        this.eventList = [];
        this.currEventId = -1;
        this.currEvent = null;

        this.editing = false;
    }


    getEvents(callback)
    {
        let obj = 
        {
            id : firebase.auth().currentUser.uid
        }

        comunicationManager.httpPost("eventList", obj, function(ret)
        {
            let evList = ret.eventList;
            callback(evList)         
            console.log(ret)
        })
    }


    newEvent(ev)
    {
        let newEv = new Evento(ev.id, ev.name, ev.creator, ev.dateStart, ev.dateEnd, ev.description);
        this.eventList.push(newEv); 
    }


    selectEvent(id)
    {
        this.currEventId = parseInt(id);
        this.currEvent = this.eventList[this.currEventId]
        pageNew("pageEvent")
    }

    closeEvent()
    {
        this.currEvent
        this.currEventId = -1;
        this.currEvent = null;
    }

    logout()
    {
        this.eventList = [];
        this.currEventId = -1;
        this.currEvent = null;
    }

    reload(callback)
    {
        this.eventList = [];
        this.currEvent = null;
        pageGet("pageHome").loadEventi(function()
        {
            eventManager.currEvent = eventManager.eventList[eventManager.currEventId];
            callback()
        })
    }

}