function confirmOrder(method){
    
    let fullName = $('#fullName').html()
    let mobile = $('#mobile').html()
    let address = $('#address').html()
    let COD=method
    console.log(fullName,mobile,address);
    if(method=='COD'){
        $.ajax({
            url : '/cod-place-order',
            method : 'post',
            data : {
                fullName : fullName,
                mobile : mobile,
                address : address,
                paymentMethod : COD
            },
            success : (response)=>{
                if(response.status){
                    location.href ='/order-successfully-placed'
                }
            }
        })
    }
}