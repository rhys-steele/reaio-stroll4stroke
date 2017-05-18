<?php
	//=========================================================
	// Functions for processing new track data
	//=========================================================
	
	// INCLUDE FOR PHP VERSION COMPATIBILITY
    include './compat/http_response_code.php';

    // Get POST data
    $post_data = file_get_contents('php://input');
    $post_array = json_decode($post_data);
    if ($post_array === NULL) {
        http_response_code(400);
        die();
    }

    // Get the track data JSON array from file
    $json_string = file_get_contents('./trackData.json');
    $json_array = json_decode($json_string);
    if ($json_array === NULL) {
        http_response_code(400);
        die();
    }

    // Check if markers is empty and add if not
    if (!isset($json_array->markers)) {
        $json_array->markers = array();
    }

    // Parse new marker photo
    $photo_url = store_photo($post_array->photo);
    $new_marker = array(
    	"latitude" => $post_array->latitude,
    	"longitude" => $post_array->longitude,
    	"text" => $post_array->text,
    	"photo_url" => $photo_url,
    	"timestamp" => strtotime("now")
    );
    array_push($json_array, $new_marker);

    // Save markers to file
    $json_string = json_encode($card_array);
	if ($json_string !== FALSE) {
		file_put_contents('../researchRegister.json', $json_string);
	} else {
		http_response_code(500);
		die();
	}

	/**
	 * Stores a photo and returns the URL at which it stored
	 */
	function store_photo($photo_data) {
		// Check if directory exists for the list
	  	if (!file_exists('./photos')) {
		    mkdir('./photos', 0664, true);
		}
		// Save new image on server
		$new_filename = '../photos/track-photo-' . strtotime("now");
		file_put_contents($new_filename, base64_decode($photo_data));
		// Return new filename
		return $new_filename;
	}
?>