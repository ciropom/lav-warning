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

neww.btn_take_pic = Titanium.UI.createButton({
    title: "Foto"
});
neww.btn_get_pos = Titanium.UI.createButton({
    title: "Posizione"
});
neww.btn_send = Titanium.UI.createButton({
    title: "Invia segnalazione"
});

//action buttons
neww.top_buttons.add(neww.btn_take_pic);
neww.top_buttons.add(neww.btn_get_pos);
neww.top_buttons.add(neww.btn_send);

neww.gview = gallery.create();
neww.giter = gallery.init_iterator();

//event listeners for buttons
neww.btn_take_pic.addEventListener('click', function(){
    //passed by reference, so the next time giter is the new one
    //because show_camera calls gallery.add() which updates the object
    camera.show_camera(neww.gview, neww.giter);
});

neww.btn_get_pos.addEventListener('click', function(){
    Ti.API.info("posizione premuto!");

    gps.get_position(); //start searching

    Ti.App.addEventListener('app:getCoords', function(e){
	Ti.API.info("creazione alert dialog");
	
	if( e.success ){
	    Ti.API.info(e);
	    neww.position.latitude = e.latitude;
	    neww.position.longitude = e.longitude;
	    gps.street_from_position(neww.position, 
				     neww.onStreetFound);
	} else {
	    var info = Ti.UI.createNotification({
		duration: 2000,
		message: "Impostazione automatica fallita, procedere inserendo manualmente la posizione",
	    });
	    info.show();
	}
	
    });

    
});

neww.onStreetFound = function(e){
    //callback of reversegeocoder
    //it will be called when the "human readable positions"
    //are found
    Ti.UI.createAlertDialog({
	title:"Reverse geocoding success!",
	message: e,
    }).show();

    
}

neww.btn_send.addEventListener('click', function(){
    send.showSendView(neww.giter);
});

neww.main_view.add(neww.top_buttons);
neww.main_view.add(neww.gview);
// it will be opened by the app.js file
// when the "onclick" event fires on the "new warning" button
neww.main_win.add(neww.main_view);