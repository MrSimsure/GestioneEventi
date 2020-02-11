var verboseMode = true;

console.verbose = function(text)
{
    if (verboseMode == true) console.log(text)
}


require("./modules/database")
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
var fs  = require('fs');


var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use("/client", express.static(__dirname + "/client"));


app.get("/", function(req, res)  {  res.sendFile(__dirname + "/client/index.html");});   


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////UTENTI


//RICEVI IL NOME DI UN UTENTE DAL IL SUO ID
app.post('/getUserName', function(req, res)
{
    database.getUser(req.body.id, function(result)
    {
        res.send({
            name:result
        });
    })

    
});

//RICEVI IL NOME DI UN UTENTE DAL IL SUO ID
app.post('/disponibilitaSet', function(req, res)
{
    database.disponibilitaSet(req.body.userID, req.body.disponibilita, function(result)
    {
    })
});

//RICEVI IL NOME DI UN UTENTE DAL IL SUO ID
app.post('/disponibilitaGet', function(req, res)
{
    database.disponibilitaGet(req.body.userID, function(result)
    {
        res.send(
        {
            disponibilita : result
        });
    })
});

//QUANDO UN NUOVO UTENTE SI REGISTRA SALVA IL SUO NOME
app.post('/newUser', function(req, res)
{
    database.addProfile(req.body.id, req.body.name)
});

//
app.post('/userGetByCategory', function(req, res)
{
    let lista = []
    let listaID = []
    database.getMemberCategory(req.body.categoryID, function(resultID)
    {
        for(let i=0; i<resultID.length; i++)
        {
            lista.push({id:resultID[i].id})
            listaID.push(resultID[i].id)
        }
        
        database.getUsers(listaID, function(resultName)
        {
            for(let i=0; i<resultName.length; i++)
            {
                lista[i].name = resultName[i].name
            }

            res.send({
                names : lista
            });
        })
        
    })

    
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////INVITO

//QUANDO UN UTENTE SELEZIONA UN LINK DI INVITO MANDAGLI LA PAGINA SPECIALE
app.get('/invito', function(req, res)
{
    let evento = req.query.evento
    let categoria = req.query.categoria
    let mittente = req.query.mittente

    let data = fs.readFileSync(__dirname + '/client/index.html', "utf8");
    if(data)
        res.send(data.replace('window.invito = null','window.invito = {"evento":"'+evento+'","categoria":"'+categoria+'","mittente":"'+mittente+'"}'));
});

//QUANDO LA PAGINA SPECIALE DI INVITO VIENE APERTA E IL LOGIN EFFETTUATO MANDA AL SERVER LA RICHIESTA DI ACCETTAZIONE
app.post('/invitoSegna', function(req, res)
{
    database.addUser(req.body.id, req.body.name, req.body.category, req.body.event, req.body.invite)
});

app.post('/invitoAccetta', function(req, res)
{
    database.updateUser(req.body.userID, req.body.eventID, req.body.categoryID, function(ret)
    {
        res.send({error : "done"});
    })
});

app.post('/invitoRimuovi', function(req, res)
{
    database.removeUser(req.body.userID, req.body.eventID, req.body.categoryID, function(ret)
    {
        res.send({error : "done"});
    })
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NOTIFICHE E MESSAGGI

app.post('/notificheGet', function(req, res)
{
    database.notificheGetInvito(req.body.userID, req.body.eventID, function(ret)
    {
        res.send(
        {
            notifiche : ret
        });
    })

    
});

app.post('/notificheEvento', function(req, res)
{
    database.notificheGetEvento(req.body.eventID, function(ret)
    {
        res.send(
        {
            notifiche : ret
        });
    })
});

app.post('/notificheCategoria', function(req, res)
{
    database.notificheGetCategoria(req.body.categoryID, function(ret)
    {
        res.send(
        {
            notifiche : ret
        });
    })
});

app.post('/notificheUtente', function(req, res)
{
    database.notificheGetUser(req.body.userID, function(ret)
    {
        res.send(
        {
            notifiche : ret
        });
    })
});

app.post('/sendMessage', function(req, res)
{
    let response = database.sendMessage(req.body.id, req.body.name, req.body.subject, req.body.message, req.body.type, function()
    {
        res.send(
        {
            error : response
        });
    })
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////EVENTI

//RICEVI NUOVO EVENTO
app.post('/eventCreate', function(req, res)
{
    let response = database.eventCreate(req.body.id, req.body.name, req.body.startDate, req.body.endDate, function(eventID)
    {
        database.categoryCreate(eventID,"Organizzatori")
    })
    
    res.send(
    {
        error : response
    });
});

//ELIMINA EVENTO
app.post('/eventDelete', function(req, res)
{
    let response = database.eventDelete(req.body.eventID)

    res.send(
    {
        error : response
    });
});

//MODIFICA EVENTO
app.post('/eventEdit', function(req, res)
{
    let response = database.eventEdit(req.body.id, req.body.name ,req.body.startDate ,req.body.endDate, req.body.desc)

    res.send(
    {
        error : response
    });
});

//OTTIENI LISTA EVENTI DATO IL LORO CREATORE
app.post('/eventList', function(req, res)
{
    console.log("Get Events")
    let lista = [];
    
    database.eventGetByCreator(req.body.id, function(RESULT)
    {
        for(let i=0; i<RESULT.length; i++)
        {
            lista.push(RESULT[i])
        }

        database.eventGetByPartecipant(req.body.id, function(RESULT2)
        {
            for(let i=0; i<RESULT2.length; i++)
            {
                lista.push(RESULT2[i])
            }

            res.send(
            {
                eventList : lista
            });
        })
    })
});

//OTTIENI EVENTO DATO IL SUO ID
app.post('/eventGet', function(req, res)
{
    console.log("Get Events For = "+req.body.eventID)

    database.eventGet(req.body.eventID, function(RESULT)
    {
        res.send(
        {  
            name : RESULT.name,
            dateStart : RESULT.dateStart,
            dateEnd : RESULT.dateEnd,
            desc : RESULT.desc,
        });
    })

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CATEGORIE

//RICEVI RICHIESTA DI CREARE UNA NUOVA CATEGORIA
app.post('/categoryCreate', function(req, res)
{
    let response = database.categoryCreate(req.body.eventID,req.body.name)

    res.send(
    {
        error : response
    });
});

//RICEVI RICHIESTA DI CREARE UNA NUOVA CATEGORIA
app.post('/categoryEdit', function(req, res)
{
    let response = database.categoryEdit(req.body.categoryID,req.body.name)

    res.send(
    {
        error : response
    });
});

//RICEVI RICHIESTA DI CREARE UNA NUOVA CATEGORIA
app.post('/categoryDelete', function(req, res)
{
    let response = database.categoryDelete(req.body.categoryID)

    res.send(
    {
        error : response
    });
});

//PRENDI LE INFORMAZIONI SU TUTTE LE CATEGORIE
app.post('/categoryList', function(req, res)
{
    console.log("Get Category For ="+req.body.eventID)
    
    database.categoryList(req.body.eventID, function(RESULT)
    {
        res.send(
        {
            categoryList : RESULT
        });
    })
});


//PRENDI LE INFORMAZIONI SU TUTTE LE CATEGORIE
app.post('/categoryMyList', function(req, res)
{
    database.categoryGetByPartecipant(req.body.eventID, req.body.userID, function(RESULT)
    {
        res.send(
        {
            categoryList : RESULT
        });
    })
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 8200);
console.log("server started");