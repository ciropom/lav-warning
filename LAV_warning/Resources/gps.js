Ti.Geolocation.purpose = 'Get Current Location';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
Titanium.Geolocation.distanceFilter = 4;

var gps = {};

    //returns 1 if geolocation is enabled, false otherwise

gps.locationAdded = false;
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
    }else{
	var wait_dialog = Titanium.UI.createNotification({
	    duration: 2000,
	    message: "Errore nell'ottenimento dei dati dal GPS" 
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

    gps.addHandler();
    var wait_dialog = Titanium.UI.createNotification({
	duration: 2000,
	message: "Attendere prego, ricerca di una posizione valida in corso..."
    });
    wait_dialog.show();
};

gps.street_from_position = function(coords, callback){
    //uses the coords got from get_position, and tries to find the human readable position.
    Ti.Geolocation.reverseGeocoder(coords.latitude, coords.longitude, callback);
};

