// this file handles all the things related to the camera

function show_camera( win, width, height ){
    /*
     * :param win: the object in which the imageview containing the image taken will be appended
     */
    Titanium.Media.showCamera({
	success:function(event) {
	    // called when media returned from the camera
	    Ti.API.debug('Our type was: '+event.mediaType);
	    if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
		var imageView = Ti.UI.createImageView({
		    width:width,
		    height:height,
		    image:event.media
		});
		win.add(imageView);
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