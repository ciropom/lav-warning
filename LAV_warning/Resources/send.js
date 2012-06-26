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

Titanium.include("gallery.js");

var send = {};

send.showSendView = function(images, position){
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
	txt += "Posizione stimata del maltrattamento: ";
	txt += "("+position.latitude+", "+position.longitude+") ";
	txt += "link: http://maps.google.com/maps?q="+position.latitude+",+"+position.longitude+"&iwloc=A&hl=it  ";
    }
    txt += "Per favore inserisci ulteriori informazioni utili qui sotto, comprese ulteriori indicazioni sulla posizione: ";

    email.messageBody = txt;

    //add attachments
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