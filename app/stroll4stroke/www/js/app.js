var appData = {
    latitude: null,
    longitude: null,
    imageData: null
}
// App ready function
// Called when the app is initialized
function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
}
document.addEventListener("app.Ready", onAppReady, false) ;

// Send the update to the server
function sendUpdate() {
    navigator.geolocation.getCurrentPosition(geolocationSuccessCallback, geolocationErrorCallback);
}

// Success callback for the geolocation function
// @param position - the position object returned from the plugin
function geolocationSuccessCallback(position) {
    appData.latitude = position.coords.latitude;
    appData.longitude = position.coords.longitude;
    navigator.camera.getPicture(function(imageData) {
        $('#updateImage').attr("src", "data:image/png;base64," + imageData);
        appData.imageData = imageData;
        $("#lowButton").hide();
        $("#imageContent").show();
    }, 
    cameraError,
    {
        destinationType : Camera.DestinationType.DATA_URL, 
        encodingType: Camera.EncodingType.PNG,
        quality: 20,
        correctOrientation: true
//        allowEdit: true
    });
}


function sendData() {
    $.ajax({
        type: "POST",
        url: "http://roster.orangeskylaundry.com.au/reaio/s4s/server/addTrackData.php",
        data: JSON.stringify({
            latitude: appData.latitude,
            longitude: appData.longitude,
            text: $("#caption").val(),
            photo: appData.imageData
        }),
        success: function(result){
//            alert("Location update data sent successfully");
            window.setTimeout(window.location.reload(), 1000);
        },
        error: function(error) {
            alert("Sorry - Something went wrong with sending the data to the server");
            window.location.reload();
        }
    });
}

// Fail function for the geolocation
function geolocationErrorCallback() {
    alert("Sorry - Something went wrong with geolocation");
    window.location.reload();
}

// Success callback for the camera function
function cameraError() {
    alert("Sorry - Something went wrong with the camera");
    window.location.reload();
}
