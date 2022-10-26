function changeQuantity(cartId, productId, count) {
  let quantity = parseInt(document.getElementById(productId).innerHTML);
  let removedProduct = document.getElementById("remove" + productId);
  count = parseInt(count);
  document.getElementById("plusButtonCart"+productId).classList.add('d-none')
  document.getElementById("minusButtonCart"+productId).classList.add('d-none')
  document.getElementById(productId).style.width="110px"
  $.ajax({
    url: "/change-cart-quantity",
    data: {
      cartId: cartId,
      productId: productId,
      count: count,
      quantity: quantity,
    },

    method: "post",
    success: (response) => {
      console.log(response);
      if (response.status) {
        document.getElementById(productId).innerHTML = quantity + count;
        document.getElementById("totalAMount").innerHTML = response.result.total;
        document.getElementById("price" + productId).innerHTML =response.result.productTotal.productTotal;
        document.getElementById("subTotal").innerHTML = response.result.total;
        document.getElementById("plusButtonCart"+productId).classList.remove('d-none')
        document.getElementById("minusButtonCart"+productId).classList.remove('d-none')
        document.getElementById(productId).style.width="40px"
        $.ajax({
          
          url: "/change-product-total-price",
          data: {
            cartId: cartId,
            total : response.result.productTotal.productTotal,
            productId: productId,
            count: count,
            quantity: quantity,
          },

          method: "post",
          success : (response)=>{
          }
        });
      } else {
        removedProduct.remove();
        document.getElementById("totalAMount").innerHTML = response.total;
        document.getElementById("subTotal").innerHTML = response.total;
        Swal.fire({
          icon: "error",
          title: "Deleted!",
          text: "Product Deleted from Cart!",
        });
      }
    },
  });
}

function removeProduct(cartId, productId) {
  let removedProduct = document.getElementById("remove" + productId);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
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
            console.log(response);
            removedProduct.remove();
            document.getElementById("totalAMount").innerHTML = response.result.total;
            document.getElementById("subTotal").innerHTML = response.result.total;
          }
        },
      }).then(() => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Product removed from your cart',
            showConfirmButton: false,
            timer: 1000
          })
      });
    }
  });
}
