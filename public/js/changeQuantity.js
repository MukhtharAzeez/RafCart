function changeQuantity(cartId, productId, count) {
  let quantity = parseInt(document.getElementById(productId).innerHTML);

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
        document
          .getElementById("plusButtonCart" + productId)
          .classList.add("d-none");
        document
          .getElementById("minusButtonCart" + productId)
          .classList.add("d-none");
        document.getElementById(productId).style.width = "110px";
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
              document.getElementById("totalAMount").innerHTML =
                response.result.total;
              document.getElementById("price" + productId).innerHTML =
                response.result.productTotal.productTotal;
              document.getElementById("subTotal").innerHTML =
                response.result.total;
              document
                .getElementById("plusButtonCart" + productId)
                .classList.remove("d-none");
              document
                .getElementById("minusButtonCart" + productId)
                .classList.remove("d-none");
              document.getElementById(productId).style.width = "40px";




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

              // Alert to confirm delete
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
                  removedProduct.remove();
                  let count = parseInt(document.getElementById("cart-count").innerHTML)
                  document.getElementById("cart-count").innerHTML = count - 1
                  document.getElementById("totalAMount").innerHTML = response.total;
                  document.getElementById("subTotal").innerHTML = response.total;
                  if (response.total.length == 0) {
                    document.getElementById('proceedButton').innerHTML = `<a href="/shop"><button>Browse Some Products</button></a>`
                  }
                  Swal.fire({
                    icon: "error",
                    title: "Deleted!",
                    text: "Product Deleted from Cart!",
                    background: "black",
                  });
                } else {
                  document
                    .getElementById("plusButtonCart" + productId)
                    .classList.remove("d-none");
                  document
                    .getElementById("minusButtonCart" + productId)
                    .classList.remove("d-none");
                  document.getElementById(productId).style.width = "40px";
                }
              })


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
              response.result.total;
            document.getElementById("cart-count").innerHTML = count - 1

            if (response.result.total == 0) {
              document.getElementById('proceedButton').innerHTML = `<a href="/shop"><button>Browse Some Products</button></a>`
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
}
