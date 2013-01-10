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

var camera = {};

// this file handles all the things related to the camera
camera.show_camera = function(iter){
    Titanium.Media.showCamera({
	success:function(event) {
	    // called when media returned from the camera
	    if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
		iter = gallery.add(iter, event.media.nativePath);
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
	saveToPhotoGallery:true,
	allowEditing:false,
	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
    });
}