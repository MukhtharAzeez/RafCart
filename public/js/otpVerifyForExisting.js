$('#otpForm').submit((e)=>{
    e.preventDefault();
    $.ajax({
        url : '/verify-through-otp',
        method : 'post',
        data : $('#otpForm').serialize(),
        success : (response)=>{
            console.log(response)
            if(response.status==true){
                location.href ='/'
            }else if (response.status == 'password'){
                location.href = '/password-change-page'
            }else{
                $('#otpAlert').removeClass('d-none')
            }
        }
    })
})


