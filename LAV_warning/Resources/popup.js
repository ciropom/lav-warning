//txthint : the hint message for the text
//propertyKey : the key of the Ti.App.Properties value to be set
//type: can be 'int' or 'string'
popup = function(text,txthint, propertyKey,type){
    var win = Ti.UI.createWindow({
        backgroundColor: 'gray',
        fullscreen: true,
        navBarHidden: false,
        opacity : 0.50,
        id : "popup"
    });
    win.orientationModes = [Ti.UI.PORTRAIT];
 
    var blur = Ti.UI.createAnimation({
        opacity: 0.50
    })
    var shadow = Ti.UI.createView({
        left: 50,
        top: 100,
        right: 50,
        bottom: 100,
        opacity: 0.50,
        backgroundColor: 'black',
        borderRadius: 10,
        borderColor: 'black'
    });
    var frmLog = Ti.UI.createView({
        top : 105,
        left: 55,
        right: 55,
        bottom: 105,
        opacity: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        layout: "vertical"
    });
    var text = Ti.UI.createLabel({
	color: '#000000',
	font: { fontSize:24 },
	text: text,
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	top: 30,
	left: 15,
	right: 15
    });
    var txt = Ti.UI.createTextField({
        hintText: txthint,
        top: 30,
        left: 30,
        right: 30,
        txtID : "txt"
    });
    var btngroup = Ti.UI.createView({
        layout: "vertical"
    });
    var btnCancel = Ti.UI.createButton({
        title: "Annulla",
        btnID : "btnCancel",
        width: 100
    });
    btnCancel.addEventListener('click',function(e){
	Ti.App.fireEvent("cancel-click", 
			 {'event': e, 'propertyKey': propertyKey, 'win': win});
    });
    var btnSave = Ti.UI.createButton({
        title: "Salva",
        btnID : "btnSave",
        width: 100
    });
    btnSave.addEventListener('click',function(e){
	Ti.App.fireEvent("save-click", 
			 {'event':e, 'txt':txt.value, 'propertyKey': propertyKey, 'win': win, 'type':type} );
    });
    frmLog.add(text);
    frmLog.add(txt);
    frmLog.add(btnSave);
    frmLog.add(btnCancel);
    shadow.animate(blur);
    win.add(shadow);
    win.add(frmLog);
    return win;
}