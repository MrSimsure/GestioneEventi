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
    }


    getCategories(callback)
    {
        let obj = 
        {
            id : this.id
        }

        comunicationManager.httpPost("categoryList", obj, function(ret)
        {
            let catList = ret.categoryList;
            callback(catList)         
            console.log(catList)
        })
    }

    newCategory(ct)
    {
        let newCat = new Categoria(ct.id, ct.name, ct.evento);
        this.categoryList.push(newCat); 
    }

    selectCategory(id)
    {console.log(id)
        this.currCategoryId = parseInt(id);
        this.currCategory = this.categoryList[this.currCategoryId]
        pageNew("pageCategory")
    }

    closeEvent()
    {
        eventManager.currEventId = -1;
        eventManager.currEvent = null;
    }
}