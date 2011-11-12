Titanium.include("camera.js");

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
    layout:'vertical'
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

//event listeners for buttons
neww.btn_take_pic.addEventListener('click', 
				   function(){
				       // this should open the camera and set all the callbacks
				       var photowin = Titanium.UI.createWindow({
					   title:'Foto scattata',
				       });
				       Titanium.API.info("qwe1");
				       show_camera(photowin, photowin.width, photowin.height);
				       Titanium.API.info("qwe");
				       photowin.open();
				   });


neww.main_view.add(neww.top_buttons);

neww.main_win.add(neww.main_view);