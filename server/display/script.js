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
function createMap(trackdata) {
	var map = new GMaps({
		div: '#map'
	});
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