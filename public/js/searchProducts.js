function searchProducts(){
    let search = $('#show_suggest').val();
    if(search.length>0){
        $.ajax({
            url : `product-search-result?name=${search}`,
            method : 'get',
            success : (response)=>{
                let html=''
                response.forEach((item)=>{
                    html +=`<a href="/view-single-product?productId=${item._id}" class="single_sresult_product">
                    <div class="sresult_img">
                        <img loading="lazy"  src="${item.images[0].image}" alt="product">
                    </div>
                    <div class="sresult_content">
                        <h4>${item.name}</h4>
                        <div class="price">
                            <span class="org_price">₹${item.discount}.00</span>
                        </div>
                    </div>
                </a>`
                })
                $('#divForSearch').html(html)
            }
        })
    }else{
        let html=''
        $('#divForSearch').html(html)
    }
    
}
