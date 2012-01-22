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

Ti.Geolocation.purpose = 'Get Current Location';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
Titanium.Geolocation.distanceFilter = 4;

var gps = {};

    //returns 1 if geolocation is enabled, false otherwise

gps.locationAdded = false;
gps.handleLocation = function(e) {
    if (e.success) {
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
    var msg = "";
    
    Titanium.Geolocation.getCurrentPosition(function(e) {
	if (e.error) {
	    return;
	}
    });
    
    if( Titanium.Geolocation.locationServicesEnabled ){
	if( !gps.locationAdded ){
	    gps.addHandler();
	    msg = "Attendere prego, ricerca di una posizione valida in corso...";
	} else {
	    gps.removeHandler();
	    msg = "Ricerca posizione GPS interrotta";
	}
	Titanium.UI.createNotification({
	    duration: 2000,
	    message: msg
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

