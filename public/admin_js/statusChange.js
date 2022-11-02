function statusChange(id){
    var e = document.getElementById("statusSelect");
    var value = e.value;
    $.ajax({
        url : `/admin/change-order-status`,
        method : 'post',
        data : {
            orderId : id,
            changeStatus : value
        },
        success : (response)=>{
            console.log(response)
        }
    });
}