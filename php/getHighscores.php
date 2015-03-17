<?php

try {
	include_once("config.php");
	
	$q  = " SELECT * FROM `matrixsessions` ";
	$q .= " ORDER BY `width` DESC, `height` DESC, `score`, `optimizeCells`, `clicks`";
	$q .= " LIMIT 10 ";
	
	$result = mysqli_query($mysqli, $q);
	
	if ($result) {
		if (mysqli_num_rows($result) > 0) {
			$bigJson = array();
			while ($row = mysqli_fetch_assoc($result)) {
				array_push($bigJson, $row);
			}
			echo json_encode($bigJson);
			
		} else {
			echo "highscore is empty nigga";
		}
	} else {
		if (mysqli_error($mysqli)) {
			echo mysqli_error($mysqli);
		} else {
			echo "highscore is empty nigga";
		}
	
	}
	
} catch (Exception $e) {
	echo "excpt ";
	echo $e;
	
}

?>