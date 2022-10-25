function addToWishList(id){
    count=parseInt(document.getElementById('wishListCount').innerHTML)
    $.ajax({
        url : `/add-to-wishList/${id}`,
        method : 'get',
        success: (response)=>{
            if(response.status){
                document.getElementById('wishListCount').innerHTML=count+1
                // console.log(document.getElementById('addToWishListFirst'+id))
                // document.getElementById('addToWishListSecond'+id).classList.remove('d-none')
                // document.getElementById('removeFromWishListFirst'+id).classList.add('d-none')
                // document.getElementById('removeFromWishListSecond'+id).classList.add('d-none')
            }else if(response.productExist){
                Swal.fire({
                    position: 'top-end',
                    icon: 'info',
                    text: 'Product already exist in your wishlist',
                    showConfirmButton: false,
                    timer: 1000,
                    
                  })
            }else{
                Swal.fire({
                    html:'<a href="/login">Login Now!</a> ' ,
                    title: 'Not loggined Yet?',
                    text : 'Login now to continue shopping',
                    icon: 'question',
                    showConfirmButton: false,
                    showCancelButton : true
                })
            }
        }
    })
}

function removeFromWishList(id){
    divToRemove=document.getElementById('remove'+id);
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
            url : `/remove-from-wish-list/${id}`,
            method: "get",
            success: (response) => {
              if (response.status) {
                divToRemove.remove();
              }
            },
          })
        }
      });
}

