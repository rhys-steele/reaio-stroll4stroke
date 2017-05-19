// Start getting map data on document ready
$(document).ready(function() {
    var trackData = getTrackData();
    // window.setInterval(location.reload(true), 1000000);
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
		div: '#map',
		lat: -37.813628,
		lng: 144.963058
	});
	// Add window resize listener
    $(window).resize(function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
		    if (map.markers.length !== 0) {
		        map.refresh();
				map.fitZoom();
			}
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
	var path = [];
	for (var i = 0; i < trackData.length; i++) {
		var marker = trackData[i];
		// Ignore data if outside set date range
		if (dateParam !== '' && dateParam !== null && (marker.timestamp <= startDateStamp || marker.timestamp >= endDateStamp)) {
			continue;
		}
		var markerDate = new Date(marker.timestamp * 1000); 
		map.addMarker({
			lat: marker.latitude,
			lng: marker.longitude,
			title: markerDate.toString(),
			infoWindow: {
				content: '<img height="200px" src="' + marker.photo_url + '"><br><span>' + marker.text + '</span>'
			}
		});
		path.push([marker.latitude, marker.longitude]);
		if (i === trackData.length-1) {
			console.log(map.markers);
		}
	}
	if (map.markers.length !== 0) {
		map.drawPolyline({
			path: path,
			strokeColor: '#131540',
			strokeOpacity: 0.6,
			strokeWeight: 6
		});
		map.fitZoom();
	}
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