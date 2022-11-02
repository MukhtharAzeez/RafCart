// function fileUpload(){
//     console.log("Hello")
// }
// console.log("jii")
// $('#formFile-3-invalid').change(function(ev) {
//     console.log(ev)
// });

var fileInput = document.getElementById('formFile-3-invalid');
fileInput.onchange = function () {
    var input = this.files[0]; 
    if (input) {
        $('#formFile-3-invalid').removeClass('is-invalid')
        $('#formFile-3-invalid').addClass('is-valid')
    } else {
        $('#formFile-3-invalid').addClass('is-invalid')
        $('#formFile-3-invalid').removeClass('is-valid')
    }
};

