$('#otpForm').submit((e)=>{
    console.log("hiiii")
    e.preventDefault();
    $.ajax({
        url : '/verify-through-otp',
        method : 'post',
        data : $('#otpForm').serialize(),
        success : (response)=>{
            console.log(response)
            if(response.status){
                location.href ='/'
            }else{
                $('#otpAlert').removeClass('d-none')
            }
        }
    })
})


