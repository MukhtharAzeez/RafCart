function addToCart(id) {

  console.log(id)
    // check the product already exists or not 
    $.ajax({
        url: `/check-exist-product-in-cart/${id}`,
        method: 'get',
        success: (response) => {
            console.log(response)
            if (response.productExist==true) {
            
                Swal.fire({
                    position: 'top-end',
                    icon: 'info',
                    text: 'Product already exist in your cart',
                    showConfirmButton: false,
                    timer: 1000,
                    background : 'black',
                    
                  })
            } else if(response.noProductExist) {
                

                $.ajax({
                    url: `/add-to-cart/${id}`,
                    method: 'get',
                    success: (response) => {
                        if (response.status) {
                            let count = $('#cart-count').html()
                            count = parseInt(count) + 1
                            $('#cart-count').html(count)
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Product added to your cart',
                                showConfirmButton: false,
                                timer: 1000,
                                background : 'black',
                              })
                        }
                    }
                })
            } else {
               

                Swal.fire({
                    html:'<a href="/login">Login Now!</a> ' ,
                    title: 'Not loggined Yet?',
                    text : 'Login now to continue shopping',
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