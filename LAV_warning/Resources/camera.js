var gallery = require("gallery.js");

// this file handles all the things related to the camera
function show_camera(view, iter){
    Titanium.Media.showCamera({
	success:function(event) {
	    // called when media returned from the camera
	    if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
		iter = gallery.add(view, iter, event.media);
	    } else {
		alert("got the wrong type back ="+event.mediaType);
	    }
	},
	cancel:function() {
	    // called when user cancels taking a picture
	},
	error:function(error) {
	    // called when there's an error
	    var a = Titanium.UI.createAlertDialog({title:'Camera'});
	    if (error.code == Titanium.Media.NO_CAMERA) {
		a.setMessage('Il dispositivo non ha una telecamera.');
	    } else {
		a.setMessage('Errore inaspettato: ' + error.code);
	    }
	    a.show();
	},
	saveToPhotoGallery:false,
	allowEditing:false,
	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
    });
}