$(document).ready(function(){

  var dataPost={"page":"transRept"};
  var dateFormat="mm/dd/yy";

  var transTableReq=$('#dataTable').DataTable({
    dom:'lfrtip<"table-bottom"B>',
    buttons:[
      {
        extend:'print',
        text: 'Print',
        className:'btn-print'
      }
    ]
  });

  var startD=$("label[for='startDate']").next().datepicker({
    changeMonth:true,
    changeYear:true,
    numberOfMonths:2
  })
  .on("change",function(){
    endD.datepicker("option","minDate",obtainDate(this));
  });

  var endD=$("label[for='endDate']").next().datepicker({
    changeMonth:true,
    changeYear:true,
    numberOfMonths:2
  })
  .on("change",function(){
    startD.datepicker("option","maxDate",obtainDate(this));
  });


  function obtainDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( dateFormat, element.value );
    } catch( error ) {
      date = null;
    }
    return date;
  }

  $('.btn-reset').click(function (event) {
    startD.datepicker("refresh");
    endD.datepicker("refresh");
  });

  $('#transactionReportSubmit').validate({
    rules:{
      startDate:"required",
      endDate:"required"
    },
    submitHandler:function(verifiedForm) {
      alert("Data submited");
      $(verifiedForm).ajaxSubmit({
        data:dataPost,
        dataType:"json",
        beforeSubmit: function(requestPosted,transactionForm,options){
          console.log("data passed");
          console.log(requestPosted);
          console.log("addtional data passed");
          console.log(dataPost);
          return true;
        },
        success: function(result){
          console.log("returuned");
          console.log(result);
          if(result.length==0){
            $('#message').append(" error no data from date requested pleasae select another date");
            transTableReq.clear().draw();
            $(".table").hide();
            $('#message').show();
          }
          else {
            $("#message").hide();
            transTableReq.clear().draw();
            $.each(result,function(index,requestedListData) {
              transTableReq.row.add(
                [
                  requestedListData.receiptNum,
                  requestedListData.totalItem,
                  requestedListData.totalPrice,
                  requestedListData.amountTendered,
                  requestedListData.changeAmount,
                  requestedListData.modePay,
                  requestedListData.dateAdded,
                  requestedListData.addedPerson
                ]
              ).draw(false);
            });
            $('.table').show();
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
          alert('An error occurred...\nPlease refresh the page\nIf this issue continue occures\nPlease contact developer and screemshot the console (F12 or Ctrl+Shift+I, Console tab)\nThanks!');
          console.log("process request transaction list from db");
          console.log('jqXHR:');
          console.log(jqXHR);
          console.log('textStatus:');
          console.log(textStatus);
          console.log('errorThrown:');
          console.log(errorThrown);
        }
      });
    }
  });

  $("#message").hide();
  $(".table").hide();

});
