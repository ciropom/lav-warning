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
	left:0,right:0,
	top:0,bottom:0,
    	contentWidth: 320,
    	contentHeight: 'auto',
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

    _img = Ti.UI.createImageView({
	url: image.nativePath,
	width: 75,
	height: 75,
	left: iterator.rowPosition,
	top: iterator.columnPosition,
	id: iterator.data.index
    });

    
    // Attach click listener to each thumb
    _img.addEventListener('click', function (e) {
    	// Create a new window and show the image selected
    	_imageWin = Ti.UI.createWindow({
    	    backgroundColor: '#000',
    	    title: "Foto numero "+iterator.data.index.toString()+" del maltrattamento"
    	});
	
    	var imageView = Ti.UI.createImageView({
    	    width:'auto',
    	    height:'auto',
    	    left:0,right:0,top:0,bottom:0,
    	    url: image.nativePath
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