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

/* Author: Danilo Tomasoni <danilo.tomasoni@cryptolab.net> */

Ti.Geolocation.purpose = 'Get Current Location';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
Titanium.Geolocation.distanceFilter = 4;

var gps = {};
gps._null_position = {'latitude':null, 'longitude':null, 'street':null};
gps._last_position = {'latitude':null, 'longitude':null, 'street':null};

//if andorid tune geolocation
if( Ti.Platform.osname == 'android' ){
    Ti.API.trace("Android device, tuning gps parameters");
    Titanium.Geolocation.Android.manualMode = true;
    gps.provider = Ti.Geolocation.Android.createLocationProvider({
	name: Ti.Geolocation.PROVIDER_GPS,
	minUpdateTime: '5.0',
	minUpdateDistance: '5.0'
    });
    Ti.Geolocation.Android.addLocationProvider(gps.provider);
    Ti.API.info("GPS: minUpdateTime = " + gps.provider.minUpdateTime);
    Ti.API.info("GPS: minUpdateDistance = " + gps.provider.minUpdateDistance); 
}


//returns 1 if geolocation is enabled, false otherwise
gps.locationAdded = false;
gps.handleLocation = function(e) {
    if (e.success) {
        Ti.App.fireEvent("app:getCoords", e.coords );
	//gps.removeHandler();
	Ti.API.trace("fired app:getCoords"+e);
    }else{
	Ti.API.error("GPS error "+e.code+": "+e.error);
	// var wait_dialog = Titanium.UI.createNotification({
	//     duration: 2000,
	//     message: "Errore GPS "+e.code+": "+e.error 
	// });
	// wait_dialog.show();
    }
};
gps.addHandler = function() {
    if (!gps.locationAdded) {
	if( Titanium.Geolocation.locationServicesEnabled ){
	    Ti.API.trace("adding location handler");
	    Ti.Geolocation.addEventListener('location', gps.handleLocation);
	    gps.locationAdded = true;
	    //register an event that keeps a reference to the lastest position
	    Ti.App.addEventListener('app:getCoords', gps._onPositionFound);
	}else{
	    var err_dialog = Titanium.UI.createNotification({
	        duration: 2000,
	        message: "Errore GPS disabilitato. Abilitarlo e riprovare." 
	    });
	    err_dialog.show();
	}
    }
};
gps.removeHandler = function() {
    if (gps.locationAdded) {
	//unregister the event that keeps a reference to the lastest position
	Ti.App.removeEventListener('app:getCoords', gps._onPositionFound);
	Ti.Geolocation.removeEventListener('location', gps.handleLocation);
	//clear location variables
	gps._last_position.latitude = null;
	gps._last_position.longitude = null;
	gps._last_position.street = null;
	Ti.API.trace("removed location handler");
	gps.locationAdded = false;
    }
};

//this is the internal method listening on app:getCoords
gps._onPositionFound = function(e){
    //invoked when the coords are obtained
    gps._last_position.latitude = e.latitude;
    gps._last_position.longitude = e.longitude;
    gps.street_from_position(e, 
			     gps._onStreetFound);
    
    Ti.API.trace("Impostazione automatica della posizione tramite GPS riuscita");
}

gps._onStreetFound = function(e){
	//callback of reversegeocoder
	//it will be called when the "human readable positions"
	//are found
	if( e.success ){
	    Ti.API.trace("Street addresses "+e.places);
	    //salvo gli indirizzi.
	    gps._last_position.street = e.places;
	}else{
	    Ti.API.trace("Street addresses not found");
	    gps._last_position.street = null;
	}
}

gps.get_null_position = function(){
    return gps._null_position;
}

//get last position found
gps.get_position = function(){
    //copy the internal to a new dictionary
    return {'latitude':gps._last_position.latitude, 
	    'longitude':gps._last_position.longitude, 
	    'street':gps._last_position.street};
};

gps.street_from_position = function(coords, callback){
    //uses the coords got from get_position, and tries to find the human readable position.
    Ti.Geolocation.reverseGeocoder(coords.latitude, coords.longitude, callback);
};

