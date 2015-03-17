<?php
########## MySql details #############
// local config
$username = "root"; //mysql username
$password = ""; //mysql password
$hostname = "localhost"; //hostname
$databasename = 'testing'; //databasename

$mysqli = mysqli_connect($hostname,$username,$password,$databasename);
$database = mysqli_select_db($mysqli, $databasename);

// online config
// $mysql_host = "mysql2.000webhost.com";
// $mysql_database = "a2731215_db";
// $mysql_user = "a2731215_admin";
// $mysql_password = "dumnezeu55";

// $mysqli = mysqli_connect($mysql_host,$mysql_user,$mysql_password,$mysql_database);
// $database = mysqli_select_db($mysqli, $databasename);
?>