Titanium.include("camera.js");
Titanium.include("gallery.js");
Titanium.include("gps.js");
Titanium.include("send.js");

var neww = {};

neww.position = {};

neww.main_win = Titanium.UI.createWindow({  
    title:'Creazione di una nuova segnalazione',
    backgroundColor:'#fff',
});

neww.main_view = Titanium.UI.createView({
    backgroundColor:'transparent',
    top:0,
    left:0,
    width:'100%',
    height:'100%',
    layout:'vertical'
});

neww.top_buttons = Titanium.UI.createView({
    layout:'horizontal'
});

neww.btn_help = Titanium.UI.createButton({
    title: "Istruzioni"
});
neww.btn_take_pic = Titanium.UI.createButton({
    title: "Foto"
});
neww.btn_get_pos = Titanium.UI.createButton({
    title: "Posizione"
});
neww.btn_send = Titanium.UI.createButton({
    title: "Segnala!"
});

//action buttons
neww.top_buttons.add(neww.btn_help);
neww.top_buttons.add(neww.btn_take_pic);
neww.top_buttons.add(neww.btn_get_pos);
neww.top_buttons.add(neww.btn_send);

neww.gview = gallery.create();
neww.giter = gallery.init_iterator();

neww.btn_help.addEventListener('click', function(){
    //create a dialog with help
    
    Ti.UI.createAlertDialog({
	title:'Aiuto',
	message:"Benvenuti nell'applicazione per segnalare maltrattamenti della LAV. Scatta delle foto all'animale maltrattato e segnalaci la tua posizione in modo semplice e veloce, e poi inviaci la segnalazione.",
	buttonNames: ['Indietro']
    }).show();
    
});

//event listeners for buttons
neww.btn_take_pic.addEventListener('click', function(){
    //passed by reference, so the next time giter is the new one
    //because show_camera calls gallery.add() which updates the object
    camera.show_camera(neww.gview, neww.giter);
});

neww.btn_get_pos.addEventListener('click', function(){
    Ti.API.info("posizione premuto!");

    gps.get_position(); //start searching
    
    var onStreetFound = function(e){
	//callback of reversegeocoder
	//it will be called when the "human readable positions"
	//are found
	Ti.UI.createAlertDialog({
	    title:"Reverse geocoding success!",
	    message: e,
	}).show();
    }


    Ti.App.addEventListener('app:getCoords', function(e){
	//invoked when the coords are obtained
	Ti.API.info("creazione alert dialog");
	
	Ti.API.info(e);
	neww.position.latitude = e.latitude;
	neww.position.longitude = e.longitude;
	gps.street_from_position(e, 
				 onStreetFound);
	    
	Ti.UI.createNotification({
	    duration: 2000,
	    message: "Impostazione automatica della posizione tramite GPS riuscita",
	}).show();
	
    });

    
});

neww.btn_send.addEventListener('click', function(){
    
    var no_pos = Ti.UI.createAlertDialog({
	title:'Attenzione',
	message:"La posizione non è stata ottenuta tramite GPS. Ricordarsi di inserire nella segnalazione la posizione dell'animale maltrattato!",
	buttonNames: ['Indietro','Ok'], 
	cancel: 0
    });
    
    no_pos.addEventListener('click',function(e){
	if( e.index == 1 )
	    send.showSendView(neww.giter, neww.position);
    });
    
    no_pos.show();
    
});

neww.main_view.add(neww.top_buttons);
neww.main_view.add(neww.gview);
// it will be opened by the app.js file
// when the "onclick" event fires on the "new warning" button
neww.main_win.add(neww.main_view);

//open the interface
neww.main_view.show();
neww.main_win.open();