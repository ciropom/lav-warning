Ti.Geolocation.purpose = 'Get Current Location';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
Titanium.Geolocation.distanceFilter = 4;

var gps = {};

    //returns 1 if geolocation is enabled, false otherwise

gps.locationAdded = false;
gps.handleLocation = function(e) {
    if (e.success) {
	Ti.API.info(e.coords);
        Ti.App.fireEvent("app:getCoords", e.coords );
	gps.removeHandler();
    }else{
	var wait_dialog = Titanium.UI.createNotification({
	    duration: 2000,
	    message: "Errore GPS "+e.code+": "+e.error 
	});
	wait_dialog.show();
    }
};
gps.addHandler = function() {
    if (!gps.locationAdded) {
	Ti.Geolocation.addEventListener('location', gps.handleLocation);
	gps.locationAdded = true;
    }
};
gps.removeHandler = function() {
    if (gps.locationAdded) {
	Ti.Geolocation.removeEventListener('location', gps.handleLocation);
	gps.locationAdded = false;
    }
};

gps.get_position = function(){
    //the user should register a event listener on 'app:getCoords'
    Titanium.Geolocation.getCurrentPosition(function(e) {
	if (e.error) {
	    return;
	}
    });

    
    if( Titanium.Geolocation.locationServicesEnabled ){
	gps.addHandler();
	Titanium.UI.createNotification({
	    duration: 2000,
	    message: "Attendere prego, ricerca di una posizione valida in corso..."
	}).show();
    }else
	Titanium.UI.createNotification({
	    duration: 2000,
	    message: "GPS disabilitato. Abilitarlo e riprovare."
	}).show();
	
};

gps.street_from_position = function(coords, callback){
    //uses the coords got from get_position, and tries to find the human readable position.
    Ti.Geolocation.reverseGeocoder(coords.latitude, coords.longitude, callback);
};

