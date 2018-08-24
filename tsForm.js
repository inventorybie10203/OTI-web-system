$(document).ready(function(){
  var dataPost={"page":"form-item-list"};
  var itemTable=$("#dataTable").DataTable();
  var itemNameRemove;
  var totalPrice;
  var qtyRequest;
  var qtyInStock=$("label[for='qtyAvaliable']").next().val();
  var qty;
  var optionToAdd;
  var dataToPost;
  var grandTotal=0;
  var tax=0;
  var discount=0;
  var discountP;
  var itemTotal=0;
  var discountR=0;
  var amountChange;
  var transactionForm=$('#transactionForm');


  function clearInputUpper(){
    $("label[for='description']").next().val(null);
    $("label[for='qtyAvaliable']").next().val(null);
    $("label[for='unitPrice']").next().val(null);
    $("label[for='totalPrice']").next().val(null);
    $("label[for='qtyInput']").next().attr('readonly','readonly');
    $("label[for='qtyInput']").next().val(null);
  }

  function enableInputLower() {
    $("label[for='tax']").next().removeAttr('readonly');
    $("label[for='discountPercent']").next().removeAttr('readonly');
    $("label[for='discountRM']").next().removeAttr('readonly');
    $("label[for='payMethod']").next().removeAttr('readonly');
    $("label[for='amountTendered']").next().removeAttr('readonly');
  }

  function disableInputLower() {
    $("label[for='tax']").next().attr('readonly','readonly');
    $("label[for='discountPercent']").next().attr('readonly','readonly');
    $("label[for='discountRM']").next().attr('readonly','readonly');
    $("label[for='payMethod']").next().attr('readonly','readonly');
    $("label[for='amountTendered']").next().attr('readonly','readonly');
  }

  function calculate() {
    itemTotal=itemTable.column(3).data().reduce(function(item1,item2){
      return Number(item1)+Number(item2);
    });
    tax=Number($("label[for='tax']").next().val());
    grandTotal=Number(tax)/100*Number(itemTotal)+Number(itemTotal)-Number(discount);
    $("label[for='grandTotal']").next().val(grandTotal);
  }

  $('.select-box-1').select2({
    placeholder:"Loading..."
  });

  $('.select-box-2').select2({
    placeholder:"Select a payment method",
    minimumResultsForSearch: Infinity
  });

  $('.select-box-1').on('select2:select',function(e){
    dataToPost = e.params.data;
    dataPost.page="form-item-details";
    dataPost.id=dataToPost.id;
    $.ajax({
      url:"tsProcess.php",
      type:"POST",
      data: $.param(dataPost),
      dataType:'json',
      error: function(jqXHR, textStatus, errorThrown){
        alert('An error occurred...\nPlease refresh the page\nIf this issue continue occures\nPlease contact developer and screemshot the console (F12 or Ctrl+Shift+I, Console tab)\nThanks!');
        console.log("process request item details");
        console.log('jqXHR:');
        console.log(jqXHR);
        console.log('textStatus:');
        console.log(textStatus);
        console.log('errorThrown:');
        console.log(errorThrown);
      },
      success:function(result){
        $("label[for='description']").next().val(result[0].description);
        $("label[for='qtyAvaliable']").next().val(result[0].quantity);
        $("label[for='unitPrice']").next().val(result[0].price);
        $("label[for='qtyInput']").next().attr('max',result[0].quantity);
        $("label[for='qtyInput']").next().removeAttr('readonly');
        qtyInStock=result[0].quantity;
      }
    });
    $("label[for='qtyInput']").next().val(null);
  });

  $.ajax({
    url: "tsProcess.php",
    type: "POST",
    data:$.param(dataPost),
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown){
      alert('An error occurred...\nPlease refresh the page\nIf this issue continue occures\nPlease contact developer and screemshot the console (F12 or Ctrl+Shift+I, Console tab)\nThanks!');
      console.log("on page load process request item list");
      console.log('jqXHR:');
      console.log(jqXHR);
      console.log('textStatus:');
      console.log(textStatus);
      console.log('errorThrown:');
      console.log(errorThrown);
    },
    success: function(result){
      $('.select-box-1').select2({
        placeholder:"Select an item"
      });
      $.each(result, function (index, itemList) {
        optionToAdd=new Option(itemList.name_item, itemList.ID_item, false, false);
        $('.select-box-1').append(optionToAdd);
      });
    }});

    $("label[for='qtyInput']").next().keyup(function(){
      qty=$("label[for='qtyInput']").next().val();
      totalPrice=qty*$("label[for='unitPrice']").next().val();
      $("label[for='totalPrice']").next().val(totalPrice);
      qtyRequest=qty;
    });

    $("#addItem").click(function(){
      if(!$("label[for='qtyInput']").next().val()){
        alert("Please enter item quantity");
      }
      else{
        var intQtyRequest=Number(qtyRequest);
        var intQtyInStock=Number(qtyInStock);
        if(intQtyRequest>intQtyInStock){
          alert("Invalid item quantity\nItem to add: "+qtyRequest+"\nItem in stock: "+qtyInStock);
        }
        else {
          var selectedDataObj=$('.select-box-1').select2('data');
          itemTable.row.add(
            [
              selectedDataObj[0].text,
              $("label[for='qtyInput']").next().val(),
              $("label[for='unitPrice']").next().val(),
              $("label[for='totalPrice']").next().val()
            ]
          ).draw(false);
          $('.select-box-1').find(':selected').attr('readonly','readonly');
          $('.select-box-1').select2();
          $('.select-box-1').val(null).trigger("change");
          clearInputUpper();
        }
      }
    });

    $("#clearTable").click(function(){
      $('.select-box-1').find(':readonly').removeAttr('readonly');
      $('.select-box-1').select2();
      itemTable.clear().draw();
    });

    $('.btn-reset').click(function(){
      clearInputUpper();
    });

    $('#dataTable').on('click','tr',function(){
      if ( $(this).hasClass('selected') ) {
        $(this).removeClass('selected');
      }
      else {
        itemTable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
      }
    });

    $("#clearRows").click(function(){
      itemNameRemove=itemTable.cell(itemTable.row('.selected'),itemTable.column(0)).data();
      $('.select-box-1 option').filter(function(){
        return $(this).text() == itemNameRemove;
      }).removeAttr('readonly');
      $('.select-box-1').select2();
      itemTable.row('.selected').remove().draw(false);
      clearInputUpper();
    });

    $("label[for='tax']").next().keyup(function(){
      calculate();
    });

    $("label[for='discountPercent']").next().keyup(function(){
      discountP=$("label[for='discountPercent']").next().val();
      discount=Number(discountP)/100*Number(itemTotal);
      $("label[for='discountRM']").next().val(discount);
      calculate();
    });

    $("label[for='discountRM']").next().keyup(function(){
      discountR=$("label[for='discountRM']").next().val();
      discount=discountR;
      discountP=Number(discountR)/Number(itemTotal)*100;
      $("label[for='discountPercent']").next().val(discountP);
      calculate();
    });

    $("label[for='amountTendered']").next().keyup(function(){
      amountChange=Number($("label[for='amountTendered']").next().val())-Number(grandTotal);
      $("label[for='changeAmount']").next().val(amountChange);
    });

    itemTable.on( 'draw', function () {
      if(!itemTable.data().any()){
        disableInputLower();
      }
      else{
        enableInputLower();
        calculate();
      }
    });



    //verify+submit
    $('#transactionForm').validate({
      onkeyup:true,
      rules: {
        payMethod: "required",
        tax:{
          required:true,
          min:0
        },
        discountPercent:{
          required:true,
          min:0,
          max:100
        },
        discountRM:{
          required:true,
          min:0
        },
        grandTotal:{
          required:true,
          min:0
        },
        amountTendered:{
          required:true,
          min:0
        },
        changeAmount:{
          required:true,
          min:0
        }
      },
      messages:{
        changeAmount:{
          min:"Please enter valid amount tendered"
        },
        discountPercent:{
          max:"Not logic that we giving over 100% discount?"
        }
      },
      submitHandler: function(transactionFormVerified){
        alert("Data submited");
        dataPost.page="form-item-add";
        dataPost.totalItem=itemTable.rows().count();
        $(transactionFormVerified).ajaxSubmit({
          dataType: 'html',
          data:dataPost,
          beforeSubmit: function(requestPosted,transactionForm,options){
            console.log("data passed");
            console.log(requestPosted);
            console.log("addtional data passed");
            console.log(dataPost);
            return true;
          },
          error: function(jqXHR, textStatus, errorThrown){
            alert('An error occurred...\nPlease refresh the page\nIf this issue continue occures\nPlease contact developer and screemshot the console (F12 or Ctrl+Shift+I, Console tab)\nThanks!');
            console.log("process adding item to db");
            console.log('jqXHR:');
            console.log(jqXHR);
            console.log('textStatus:');
            console.log(textStatus);
            console.log('errorThrown:');
            console.log(errorThrown);
          },
          success: function(result){
            alert(result);
          }
        });
      }
    });
    $(document).on("wheel", "input[type=number]", function (e) {
      $(this).blur();
    });
  });
