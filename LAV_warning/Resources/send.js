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

/* Author: Danilo Tomasoni <danilo.tomasoni@cryptolab.net> */

Titanium.include("gallery.js");

var send = {};

send.showSendView = function(images){
    //show the send view
    
    //creates a comment view fully functional with all the callbacks 
    //set. 
    var email = Titanium.UI.createEmailDialog()
    var i;

    if (!email.isSupported()) {
	Ti.UI.createAlertDialog({
	    title:'Errore',
	    message:"Email non disponibile, installare un app in grado di inviare email"
	}).show();
	return;
    }

    email.subject = "Segnalazione maltrattamento";
    //load target mail
    target_mail=Ti.App.Properties.getString('targetMail', 'lav.trentino@lav.it');
    email.toRecipients = [target_mail];
    
    var txt = '';
    txt += "Per favore inserisci qui sotto i dettagli che ritieni utili su questa segnalazione:\n\n\n";

    //add attachments
    Ti.API.debug("images "+JSON.stringify(images)+"");
    Ti.API.debug("invio di "+images.index+" immagini...");
    for(var i = 0; i < images.index; i++){
	var f = Ti.Filesystem.getFile(images.paths[i].path);
	var img = f.name;
	if( f.exists() ){
	    email.addAttachment(f);
	    Ti.API.trace("aggiungo immagine "+images.paths[i].path);
	}
	if( images.paths[i].location != undefined && images.paths[i].location != null ){
	    if( images.paths[i].location.latitude != null && images.paths[i].location.longitude != null )
		txt += "Coordinate GPS immagine "+imgname+" : "+images.paths[i].location.latitude+","+images.paths[i].location.longitude+"\n";
	
	    if( images.paths[i].location.street != undefined && images.paths[i].location.street != null && images.paths[i].location.street.length != 0 ){
		txt += "Indirizzo GPS immagine "+imgname+" :\n";
		var j;
		var streets = images.paths[i].location.street;
		for(j=0; i<streets.length; i++)
		    txt += streets[j].address+"\n";
	    }
	}

	Ti.API.trace("aggiungo posizione "+images.paths[i].location);
    }
    txt+= "\n";
    email.messageBody = txt;

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