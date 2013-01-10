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

var gallery = {};

gallery.create = function(){
    // Create the container for the gallery
    // return Ti.UI.createView({
    // 	backgroundColor:'transparent',
    // 	top:0,
    // 	left:0,
    // 	width:'100%',
    // 	height:'100%',
    // });
    
    return Ti.UI.createScrollView({
	contentWidth: 'auto',
    	contentHeight: 'auto',
	width: '100%',
	height: '100%',
	scrollType: 'vertical',
	backgroundColor: '#FC7E00',
    	showVerticalScrollIndicator: true,
    	showHorizontalScrollIndicator: false
    });
}

gallery.init_iterator = function(){
    //create an iterator used to keep track
    //of the position of the next image to be added
    var iter = {};

    iter.data = {};
    iter.data.index = 0;
    iter.data.paths = [];

    iter.rows = 0;
    iter.columns = 0;
    iter.image_size=Ti.App.Properties.getInt('previewDimension', 150);
    iter.thumbPadding = 5;
    iter.rowPosition = 15;
    iter.rowPositionReset = 15;
    iter.padding = 5;
    iter.columnPosition	= 15;
    return iter;
}


gallery.add = function(scroll, iterator, image){
    //add the image passed, in the position pointed by iterator,
    //in the view scroll
    var _img;
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
	image: image.nativePath,
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
    		title: "Foto numero "+iterator.data.index.toString()+" del maltrattamento"
    	    });
	    //all orientation modes are ok
	    _imageWin.orientationModes = [];
	    //build image view
	    Ti.API.debug("image native path: '"+path+"'");
    	    var imageView = Ti.UI.createImageView({
    		//left:0,right:0,top:0,bottom:0,
    		image: path
    	    });
	    //add image
    	    _imageWin.add(imageView);
    	    _imageWin.addEventListener('click', function(e){
    		_imageWin.close();
    	    });
	    //build remove button

    	    _imageWin.open();
	}
    }

    // Attach click listener to each thumb
    _img.addEventListener('click', createFullViewer(image.nativePath));

    // Add thumb to the scrollview
    scroll.add(_img);

    // Increment pointers
    iterator.columns += 1;
    iterator.rowPosition += iterator.image_size + iterator.padding;
    
    //save data
    iterator.data.paths[iterator.data.index] = image.nativePath;
    iterator.data.index += 1;

    Ti.API.debug("immagine "+image.nativePath+" aggiunta");
    //return the iterator to the next position
    return iterator;
}

gallery.getImagePaths = function(iterator){
    //this function extracts from an iterator all the 
    //images that the gallery has inside
    //in the insertion order
    //it returns a dictionary
    //- index: the total number of items
    //- paths: an array of nativePath (one for each picture)
    
    //return by value (not by reference)
    return JSON.parse( JSON.stringify( iterator.data ) );
}