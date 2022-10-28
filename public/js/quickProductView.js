
function quickProductView(id){
   console.log(id);
    
    $.ajax({
        url : `/product-quick-view/${id}`,
        method : 'get',
        success : (response)=>{
            document.getElementById('productName').innerHTML=response.name
            $("#mainImageQuickView").attr("src", response.images[0].image);
            $("#mainImageQuickViewList").attr("src", response.images[0].image);
            for(var i=0;i<response.images.length;i++){
                $(`#quickViewImage${i}List`).attr("src", response.images[i].image);
                $(`#quickViewImage${i}`).attr("src", response.images[i].image); 
            }
            for(var i=response.images.length;i<4;i++){
                $(`#quickViewImage${i}List`).attr("src", 'https://t3.ftcdn.net/jpg/04/34/72/82/240_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg');
                $(`#quickViewImage${i}`).attr("src", 'https://t3.ftcdn.net/jpg/04/34/72/82/240_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg');  
            }
            document.getElementById('productCategory').innerHTML=response.category
            document.getElementById('productPrice').innerHTML='₹'+response.price
            document.getElementById('productDiscount').innerHTML='₹'+response.discount
            document.getElementById('productDescription').innerHTML=response.description
            document.getElementById('productQuantity').innerHTML=response.stock
            let id=response._id
            $('#addToCartFunction').click((e)=>{
                $.ajax({
                    url: `/check-exist-product-in-cart/${id}`,
                    method: 'get',
                    success: (response) => {
                        if (response.productExist==true) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'info',
                                text: 'Product already exist in your cart',
                                showConfirmButton: false,
                                timer: 1000,
                                
                              })
                        } else if (response.userExist == false) {
                            Swal.fire({
                                html:'<a href="/login">Login Now!</a> ' ,
                                title: 'Not loggined Yet?',
                                text : 'Login now to continue shopping',
                                icon: 'question',
                                showConfirmButton: false,
                                showCancelButton : true
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
                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            title: 'Product added to your cart',
                                            showConfirmButton: false,
                                            timer: 1000
                                          })
                                    }
                                }
                            })
                        }
                    }
                })
            })
        }
       }).then(()=>{
        $('.product_quickview').addClass('active');
        $('body').css('overflow-y', 'hidden')
       })
       
}
