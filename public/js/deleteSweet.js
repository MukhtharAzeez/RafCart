
function deleteButton(id){
   console.log(id);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
        window.location =`/admin/delete-product/${id}`
        Swal.fire({
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            
          })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  };


  function undoButton(id){
    console.log(id);
     const swalWithBootstrapButtons = Swal.mixin({
       customClass: {
         confirmButton: 'btn btn-success',
         cancelButton: 'btn btn-danger'
       },
       buttonsStyling: false
     })
 
     swalWithBootstrapButtons.fire({
       title: 'Are you sure?',
       text: "You won't be able to revert this!",
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'confirm',
       cancelButtonText: 'cancel',
       reverseButtons: true
     }).then((result) => {
       if (result.isConfirmed) {
         
         window.location =`/admin/undo-product/${id}`
         Swal.fire({
             icon: 'success',
             title: 'Success',
             showConfirmButton: false,
             
           })
       } else if (
         /* Read more about handling dismissals below */
         result.dismiss === Swal.DismissReason.cancel
       ) {
         swalWithBootstrapButtons.fire(
           'Cancelled',
           'Your imaginary file is safe :)',
           'error'
         )
       }
     })
   };