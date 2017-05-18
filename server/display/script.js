// Start getting map data on document ready
$(document).ready(function() {
    var trackData = getTrackData();
});

// Gets track data from file and returns array
function getTrackData() {
	$.getJSON("../trackData.json", function(data) {
		createMap(data.markers);
	});
}

// Create map
function createMap(trackData) {
	// Initialize map
	var map = new GMaps({
		div: '#map'
	});
	// Add window resize listener
    $(window).resize(function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
	        map.refresh();
		    map.fitZoom();
	    }, 250);
	});
	// Get timestamp range based on URL param
	var dateParam = getParameterByName('date');
	var startDateStamp;
	var endDateStamp;
	if (dateParam !== '' && dateParam !== null) {
		var date = new Date(dateParam);
		date.setTime(date.getTime() + 10*60*1000); //AEST
		startDateStamp = date.getTime() / 1000;
		endDateStamp = date.getTime() / 1000 + 86400;
	}
	// Add markers for all track data
	for (var i = 0; i < trackData.length; i++) {
		var marker = trackData[i];
		// Ignore data if outside set date range
		if (dateParam !== '' && dateParam !== null && (marker.timestamp <= startDateStamp || marker.timestamp >= endDateStamp)) {
			continue;
		}
		var markerDate = new Date(marker.timestamp); 
		map.addMarker({
			lat: marker.latitude,
			lng: marker.longitude,
			title: markerDate.toString(),
			infoWindow: {
				content: '<img height="200px" src="https://roster.orangeskylaundry.com.au/app-usage-dashboard/img/logo.png">'
			}
		});
	}
	map.fitZoom();
}

// URL GET parameter function
function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    results = regex.exec(url);
    if (!results) {
    	return null;
    } 
    if (!results[2]) {
    	return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}