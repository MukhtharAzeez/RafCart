$('#otpForm').submit((e)=>{
    e.preventDefault();
    $.ajax({
        url : '/verify-through-otp',
        method : 'post',
        data : $('#otpForm').serialize(),
        success : (response)=>{
            console.log("response",response)
            if(response.status==true){
                // location.href ='/'
                console.log(response)
            }else{
                $('#otpAlert').removeClass('d-none')
            }
        }
    })
})


