Titanium.include("gallery.js");

var send = {};

send.showSendView = function(image_iter, position){
    //show the send view
    
    //creates a comment view fully functional with all the callbacks 
    //set. 
    var email = Titanium.UI.createEmailDialog()
    
    if (!email.isSupported()) {
	Ti.UI.createAlertDialog({
	    title:'Errore',
	    message:"Email non disponibile, installare un app in grado di inviare email"
	}).show();
	return;
    }

    email.subject = "Segnalazione maltrattamento";
    email.toRecipients = ['lav.trentino@lav.it'];
    
    var txt = '';
    if(position.latitude !== undefined && position.latitude !== null){
	txt += "Posizione GPS del maltrattamento: ";
	txt += "("+e.latitude+", "+e.longitude+") ";
	txt += "link: http://maps.google.com/maps?q="+position.latitude+",+"position.longitude"&iwloc=A&hl=it";
    }
    txt += "Per favore inserisci ulteriori informazioni utili qui sotto, comprese ulteriori indicazioni sulla posizione: ";

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
	    information = "Email di segnalazione creata correttamente";
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

    Ti.UI.createNotification({
	duration: 3000,
	title:title,
	message:information,
    }).show();
}