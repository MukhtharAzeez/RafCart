function cancelOrder(orderId){
    Swal.fire({
        title: 'Do you want to cancel the order?',
        showCancelButton: true,
        confirmButtonText: 'Sure',
        background : 'black'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            $.ajax({
                url : `/cancel-order?orderId=${orderId}`,
                method : 'get',
                success : (response)=>{
                    $(`#status${orderId}`).html('order cancelled')
                    $(`#status${orderId}`).css('color','red')
                    $(`#cancelOrder${orderId}`).hide();
                    Swal.fire({
                        title:'Cancelled!',
                        icon : 'success',
                        background : 'black'
                        })
                }
            })
          
        }
      })
    
}