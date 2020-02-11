
UrlMain = window.location.href

function loginFast()
{
    firebase.auth().signInWithEmailAndPassword("benigni_simone@libero.it", "123456").then(function(user)
    {
        httpPost("getUserName", {id:firebase.auth().currentUser.uid}, function(ret)
        {
            window.profilo = new Profilo(ret.name, firebase.auth().currentUser.uid);

            if(window.invito != null)
            {
                window.pageNew("pageInvito",false, false)
            }
            else
            {
                window.pageNew("pageHome",false, false)
            }

            return
        })
        
    }).catch(error => 
    {
        console.error(error);
    })
}


function httpGet(url, callback)
    {
        var request = new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if (request.readyState==4 && request.status==200)
            {
                if(callback != undefined)
                {
                    callback(JSON.parse(request.response));
                }
            }
        }
        request.open("GET", this.UrlMain+url, true);
        request.send();
    }


function httpPost(url, data, callback)
    {
        var request = new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if (request.readyState==4 && request.status==200)
            {
                if(callback != undefined)
                {
                    callback(JSON.parse(request.response));
                }
            }
        }
        request.open("POST", this.UrlMain+url, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send( $.param(data) );
    }



function copyElementText(id) 
{
    var text = document.getElementById(id).innerText;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
}

function checkDuplicateInObject(propertyName, inputArray) 
{

    testObject = {};
  
    inputArray.map(function(item) 
    {
      var itemPropertyName = item[propertyName];    
      if (itemPropertyName in testObject) 
      {
        testObject[itemPropertyName].duplicate = true;
        item.duplicate = true;

        inputArray.remove(inputArray.indexOf(item))
      }
      else 
      {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      } 
    });
    return inputArray;
  }

/**
 * Aggiungi o sottrai un valore ad una variabile nel css
 * @param {string} nome
 * @param {number} valore
 */
function cssVarAdd(nome, valore)
{
    let n = parseInt(getComputedStyle(document.documentElement).getPropertyValue(nome))
    document.documentElement.style.setProperty(nome, n+valore);
}

/**
 * Ritorna il valore di una variabile nel css
 * @param {string} nome
 */
function cssVarGet(nome)
{
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue(nome))
}

/**
 * Setta il valore di una variabile nel css
 * @param {string} nome
 * @param {number} valore
 */
function cssVarSet(nome, valore)
{
    let n = parseInt(getComputedStyle(document.documentElement).getPropertyValue(nome))
    document.documentElement.style.setProperty(nome, valore);
}


/**
 * Nascondi un elemento html
 * @param {DOM element} element
 */
function htmlHide(element)
{
    element.style.display = "none";
}


/**
 * Mostra un elemento html
 * @param {DOM element} element
 */
function htmlShow(element)
{
    element.style = "";
}



/**
 * Ritorna true se un numero è dispari
 * @param {number} num
 */
function isDispari(num) 
{ 
    if(num % 2 == 1)
    {return true}
    else
    {return false}
}


/**
 * Ritorna true se l'applicazione viene aperta da un dispositivo mobile
 */
function isMobile() 
{ 

        if( navigator.userAgent.match(/Android 8.0.0/i)
        ||  navigator.userAgent.match(/Macintosh/i)
        || navigator.userAgent.match(/iPhone/i)
        )
        {
            return true;
        }
        else 
        {
            return false;
        }
}


/**
 * Ritorna il numero di elementi figli del nodo passato
 * @param {DOM element} node
 */
function getChildNumber(node) 
{
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}

/**
 * Ritorna la percentuale richiesta del numero passato
 * @param {number} numero
 * @param {number} percentuale
 */
function per(num, amount)
{
  return num*amount/100;
}



async function showEstimatedQuota() 
{
    if (navigator.storage && navigator.storage.estimate) 
    {
      const estimation = await navigator.storage.estimate();
      console.log(`Quota: ${estimation.quota}`);
      console.log(`Usage: ${estimation.usage}`);
    } 
    else 
    {
      console.error("StorageManager not found");
    }
}


function randomDate() 
{
    let start = new Date(2012, 0, 1)
    let end = new Date()
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
  

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min)) + min;
}



Array.prototype.remove = function(position)
{
    this.splice(position,1);
}

/*
Object.prototype.length = function()
{
    return  Object.keys(this).length
}
*/


function reload()
{
    location.reload(true)
}
