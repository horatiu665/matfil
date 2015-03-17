<?php
include_once("config.php");

try {
	// get post data
	if (isset($_POST["sessionId"]) && !empty($_POST["sessionId"])) {
		// get one of the matrices which fit the description w,h,N
		$q = " SELECT * FROM ";
		$q .= " `matrixsessions` ";
		$q .= " WHERE "; 
		$q .= " sessionId='{$_POST['sessionId']}' ";
		// choose one of the results at random
		$q .= " ORDER BY 'date' DESC LIMIT 1 ";
		
		$result = mysqli_query($mysqli, $q);
		
		if ($result) {
			// successful query, but maybe empty. check if empty
			if (mysqli_num_rows ($result) > 0) {
				while ($row = mysqli_fetch_row($result)) {
					echo json_encode($row);
				}
			} else {
				// result was empty
				echo "empty1";
			}
		} else {
			if (mysqli_error()) {
				echo mysqli_error();
			} else {
				// result was empty
				echo "empty2";
			}
		}
		
	} else {
		echo "nothing was set";
		
	}
} catch (Exception $e) {
	echo "excpt ";
	echo $e;
	
}

?>