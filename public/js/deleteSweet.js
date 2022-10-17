
document.getElementById('deleteButton').addEventListener('click', function () {
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
        const productId = document.getElementById("productId").innerHTML;
        window.location =`/admin/delete-product/${productId}`
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
  });

  document.getElementById('undoButton').addEventListener('click', function () {
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
        const productId = document.getElementById("productId").innerHTML;
        window.location =`/admin/undo-product/${productId}`
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
  });