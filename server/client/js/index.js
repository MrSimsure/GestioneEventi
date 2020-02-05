window.onload = function()
{
        btnBack = document.getElementById("btnBack");
        
        eventManager = new EventManager();
        comunicationManager = new ComunicationManager();

        pageInit(function()
        {
        compInit(function()
        {
                console.log("all loaded")
                pageNew("pageEnter", false,false)
                htmlHide(document.getElementById("loading"))
        })             
        })

        var firebaseConfig = 
        {
            apiKey: "AIzaSyBJ13VzR3lFVXve6egmgMlLRmsPry6jm_4",
            authDomain: "idsproject-f13e7.firebaseapp.com",
            databaseURL: "https://idsproject-f13e7.firebaseio.com",
            projectId: "idsproject-f13e7",
            storageBucket: "idsproject-f13e7.appspot.com",
            messagingSenderId: "819511476241",
            appId: "1:819511476241:web:c12a0165baf717ee"
        };
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
}

