
$('#discountValueHide').click(()=>{
    $('#discountDiv').hide()
    // $('#discountDiv').prop('required',false);
})
$('#discountValueGet1').click(()=>{
    // $('#discountDiv').prop('required',true);
    $('#discountDiv').show()
})
$('#discountValueGet2').click(()=>{
    // $('#discountDiv').prop('required',true);
    $('#discountDiv').show()
})





$('#formCouponDiscount').on('keyup',()=>{
    check_discount();
})
$('#formCouponDiscount').focusout(()=>{
    check_discountValueAfterFocuOut();
})

function checkDiscount(){
    check_discountValueAfterFocuOut()
}

function check_discount(){
    let value = $('input[name="type"]:checked').val();
    var discount =$('#formCouponDiscount').val()
    if(value=='Percentage'){
        if(discount>0 && discount<=100){
            $('#discountValueMsg').html("") 
        }else{
            $('#discountValueMsg').html("Percentage value must contains between 1-100")
        }
    }else{

    }
}

function check_discountValueAfterFocuOut(){
    let value = $('input[name="type"]:checked').val();
     var discount =$('#formCouponDiscount').val()
    if(value=='Percentage'){
        if(discount.length==0){
            $('#discountValueMsg').html("") 
        }else if(discount>0 && discount<=100){
            $('#discountValueMsg').html("") 
        }else{
            $('#discountValueMsg').html("Percentage value must contains between 1-100")  
        }
    }else{
        $('#discountValueMsg').html("")
    }
}



$(document).ready(function () {

    $('#offerDiv').hide()
    $('#fromToTo').hide()
    $('#orderToReach').hide()
    $('#priceToReach').hide()
    

    $("select.couponFor").change(function () {
        var selected = $(this).children("option:selected").val();
        if(selected=='everyOne'){
           
            $('#statusDiv').show();
            $('#sheduleDiv').show();
            $('#offerDiv').hide()
            $('#fromToTo').hide()
            $('#orderToReach').hide()
            $('#priceToReach').hide()
        }else{
            $('#offerDiv').show()
            $('#fromToTo').show()
            $('#statusDiv').hide();
            $('#sheduleDiv').hide();
            
        }
    })
    $("select.couponType").change(function () {
        var selectedType = $(this).children("option:selected").val();
        if(selectedType=='FromToTo'){
            $('#fromToTo').show()
            $('#orderToReach').hide()
            $('#priceToReach').hide()
        }else if(selectedType=='totalOrderAchievement'){
            $('#fromToTo').hide()
            $('#orderToReach').show()
            $('#priceToReach').hide()
        }else{
            $('#fromToTo').hide()
            $('#orderToReach').hide()
            $('#priceToReach').show()
        }
    })
})