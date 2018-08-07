
<?php
include 'sqlconnect.php';

// from php process
if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
  if($_POST==null){
    echo "nodata received?";
  }
  else if($_POST['page']=='form-item-details') {
    $sql='SELECT * FROM inventory WHERE ID_item='.$_POST['id'];
    $stmt=$pdo->prepare($sql);
    $stmt->execute();
    $itemDetails=$stmt->fetchAll(PDO::FETCH_ASSOC);
    $return=json_encode($itemDetails);
    echo $return;
  }
  else if($_POST['page']=='form-item-list') {
    $sql='SELECT name_item, ID_item FROM inventory';
    $stmt=$pdo->prepare($sql);
    $stmt->execute();
    $itemList=$stmt->fetchAll(PDO::FETCH_ASSOC);
    $return=json_encode($itemList);
    echo $return;
  }
  else{
    echo "unable rcoginse function data passed";
    $info=var_dump($_POST);
  }
}
else {
  echo "not a post method";
}




?>
