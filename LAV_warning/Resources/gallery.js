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

var gallery = {};

gallery.create = function(){

    var scroll = Ti.UI.createScrollView({
	contentWidth: 'auto',
    	contentHeight: 'auto',
	width: '100%',
	height: '100%',
	scrollType: 'vertical',
	backgroundColor: '#FC7E00',
    	showVerticalScrollIndicator: true,
    	showHorizontalScrollIndicator: false
    });

    //create an iterator used to keep track
    //of the position of the next image to be added
    var iter = {};
    //widgets info
    iter.widget = scroll;
    gallery._reset(iter);

    return iter;
}

//reset gallery pointers
//should not be used by externals
gallery._reset = function(iter) {
    //remove inner view if present
    if( iter._inner != undefined && iter._inner != null )
	iter.widget.remove(iter._inner);
    //create new inner view
    iter._inner = Ti.UI.createView({ height: 'auto' });
    iter.widget.add(iter._inner);
    var old_data;
    if(iter.data != undefined )
	old_data = JSON.parse( JSON.stringify( iter.data ) );

    //images info
    iter.data = {};
    iter.data.index = 0;
    iter.data.paths = [];
    //layout infos
    iter.rows = 0;
    iter.columns = 0;
    iter.image_size=Ti.App.Properties.getInt('previewDimension', 150);
    iter.thumbPadding = 5;
    iter.rowPosition = 15;
    iter.rowPositionReset = 15;
    iter.padding = 5;
    iter.columnPosition	= 15;

    return old_data;
}

gallery.updateLayout = function(iterator){
    gallery.remove(iterator, null);
}

//imagePath is the nativepath to be removed
//return the new iterator for the gallery
gallery.remove = function(iterator, imagePath){
    Ti.API.debug("removing '"+imagePath+"' from gallery.");
    var i = 0;
    var scroll = iterator._inner;
    //reset iterator
    var old_data = gallery._reset(iterator);
    //update
    for( ; i < old_data.index ; ++i ){
	var gallerypath = old_data.paths[i].path;
	var gallerygps = old_data.paths[i].position;
	//add it if it is not to be removed
	if( imagePath != gallerypath )
	    gallery.add(iterator, gallerypath, gallerygps);
	Ti.API.trace("processed image '"+gallerypath+"''");
    }
    Ti.API.debug("gallery.remove: new Iterator: "+JSON.stringify( iterator.data ));
}

//eventually raises an app:galleryRebuilt signal if the user removes an image
gallery.add = function(iterator, imagePath, position){
    //add the image passed, in the position pointed by iterator,
    //in the view scroll
    var _img;
    var scroll = iterator._inner;
    var width_occupied = (iterator.columns + 1) * (iterator.padding + iterator.image_size) + iterator.rowPositionReset;
    Ti.API.debug("width occupied : "+width_occupied+" | scroll width : "+scroll.size.width);
    // Display the thumbs on 3 columns
    if ( width_occupied >= scroll.size.width ) {
	iterator.columns = 0;
	iterator.rows += 1;
	iterator.columnPosition += iterator.image_size + iterator.thumbPadding;
	iterator.rowPosition = iterator.rowPositionReset;
    }

    _img = Ti.UI.createImageView({
	image: imagePath,
	width: iterator.image_size,
	height: iterator.image_size,
	left: iterator.rowPosition,
	top: iterator.columnPosition,
	id: iterator.data.index
    });

    function createFullViewer(imagepath){
	return function (e) {
    	    var path = imagepath;
	    // Create a new window and show the image selected
    	    _imageWin = Ti.UI.createWindow({
    		backgroundColor: '#000',
		layout: "vertical",
    		title: "Foto del maltrattamento"
    	    });
	    //all orientation modes are ok
	    _imageWin.orientationModes = [];
	    //build remove button
	    var _btnRemove = Titanium.UI.createButton({
		title: "Rimuovi",
	    });
	    _btnRemove.addEventListener('click', function(e){
		var new_iter = gallery.remove(iterator,path);
		Ti.App.fireEvent("app:galleryRebuilt", 
				 {'new_iterator' : new_iter,
				  'cause' : 'image-removed'});
	    });
	    _imageWin.add(_btnRemove);
	    //build image view
	    Ti.API.debug("image native path: '"+path+"'");
    	    var imageView = Ti.UI.createImageView({
    		image: path,
		error: function(e){
		    Ti.API.debug("Failed to load image '"+e.image+"'");
		    e.source.setImage('/images/failed.png');
		    /*Ti.UI.createAlertDialog({
			title:'Errore',
			message:"Non sono riuscito a caricare l'immagine.\nQuesto in genere accade quando l'immagine è troppo grande, o quando hai molte applicazioni aperte.",
			buttonNames: ['Indietro']
		    }).show();*/

		}
    	    });
	    //add image
    	    _imageWin.add(imageView);
    	    _imageWin.addEventListener('click', function(e){
    		_imageWin.close();
    	    });

    	    _imageWin.open();
	}
    }

    // Attach click listener to each thumb
    _img.addEventListener('click', createFullViewer(imagePath));

    // Add thumb to the scrollview
    scroll.add(_img);

    // Increment pointers
    iterator.columns += 1;
    iterator.rowPosition += iterator.image_size + iterator.padding;
    
    //save data
    iterator.data.paths[iterator.data.index] = {'location':position, 'path':imagePath};
    iterator.data.index += 1;

    Ti.API.debug("gallery.add: Iterator: "+JSON.stringify( iterator.data ));
    Ti.API.debug("immagine "+imagePath+" aggiunta");
    //return the iterator to the next position
    return iterator;
}

gallery.getImagePaths = function(iterator){
    //this function extracts from an iterator all the 
    //images that the gallery has inside
    //in the insertion order
    //it returns a dictionary
    //- index: the total number of items
    //- paths: an array of dictionary {nativePath, position of image} (one for each picture)
    
    //return by value (not by reference)
    return JSON.parse( JSON.stringify( iterator.data ) );
}