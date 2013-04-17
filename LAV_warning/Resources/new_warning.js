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

/*   Author: Danilo Tomasoni <danilo.tomasoni@cryptolab.net> */

Titanium.include("camera.js");
Titanium.include("gallery.js");
Titanium.include("gps.js");
Titanium.include("send.js");
Titanium.include("popup.js");

var neww = {};
neww.gps_enabled = true;
//load settings 
neww.target_mail=Ti.App.Properties.getString('targetMail', 'lav.trentino@lav.it');
neww.preview_dimension=Ti.App.Properties.getInt('previewDimension', 150);


//specify default actions for popup save and cancel buttons
Ti.App.addEventListener('save-click', function(e){
    if( e.type == 'int' ){
	try{
	    Ti.App.Properties.setInt(e.propertyKey, parseInt(e.txt));
	}catch(e){
	    Ti.API.debug("save-int: "+e.message);
	    //show error message and stay there
	    Titanium.UI.createNotification({
		duration: 2000,
		message: "Errore: inserire un valore numerico." 
	    }).show();
	    return;
	}
	//if preview dimension changed update gallery layout
	if( e.propertyKey == 'previewDimension' )
	    gallery.updateLayout(neww.giter);
    }else
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
        //option menu configuration
	onCreateOptionsMenu : function(e) {
            var menu = e.menu;
	    //adding menuitems
            var menuItem = menu.add({ title : 'Chiudi', itemId: 0 });
            //menuItem.setIcon("item1.png");
            menuItem.addEventListener('click', function(e) {
		//remove location handler if present
		gps.removeHandler();
                // do something when the menu item is tapped
		Titanium.Android.currentActivity.finish();
            });
            var menuItem = menu.add({ title : 'e-mail', itemId: 1 });
            menuItem.addEventListener('click', function(e) {
                // do something when the menu item is tapped
		//open popup
		var win = popup(
		    "",
		    "Nuova mail LAV",
		    'targetMail');
		win.open();
            });
            var menuItem = menu.add({ title : 'anteprime', itemId: 2 });
            menuItem.addEventListener('click', function(e) {
                // do something when the menu item is tapped
		//open popup
		var win = popup(
		    "",
		    /*
		    "Per cambiare la dimensione delle anteprime delle foto scattate inserisci qui sotto un valore numerico espresso in pixel.\nEsempio: 150\n",*/
		    "Dimensione anteprime",
		    'previewDimension',
		    'int');
		win.open();
            });
	    //gps handling
	    var menuItem = menu.add({ title : 'start GPS', itemId: 3 });
            menuItem.addEventListener('click', function(e) {
		//add location handler if not present
		gps.addHandler();
	    });
	    var menuItem = menu.add({ title : 'stop GPS', itemId: 4 });
            menuItem.addEventListener('click', function(e) {
		//remove location handler if present
		gps.removeHandler();		
	    });
        },
	onPrepareOptionsMenu: function(e){
	    var menu = e.menu;
	    menu.findItem(3).setVisible(!gps.locationAdded);
	    menu.findItem(4).setVisible(gps.locationAdded);
	}
    }
});
//toggle gps when app goes to background
Ti.App.addEventListener('resume', function(e){
    Ti.API.trace("LAV Warning resume"); 
    gps.addHandler();
});
Ti.App.addEventListener('pause', function(e){
    Ti.API.trace("LAV Warning pause");
    gps.removeHandler();
});


//only landscape mode alowed
if( Titanium.Platform.displayCaps.platformWidth <= 300 )
    neww.main_win.orientationModes = [Ti.UI.LANDSCAPE_LEFT];

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
    height: '80',
    width:Titanium.UI.FILL
});


neww.btn_help = Titanium.UI.createButton({
    backgroundImage: '/images/help.png',
    width: 48, height: 48,
    left: 50
});

neww.btn_load_pic = Titanium.UI.createButton({
    backgroundImage: '/images/photo-load.png',
    width: 48, height: 48,
    left: 180
});

neww.btn_take_pic = Titanium.UI.createButton({
    backgroundImage: '/images/photo.png',
    width: 48, height: 48,
    left: 300
});
neww.btn_send = Titanium.UI.createButton({
    backgroundImage: '/images/send.png',
    width: 48, height: 48,
    right: 50
});

//action buttons
neww.top_buttons.add(neww.btn_help);
neww.top_buttons.add(neww.btn_load_pic);
neww.top_buttons.add(neww.btn_take_pic);
neww.top_buttons.add(neww.btn_send);

neww.giter = gallery.create();

neww.welcome = Ti.UI.createLabel({
  text: 'Foto che verranno incluse nella segnalazione:',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  color: '#000000',
  font: { fontSize:16 }
});

//controllers wiring
neww.btn_help.addEventListener('click', function(){
    //create a dialog with help
    
    Ti.UI.createAlertDialog({
	title:'Aiuto',
	message:"Benvenuti nell'applicazione della LAV Trentino per segnalare i maltrattamenti alle LAV locali. Indica la tua posizione e scatta delle foto all'animale maltrattato in modo semplice e veloce tramite i relativi pulsanti e poi inviaci la segnalazione.\nPer cambiare l'indirizzo email della LAV locale a cui vuoi segnalare il maltrattamento usa il tasto fisico 'Opzioni'.\nRicorda: segnalazioni con molte foto richiedono un pò di tempo per essere inviate, quindi abbi pazienza.",
	buttonNames: ['Indietro']
    }).show();
    
});

neww.btn_load_pic.addEventListener('click', function(){
    Ti.Media.openPhotoGallery({
	mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
	success: function(e){
	    //e.media is the blob image, gps.get_position() gets the lastest available position from GPS
	    gallery.add(neww.giter, e.media.nativePath, gps.get_position());
	},
	error: function(e){},
	cancel: function(e){}
    });
});

neww.btn_take_pic.addEventListener('click', function(){
    //passed by reference, so the next time giter is the new one
    //because show_camera calls gallery.add() which updates the object
    camera.show_camera(neww.giter);
});

neww.btn_send.addEventListener('click', function(){
    var message;
    var images = gallery.getImagePaths(neww.giter);

    if( images.index == 0 ){
	message = "è necessaria almeno una foto per inviare una segnalazione di maltrattamento.";
	// display a complaint message
	var no_pos = Ti.UI.createAlertDialog({
	    title:'Attenzione',
	    message:message,
	    buttonNames: ['Indietro'], 
	    cancel: 0
	});

	no_pos.show();
    }else{
	// do not display anything 
	send.showSendView(images);
    }
        

});

//layout main panel
neww.main_view.add(neww.top_buttons);
neww.main_view.add(neww.welcome);
neww.main_view.add(neww.giter.widget);


// it will be opened by the app.js file
// when the "onclick" event fires on the "new warning" button
neww.main_win.add(neww.main_view);

neww.changeButtonsPosition = function(){
    var phone_width = Titanium.Platform.displayCaps.platformWidth;
    var padding = 50;
    var button_half_width = 24;
    var button_distance = (phone_width - padding*2) / 3;
    
    neww.btn_help.setLeft( padding - button_half_width ); 
    neww.btn_load_pic.setLeft( padding + button_distance - button_half_width ); 
    neww.btn_take_pic.setLeft( padding + (button_distance * 2) - button_half_width); 
    neww.btn_send.setLeft( padding + (button_distance * 3) - button_half_width); 
}
//change the position also onload
neww.changeButtonsPosition();

//main window event handlers
neww.main_win.addEventListener('postlayout', function(e){
    //debug
    Ti.API.trace("win "+neww.main_win.size.width+","+neww.main_win.size.height+" ");
    Ti.API.trace("buttons "+neww.top_buttons.size.width+","+neww.top_buttons.size.height+" ");
    Ti.API.trace("mainview "+neww.main_view.size.width+","+neww.main_view.size.height+" ");
    Ti.API.trace("welcome "+neww.welcome.size.width+","+neww.welcome.size.height+" ");
    Ti.API.trace("scrollview "+neww.giter.widget.size.width+","+neww.giter.widget.size.height+" ");
});

neww.main_win.addEventListener('open', function(e){
    Ti.API.trace("LAV Warning open"); 
    gps.addHandler();
});
//open the interface
neww.main_win.open();

Ti.Gesture.addEventListener('orientationchange', function(e) {
    Ti.API.trace(Ti.Gesture.orientation);
    neww.changeButtonsPosition();
    gallery.updateLayout(neww.giter);
});
