Titanium.include("camera.js");
var gallery = Titanium.include("gallery.js");

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
    title: "Scatta delle foto"
});
neww.btn_get_pos = Titanium.UI.createButton({
    title: "Imposta la posizione"
});
//action buttons
neww.top_buttons.add(neww.btn_take_pic);
neww.top_buttons.add(neww.btn_get_pos);

neww.gview = gallery.create();
neww.giter = gallery.init_iterator();

//event listeners for buttons
neww.btn_take_pic.addEventListener('click', function(){
    //passed by reference, so the next time giter is the new one
    //because show_camera calls gallery.add() which updates the object
    show_camera(neww.gview, neww.giter);
    
    imageWin.addEventListener('click', function(){
	imageWin.close();
    });
    
    imageWin.open();
});

neww.main_view.add(neww.top_buttons);
neww.main_view.add(neww.gview);

neww.main_win.add(neww.main_view);