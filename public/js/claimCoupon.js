function claimCoupon(code){
    $.ajax({
        url : `/claim_coupon?code=${code}`,
        method : 'get',
        success : (response)=>{
            if(response.status){
                $(`#claimButtton${code}`).addClass('d-none')
                $(`#claimedButtton${code}`).removeClass('d-none')
            }
        }
    })
}