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

    disponibilitaSet = function()
    {
        let disp = 0;
        if(document.querySelector("#switchDisponibile").querySelector("input").checked == true)
        {disp = 1}else{disp = 0}

        let obj = 
        {
            userID          : profilo.id,
            disponibilita   : disp,
        }

        httpPost("disponibilitaSet", obj, function()
        {
        })
    }
}
