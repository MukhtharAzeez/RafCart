function addToWishList(id){
    count=parseInt(document.getElementById('wishListCount').innerHTML)
    $.ajax({
        url : `/add-to-wishList/${id}`,
        method : 'get',
        success: (response)=>{
            if(response.status){
                document.getElementById('wishListCount').innerHTML=count+1
                $('#addToWishListFirst'+id).removeClass("d-none");
                $('#addToWishListSecond'+id).removeClass("d-none");
                $('#removeFromWishListFirst'+id).addClass("d-none");
                $('#removeFromWishListSecond'+id).addClass("d-none");
            }else if(response.productExist){
              document.getElementById('wishListCount').innerHTML=count-1
                $('#addToWishListFirst'+id).addClass("d-none");
                $('#addToWishListSecond'+id).addClass("d-none");
                $('#removeFromWishListFirst'+id).removeClass("d-none");
                $('#removeFromWishListSecond'+id).removeClass("d-none");
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
        background : 'black'
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url : `/remove-from-wish-list/${id}`,
            method: "get",
            success: (response) => {
              if (response.status) {
               
                divToRemove.remove();
                let count=parseInt(document.getElementById("wishListCount").innerHTML)
                document.getElementById("wishListCount").innerHTML =count-1
              }
            },
          })
        }
      });
}

