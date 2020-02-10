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
            id : profilo.id
        }

        httpPost("eventList", obj, function(ret)
        {
            let evList = ret.eventList;
            callback(evList)         
            console.log(ret)
        })
    }


    creaEvento(ev)
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
        $("#listaEventi").empty()
        this.eventList = [];
        this.currEvent = null;
        pageGet("pageHome").loadEventi(function()
        {
            eventManager.currEvent = eventManager.eventList[eventManager.currEventId];
            callback()
        })
    }

}