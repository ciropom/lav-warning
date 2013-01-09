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
Titanium.include("popup.js");

var neww = {};

neww.position = {'latitude':null, 'longitude':null, 'street':null};
//load settings 
neww.target_mail=Ti.App.Properties.getString('targetMail', 'lav.trentino@lav.it');
neww.preview_dimension=Ti.App.Properties.getString('previewDimension', 150);


//specify default actions for popup save and cancel buttons
Ti.App.addEventListener('save-click', function(e){
    Ti.App.Properties.setString(e.propertyKey, e.txt);
    e.win.close();
});
Ti.App.addEventListener('cancel-click', function(e){
    e.win.close();
});

neww.main_win = Titanium.UI.createWindow({
    title:'Creazione di una nuova segnalazione',
    exitOnClose: true,
    navBarHidden: false,
    activity : {
        onCreateOptionsMenu : function(e) {
            var menu = e.menu;
	    //adding menuitems
            var menuItem = menu.add({ title : 'Chiudi' });
            //menuItem.setIcon("item1.png");
            menuItem.addEventListener('click', function(e) {
                // do something when the menu item is tapped
		Titanium.Android.currentActivity.finish();
            });
            var menuItem = menu.add({ title : 'e-mail' });
            menuItem.addEventListener('click', function(e) {
                // do something when the menu item is tapped
		//open popup
		var win = popup(
		    "Se vuoi cambiare l'indirizzo a cui viene inviata la segnalazione, inseriscilo qui sotto.\nRicorda che un indirizzo email valido deve contenere la '@':\nEsempio: lav.trentino@lav.it\n\n",
		    "Indirizzo mail LAV della tua zona",
		    'targetMail');
		win.open();
            });
            var menuItem = menu.add({ title : 'anteprime' });
            menuItem.addEventListener('click', function(e) {
                // do something when the menu item is tapped
		//open popup
		var win = popup(
		    "Se vuoi cambiare la dimensione delle anteprime delle foto scattate inserisci qui sotto un valore numerico espresso in pixel.\nEsempio: 150\n\n",
		    "Dimensione dell'anteprima delle foto",
		    'previewDimension');
		win.open();
            });
        }
    }
});

neww.main_view = Titanium.UI.createView({
    //backgroundColor:'transparent',
    backgroundColor:'#FC9505',
    top:0,
    left:0,
    width:Titanium.UI.FILL,
    height:Titanium.UI.FILL,
    layout:'vertical'
});

neww.top_buttons = Titanium.UI.createView({
    layout:'composite',
    height: '100',
    width:Titanium.UI.FILL
});


neww.btn_help = Titanium.UI.createButton({
    //title: "Istruzioni",
    backgroundImage: '/images/help.png',
    width: 48, height: 48,
    left: 50
    //font: {fontFamily:'Arial', fontSize: 16}
});
neww.btn_take_pic = Titanium.UI.createButton({
    backgroundImage: '/images/photo.png',
    width: 48, height: 48,
    //title: "Foto",
    left: 180
    //font: {fontFamily:'Arial', fontSize: 16}
});
neww.btn_get_pos = Titanium.UI.createButton({
    backgroundImage: '/images/gps.png',
    width: 48, height: 48,
    //title: "GPS",
    left: 340
    //font: {fontFamily:'Arial', fontSize: 16}
});
neww.btn_send = Titanium.UI.createButton({
    backgroundImage: '/images/send.png',
    width: 48, height: 48,
    //title: "Segnala!",
    right: 50
    //font: {fontFamily:'Arial', fontSize: 16}
});

//action buttons
neww.top_buttons.add(neww.btn_help);
neww.top_buttons.add(neww.btn_get_pos);
neww.top_buttons.add(neww.btn_take_pic);
neww.top_buttons.add(neww.btn_send);

neww.gview = gallery.create();
neww.giter = gallery.init_iterator();

neww.welcome = Ti.UI.createLabel({
  text: 'Foto che verranno incluse nella segnalazione:',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  color: '#000000',
  font: { fontSize:24 }
});

//controllers wiring
neww.btn_help.addEventListener('click', function(){
    //create a dialog with help
    
    Ti.UI.createAlertDialog({
	title:'Aiuto',
	message:"Benvenuti nell'applicazione della LAV Trentino per segnalare i maltrattamenti. Indicaci la tua posizione e scatta delle foto all'animale maltrattato in modo semplice e veloce tramite i relativi pulsanti e poi inviaci la segnalazione.\nRicorda: segnalazioni con molte foto richiedono un pò di tempo per essere inviate, quindi abbi pazienza.",
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

    gps.get_position(); //start searching
    
    var onStreetFound = function(e){
	//callback of reversegeocoder
	//it will be called when the "human readable positions"
	//are found
	if( e.success ){
	    Ti.UI.createAlertDialog({
		title:"Indirizzo identificato!",
		message: "Nella segnalazione verrà incluso anche l'indirizzo del luogo in cui ti trovi oltre alle coordinate GPS.",
	    }).show();
	    //salvo gli indirizzi.
	    neww.position.street = e.places;
	}else
	    Ti.UI.createAlertDialog({
		title:"Indirizzo non trovato",
		message: "Non sono riuscito a risalire all'indirizzo in cui ti trovi.\nNon ti preoccupare comunque, nella segnalazione verranno inserite le coordinate GPS dalle quali si può comunque risalire al punto esatto della segnalazione.",
	    }).show();
	    
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
		send.showSendView(images, neww.position);
	});
    
    no_pos.show();

});

//layout main panel
neww.main_view.add(neww.top_buttons);
neww.main_view.add(neww.welcome);
neww.main_view.add(neww.gview);


// it will be opened by the app.js file
// when the "onclick" event fires on the "new warning" button
neww.main_win.add(neww.main_view);

neww.changeButtonsPosition = function(){
    var phone_width = Titanium.Platform.displayCaps.platformWidth;
    var button_distance = phone_width / 4;
    neww.btn_take_pic.setLeft( button_distance ); 
    neww.btn_get_pos.setLeft( button_distance * 2 ); 
}
//change the position also onload
neww.changeButtonsPosition();

//open the interface
neww.main_win.open();


Ti.Gesture.addEventListener('orientationchange', function(e) {
    Ti.API.trace(Ti.Gesture.orientation);
    neww.changeButtonsPosition();
});

neww.main_win.addEventListener('postlayout', function(e){
    //debug
    Ti.API.trace("win "+neww.main_win.size.width+","+neww.main_win.size.height+" ");
    Ti.API.trace("buttons "+neww.top_buttons.size.width+","+neww.top_buttons.size.height+" ");
    Ti.API.trace("mainview "+neww.main_view.size.width+","+neww.main_view.size.height+" ");
    Ti.API.trace("welcome "+neww.welcome.size.width+","+neww.welcome.size.height+" ");
    Ti.API.trace("scrollview "+neww.gview.size.width+","+neww.gview.size.height+" ");
});
