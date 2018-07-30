<?php
$host='localhost';
$user='root';
$password=null;
$dbname='test';

$dsn='mysql:host='. $host .';dbname='. $dbname;

try{
$pdo=new PDO($dsn, $user, $password);
$messages= 'connection established';
}
catch(PDOException $error){
  $messages=$error;
}

?>
