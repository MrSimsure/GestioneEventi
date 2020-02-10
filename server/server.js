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

/////////////////////////////////////////////////////////////////////////UTENTI

//RICEVI ID UTENTE
app.post('/userID', function(req, res)
{
    console.log(req.body.id)
});

//RICEVI ID UTENTE
app.post('/getUserName', function(req, res)
{
    database.getUser(req.body.id, function(result)
    {
        res.send({
            name:result
        });
    })

    
});

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
app.post('/segna', function(req, res)
{
    let respUser = database.updateUser(req.body.id, req.body.name, req.body.category, req.body.event, req.body.invite)

    res.send(
    {
        error : respUser
    });
});


app.post('/accetta', function(req, res)
{
    let respUser = database.addUser(req.body.id, req.body.evento, req.body.categoria, req.body.nome)
    let respMess = database.sendMessage(ID, message, receiver, type)

    res.send(
    {
        error : response
    });
});

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


app.post('/sendMessage', function(req, res)
{
    let response = database.addUser(req.body.id, req.body.messaggio, req.body.ricevitore, req.body.tipo)

    res.send(
    {
        error : response
    });
});


app.post('/newUser', function(req, res)
{
    let response1 = database.addUser(req.body.id, req.body.name)
    let response2 = database.addProfile(req.body.id, req.body.name)

    res.send(
    {
        error1 : response1,
        error2 : response2
    });
});

/////////////////////////////////////////////////////////////////////////EVENTI

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

/////////////////////////////////////////////////////////////////////////CATEGORIE

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

app.listen(process.env.PORT || 8200);
console.log("server started");