// const { $where } = require("../../models/user_schema");

// function saveAddress(...address){
//     console.log(address);
    
// }

function placeOrder(){
    let index=$('input[name="address"]:checked').val();
    if(index!=undefined){
      
        location.href = `/payment-page/${index}`
       
        
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You must select a Address',
          })
    }
}

