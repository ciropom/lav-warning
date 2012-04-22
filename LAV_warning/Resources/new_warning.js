/* "LAV Warning" is free software: you can redistribute it and/or modify */
/* it under the terms of the GNU General Public License as published by */
/* the Free Software Foundation, either version 3 of the License, or */
/*   (at your option) any later version. */
  
/*   "LAV Warning" is distributed in the hope that it will be useful, */
/*   but WITHOUT ANY WARRANTY; without even the implied warranty of */
/*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the */
/*   GNU General Public License for more details. */
  
/*   You should have received a copy of the GNU General Public License */
/*   along with "LAV Warning".  If not, see <http://www.gnu.org/licenses/>. */

Titanium.include("camera.js");
Titanium.include("gallery.js");
Titanium.include("gps.js");
Titanium.include("send.js");

var neww = {};

neww.position = {'latitude':null, 'longitude':null, 'street':null};

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
    layout:'horizontal',
    left: 10
});

neww.btn_help = Titanium.UI.createButton({
    title: "Istruzioni"
    //font: {fontFamily:'Arial', fontSize: 16}
});
neww.btn_take_pic = Titanium.UI.createButton({
    title: "Foto"
    //font: {fontFamily:'Arial', fontSize: 16}
});
neww.btn_get_pos = Titanium.UI.createButton({
    title: "GPS"
    //font: {fontFamily:'Arial', fontSize: 16}
});
neww.btn_send = Titanium.UI.createButton({
    title: "Segnala!"
    //font: {fontFamily:'Arial', fontSize: 16}
});

//action buttons
neww.top_buttons.add(neww.btn_help);
neww.top_buttons.add(neww.btn_get_pos);
neww.top_buttons.add(neww.btn_take_pic);
neww.top_buttons.add(neww.btn_send);

neww.gview = gallery.create();
neww.giter = gallery.init_iterator();

neww.btn_help.addEventListener('click', function(){
    //create a dialog with help
    
    Ti.UI.createAlertDialog({
	title:'Aiuto',
	message:"Benvenuti nell'applicazione della LAV Trentino per segnalare i maltrattamenti. Segnalaci la tua posizione e scatta delle foto all'animale maltrattato in modo semplice e veloce tramite i relativi pulsanti e poi inviaci la segnalazione.",
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
	
	if( e )
	    neww.position.street = e[0].address;
    }


    Ti.App.addEventListener('app:getCoords', function(e){
	//invoked when the coords are obtained
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
    var message;
    var ok = true;
    var images = gallery.getImagePaths(neww.giter);

    if( images.index == 0 && (neww.position.latitude == undefined || neww.position.latitude == null)){
	message = "è necessaria almeno una foto o una posizione per inviare una segnalazione di maltrattamento.";
	ok = false;
    } else if (images.index == 0)
	message = "Non hai scattato alcuna foto del maltrattamento! senza foto la segnalazione sarà molto meno efficace. Procedere senza foto?"
    else if(neww.position.latitude == undefined || neww.position.latitude == null)
	message = "La posizione non è stata ottenuta tramite GPS. Ricordarsi di inserire nella segnalazione la posizione dell'animale maltrattato!";
    else {
	// do not display anything 
	send.showSendView(images, neww.position);
	return;
    }
    // display a complaint message
    var no_pos = Ti.UI.createAlertDialog({
	title:'Attenzione',
	message:message,
	buttonNames: ['Indietro','Ok'], 
	cancel: 0
    });
    
    if( ok )
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