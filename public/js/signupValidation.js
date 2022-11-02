$("#fullNameError").hide();
$("#emailError").hide();
$("#phoneError").hide();
$("#passwordError").hide();
$("#confirmPasswordError").hide();
$("#SubmitButton").hide();

let fullNameSuccess=false;
let emailSuccess=false;
let phoneSuccess=false;
let passwordSuccess=false;
let confirmPasswordSuccess=false;

// Name Validation
$('#fullName').on('keyup',()=>{
    check_fullName();
})
$('#fullName').focusout(()=>{
    check_fullNameFocusout();
})

function check_fullName(){
 var pattern = /^[a-z A-Z]*$/;
 var fname =$('#fullName').val()
 if(pattern.test(fname) && fname.length!=0){
    $('#fullName').css("border","1px solid #34F458")
    $("#fullNameError").hide();
    fullNameSuccess=true;
 }else if(fname.length==0) {
    $('#fullName').css("border","1px solid red")
    $("#fullNameError").hide();
    fullNameSuccess=false;
 }else{
    $('#fullName').css("border","1px solid red")
    $("#fullNameError").show();
    fullNameSuccess=false;
 }
 check_submission();
}
function check_fullNameFocusout(){
    var fname =$('#fullName').val()
    if(fname.length==0){
        $("#fullNameError").hide();
        $('#fullName').css("border","1px solid #d9d0d0")
        fullNameSuccess=false;
    }
}


// Email Validation

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
 check_submission();
}
function check_emailFocusout(){
    var email =$('#email').val()
    if(email.length==0){
        $("#emailError").hide();
        $('#email').css("border","1px solid #d9d0d0")
        emailSuccess=false;
    }
}

// Phone Number Validation

$('#phone').on('keyup',()=>{
    check_phone();
})
$('#phone').focusout(()=>{
    check_phoneFocusout();
})

function check_phone(){
 var pattern = /^[0-9]*$/;
 var phone =$('#phone').val()

 if(pattern.test(phone) && phone.length==10){
    $('#phone').css("border","1px solid #34F458")
    $("#phoneError").hide();
    phoneSuccess = true
 }else if(phone.length==0) {
    $('#phone').css("border","1px solid red")
    $("#phoneError").hide();
    phoneSuccess = false
 }else{
    $('#phone').css("border","1px solid red")
    $("#phoneError").show();
    phoneSuccess = false
 }
 check_submission();
}
function check_phoneFocusout(){
    var phone =$('#phone').val()
    if(phone.length==0){
        $("#phoneError").hide();
        $('#phone').css("border","1px solid #d9d0d0")
        phoneSuccess = false
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
 check_submission();
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
 check_submission();
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

 function check_submission(){
    console.log(fullNameSuccess,emailSuccess,phoneSuccess,passwordSuccess,confirmPasswordSuccess)
    if(fullNameSuccess===true && emailSuccess === true && phoneSuccess===true && passwordSuccess===true && confirmPasswordSuccess==true){
          $("#SubmitButton").show();     
    }else{
        $("#SubmitButton").hide();
    }
 }




// $("#registrationForm").submit(function(){
//     var fname =$('#fullName').val()
//     var email =$('#email').val()
//     var phone =$('#phone').val()
//     var password =$('#password').val()
//     var confirmPassword =$('#confirmPassword').val()
//    if(fullNameSuccess===true && emailSuccess === true && phoneSuccess===true && passwordSuccess===true && confirmPasswordSuccess){
//        $.ajax({
//         url : "/register",
//         method : "post",
//         data :{
//             userName : fname,
//             email : email, 
//             phone : phone,
//             password : password,
//             confirmPassword : confirmPassword,
//         },
//         response : (response)=>{
//             console.log(response);
//         }
//     })
//    }else{
//        console.log("false");
//    }
// })

