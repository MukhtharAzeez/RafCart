function changeQuantity(cartId, productId, count) {
  
  let quantity = parseInt(document.getElementById(productId).innerHTML);

  $.ajax({
    url : '/coupon-exist-check',
    method : 'get',
    success : (response)=>{
      if(response.status){

        // Product Stock Check
        $.ajax({
          url: "/product-stock-check",
          method: "post",
          data: {
            productId: productId,
            quantity: quantity,
            count: count,
          },
          success: (response) => {
            if (response.status) {
              let removedProduct = document.getElementById("remove" + productId);
              count = parseInt(count);
              $.ajax({
                url: "/change-cart-quantity",
                method: "post",
                data: {
                  cartId: cartId,
                  productId: productId,
                  count: count,
                  quantity: quantity,
                },
      
                
                success: (response) => {
                  console.log(response)
                  if (response.status) {
                    document.getElementById(productId).innerHTML = quantity + count;
                    document.getElementById("totalAMount").innerHTML = response.result.total;
                    document.getElementById("price" + productId).innerHTML = response.result.productTotal.productTotal;
                    document.getElementById("subTotal").innerHTML = response.result.subTotal;
                    $.ajax({
                      url: "/change-product-total-price",
                      data: {
                        cartId: cartId,
                        total: response.result.productTotal.productTotal,
                        productId: productId,
                        count: count,
                        quantity: quantity,
                      },
      
                      method: "post",
                      success: (response) => { },
                    });
                  } else {
      
                      console.log(response)
                        removedProduct.remove();
                        let count = parseInt(document.getElementById("cart-count").innerHTML)
                        document.getElementById("cart-count").innerHTML = count - 1
                        document.getElementById("totalAMount").innerHTML = response.total[0].total;
                        document.getElementById("subTotal").innerHTML = response.total[0].subTotal;
                        if (response.total[0].total == 0) {
                          document.getElementById('proceedButton').innerHTML = `<a href="/shop"><button>Browse Some Products</button></a>`
                          $('#discountOnCoupon').html('0')
                          $('#couponButton').hide();
                          $('#couponBox').hide();
                        }
                        Swal.fire({
                          icon: "error",
                          title: "Deleted!",
                          text: "Product Deleted from Cart!",
                          background: "black",
                        });
                  }
                },
              });
            } else {
              Swal.fire({
                imageUrl:
                  "https://res.cloudinary.com/dr2hks7gt/image/upload/v1667001964/La%20Bonnz/kindpng_2657327_nwna50.png",
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: "Custom image",
                background: "black",
              });
            }
          },
        });
      }else{
        Swal.fire({
          title : 'Applied a Coupon?',
          text : 'either you remove that coupon or proceed to checkout?',
          background : 'black'
        })
      }
    }
  })
}

function removeProduct(cartId, productId) {

  $.ajax({
    url : '/coupon-exist-check',
    method : 'get',
    success : (response)=>{
      if(response.status){

        let removedProduct = document.getElementById("remove" + productId);
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
          background: "black",
        }).then((result) => {
          if (result.isConfirmed) {
            $.ajax({
              url: "/removeCartItem",
              data: {
                cartId: cartId,
                productId: productId,
              },
              method: "post",
              success: (response) => {
                if (response.status) {
                  let count = parseInt(document.getElementById("cart-count").innerHTML)
                  removedProduct.remove();
                  document.getElementById("totalAMount").innerHTML =
                    response.result.total;
                  document.getElementById("subTotal").innerHTML =
                    response.result.subTotal;
                  document.getElementById("cart-count").innerHTML = count - 1
      
                  if (response.result.total  == 0) {
                    document.getElementById('proceedButton').innerHTML = `<a href="/shop"><button>Browse Some Products</button></a>`
                    $('#discountOnCoupon').html('0')
                    $('#couponButton').hide();
                    $('#couponBox').hide();
                  }
                }
              },
            }).then(() => {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Product removed from your cart",
                showConfirmButton: false,
                timer: 1000,
                background: "black",
              });
            });
          }
        });
      }else{
        Swal.fire({
          title : 'Applied a Coupon?',
          text : 'either you remove that coupon or proceed to checkout?',
          background : 'black'
        })
      }
    }})
}


function applyCoupon(code){
  let total = parseInt(document.getElementById('totalAMount').innerHTML)
    $.ajax({
    url : '/check-cart-exist',
    method : 'get',
    success : (response)=>{
      if(response.status){

        
        Swal.fire({
          title: 'Are you sure?',
          text: "Adding products after applying coupon is not possible!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          background : 'black'
        }).then((result) => {
          if (result.isConfirmed) {
            $.ajax({
              url : `/check-for-coupon?code=${code}`,
              method : 'get',
              success : (response)=>{
                console.log(response)
                if(response.status){
                  $.ajax({
                    url : `/apply-coupon?code=${code}`,
                    method : 'get',
                    success : (response)=>{
                      if(response.status){
                        document.getElementById("totalAMount").innerHTML =
                        response.total;
                        document.getElementById("discountOnCoupon").innerHTML =
                        -response.discount;
                        $('#couponBox').hide();
                        $('#applyButton').hide();
                        $('#removeCoupon').removeClass('d-none')
                        $('#couponButton').hide();
                      }else{
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Unfortunately this coupon not for you',
                          background : 'black'
                        })
                      }
                     
                    }
                  })
                }
              }
            })
          }
        })
      }else{
        Swal.fire({
          title : 'Cart is empty?',
          text : 'Add some product before applying coupon',
          icon : 'question',
          background : 'black'
        })
      }
    }
  })

  
}

function removeCoupon(code){
  
  $.ajax({
    url : `/check-for-coupon?code=${code}`,
    method : 'get',
    success : (response)=>{
      
      if(response.status){
        $.ajax({
          url : `/remove-coupon?code=${code}`,
          method : 'get',
          success : (response)=>{
            
            if(response.status){
              document.getElementById("totalAMount").innerHTML =
              response.total;
              document.getElementById("discountOnCoupon").innerHTML =
              response.discount;
              $('#removeCoupon').addClass('d-none')
              $('#couponBox').show();
              $('#applyButton').show();
              $('#couponButton').show();
            }else{
      
            }
           
          }
        })
      }
    }
  })
}