function getAllStates(){
    $.ajax({
        url: '/getAllStates',
        method : 'get',
        success: (response)=>{
            console.log(response);
        }
        
    })
}

