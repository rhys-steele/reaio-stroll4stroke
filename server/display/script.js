// Start getting map data on document ready
$(document).ready(function() {
    var trackData = getTrackData();
});

// Gets track data from file and returns array
function getTrackData() {
	$.getJSON("../trackData.json", function(data) {
		createMap(data);
	});
}

// Create map
function createMap(trackData) {
	// Initialize map
	var map = new GMaps({
		div: '#map',
        lat: -12.043333,
        lng: -77.028333
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
			long: marker.longitude,
			title: markerDate.format("dd/mm/yyyy hh:MM"),
			infoWindow: {
				content: '<img src="https://roster.orangeskylaundry.com.au/app-usage-dashboard/img/logo.png">'
			}
		});
	}
}