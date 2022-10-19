function addToCart(id) {


    // check the product already exists or not 
    $.ajax({
        url: `/check-exist-product-in-cart/${id}`,
        method: 'get',
        success: (response) => {
            if (response.productExist) {
                Swal.fire({
                    text: 'Product already exist in your cart',
                    icon: 'info',
                    showCloseButton: true,
                })
            } else if (response.userExist == false) {
                Swal.fire({
                    html:'<a href="/login">Login Now!</a> ' ,
                    title: 'Not loggined Yet?',
                    text : 'Login now to continue shopping',
                    icon: 'question'
                }
                    
                    
                    
                )
            } else {
                $.ajax({
                    url: `/add-to-cart/${id}`,
                    method: 'get',
                    success: (response) => {
                        if (response.status) {
                            let count = $('#cart-count').html()
                            count = parseInt(count) + 1
                            $('#cart-count').html(count)
                            Swal.fire(
                                'Sucess!',
                                'Item added to Cart!',
                                'success'
                            )
                        }
                    }
                })
            }
        }
    })


}