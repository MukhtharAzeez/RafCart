// function quickProductView(id){
//     $('.product_quickview').addClass('active');
//     $('body').css('overflow-y', 'hidden')
    
//    var html
   
//    $.ajax({
//     url : `/product-quick-view/${id}`,
//     method : 'get',
//     success : (response)=>{
//         console.log("response",response);  
//     }
//    })
//    html += `<div class="prodquick_wrap position-relative">
//    <div class="close_quickview">
//        <i class="las la-times"></i>
//    </div>
//    <div class="row" >
//        <div class="col-lg-6">
//            <div class="product_view_slider">
//                <div class="single_viewslider">
//                    <img loading="lazy"  src="images/slider-1.png" alt="product">
//                </div>
//                <div class="single_viewslider">
//                    <img loading="lazy"  src="images/slider-2.png" alt="product">
//                </div>
//                <div class="single_viewslider">
//                    <img loading="lazy"  src="images/slider-3.png" alt="product">
//                </div>
//                <div class="single_viewslider">
//                    <img loading="lazy"  src="images/slider-4.png" alt="product">
//                </div>
//                <div class="single_viewslider">
//                    <img loading="lazy"  src="images/slider-5.png" alt="product">
//                </div>
//                <div class="single_viewslider">
//                    <img loading="lazy"  src="images/slider-1.png" alt="product">
//                </div>
//            </div>
           
//        <div class="product_viewslid_nav">
//                <div class="single_viewslid_nav">
//                    <img loading="lazy"  src="images/slider-1.png" alt="product">
//                </div>
//                <div class="single_viewslid_nav">
//                    <img loading="lazy"  src="images/slider-2.png" alt="product">
//                </div>
//                <div class="single_viewslid_nav">
//                    <img loading="lazy"  src="images/slider-3.png" alt="product">
//                </div>
//                <div class="single_viewslid_nav">
//                    <img loading="lazy"  src="images/slider-4.png" alt="product">
//                </div>
//                <div class="single_viewslid_nav">
//                    <img loading="lazy"  src="images/slider-5.png" alt="product">
//                </div>
//                <div class="single_viewslid_nav">
//                    <img loading="lazy"  src="images/slider-1.png" alt="product">
//                </div>
//            </div>
//        </div>
//        <div class="col-lg-6">
//            <div class="product_info_wrapper">
//                <div class="product_base_info">
//                    <h1>MEN'S ADIDAS COURTSMASH</h1>
//                    <div class="rating">
//                        <div class="d-flex align-items-center">
//                            <div class="rating_star">
//                                <span><i class="las la-star"></i></span>
//                                <span><i class="las la-star"></i></span>
//                                <span><i class="las la-star"></i></span>
//                                <span><i class="las la-star"></i></span>
//                                <span><i class="las la-star"></i></span>
//                            </div>
//                            <p class="rating_count">50 Reviews</p>
//                        </div>
//                    </div>
//                    <div class="product_other_info">
//                        <p><span class="text-semibold">Availability:</span><span class="text-green">In
//                                Stock</span></p>
//                        <p><span class="text-semibold">Brand:</span>Bata</p>
//                        <p><span class="text-semibold">Category:</span>Clothing</p>
//                        <p><span class="text-semibold">SKU:</span>BE45VGRT</p>
//                    </div>
//                    <div class="price mt-3 mb-3 d-flex align-items-center">
//                        <span class="prev_price ms-0">$5000.00</span>
//                        <span class="org_price ms-2">$4500.00</span>
//                        <div class="disc_tag ms-3">-30%</div>
//                    </div>
//                    <div class="pd_dtails">
//                        <p>
//                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim exercitationem
//                            quaerat....
//                        </p>
//                    </div>
//                    <div class="shop_filter border-bottom-0 pb-0">
//                        <div class="size_selector mb-3">
//                            <h5>Size</h5>
//                            <div class="d-flex align-items-center">
//                                <div class="single_size_opt">
//                                    <input type="radio" hidden name="size" class="size_inp" id="size-xs">
//                                    <label for="size-xs">XS</label>
//                                </div>
//                                <div class="single_size_opt ms-2">
//                                    <input type="radio" hidden name="size" class="size_inp" id="size-s">
//                                    <label for="size-s">S</label>
//                                </div>
//                                <div class="single_size_opt ms-2">
//                                    <input type="radio" hidden name="size" class="size_inp" id="size-m" checked>
//                                    <label for="size-m">M</label>
//                                </div>
//                                <div class="single_size_opt ms-2">
//                                    <input type="radio" hidden name="size" class="size_inp" id="size-l">
//                                    <label for="size-l">L</label>
//                                </div>
//                                <div class="single_size_opt ms-2">
//                                    <input type="radio" hidden name="size" class="size_inp" id="size-xl">
//                                    <label for="size-xl">XL</label>
//                                </div>
//                            </div>
//                        </div>
//                        <div class="size_selector color_selector">
//                            <h5>Color:</h5>
//                            <div class="d-flex align-items-center">
//                                <div class="single_size_opt">
//                                    <input type="radio" hidden name="color" class="size_inp" id="color-purple">
//                                    <label for="color-purple" class="bg-color" data-bs-toggle="tooltip"
//                                           title="Rose Red"></label>
//                                </div>
//                                <div class="single_size_opt ms-2">
//                                    <input type="radio" hidden name="color" class="size_inp" id="color-red">
//                                    <label for="color-red" class="bg-white" data-bs-toggle="tooltip"
//                                           title="White"></label>
//                                </div>
//                                <div class="single_size_opt ms-2">
//                                    <input type="radio" hidden name="color" class="size_inp" id="color-green"
//                                           checked>
//                                    <label for="color-green" class="bg-dark" data-bs-toggle="tooltip"
//                                           title="Black"></label>
//                                </div>
//                            </div>
//                        </div>
//                    </div>
//                    <div class="cart_qnty ms-md-auto">
//                        <p>Quantity</p>
//                        <div class="d-flex align-items-center">
//                            <div class="cart_qnty_btn">
//                                <i class="las la-minus"></i>
//                            </div>
//                            <div class="cart_count">4</div>
//                            <div class="cart_qnty_btn">
//                                <i class="las la-plus"></i>
//                            </div>
//                        </div>
//                    </div>
//                </div>
//                <div class="product_buttons">
//                    <a href="#" class="default_btn me-sm-3 me-2 px-2 px-lg-4"><i
//                            class="icon-cart me-2"></i> Add to Cart</a>
//                    <a href="#" class="default_btn second px-3 px-ms-4"><i class="icon-heart me-2"></i>
//                        Wishlist</a>
//                </div>
//                <div class="share_icons footer_icon d-flex">
//                    <a href="#"><i class="lab la-facebook-f"></i></a>
//                    <a href="#"><i class="lab la-twitter"></i></a>
//                    <a href="#"><i class="lab la-instagram"></i></a>
//                </div>
//            </div>
//        </div>
//    </div>
// </div>`

// let sdkjakl=document.getElementById('gjhjkkhkjhkjkjlk')
//    console.log("First",sdkjakl.innerHTML);
// //    newDiv.innerHTML=html
// sdkjakl.innerHTML= html

//    console.log("last",sdkjakl.innerHTML);
// }

function quickProductView(id){
   
    
    $.ajax({
        url : `/product-quick-view/${id}`,
        method : 'get',
        success : (response)=>{
            document.getElementById('productName').innerHTML=response.name
            $("#mainImageQuickView").attr("src", response.images[0].image);
            $("#mainImageQuickViewList").attr("src", response.images[0].image);
            for(var i=0;i<response.images.length;i++){
                $(`#quickViewImage${i}List`).attr("src", response.images[i].image);
                $(`#quickViewImage${i}`).attr("src", response.images[i].image); 
            }
            for(var i=response.images.length;i<4;i++){
                $(`#quickViewImage${i}List`).attr("src", 'https://t3.ftcdn.net/jpg/04/34/72/82/240_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg');
                $(`#quickViewImage${i}`).attr("src", 'https://t3.ftcdn.net/jpg/04/34/72/82/240_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg');  
            }
            document.getElementById('productCategory').innerHTML=response.category
            document.getElementById('productPrice').innerHTML='₹'+response.price
            document.getElementById('productDiscount').innerHTML='₹'+response.discount
            document.getElementById('productDescription').innerHTML=response.description
            document.getElementById('productQuantity').innerHTML=response.stock
            let id=response._id
            $('#addToCartFunction').click((e)=>{
                $.ajax({
                    url: `/check-exist-product-in-cart/${id}`,
                    method: 'get',
                    success: (response) => {
                        if (response.productExist==true) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'info',
                                text: 'Product already exist in your cart',
                                showConfirmButton: false,
                                timer: 1000,
                                
                              })
                        } else if (response.userExist == false) {
                            Swal.fire({
                                html:'<a href="/login">Login Now!</a> ' ,
                                title: 'Not loggined Yet?',
                                text : 'Login now to continue shopping',
                                icon: 'question',
                                showConfirmButton: false,
                                showCancelButton : true
                            }
                                
                                
                                
                            )
                        } else {
                            $.ajax({
                                url: `/add-to-cart/${id}`,
                                method: 'get',
                                success: (response) => {
                                    if (response.status) {
                                        let count = $('#cart-count').html()
                                        count = parseInt(count) + 1
                                        $('#cart-count').html(count)
                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            title: 'Product added to your cart',
                                            showConfirmButton: false,
                                            timer: 1000
                                          })
                                    }
                                }
                            })
                        }
                    }
                })
            })
        }
       }).then(()=>{
        $('.product_quickview').addClass('active');
        $('body').css('overflow-y', 'hidden')
       })
       
}
