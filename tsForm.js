$(document).ready(function(){
  var dataPost="page=form";
  var itemTable=$("#dataTable").DataTable();

  $('.select-box-1').select2({
    placeholder:"Loading..."
  });

  $('.select-box-2').select2({
    placeholder:"Select a payment method",
    minimumResultsForSearch: Infinity
  });

  $('.select-box-1').on('select2:select',function(e){
    var dataToPost = e.params.data;
    dataPost= dataPost+"-item-details&id="+dataToPost.id;
    $.ajax({
      url:"tsProcess.php",
      type:"POST",
      data: dataPost,
      dataType:'json',
      success:function(result){
        var itemToAdd=result;
        $.each(itemToAdd, function(index, itemDetails){
          $("label[for='description']").next().val(itemDetails.description);
          $("label[for='qtyAvaliable']").next().val(itemDetails.quantity);
          $("label[for='unitPrice']").next().val(itemDetails.price);
          $("label[for='qtyInput']").next().attr('max',itemDetails.quantity);
          $("label[for='qtyInput']").next().removeAttr('disabled');
        });
      }
    });
  });

  $.ajax({
    url: "tsProcess.php",
    type: "POST",
    data:dataPost+"-item-list",
    dataType: 'json',
    success: function(result){
      $('.select-box-1').select2({
        placeholder:"Select an item"
      });
      $.each(result, function (index, itemList) {
        var optionToAdd=new Option(itemList.name_item, itemList.ID_item, false, false);
        $('.select-box-1').append(optionToAdd);
      });
    }});

    $("label[for='qtyInput']").next().keyup(function(){
      var qty=$("label[for='qtyInput']").next().val();
      var totalPrice=qty*$("label[for='unitPrice']").next().val();
      $("label[for='totalPrice']").next().val(totalPrice);
    });

    $("#addItem").click(function(){
      var qtyRequest=$("label[for='qtyInput']").next().val();
      var qtyInStock=$("label[for='qtyAvaliable']").next().val();
      if(!$("label[for='qtyInput']").next().val()){
        alert("Please enter item quantity");
      }
      else if(qtyRequest>qtyInStock){
        alert("Invalid item quantity");
      }
      else {
        var selectedDataObj=$('.select-box-1').select2('data');
        $.map(selectedDataObj, function (selectedData) {
          selectedData.text = selectedData.text || selectedData.name; // replace name with the property used for the text
          var jsonSelectedData=selectedData;
          itemTable.row.add(
            [
              jsonSelectedData.text,
              $("label[for='qtyInput']").next().val(),
              $("label[for='unitPrice']").next().val(),
              $("label[for='totalPrice']").next().val()
            ]
          ).draw(false);
          $('.select-box-1').find(':selected').attr('disabled','disabled');
          $('.select-box-1').select2();
        });
      }
    });

    $("#clearTable").click(function(){
      $('.select-box-1').find(':disabled').removeAttr('disabled');
      $('.select-box-1').select2();
      itemTable.clear().draw();
    });

    $('.btn-reset').click(function(){
      $('.select-box-1').val(null).trigger("change");
      $('.select-box-2').val(null).trigger("change");
    });

    //clr select item single

  });
