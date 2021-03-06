
database  = {}

database.mysql = require('mysql');

database.con = database.mysql.createConnection({
    host: "den1.mysql2.gear.host",
    user: "varnellidb",
    password: "Ko26rmB_5hk-",
    database: "varnellidb"
});

/*
database.mysql = require('mysql2');
database.con = database.mysql.createConnection({
    host: "raspyexaequo.duckdns.org",
    user: "varnelliUser",
    password: "varnelliPass",
    database: "varnelliDB",
    port: 3306
});
*/

database.checkConnection = function()
{
        database.con.connect(function(err) 
        {
            if (err) {console.log("DB non accessibile"); return;}
            else console.verbose("Accesso al DB riuscito");
        });
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////EVENTI

//CREA UN NUOVO EVENTO
database.eventCreate = function(creatorID,name,dateStart,dateEnd, callback)
{
            sql = "INSERT INTO events(name,creator,dateStart,dateEnd) VALUES ('"+name+"','"+creatorID+"','"+dateStart+"','"+dateEnd+"');"
            console.verbose("Stringa inviata: " + sql);

            database.con.query(sql, function (err)
            {
            if (err) {console.log(err); return err;}
            else{

                console.log("Evento inserito");

                sql = "SELECT id FROM varnellidb.events WHERE creator = '"+creatorID+"' AND name Like '"+name+"';";
                console.verbose("Stringa inviata: " + sql);
        
                database.con.query(sql, function (err, result) 
                {
                if (err) {console.log(err); return err;}
                else 
                {
                    console.log("ID evento creato: " + result[0].id);
                    callback(result[0].id)
                    
                    sql = "INSERT INTO organizators(userID,event) VALUES ('"+creatorID+"','"+result[0].id+"');"
                    console.verbose("Stringa inviata: " + sql);
        
                    database.con.query(sql, function (err) 
                    {
                        if (err) {console.log(err); return err;}
                        else
                        {
                            return result[0].id;}
                        });
                }});
            }});
}
                    
//TORNA IL CREATORE DI UN EVENTO DATO IL SUO ID
database.eventGetUser = function(eventID, callback)
{
        sql = "SELECT creator FROM varnellidb.events WHERE id = "+eventID+";"
        console.verbose("Stringa inviata: " + sql);

        database.con.query(sql, function (err, result) 
        {
            if (err) {console.log("Evento non esistente"); return;}
            else 
            {
                console.log("Result: " + result[0].creator); 
                callback(result[0].creator)
                return ;
            }
        });
}

//TROVA UN EVENTO DATO IL SUO ID
database.eventGetById = function(eventID, callback)
{
        let sql = "SELECT * FROM varnellidb.events";
        if(Array.isArray(eventID) == true )
        {
            sql += " WHERE id = "
            for(let i=0; i<eventID.length; i++)
            {
                sql += "'"+eventID[i]+"'";
                if(i != eventID.length-1)
                {
                    sql += "or id ="
                }
                else
                {
                    sql +=";"
                }
            }  
            console.log(sql)
        }
        else
        {
            sql = "SELECT * FROM varnellidb.events WHERE id = '"+eventID+"';";
        }
        
        console.verbose("Stringa inviata: " + sql);

        database.con.query(sql, function (err, result) 
        {
            if (err) {console.log("Nessun evento trovato\n"+err); return;}
            else 
            {
                console.log("Result: " + result); 
                callback(result)
                return result;
            }
        });
}

//TROVA UN EVENTO DATO L'ID DEL SUO CREATORE
database.eventGetByCreator = function(userID, callback)
{
        sql = "SELECT * FROM varnellidb.events WHERE creator = '"+userID+"';";
        console.verbose("Stringa inviata: " + sql);
        let eventList = [];

        database.con.query(sql, function (err, result) 
        {
            if (err) {console.log("Nessun evento trovato\n"+err); return;}
            else 
            {
                callback(result)
                return result; 
            }
        });
}

//TROVA UN EVENTO DATO L'ID DEL SUO CREATORE
database.eventGetByPartecipant = function(userID, callback)
{
        sql = "SELECT * FROM varnellidb.users WHERE id = '"+userID+"'  and invite is null;";
        console.verbose("Stringa inviata: " + sql);

        database.con.query(sql, function (err, result) 
        {
            if (err) {console.log("Nessun evento trovato\n"+err); return;}
            else 
            {
                let listaId = [];
                for(let i=0; i<result.length; i++)
                {
                    listaId.push(result[i].event)
                }

                database.eventGetById(listaId, function(result2)
                {
                    callback(result2)
                })
                
            }
        });
}

//TORNA LE INFO DI UNA CATEGORIA DATO IL SUO ID
database.categoryGet = function(categoryID, callback)
{
        sql = "SELECT * FROM varnellidb.category WHERE id = "+categoryID+";";
        console.verbose("Stringa inviata: " + sql);

        database.con.query(sql, function (err, result) 
        {
            if (err) {console.log("Nessuna categoria trovata\n"+err); return;}
            else 
            {
                console.log("Result: " + result); 
                callback(result)
                return result;
            }
        });
}

//MODIFICA UN EVENTO DATO IL SUO ID
database.eventEdit = function(eventID,name,dateStart,dateEnd){

    sql = "UPDATE events SET name='"+name+"',dateStart='"+dateStart+"',dateEnd='"+dateEnd+"' WHERE id = '"+eventID+"';";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err)
    {
        if (err) {console.log("Impossibile modificare l'evento"); return;}
        else
        {
            return;
        }    
    });
}

//ELIMINA UN EVENTO
database.eventDelete = function(eventID){

    sql = "DELETE FROM events WHERE id = '"+eventID+"'";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err)
    {if (err) {console.log("Impossibile eliminare l'evento"); return;}
    else
    {
        return;
    }
        
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CATEGORIE

//CREA UNA NUOVA CATEGORIA
database.categoryCreate = function(eventID,name)
{
    sql = "INSERT INTO category(event,name) VALUES ("+eventID+",'"+name+"')";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err)
    {
        if (err) {console.log("Evento non esistente o categoria già presente"); return;}
        else
        { 
            console.verbose("Categoria inserita");

            sql = "SELECT id FROM varnellidb.category WHERE event = "+eventID+" AND name Like "+name+";";
            console.verbose("Stringa inviata: " + sql);

            database.con.query(sql, function (err, result) 
            {
                if (err) {console.log("Categoria non creata"); return;}
                else 
                {
                    console.log("ID categoria: " + result[0].id); 
                    return result[0].id;
                }
            });
        }

    });
}

//TROVA TUTTE LE CATEGORIE DATO L'ID DI UN EVENTO
database.categoryList = function(eventID,callback)
{
        sql = "SELECT * FROM varnellidb.category WHERE event = "+eventID+";";
        console.verbose("Stringa inviata: " + sql);

        database.con.query(sql, function (err, result) 
        {
            if (err){console.log("Nessuna categoria trovata\n"+err); return;}
            else 
            {
                callback(result)
                console.log("Result: " + result); return result;
            }

        });
}

//TROVA UN EVENTO DATO IL SUO ID
database.categoryGetById = function(categoryID, callback)
{
        let sql = "SELECT * FROM varnellidb.category";
        if(Array.isArray(categoryID) == true )
        {
            sql += " WHERE id = "
            for(let i=0; i<categoryID.length; i++)
            {
                sql += "'"+categoryID[i]+"'";
                if(i != categoryID.length-1)
                {
                    sql += "or id ="
                }
                else
                {
                    sql +=";"
                }
            }  
            console.log(sql)
        }
        else
        {
            sql = "SELECT * FROM varnellidb.category WHERE id = '"+categoryID+"';";
        }
        
        console.verbose("Stringa inviata: " + sql);

        database.con.query(sql, function (err, result) 
        {
            if (err) {console.log("Nessuna categoria trovato\n"+err); return;}
            else 
            {
                console.log("Result: " + result); 
                callback(result)
                return result;
            }
        });
}

//TROVA TUTTE LE CATEGORIE DATO L'ID DI UN EVENTO
database.categoryGetByPartecipant = function(eventID, userID, callback)
{
    sql = "SELECT * FROM varnellidb.users WHERE id = '"+userID+"' and event = '"+eventID+"' and invite is null;";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err, result) 
    {
        if (err) {console.log("Nessun evento trovato\n"+err); return;}
        else 
        {
            let listaId = [];
            for(let i=0; i<result.length; i++)
            {
                listaId.push(result[i].category)
            }

            database.categoryGetById(listaId, function(result2)
            {
                callback(result2)
            })
            
        }
    });
}

//RITORNA L'EVENTO A CUI APPARTIENE UNA CATEGORIA DATO IL SUO ID
database.categoryGetEvent = function(categoryID, callback)
{
        sql = "SELECT event FROM varnellidb.category WHERE id = "+categoryID+";";
        console.verbose("Stringa inviata: " + sql);

        database.con.query(sql, function (err, result) 
        {
            if (err) {console.log("Categoria non esistente"); return;}
            else 
            {
                console.log("Result: " + result[0].event); 
                callback(result[0].event)
                return;
            }
        });
}

//MODIFICA UNA CATEGORIA DATO IL SUO ID
database.categoryEdit = function(categoryID,name){

    sql = "UPDATE category SET name='"+name+"' WHERE id = '"+categoryID+"';";

    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err)
    {if (err) {console.log("Impossibile modificare la categoria"); return;}
    else
    {
        return;
    }
        
    });
}

//ELIMINA UNA CATEGORIA
database.categoryDelete = function(categoryID)
{

    sql = "DELETE FROM category WHERE id = "+categoryID;
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err)
    {if (err) {console.log("Impossibile eliminare la categoria"); return;}
    else
    {
        return;
    }
        
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////UTENTI

//AGGIUNIG UN NUOVO UTENTE
database.addProfile = function(ID, name)
{
    sql = "INSERT INTO profiles(id, name, disponibilita) VALUES ('"+ID+"'"+",'"+name+"', 1);";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err){
        if(err) {console.log("Impossibile inserire utente" + err); return;}
        else{
            return;
        }
    });
}

//AGGIUNIG UN NUOVO UTENTE
database.disponibilitaSet = function(userID, disponibilita, callback)
{
    sql = "UPDATE `profiles` SET `disponibilita`= "+disponibilita+" WHERE id = '"+userID+"';";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err){
        if(err) 
        {
            console.log("Impossibile aggiornare utente" + err); 
            callback("error")
        }
        else{
            callback("done")
        }
    });
}

//TORNA IL NOME DI UN UTENTE DATO IL SUO ID
database.disponibilitaGet = function(userID, callback)
{
    sql = "SELECT disponibilita FROM varnellidb.profiles WHERE id = '"+userID+"'";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err,result){
        if(err) {console.log("Impossibile trovare utente" + err); return;}
        else{
            console.log(result)
            callback(result[0])
        }
    });
}

//AGGIUNIG UN NUOVO UTENTE
database.updateUser = function(userID, eventID, categoryID, callback)
{
    sql = "UPDATE `users` SET `invite`= null WHERE id = '"+userID+"' and event = '"+eventID+"' and category = '"+categoryID+"';";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err){
        if(err) 
        {
            console.log("Impossibile aggiornare utente" + err); 
            callback("error")
        }
        else{
            callback("done")
        }
    });
}

//AGGIUNIG UN NUOVO UTENTE
database.removeUser = function(userID, eventID, categoryID, callback)
{
    sql = "DELETE FROM `users` WHERE id = '"+userID+"' and event = '"+eventID+"' and category = '"+categoryID+"';";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err){
        if(err) 
        {
            console.log("Impossibile aggiornare utente" + err); 
            callback("error")
        }
        else{
            callback("done")
        }
    });
}

//AGGIORNA I DATI DI UN UTENTE
database.addUser = function(ID, name, category, event , invite)
{ 
    
    sql = "INSERT INTO users(id, name, category, event, invite ) VALUES ('"+ID+"'"+",'"+name+"'"+",'"+category+"'"+",'"+event+"'"+",'"+invite+"');";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err){
        if(err) {console.log("Impossibile inserire utente" + err); return;}
        else{
            return;
        }
    });
}

//TORNA IL NOME DI UN UTENTE DATO IL SUO ID
database.getUser = function(ID, callback)
{
    sql = "SELECT name FROM varnellidb.profiles WHERE id = '"+ID+"'";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err,result){
        if(err) {console.log("Impossibile trovare utente" + err); return;}
        else{
            console.log(result)
            callback(result[0].name)
        }
    });
}

//TORNA IL NOME DI UN UTENTE DATO IL SUO ID
database.getUsers = function(usersID, callback)
{
    sql = "SELECT name FROM varnellidb.profiles";
    console.verbose("Stringa inviata: " + sql);

    sql += " WHERE id = "
    for(let i=0; i<usersID.length; i++)
    {
        sql += "'"+usersID[i]+"'";
        if(i != usersID.length-1)
        {
            sql += " or id ="
        }
        else
        {
            sql +=";"
        }
    }  
    console.log(sql)

    database.con.query(sql, function (err,result){
        if(err) {console.log("Impossibile trovare utente" + err); return;}
        else{
            console.log(result)
            callback(result)
        }
    });
}

//TROVA TUTTI GLI UTENTI CHE APPARTENGONO AD UNA CERTA CATEGORIA DATO L'ID DI QUESTA
database.getMemberCategory = function(categoryID, callback)
{
    sql = "SELECT * FROM users WHERE category = '"+categoryID+"' and invite is null;;";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err, result){
        if(err) {console.log("Impossibile individuare categoria" + err); return;}
        else{
            callback(result)
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NOTIFICHE

database.notificheGetInvito = function(userID, eventID, callback)
{
    sql = "SELECT * FROM varnellidb.users WHERE event = '"+eventID+"' and invite = '"+userID+"'";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err, result) 
    {
        if (err) {console.log("Nessun evento trovato\n"+err); return;}
        else 
        {
            callback(result)
        }
    });
}

database.notificheGetEvento = function(eventID, callback)
{
    sql = "SELECT * FROM varnellidb.interactions WHERE type = 0 and subject = '"+eventID+"'";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err, result) 
    {
        if (err) {console.log("Nessun evento trovato\n"+err); return;}
        else 
        {
            callback(result)
        }
    });
}

database.notificheGetCategoria = function(categoryID, callback)
{
    sql = "SELECT * FROM varnellidb.interactions WHERE type = 1 and subject = '"+categoryID+"'";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err, result) 
    {
        if (err) {console.log("Nessun evento trovato\n"+err); return;}
        else 
        {
            callback(result)
        }
    });
}

database.notificheGetUser = function(userID, callback)
{
    sql = "SELECT * FROM varnellidb.interactions WHERE type = 2 and subject = '"+userID+"'";
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err, result) 
    {
        if (err) {console.log("Nessun evento trovato\n"+err); return;}
        else 
        {
            callback(result)
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MESSAGGI

database.sendMessage = function(ID, name, receiver, message, type, callback)//type 1:persona 2:categoria 3:broadcast
{  
    sql = "INSERT INTO interactions(id,name,subject,object,type) VALUES ('"+ID+"','"+name+"','"+receiver+"', '"+message+"',"+type+");"
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err){
        if(err) {console.log("impossibile inviare messaggio" + err); return;}
        else{
            callback()
        }
    });
}

//RITORNA TUTTI I MESSAGGI DI UN UTENTE DATO IL SUO ID CATEGORIA ED EVENTO
database.getMessage = function(ID, categoryID, eventID)
{
    sql = "SELECT * FROM messages WHERE (ID like "+ID+" AND type like '1') OR (category like "+categoryID+" AND type like '2') OR (eventID like "+eventID+" AND type like '3';"
    console.verbose("Stringa inviata: " + sql);

    database.con.query(sql, function (err, result){
        if(err) {console.log("Impossibile trovare messaggi" + err); return;}
        else{
            return result;
        }
    });
}