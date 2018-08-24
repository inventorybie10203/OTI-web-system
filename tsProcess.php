<?php
include 'sqlconnect.php';

// from php process
if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
  if($_POST==null){
    echo "error\nnodata received";
  }
  else if($_POST['page']=='form-item-details') {
    $sql='SELECT * FROM inventory WHERE ID_item='.$_POST['id'];
    $stmt=$pdo->prepare($sql);
    try{
      $stmt->execute();
      $itemDetails=$stmt->fetchAll();
      $return=json_encode($itemDetails);
    }
    catch(PDOException $erorr){
      $return="error message\n".$error;
    }
    echo $return;
  }
  else if($_POST['page']=='form-item-list') {
    $sql='SELECT name_item, ID_item FROM inventory';
    $stmt=$pdo->prepare($sql);
    try{
      $stmt->execute();
      $itemList=$stmt->fetchAll();
      $return=json_encode($itemList);
    }
    catch(PDOException $error){
      $return="error message\n".$error;
    }
    echo $return;
  }
  else if($_POST['page']=='tranac-list'){
    $sql='SELECT * FROM transactions';
    $stmt=$pdo->prepare($sql);
    try{
      $stmt->execute();
      $transactionList=$stmt->fetchAll();
      $return=json_encode($transactionList);
    }
    catch(PDOException $error){
      $return="error message\n".$error;
    }
    echo $return;
  }
  else if ($_POST['page']=='form-item-add') {
    $date=date("y-m-d");
    $user="sys";
    $sql='INSERT INTO transactions (receiptNum, addedPerson, dateAdded, totalItem, totalPrice, modePay, amountTendered, changeAmount) VALUES (NULL, :user, :dateCurrent, :itemTotal, :totalPrice, :payMethod, :amountTendered, :amountChange)';
    $stmt=$pdo->prepare($sql);
    try{
      $totalItemsAdded=$_POST['totalItem'];
      $grandTotal=$_POST['grandTotal'];
      $payMethod=$_POST['payMethod'];
      $amtTendered=$_POST['amountTendered'];
      $amtChange=$_POST['changeAmount'];
      $stmt->bindParam(':user',$user);
      $stmt->bindParam(':dateCurrent',$date);
      $stmt->bindParam(':itemTotal',$totalItemsAdded);
      $stmt->bindParam(':totalPrice',$grandTotal);
      $stmt->bindParam(':payMethod',$payMethod);
      $stmt->bindParam(':amountTendered',$amtTendered);
      $stmt->bindParam(':amountChange',$amtChange);
      $stmt->execute();
      $return="Data added";
    }
    catch(PDOException $error){
      $return="error message\n".$error;
    }
    echo $return;
  }
  else if ($_POST['page']=='transRept') {
    $startDate=$_POST['startDate'];
    $endDate=$_POST['endDate'];
    $SDExtrated=strtotime($startDate);
    $newStartDate=date('Y-m-d',$SDExtrated);
    $EDExtrated=strtotime($endDate);
    $newEndDate=date('Y-m-d',$EDExtrated);
    $sql='SELECT * FROM transactions WHERE dateAdded BETWEEN :startD AND :endD';
    $stmt=$pdo->prepare($sql);
    try{
      $stmt->bindParam(':startD',$newStartDate);
      $stmt->bindParam(':endD',$newEndDate);
      $stmt->execute();
      $transactionList=$stmt->fetchAll();
      $return=json_encode($transactionList);
    }
    catch(PDOException $error){
      $return="error message\n".$error;
    }
    echo $return;
  }
  else{
    echo "error\nunable rcoginse function data passed\n";
    $info=var_dump($_POST);
  }
}
else {
  echo "error\nnot a post method";
}

?>
