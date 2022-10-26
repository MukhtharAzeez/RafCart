function confirmOrder(method){
    
    let fullName = $('#fullName').html()
    let mobile = $('#mobile').html()
    let address = $('#address').html()
    
   
    if(method=='COD'){
        $.ajax({
            url : '/place-an-order',
            method : 'post',
            data : {
                fullName : fullName,
                mobile : mobile,
                address : address,
                paymentMethod : method
            },
            success : (response)=>{
                console.log(response)
                    location.href =`/order-successfully-placed?orderId=${response}`
            }
        })
    }else{
        $.ajax({
            url : '/place-an-order',
            method : 'post',
            data : {
                fullName : fullName,
                mobile : mobile,
                address : address,
                paymentMethod : method
            },
            success : (response)=>{
                razorpayPayment(response)
            }
        })
    }
}

function razorpayPayment(order){
    console.log(order,"razorpayPayment");
    var options = {
        "key": "rzp_test_TgmiJlT8sVrP4A", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "La Bonnz",
        "description": "Test Transaction",
        "image": "https://www.freepnglogos.com/uploads/batman-begins-logo-png-20.png",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            verifyPayment(response,order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    console.log("toOpen razorpayPayment");
    rzp1.open();
}

function verifyPayment(paymentDetails,order){
    $.ajax({
        url : '/verify-payment',
        method : 'post',
        data : {
            paymentDetails,
            order
        },
        success : (response) => {
            console.log(response);
            location.href =`/order-successfully-placed?orderId=${response}`
            // if(response.onlinePaymentSuccess){
            //     location.href =`/order-successfully-placed?=${response.orderId}`
            // }
        }
    })
}