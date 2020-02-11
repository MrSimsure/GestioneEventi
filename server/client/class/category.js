class Categoria
{
    constructor(id, name, event)
    {
        this.id = id;
        this.name = name;
        this.event = event;

        this.userList = [];
        this.currUser = null;
        this.currUserId = -1;
    }


    getMessages(callback)
    {
        let obj = 
        {
            categoryID : this.id
        }

        httpPost("notificheCategoria", obj, function(ret)
        {
            let lista = ret.notifiche;
            callback(lista)         
            console.log(lista)
        })
    }

    selectUser(id)
    {
        this.currUserId = parseInt(id);
        this.currUser = this.userList[this.currUserId]
        pageNew("pageUser")
    }

    closeUser()
    {
        this.currUser = null;
        this.currUserId = -1;
    }

    getUsers(callback)
    {
        let obj =
        {
            categoryID : this.id
        }

        httpPost("userGetByCategory", obj, function(ret)
        {    
            let list = ret.names
            console.log(list)
            callback(list)
        })
    }

}