<?php
	//=========================================================
	// Functions for processing new track data
	//=========================================================
	
	// INCLUDE FOR PHP VERSION COMPATIBILITY
    include './compat/http_response_code.php';


    // Get POST data
    $post_data = file_get_contents('php://input');
    write_to_log('DEBUG', $post_data);
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
    array_push($json_array->markers, $new_marker);

    // Save markers to file
    $json_string = json_encode($json_array);
	if ($json_string !== FALSE) {
		file_put_contents('./trackData.json', $json_string);
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
		$new_filename = './photos/track-photo-' . strtotime("now") . '.png';
		file_put_contents($new_filename, base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $photo_data)));
		// Return new filename
		return '.' . $new_filename;
	}

	/**
	 * Function for writing to error log
     */
    function write_to_log($level, $content) {
        $url = 'http://roster.orangeskylaundry.com.au/web-service/log/writeToLog.php';
        $fields = array(
                "logfile" => "access",
                "level" => $level,
                "content" => $content,
                "source" => __FILE__,
                "ip" => $_SERVER["REMOTE_ADDR"]
            );

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);

        curl_exec($ch);
        curl_close($ch);
    }
?>