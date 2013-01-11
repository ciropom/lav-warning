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
        width: 245,
	height: 255,
        /*left: 50,
        top: 100,
        right: 50,
        bottom: 100,*/
        opacity: 0.50,
        backgroundColor: 'black',
        borderRadius: 10,
        borderColor: 'black'
    });
    var frmLog = Ti.UI.createView({
        width: 240,
	height: 250,
	/*top : 105,
        left: 55,
        right: 55,
        bottom: 105,*/
        opacity: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        layout: "vertical"
    });
    var textlabel = Ti.UI.createLabel({
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
    if( text != "" )
	frmLog.add(textlabel);
    frmLog.add(txt);
    frmLog.add(btnSave);
    frmLog.add(btnCancel);
    shadow.animate(blur);
    win.add(shadow);
    win.add(frmLog);
    return win;
}