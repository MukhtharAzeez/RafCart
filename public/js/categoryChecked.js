
let a=[]
let flag=0
let price 

function getProductsByCategory(name){
  if(price==undefined){
    price = '₹0 - ₹1000000'
  }
    if(a.length==0){       
        a.push(name) 
    }else{
        for(var i=0;i<a.length;i++){
            if(a[i]==name){
                a.splice(i,1)
                flag=1   
            }
        }
        if(flag==0){
            a.push(name)  
        }else{
            flag=0
        }
    }

    var newDiv=document.getElementById('divForHideWhenUsingFilter')
   
    var html=''
    $.ajax({
        url : `/category-filter?price=${price}`,
        method : 'post',
        data :{
            category:a,
           
        },
        success : (response)=>{
            response.forEach(function(item, index) {  

                    html+=`<div class="col-md-4 col-sm-6 ">
                    <div class="single_toparrival">
                      <div class="topariv_img">
                        <img loading="lazy" src=${item.images[0].image} alt="product"
                          style="width: 100%; height:220px; padding: 40px;" />
                        <div class="persof bg-danger">HOT</div>
                        <div class="adto_wish" >

                      ${item.favourite?
                     `<i class="fa-solid fa-heart" id="addToWishListFirst${item._id}" style="color: rgb(212, 10, 10);"></i>
                     <i class="fa-regular fa-heart d-none" id="removeFromWishListFirst${item._id}"></i>`
                     :
                     `<i class="fa-solid fa-heart d-none" id="addToWishListFirst{{this._id}}" style="color: rgb(212, 10, 10);"></i>
                     <i class="fa-regular fa-heart" id="removeFromWishListFirst${item._id}"></i>`
                      }

                    </div>
                    <div class="prod_soh">
                      <div class="adto_wish" onclick="addToWishList('${item._id}')">
                        
                          ${item.favourite ?
                        `<i class="fa-solid fa-heart" id="addToWishListSecond${item._id}" style="color: rgb(212, 10, 10);"></i>
                        <i class="fa-regular fa-heart  d-none" id="removeFromWishListSecond${item._id}"></i>`
                        :
                        `<i class="fa-solid fa-heart  d-none" id="addToWishListSecond${item._id}" style="color: rgb(212, 10, 10);"></i>
                        <i class="fa-regular fa-heart" id="removeFromWishListSecond${item._id}"></i>`
                          }
                      </div>

                      <div class="qk_view open_quickview" onclick="quickProductView('${item._id}')">
                        <span><i class="las la-eye"></i></span>
                        Quick View
                      </div>
                      
                    </div>

                      </div>
                      <div class="topariv_cont">
                        <a href="product-view.html">
                          <h4>${item.name}</h4>
                        </a>
    
                        <div class="price mb-1">
                          <span class="org_price">${item.price}.00</span>
                        </div>
                        <div class="rating">
                          <div class="d-flex align-items-center justify-content-start">
                            <div class="rating_star">
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                            </div>
                            <p class="rating_count mb-0">(150)</p>
                          </div>
                        </div>
                      </div>
    
                      ${item.onStock ? `<p style="color: green; padding-left: 110px;">${item.stock} In Stock</p>`
                       :
                        ` <p style="color: red; padding-left: 100px;">Out of Stock</p>`}
    
                    
    
    
                        ${item.onStock ? `
                        <div class="full_atc_btn">
    
                        <button onclick="addToCart('${item._id}')">
                          <span class="me-1"><i class="icon-cart"></i></span>
                          add to cart
                        </button>
    
                         </div>`
                        :
                         `<div class="full_atc_btn2">
                         <button>
                           <span class="me-1"><i class="icon-cart"></i></span>
                           add to cart
                         </button>
                         </div>`}


                     
                    
                    </div>
                  </div>`    
                // document.getElementById('filterPrice').innerHTML=item.discount
            })
            newDiv.innerHTML=html
        }
    })
}

function getAllProductsByCategory (){
    var newDiv=document.getElementById('divForHideWhenUsingFilter')
    var html=''
    $.ajax({
        url : `/get-all-products?price=${price}`,
        method : 'get',
        
        success : (response)=>{
            response.forEach(function(item, index) {  
                
                    html+=`<div class="col-md-4 col-sm-6 ">
                    <div class="single_toparrival">
                      <div class="topariv_img">
                        <img loading="lazy" src=${item.images[0].image} alt="product"
                          style="width: 100%; height:220px; padding: 40px;" />
                        <div class="persof bg-danger">HOT</div>
                        <div class="adto_wish" >

                      ${item.favourite?
                     `<i class="fa-solid fa-heart" id="addToWishListFirst${item._id}" style="color: rgb(212, 10, 10);"></i>
                     <i class="fa-regular fa-heart d-none" id="removeFromWishListFirst${item._id}"></i>`
                     :
                     `<i class="fa-solid fa-heart d-none" id="addToWishListFirst{{this._id}}" style="color: rgb(212, 10, 10);"></i>
                     <i class="fa-regular fa-heart" id="removeFromWishListFirst${item._id}"></i>`
                      }

                    </div>
                    <div class="prod_soh">
                      <div class="adto_wish" onclick="addToWishList('${item._id}')">
                        
                          ${item.favourite ?
                        `<i class="fa-solid fa-heart" id="addToWishListSecond${item._id}" style="color: rgb(212, 10, 10);"></i>
                        <i class="fa-regular fa-heart  d-none" id="removeFromWishListSecond${item._id}"></i>`
                        :
                        `<i class="fa-solid fa-heart  d-none" id="addToWishListSecond${item._id}" style="color: rgb(212, 10, 10);"></i>
                        <i class="fa-regular fa-heart" id="removeFromWishListSecond${item._id}"></i>`
                          }
                      </div>

                      <div class="qk_view open_quickview" onclick="quickProductView('${item._id}')">
                        <span><i class="las la-eye"></i></span>
                        Quick View
                      </div>
                      
                    </div>

                      </div>
                      <div class="topariv_cont">
                        <a href="product-view.html">
                          <h4>${item.name}</h4>
                        </a>
    
                        <div class="price mb-1">
                          <span class="org_price">${item.price}.00</span>
                        </div>
                        <div class="rating">
                          <div class="d-flex align-items-center justify-content-start">
                            <div class="rating_star">
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                              <span><i class="las la-star"></i></span>
                            </div>
                            <p class="rating_count mb-0">(150)</p>
                          </div>
                        </div>
                      </div>
    
                      ${item.onStock ? `<p style="color: green; padding-left: 110px;">${item.stock} In Stock</p>`
                       :
                        ` <p style="color: red; padding-left: 100px;">Out of Stock</p>`}
    
                    
    
    
                        ${item.onStock ? `
                        <div class="full_atc_btn">
    
                        <button onclick="addToCart('${item._id}')">
                          <span class="me-1"><i class="icon-cart"></i></span>
                          add to cart
                        </button>
    
                         </div>`
                        :
                         `<div class="full_atc_btn2">
                         <button>
                           <span class="me-1"><i class="icon-cart"></i></span>
                           add to cart
                         </button>
                         </div>`}


                     
                    
                    </div>
                  </div>`        
                // document.getElementById('filterPrice').innerHTML=item.discount
            })
            newDiv.innerHTML=html
        }
    })
}

function filterByPrice(){
  let value=$('#amount').val()
  price=value
  let html=''
  var newDiv=document.getElementById('divForHideWhenUsingFilter')

  $.ajax({
    url : `/category-filter?price=${price}`,
    method : 'post',
    data :{
        category:a,
       
    },
    success : (response)=>{
        response.forEach(function(item, index) {  
            

                html+=`<div class="col-md-4 col-sm-6 ">
                <div class="single_toparrival">
                  <div class="topariv_img">
                    <img loading="lazy" src=${item.images[0].image} alt="product"
                      style="width: 100%; height:220px; padding: 40px;" />
                    <div class="persof bg-danger">HOT</div>
                    <div class="adto_wish" >

                  ${item.favourite?
                 `<i class="fa-solid fa-heart" id="addToWishListFirst${item._id}" style="color: rgb(212, 10, 10);"></i>
                 <i class="fa-regular fa-heart d-none" id="removeFromWishListFirst${item._id}"></i>`
                 :
                 `<i class="fa-solid fa-heart d-none" id="addToWishListFirst{{this._id}}" style="color: rgb(212, 10, 10);"></i>
                 <i class="fa-regular fa-heart" id="removeFromWishListFirst${item._id}"></i>`
                  }

                </div>
                <div class="prod_soh">
                  <div class="adto_wish" onclick="addToWishList('${item._id}')">
                    
                      ${item.favourite ?
                    `<i class="fa-solid fa-heart" id="addToWishListSecond${item._id}" style="color: rgb(212, 10, 10);"></i>
                    <i class="fa-regular fa-heart  d-none" id="removeFromWishListSecond${item._id}"></i>`
                    :
                    `<i class="fa-solid fa-heart  d-none" id="addToWishListSecond${item._id}" style="color: rgb(212, 10, 10);"></i>
                    <i class="fa-regular fa-heart" id="removeFromWishListSecond${item._id}"></i>`
                      }
                  </div>

                  <div class="qk_view open_quickview" onclick="quickProductView('${item._id}')">
                    <span><i class="las la-eye"></i></span>
                    Quick View
                  </div>
                  
                </div>

                  </div>
                  <div class="topariv_cont">
                    <a href="product-view.html">
                      <h4>${item.name}</h4>
                    </a>

                    <div class="price mb-1">
                      <span class="org_price">${item.price}.00</span>
                    </div>
                    <div class="rating">
                      <div class="d-flex align-items-center justify-content-start">
                        <div class="rating_star">
                          <span><i class="las la-star"></i></span>
                          <span><i class="las la-star"></i></span>
                          <span><i class="las la-star"></i></span>
                          <span><i class="las la-star"></i></span>
                          <span><i class="las la-star"></i></span>
                        </div>
                        <p class="rating_count mb-0">(150)</p>
                      </div>
                    </div>
                  </div>

                  ${item.onStock ? `<p style="color: green; padding-left: 110px;">${item.stock} In Stock</p>`
                   :
                    ` <p style="color: red; padding-left: 100px;">Out of Stock</p>`}

                


                    ${item.onStock ? `
                    <div class="full_atc_btn">

                    <button onclick="addToCart('${item._id}')">
                      <span class="me-1"><i class="icon-cart"></i></span>
                      add to cart
                    </button>

                     </div>`
                    :
                     `<div class="full_atc_btn2">
                     <button>
                       <span class="me-1"><i class="icon-cart"></i></span>
                       add to cart
                     </button>
                     </div>`}


                 
                
                </div>
              </div>` 
            
                
            // document.getElementById('filterPrice').innerHTML=item.discount
        })
        newDiv.innerHTML=html
    }
})
}

