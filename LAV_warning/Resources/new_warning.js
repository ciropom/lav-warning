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
//bottoni azione
neww.top_buttons.add(btn_take_pic);
neww.top_buttons.add(btn_get_pos);

neww.main_view.add(top_buttons);

neww.main_win.add(neww.main_view);