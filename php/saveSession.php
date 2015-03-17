<?php

try {
	include_once("config.php");

	if (isset($_POST["session"]) && !empty($_POST["session"])) {
		// unpack data from POST
		$w = $_POST["w"];
		$h = $_POST["h"];
		$n = $_POST["n"];
		$matrix = $_POST["matrix"];
		$sessionId = $_POST["sessionId"];
		$playerName = $_POST["name"];
		$score = $_POST["score"];
		$clicks = $_POST["clicks"];
		$optimizeCells = $_POST["optimizeCells"];
		
		$currentTime = date("Y-m-d H:i:s");
		
		$q =  " INSERT INTO ";
		$q .= " `matrixsessions` ";
		$q .= " (`id`, `width`, `height`, `n`, `matrix`, `sessionId`, `date`, `name`, `score`, `clicks`, `optimizeCells`) ";
		$q .= " VALUES ";
		$q .= " (NULL, '{$w}', '{$h}', '{$n}', '{$matrix}', '{$sessionId}', '{$currentTime}', '{$playerName}', '{$score}', '{$clicks}', '{$optimizeCells}') ";
		$q .= " ON DUPLICATE KEY UPDATE ";
		$q .= " width = '{$w}', height = '{$h}', n = '{$n}', matrix = '{$matrix}', name = '{$playerName}', score = '{$score}', date = '{$currentTime}', clicks = '{$clicks}', optimizeCells = '{$optimizeCells}' ";

		echo "\n query was \n" + $q;
		
		$result = mysqli_query($mysqli, $q);
		
		if ($result) {
			echo "RESULT: \n" . ($result);
			
		} else {
			echo mysql_error();
		
		}
	}
} catch (Exception $e) {
	echo "excpt ";
	echo $e;
	
}

?>