$("#passwordError").hide();
$("#confirmPasswordError").hide();

let passwordSuccess=false;
let confirmPasswordSuccess=false;


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
 
 if(pattern.test(password) && password.length>=8 && password.length<=14){
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
//  check_submission();
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


// Confirm Password Validation

$('#confirmPassword').on('keyup',()=>{
    check_confirmPassword();
})
$('#confirmPassword').focusout(()=>{
    check_confirmPasswordFocusout();
})

function check_confirmPassword(){
 var pattern = /^[0-9a-zA-Z]*$/;
 var password =$('#password').val()
 var confirmPassword =$('#confirmPassword').val()
 
 if(password === confirmPassword){ 
    $('#confirmPassword').css("border","1px solid #34F458")
    $("#confirmPasswordError").hide(); 
    confirmPasswordSuccess = true 
 }else if(confirmPassword.length==0) {
    $('#confirmPassword').css("border","1px solid red")
    $("#confirmPasswordError").hide();
    confirmPasswordSuccess = false
 }else{
    $('#confirmPassword').css("border","1px solid red")
    $("#confirmPasswordError").show();
    confirmPasswordSuccess = false
 }
//  check_submission();
}

function check_confirmPasswordFocusout(){
   
    var confirmPassword =$('#confirmPassword').val()
    if(confirmPassword.length==0){
        $("#confirmPasswordError1").hide();
        $("#confirmPasswordError2").hide();
        $('#confirmPassword').css("border","1px solid #d9d0d0")
        confirmPasswordSuccess = false
    }
}

$("#forgotPasswordForm").submit(function(e){
    e.preventDefault();
    console.log(passwordSuccess,confirmPasswordSuccess)
    if(passwordSuccess===true && confirmPasswordSuccess){
        $.ajax({
         url : "/password-change",
         method : "post",
         data : $('#forgotPasswordForm').serialize(),
         success : (response)=>{
             console.log(response)
             if(response.status){
                 location.href = '/login'
             }
         }
     })
    }else{
        console.log("false");
    }
 })