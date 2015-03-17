<?php
include_once("config.php");

try {
	// get post data
	if (isset($_POST["getMatrix"]) && !empty($_POST["getMatrix"])) {
		// interpret data
		$data = $_POST["getMatrix"];
		
		// get w and h indices
		$w = $_POST["w"];
		$h = $_POST["h"];
		$n = $_POST["n"];
		
		// get one of the matrices which fit the description w,h,N
		$q = " SELECT * FROM ";
		$q .= " `matrices` ";
		$q .= " WHERE "; 
		$q .= " width='{$w}' ";
		$q .= " AND height='{$h}' ";
		$q .= " AND n='{$n}' ";
		// choose one of the results at random
		$q .= " ORDER BY 'id' DESC LIMIT 1 ";
		
		$result = mysqli_query($mysqli, $q);
		
		if ($result) {
			while ($row = mysqli_fetch_row($result)) {
				
				echo $row;
			}
		} else {
			echo mysql_error();
		}
		
	} else if (isset($_POST["matrix"]) && !empty($_POST["matrix"])) {
		// save values into vars first
		
		$w = $_POST["w"];
		$h = $_POST["h"];
		$n = $_POST["n"];
		$matrix = $_POST["matrix"];
		$sessionId = $_POST["sessionId"];
		$playerName = $_POST["name"];
		$currentTime = date("Y-m-d H:i:s");
		
		// save matrix to database
		$q =  " INSERT INTO ";
		$q .= " `matrices` ";
		$q .= " (`id`, `width`, `height`, `n`, `matrix`, `sessionId`, `date`, `name`) ";
		$q .= " VALUES ";
		$q .= " (NULL, '{$w}', '{$h}', '{$n}', '{$matrix}', '{$sessionId}', '{$currentTime}', '{$playerName}') ";
		
		$result = mysqli_query($mysqli, $q);
		if ($result) {
			echo $result;
		} else {
			echo mysql_error();
		}
		
	} else if (isset($_POST["getHighscores"]) && !empty($_POST["getHighscores"])) {
		
		
	} else {
		echo "nothing was set";
		
	}
} catch (Exception $e) {
	echo "excpt ";
	echo $e;
	
}

?>