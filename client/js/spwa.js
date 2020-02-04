/// SPWA - Single Page Web App
/// collezzione di funzioni per realizzare comodamente un single page web application

var comps = 
{
    eventButton : "eventButton",                    //pulsanti 
    categoryButton : "categoryButton",                    //pulsanti 
}


var pages =
{
    pageEnter : "pageEnter",                        //entrata dell'app, login e signup (procede se gia loggato)
    pageCategoryCreate : "pageCategoryCreate",      //creazione e modifica di una categoria
    pageEventCreate : "pageEventCreate",            //creazione e modifica di un evento
    pageLogin : "pageLogin",                        //campi di login
    pageSignup : "pageSignup",                      //campi di registrazione
    pageHome: "pageHome",                           //lista degli eventi
    pageEvent : "pageEvent",                        //lista delle categorie
    pageCategory : "pageCategory"                   //invitati alla categoria
}


pageQueue = [];
pageCurrent = "";

compList = [];


/**
 * Crea i template sulla pagina di tutte le pagine possibili
 * @param {function} callback 
 */
function pageInit(callback)
{
    let num = Object.keys(pages).length;
    let n = 0;

    for(let i in pages)
    {
        $.get("/client/page/"+i+".html", function(data)
        { 
            $(data).appendTo("body");

            n ++
           // console.log("page loaded "+i)

            if(n == num && callback != undefined)
                callback()
        });
    }
}

function compInit(callback)
{
    let num = Object.keys(comps).length;
    let n = 0;

    for(let i in comps)
    {
        $.get("/client/comp/"+i+".html", function(data)
        { 
            $(data).appendTo("body");

            n ++
           // console.log("comp loaded "+i)

            if(n == num && callback != undefined)
                callback()
        });
    }
}

/**
 * carica un componente html e lo allega al parent desiderato
 * @param {string} parent 
 * @param {string} name 
 */
function compNew(parent, name)
{
    let temp = document.getElementById(name+"Template");
    let clon = temp.content.firstElementChild.cloneNode(true);
    let compNew = document.querySelector(parent).appendChild(clon);

    let cp = new Comp(compNew)
    //compList.push(cp)

    let script = compNew.querySelector("script");

    if(script != undefined)
    {
        eval(script.innerHTML)
    }

    return compNew;
}


/**
 * carica una nuova pagina nella PWA rendendo le precedenti nascoste
 * @param {string} name 
 * @param {boolean} del 
 * @param {boolean} back 
 */
function pageNew(name, del, back)
{
    pageCurrent = name;

    //clona il contenuto della pagina nell'html principale
    let temp = document.getElementById(name+"Template");
    let clon = temp.content.firstElementChild.cloneNode(true);
    let pageNew = document.querySelector("body").appendChild(clon);

    //elimina o no al pagian che stai lasciando
    if(del != undefined && del == true)
    {
        pageQueue[pageQueue.length-1].delete();
        pageQueue.remove(pageQueue.length-1);
    }

    //aggiungi la pagina alla queue delle pagine
    let pg = new Page(pageNew, back)
    pageQueue.push(pg)
    pageNew.setAttribute("data-id", pageQueue.length-1)

    for(let i=0; i<pageQueue.length-1; i++)
    {
        htmlHide(pageQueue[i].html)
    }

    //esegui il codice della pagina
    let script = pageNew.querySelector("script");

    if(script != undefined)
    {
        eval(script.innerHTML)
    }
        

    //lascia o matieni il pulsante back
    if(back != undefined && back == false)
    {
        htmlHide(btnBack)
    }
    else
    {
        htmlShow(btnBack)
    }

    return pageNew;
}


function backAction()
{
    pageQueue[pageQueue.length-1].delete();
    pageQueue.remove(pageQueue.length-1);

    htmlShow(pageQueue[pageQueue.length-1].html)
    pageCurrent = pageQueue[pageQueue.length-1].name

    if(pageQueue[pageQueue.length-1].backBtn == false)
        htmlHide(btnBack)

    if(pageQueue.length == 1)
        htmlHide(btnBack)   
}


/**
 * torna alla pagina precedente
 */
function pageBack()
{
    if(page().onBack != undefined) 
    {
        page().onBack(function()
        {
            backAction() 
        })
    }
    else
    {
        backAction()
    }

    
}

/**
 * torna alla pagina precedente
 */
function pageBackReload()
{
    pageBack()

    pageQueue[pageQueue.length-1].delete();
    pageQueue.remove(pageQueue.length-1);

    pageNew(pageCurrent)      
}


/**
 * Ritorna l'istanza della pagina di cui si passa il nome
 * @param {string} name 
 */
function pageGet(name)
{
    return pageQueue[document.getElementById(name).getAttribute("data-id")];
}

/**
 * Ritorna l'istanza della pagina attuale
 */
function page()
{
    return  pageQueue[document.getElementById(pageCurrent).getAttribute("data-id")];
}



