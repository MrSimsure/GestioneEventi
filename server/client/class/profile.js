class Profilo
{
    constructor(name, id)
    {
        this.name = name;
        this.id = id;
    }

    getMessages(callback)
    {
        let obj = 
        {
            userID : this.id
        }

        httpPost("notificheUtente", obj, function(ret)
        {
            let lista = ret.notifiche;
            callback(lista)         
            console.log(lista)
        })
    }
}
