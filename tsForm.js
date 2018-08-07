$(document).ready(function(){
  var dataPost="page=form";

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
    console.log("changed");
    console.log("data to post "+dataPost);
    $.ajax({
      url:"tsProcess.php",
      type:"POST",
      data: dataPost,
      dataType:'json',
      success:function(result){
        $.each(result, function(index, itemDetails){
          console.log(itemDetails);
          $("label[for='description']").next().val(itemDetails.description);
          $("label[for='qtyAvaliable']").next().val(itemDetails.quantity);
          $("label[for='unitPrice']").next().val(itemDetails.price);
          $("label[for='qtyInput']").next().attr('max',itemDetails.quantity);
          $("label[for='qtyInput']").next().attr('min',0);
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
      console.log(result);
      $('.select-box-1').select2({
        placeholder:"Select an item"
      });
      $.each(result, function (index, itemList) {
        var optionToAdd=new Option(itemList.name_item, itemList.ID_item, false, false);
      $('.select-box-1').append(optionToAdd);
      });
    }});

});
