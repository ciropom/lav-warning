Ti.Geolocation.purpose = 'Get Current Location';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

var gps = {};

    //returns 1 if geolocation is enabled, false otherwise

gps.locationAdded = false;
gps.addHandler = function() {
    if (!locationAdded) {
	Ti.Geolocation.addEventListener('location', handleLocation);
	gps.locationAdded = true;
    }
};
gps.removeHandler = function() {
    if (locationAdded) {
	Ti.Geolocation.removeEventListener('location', handleLocation);
	gps.locationAdded = false;
    }
};


gps.handleLocation = function(e) {
    if (!e.error) {
	Ti.API.info(e.coords);
        Ti.App.fireEvent("app:getCoords", e);
	gps.removeHandler();
	var wait_dialog = Titanium.UI.createNotification({
	    duration: 2000,
	    message: e.latitude+" "+e.longitude 
	});
	wait_dialog.show();
    }
};

gps.get_position = function(){
    //the user should register a event listener on 'app:getCoords'
    if ( Ti.Geolocation.locationServicesEnabled ) {
	gps.addHandler();
	var wait_dialog = Titanium.UI.createNotification({
	    duration: 2000,
	    message: "Attendere prego, ricerca di una posizione valida in corso..."
	});
    } else {
	var wait_dialog = Titanium.UI.createNotification({
	    duration: 2000,
	    message: "ERROR: GPS non abilitato. Imposta manualmente la posizione"
	});
    }
    wait_dialog.show();
};

gps.street_from_position = function(coords, callback){
    //uses the coords got from get_position, and tries to find the human readable position.
    Ti.Geolocation.reverseGeocoder(coords.latitude, coords.longitude, callback);
};

