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
    	contentWidth: 320,
    	contentHeight: 'auto',
    	top: 0,
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
    iter.thumbPadding = 5;
    iter.rowPosition = 2;
    iter.rowPositionReset = 2;
    iter.padding = 5;
    iter.columnPosition	= 15;
    return iter;
}

gallery.add = function(scroll, iterator, image){
    //add the image passed, in the position pointed by iterator,
    //in the view scroll
    var _img;

    // Display the thumbs on 3 columns
    if (iterator.columns % 3 === 0 && iterator.rows !== 0) {
	iterator.columnPosition += 75 + iterator.thumbPadding;
	iterator.rowPosition = iterator.rowPositionReset;
    }

    // Create the thumb as a label with a background image
    Ti.API.info(image.nativePath);
    _img = Ti.UI.createLabel({
	backgroundImage: image.nativePath,
	width: 75,
	height: 75,
	left: iterator.rowPosition,
	top: iterator.columnPosition
    });

    // Set the thumbs properties
    // TODO: Properties should be sent as an option
    _img.borderColor 				= null;
    _img.borderWidth 				= 0;
    _img.backgroundPaddingLeft 	        	= 0;
    _img.backgroundPaddingRight 	        = 0;
    _img.backgroundPaddingTop 		        = 0;
    _img.backgroundPaddingBottom	        = 0;
    _img.backgroundLeftCap	 		= 0;
    _img.backgroundTopCap 			= 0;

    // Attach click listener to each thumb
    _img.addEventListener('click', function (e) {
	// Create a new window and show the image selected
	_imageWin = Ti.UI.createWindow({
	    backgroundColor: '#000',
	    title: "Foto del maltrattamento"
	});
	
	var imageView = Ti.UI.createImageView({
	    width:'auto',
	    height:'auto',
	    backgroundColor: '#000',
	    image: image.nativePath
	});

	_imageWin.add(imageView);
	_imageWin.addEventListener('click', function(e){
	    _imageWin.close();
	});
	
	_imageWin.open();

    });

    // Add thumb to the scrollview
    scroll.add(_img);

    // Increment pointers
    iterator.columns += 1;
    iterator.rows += 1;
    iterator.rowPosition += 75 + iterator.padding;
    
    //save data
    iterator.data.paths[iterator.data.index] = image.nativePath;
    iterator.data.index += 1;

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

    return iterator.data;
}