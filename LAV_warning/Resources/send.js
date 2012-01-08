Titanium.include("gallery.js");
Titanium.include("new_warning.js");

var send = {};

send.showSendView = function(image_iter){
    //show the send view
    
    //creates a comment view fully functional with all the callbacks 
    //set. 
    var email = Titanium.UI.createEmailDialog()
    
    if (!email.isSupported()) {
	Ti.UI.createAlertDialog({
	    title:'Error',
	    message:"Email non disponibile, installare un app in grado di inviare email"
	}).show();
	return;
    }

    email.subject = "Segnalazione maltrattamento";
    email.toRecipients = ['lav.trentino@lav.it'];
    
    var txt = "Posizione GPS del maltrattamento (latitudine:";
    txt += neww.position.latitude;
    txt += ", longitudine:"+neww.position.longitude;
    txt += ") Per favore inserisci ulteriori informazioni utili qui sotto: ";

    email.messageBody = txt;

    //add attachments
    images = gallery.getImagePaths(image_iter);
    
    for(var i = 0; i < images.index; i++){
	var f = Ti.Filesystem.getFile(images.paths[i]);
	email.addAttachment(f);
    }


    //add listener
    email.addEventListener('complete', send.messageSendCompleted );
    send.emaildialog = email;
    email.open();

};

send.messageSendCompleted = function(e){
    //the user can replace this function to manipulate the response actions
    var information = "";
    var title = "";
    if( e.result == send.emaildialog.SENT ){
	if( e.success ){
	    title = "Fatto!";
	    information = "La segnalazione è stata inviata correttamente";
	}
	else{
	    title = "Attenzione!";
	    information = "La segnalazione non è stata inviata. Controllare l'app selezionata per ulteriori dettagli.";
	}
    }
    else if(e.result == send.emaildialog.SAVED){
	title = "Fatto!";
	information = "La segnalazione è stata salvata nelle bozze della tua posta elettronica.";
    }
    else if(e.result == send.emaildialog.CANCELLED){
	title = "Attenzione!";
	information = "Invio della segnalazione annullato";
    }
    else if(e.result == send.emaildialog.FAILED){
	title = "Errore!";
	information = e.error;
    }

    Ti.UI.createAlertDialog({
	title:title,
	message:information,
    }).show();
}