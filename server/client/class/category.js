class Categoria
{
    constructor(id, name, event)
    {
        this.id = id;
        this.name = name;
        this.event = event;

        this.userList = [];
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