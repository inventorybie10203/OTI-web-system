$(document).ready(function(){
  var transactionTable=$("#dataTable").DataTable();
  var dataToPost="page=tranac-list";
  $.ajax({
    url:"tsProcess.php",
    type:"POST",
    data: dataToPost,
    dataType:'json',
    success:function(result){
      $.each(result, function(index, transactionList){
        transactionTable.row.add(
          [
            transactionList.receiptNum,
            transactionList.totalItem,
            transactionList.totalPrice,
            transactionList.amountTendered,
            transactionList.changeAmount,
            transactionList.modePay,
            transactionList.dateAdded,
            transactionList.addedPerson
          ]
        ).draw(false);
      });
    }
  });  
});
