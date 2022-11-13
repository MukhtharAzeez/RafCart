$("#emailError").hide();
$("#passwordError").hide();
// $("#loginButton").hide();

let emailSuccess=false;
let phoneSuccess=false;



$('#email').on('keyup',()=>{
    check_email();
})
$('#email').focusout(()=>{
    check_emailFocusout();
})

function check_email(){
 var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

 var email =$('#email').val()
 if(pattern.test(email) && email.length!=0){
    $('#email').css("border","1px solid #34F458")
    $("#emailError").hide();
    emailSuccess = true
 }else if(email.length==0) {
    $('#email').css("border","1px solid red")
    $("#emailError").hide();
    emailSuccess=false;
 }else{
    $('#email').css("border","1px solid red")
    $("#emailError").show();
    emailSuccess=false;
 }
//  check_submission();
}
function check_emailFocusout(){
    var email =$('#email').val()
    if(email.length==0){
        $("#emailError").hide();
        $('#email').css("border","1px solid #d9d0d0")
        emailSuccess=false;
    }
}



// Password Validation

$('#password').on('keyup',()=>{
    check_password();
})
$('#password').focusout(()=>{
    check_passwordFocusout();
})

function check_password(){
 var pattern = /^[0-9a-zA-Z]*$/;
 var password =$('#password').val()
 
 if(pattern.test(password) && password.length>=8){
    $('#password').css("border","1px solid #34F458")
    $("#passwordError").hide();
    passwordSuccess =true 
 }else if(password.length==0) {
    $('#password').css("border","1px solid red")
    $("#passwordError").hide();
    passwordSuccess =false
 }else{
    $('#password').css("border","1px solid red")
    $("#passwordError").show();
    passwordSuccess =false
 }
 
}
function check_passwordFocusout(){
    var password =$('#password').val()
    if(password.length==0){
        $("#passwordError1").hide();
        $("#passwordError2").hide();
        $('#password').css("border","1px solid #d9d0d0")
        passwordSuccess =false
    }
}

$('#loginForm').submit((e)=>{
    e.preventDefault();
    if(emailSuccess === true && passwordSuccess===true){
    
                var email =$('#email').val()
                var password =$('#password').val()
        
                $.ajax({
                    url : '/email-password-check',
                    method : 'post',
                    data : {
                        email : email,
                        password : password,
                    },
                    success : (response)=>{
                        console.log(response)
                        if(response.email && response.password){
                            $.ajax({
                                url : '/login',
                                method : 'post',
                                data : $('#loginForm').serialize(),
                                success : (response)=>{
                                    if(response.status){
                                        location.href = '/'
                                    }else if(response.otp){
                                        location.href = '/check-user-verification'
                                    }
                                }
                            })
                        }else if(response.email==false){
                            document.getElementById('emailError').innerHTML='You did not create an account yet! do signup'
                            $("#emailError").show() 
                        }else if(response.password==false){
                            $('#password').css("border","1px solid red")
                            document.getElementById('passwordError').innerHTML='Entered credential is invaliid'
                            $("#passwordError").show()
                        }else if(response.userBlocked==true){
                            document.getElementById('emailError').innerHTML='You did not have an access to login now'
                            $("#emailError").show()
                            $('#password').css("border","1px solid red")
                        }
                        
                    }
                })
        
                     
            }
})

// function check_submission(){
//     if(emailSuccess === true && passwordSuccess===true){
    
//         var email =$('#email').val()
//         var password =$('#password').val()

//         $.ajax({
//             url : '/email-password-check',
//             method : 'post',
//             data : {
//                 email : email,
//                 password : password,
//             },
//             success : (response)=>{
//                 if(response.email && response.password){
//                     $("#loginButton").show();  
//                 }else if(response.email==false){
//                     document.getElementById('emailError').innerHTML='You didn not create a account yet! do signup'
//                     $("#emailError").show()
//                     $("#loginButton").hide();
                  
//                 }else if(response.password==false){
//                     $('#password').css("border","1px solid red")
//                     document.getElementById('passwordError').innerHTML='Entered password is incorrect'
//                     $("#passwordError").show()
//                 }else if(response.userBlocked==true){
//                     document.getElementById('emailError').innerHTML='You did not have an access to login now'
//                     $("#emailError").show()
//                     $('#password').css("border","1px solid red")
//                 }
                
//             }
//         })

             
//     }else{
//         $("#loginButton").hide();
//     }
//  }