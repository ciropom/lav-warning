Titanium.include("new_warning.js");


// this sets the background color of the master UIView
Titanium.UI.setBackgroundColor('#000');

var lav_ui = {};

//
// create base UI tab and root window
//
var main_win = Titanium.UI.createWindow({  
    title:'Benvenuti!',
    backgroundColor:'#fff',
});

var v_view = Titanium.UI.createView({
    backgroundColor:'transparent',
    top:0,
    left:0,
    width:'100%',
    height:'100%',
    layout:'vertical'
});

var benvenuto = Titanium.UI.createLabel({
    color:'#999',
    text:"Benvenuti nell'applicazione per segnalare maltrattamenti della LAV",
    font:{fontSize:20,fontFamily:'Helvetica Neue'},
    textAlign:'center',
    width:'auto'
});

var istruzioni = Titanium.UI.createLabel({
    color:'#999',
    text:"Scatta delle foto all'animale maltrattato e segnalaci la tua posizione in modo semplice e veloce utilizzando i bottoni sottostanti",
    font:{fontSize:20,fontFamily:'Helvetica Neue'},
    textAlign:'center',
    width:'auto'
});

var new_warning = Titanium.UI.createButton({
    title: "Nuova segnalazione"
});

//come si fa` a prendere una funzione da un altro file?
//btn_take_pic.addClickListener()

v_view.add(benvenuto);
v_view.add(istruzioni);
v_view.add(new_warning);

new_warning.addEventListener('click', 
			     function(){
				 neww.main_win.open();
			     });

v_view.show();

main_win.add(v_view);

main_win.open();
