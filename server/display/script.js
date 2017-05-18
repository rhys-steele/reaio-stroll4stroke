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
	// Watch window resize event
    $(window).resize(function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
	        map.refresh();
		    map.fitZoom();
	    }, 250);
	});
	// Add markers for all track data
	for (var i = 0; i < trackData.length; i++) {
		var marker = trackData[i];
		var markerDate = new Date(marker.timestamp); 
		map.addMarker({
			lat: marker.latitude,
			lng: marker.longitude,
			title: markerDate.toString(),
			infoWindow: {
				content: '<img src="https://roster.orangeskylaundry.com.au/app-usage-dashboard/img/logo.png">'
			}
		});
	}
	map.fitZoom();
}