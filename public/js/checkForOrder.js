function CheckForOrders(){
    $.ajax({
        url : '/check-for-orders',
        method : 'get',
        success : (response)=>{
            console.log(response)
            if(response.status){
                location.href='/view-orders'
            }else{
                Swal.fire({
                    title: 'No orders yet?',
                    text : 'continue shopping',
                    icon: 'question',
                    showConfirmButton: false,
                    showCancelButton : true,
                    background : 'black',
                }   
                )
            }
        }
    })
}

