<?php
$host='localhost';
$user='root';
$password=null;
$dbname='test';
$dsn='mysql:host='. $host .';dbname='. $dbname;
$return= new \stdClass();

try{
  $pdo=new PDO($dsn, $user, $password);
  $return->messages="connection established";

}
catch(PDOException $error){
  $return->messages=$error;
}

$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

?>
