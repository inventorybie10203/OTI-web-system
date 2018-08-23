$(document).ready(function(){
  var transactionTable=$("#dataTable").DataTable();
  var dataToPost="page=tranac-list";
  $.ajax({
    url:"tsProcess.php",
    type:"POST",
    data: dataToPost,
    dataType:'json',
    error: function(jqXHR, textStatus, errorThrown){
      alert('An error occurred...\nPlease refresh the page\nIf this issue continue occures\nPlease contact developer and screemshot the console (F12 or Ctrl+Shift+I, Console tab)\nThanks!');
      console.log("on page load request transaction list");
      console.log('jqXHR:');
      console.log(jqXHR);
      console.log('textStatus:');
      console.log(textStatus);
      console.log('errorThrown:');
      console.log(errorThrown);
    },
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
