class Categoria
{
    constructor(id, name, evento)
    {
        this.id = id;
        this.name = name;
        this.evento = evento;
    }


    getCategories(callback)
    {
        let obj = 
        {
            id : this.id
        }

        httpPost("categoryList", obj, function(ret)
        {
            let catList = ret.categoryList;
            callback(catList)         
            console.log(catList)
        })
    }

    closeCategory()
    {
        eventManager.currEvent.currCategoryId = -1;
        eventManager.currEvent.currCategory = null;
    }
}