
let c = 2
let a=[]
let flag=0
function getProductsByCategory(name){
    if(a.length==0){       
        a.push(name)
        console.log(name)  
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

    var newDiv=document.getElementById('divForHideWhenUsingFilterForList')
    
    var html=null
    $.ajax({
        url : '/category-filter',
        method : 'post',
        data :{
            category:a
        },
        success : (response)=>{
            console.log(response);
            response.forEach(function(item, index) {  
                if(html==null){
                    html=`<div class="single_list_product">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="list_product_img">
                          <div class="lp_img">
                            <a href="product-view.html">
                              <img
                                loading="lazy"
                                src=${item.images[0].image}
                                alt="product"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="product_content">
                          <a href="product-view.html">
                            <h5>${item.name}</h5>
                          </a>
                          <div class="ratprice">
                            <div class="price">
                              <span
                                class="org_price"
                              >₹${item.discount}.00</span>
                              <span class="prev_price">₹${item.price}.00</span>
                            </div>
                            <div class="rating">
                              <div
                                class="d-flex align-items-center justify-content-start"
                              >
                                <div class="rating_star">
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                </div>
                                <p class="rating_count">(150)</p>
                              </div>
                            </div>
                          </div>
                          <p class="product_list_desc">
                            ${item.description}
                          </p>

                          ${item.onStock ? `<p style="color: green; padding-left: 110px;">${item.stock} In Stock</p>`
                       :
                        ` <p style="color: red; padding-left: 100px;">Out of Stock</p>`}


                        ${item.onStock ? `
                        <div class="product_list_btns">
                             <button class="list_product_btn" onclick="addToCart('{{this._id}}')"><span
                                    class="icon"
                                  ><i class="icon-cart"></i></span>
                                  Add to Cart</button>
                              <button class="list_product_btn wish"><span
                                  class="icon"
                                ><i class="icon-heart"></i></span>
                                Wishlist</button>
                            </div>`
                        :
                         ``} 

                        </div>
                      </div>
                    </div>
                  </div>`    
                }else{
                    html+=`<div class="single_list_product">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="list_product_img">
                          <div class="lp_img">
                            <a href="product-view.html">
                              <img
                                loading="lazy"
                                src=${item.images[0].image}
                                alt="product"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="product_content">
                          <a href="product-view.html">
                            <h5>${item.name}</h5>
                          </a>
                          <div class="ratprice">
                            <div class="price">
                              <span
                                class="org_price"
                              >₹${item.discount}.00</span>
                              <span class="prev_price">₹${item.price}.00</span>
                            </div>
                            <div class="rating">
                              <div
                                class="d-flex align-items-center justify-content-start"
                              >
                                <div class="rating_star">
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                </div>
                                <p class="rating_count">(150)</p>
                              </div>
                            </div>
                          </div>
                          <p class="product_list_desc">
                            ${item.description}
                          </p>

                          ${item.onStock ? `<p style="color: green; padding-left: 110px;">${item.stock} In Stock</p>`
                       :
                        ` <p style="color: red; padding-left: 100px;">Out of Stock</p>`}


                        ${item.onStock ? `
                        <div class="product_list_btns">
                             <button class="list_product_btn" onclick="addToCart('{{this._id}}')"><span
                                    class="icon"
                                  ><i class="icon-cart"></i></span>
                                  Add to Cart</button>
                              <button class="list_product_btn wish"><span
                                  class="icon"
                                ><i class="icon-heart"></i></span>
                                Wishlist</button>
                            </div>`
                        :
                         ``} 

                        </div>
                      </div>
                    </div>
                  </div>`    
                }
                    
                // document.getElementById('filterPrice').innerHTML=item.discount
            })
            newDiv.innerHTML=html
        }
    })
}

function getAllProductsByCategory (){
    var newDiv=document.getElementById('divForHideWhenUsingFilterForList')
    var html=null
    $.ajax({
        url : '/get-all-products',
        method : 'get',
        
        success : (response)=>{
            console.log(response);
            response.forEach(function(item, index) {  
                if(html==null){
                    html=`<div class="single_list_product">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="list_product_img">
                          <div class="lp_img">
                            <a href="product-view.html">
                              <img
                                loading="lazy"
                                src=${item.images[0].image}
                                alt="product"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="product_content">
                          <a href="product-view.html">
                            <h5>${item.name}</h5>
                          </a>
                          <div class="ratprice">
                            <div class="price">
                              <span
                                class="org_price"
                              >₹${item.discount}.00</span>
                              <span class="prev_price">₹${item.price}.00</span>
                            </div>
                            <div class="rating">
                              <div
                                class="d-flex align-items-center justify-content-start"
                              >
                                <div class="rating_star">
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                </div>
                                <p class="rating_count">(150)</p>
                              </div>
                            </div>
                          </div>
                          <p class="product_list_desc">
                            ${item.description}
                          </p>

                          ${item.onStock ? `<p style="color: green; padding-left: 110px;">${item.stock} In Stock</p>`
                       :
                        ` <p style="color: red; padding-left: 100px;">Out of Stock</p>`}


                        ${item.onStock ? `
                        <div class="product_list_btns">
                             <button class="list_product_btn" onclick="addToCart('{{this._id}}')"><span
                                    class="icon"
                                  ><i class="icon-cart"></i></span>
                                  Add to Cart</button>
                              <button class="list_product_btn wish"><span
                                  class="icon"
                                ><i class="icon-heart"></i></span>
                                Wishlist</button>
                            </div>`
                        :
                         ``} 

                        </div>
                      </div>
                    </div>
                  </div>`    
                }else{
                    html+=`<div class="single_list_product">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="list_product_img">
                          <div class="lp_img">
                            <a href="product-view.html">
                              <img
                                loading="lazy"
                                src=${item.images[0].image}
                                alt="product"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="product_content">
                          <a href="product-view.html">
                            <h5>${item.name}</h5>
                          </a>
                          <div class="ratprice">
                            <div class="price">
                              <span
                                class="org_price"
                              >₹${item.discount}.00</span>
                              <span class="prev_price">₹${item.price}.00</span>
                            </div>
                            <div class="rating">
                              <div
                                class="d-flex align-items-center justify-content-start"
                              >
                                <div class="rating_star">
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                  <span><i class="las la-star"></i></span>
                                </div>
                                <p class="rating_count">(150)</p>
                              </div>
                            </div>
                          </div>
                          <p class="product_list_desc">
                            ${item.description}
                          </p>

                          ${item.onStock ? `<p style="color: green; padding-left: 110px;">${item.stock} In Stock</p>`
                       :
                        ` <p style="color: red; padding-left: 100px;">Out of Stock</p>`}


                        ${item.onStock ? `
                        <div class="product_list_btns">
                             <button class="list_product_btn" onclick="addToCart('{{this._id}}')"><span
                                    class="icon"
                                  ><i class="icon-cart"></i></span>
                                  Add to Cart</button>
                              <button class="list_product_btn wish"><span
                                  class="icon"
                                ><i class="icon-heart"></i></span>
                                Wishlist</button>
                            </div>`
                        :
                         ``} 

                        </div>
                      </div>
                    </div>
                  </div>`    
                }
                    
                // document.getElementById('filterPrice').innerHTML=item.discount
            })
            newDiv.innerHTML=html
        }
    })
}