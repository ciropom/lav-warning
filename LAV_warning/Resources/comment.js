var comment = {};

var comment.createCommentView = function(){

    var comment.lbl = Titanium.UI.createLabel({
	color:'#999',
	text:"Inserisci nel box sottostante altre indicazioni utili da fornire alla LAV (es. luogo esatto (se non impostato tramite gps), se il maltrattamento e' occasionale o ripetuto..)",
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
    });

    var comment.text = Titanium.UI.TextArea({
	value: "",
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	appearance : Titanium.UI.KEYBOARD_APPEARANCE_ALERT, 
	keyboardType : Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
	returnKeyType : Titanium.UI.RETURNKEY_EMERGENCY_CALL,
	borderRadius : 5,
	borderWidth: 2
    });
    
    var comment.send = Titanium.UI.Button({
	title:"Invia la segnalazione!"
    });
    
    
}