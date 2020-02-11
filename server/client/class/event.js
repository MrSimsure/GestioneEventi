class Evento
{
    constructor(id, name, creator, dateStart, dateEnd, desc)
    {
        this.id = id;
        this.name = name;
        this.creator = creator;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.desc = desc;
        
        this.categoryList = [];
        this.currCategoryId = -1;
        this.currCategory = null;

        this.configuratore = false;
        this.organizzatore = false;
        
        if(this.creator == profilo.id)
        {
            this.configuratore = true;
        }
    }


    getMessages(callback)
    {
        let obj = 
        {
            eventID : this.id
        }

        httpPost("notificheEvento", obj, function(ret)
        {
            let lista = ret.notifiche;
            callback(lista)         
            console.log(lista)
        })
    }

    getCategories(callback)
    {
        //if(this.configuratore == true)
        //{
            let obj = 
            {
                eventID : this.id
            }
            httpPost("categoryList", obj, function(ret)
            {
                let catList = ret.categoryList;
                callback(catList)         
                console.log(catList)
            })
        /*
        }
        else
        {
            let obj = 
            {
                eventID : this.id,
                userID  : profilo.id
            }
            httpPost("categoryMyList", obj, function(ret)
            {
                let catList = ret.categoryList;
                callback(catList)         
                console.log(catList)
            })
        }
        */
        
    }

    newCategory(ct)
    {
        let newCat = new Categoria(ct.id, ct.name, ct.evento);
        this.categoryList.push(newCat); 
    }

    selectCategory(id)
    {
        this.currCategoryId = parseInt(id);
        this.currCategory = this.categoryList[this.currCategoryId]
        pageNew("pageCategory")
    }

    closeEvent()
    {
        eventManager.currEventId = -1;
        eventManager.currEvent = null;
    }

    reload(callback)
    {
        $("#listaCategorie").empty()
        this.categoryList = [];
        this.currCategory = null;
        pageGet("pageEvent").loadCategorie(function()
        {
            eventManager.currEvent.currCategory = eventManager.currEvent.categoryList[eventManager.currEvent.currCategoryId];
            callback()
        })
    }
}