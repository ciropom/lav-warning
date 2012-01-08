Titanium.include("gallery.js");

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
    email.messageBody = 'Per favore aggiungi qui sotto informazioni utili sul maltrattamento:';

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
    var information = "";
    var title = "";
    if( e.result == send.emaildialog.SENT ){
	title = "Fatto!";
	information = "La segnalazione è stata inviata correttamente";
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
	information = "Invio della segnalazione fallito. Controllare se la connessione a internet è presente e attiva.";
    }

    Ti.UI.createAlertDialog({
	title:'Error',
	message:information,
    }).show();
}