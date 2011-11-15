Titanium.include("camera.js");
Titanium.include("gallery.js");
Titanium.include("gps.js");

var neww = {}

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
neww.btn_comment = Titanium.UI.createButton({
    title: "Commento"
});

//action buttons
neww.top_buttons.add(neww.btn_take_pic);
neww.top_buttons.add(neww.btn_get_pos);
neww.top_buttons.add(neww.btn_comment);

neww.gview = gallery.create();
neww.giter = gallery.init_iterator();

//event listeners for buttons
neww.btn_take_pic.addEventListener('click', function(){
    //passed by reference, so the next time giter is the new one
    //because show_camera calls gallery.add() which updates the object
    camera.show_camera(neww.gview, neww.giter);
});

neww.btn_get_pos = Titanium.UI.addEventListener('click', function(){
    Ti.API.info("posizione premuto!");

    gps.get_position() //start searching

    var wait_dialog = Titanium.UI.AlertDialog({
	'title': "Impostazione automatica della posizione tramite GPS",
	'message': "Sto` aspettando una posizione valida..",
	'buttonNames': ['Indietro'],
	'cancel': 0
    });
    wait_dialog.show();

    Ti.App.addEventListener('app:getCoords', function(e){
	Ti.API.info("creazione alert dialog");
	wait_dialog.hide();

	if( e.success ){
	    var address = e.places[0].address
	    var city = e.places[0].city

	    var info = Titanium.UI.AlertDialog({
		'title': "Impostazione automatica della posizione tramite GPS",
		'message': address + " " + city,
		'buttonNames': ['Indietro', 'Conferma', 'Manuale'],
		'cancel': 0
	    });
	} else {
	    var info = Titanium.UI.AlertDialog({
		'title': "Impostazione automatica della posizione tramite GPS",
		'message': "Impostazione automatica fallita, procedere inserendo manualmente la posizione",
		'buttonNames': ['Indietro', 'Manuale'],
		'cancel': 0
	    });
	}
	
	info.show();
    });

    
});

neww.btn_comment = Titanium.UI.addEventListener('click', function(){
    //open an activity which alows user to fill in a comment
});

neww.main_view.add(neww.top_buttons);
neww.main_view.add(neww.gview);

neww.main_win.add(neww.main_view);