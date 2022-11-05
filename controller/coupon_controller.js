const mongoose = require('mongoose');
const couponSchema = require('../models/coupon_schema')
const productSchema = require('../models/product_schema')
const cartSchema = require('../models/cart_schema')
const userSchema = require('../models/user_schema')

module.exports = {
    // Admin
    couponsList : async(req,res)=>{
        let coupons=await couponSchema.aggregate([
            {
                $project : {
                    code : 1,
                    type : 1,
                    discountValue : 1,
                    usageLimit : 1,
                    status : 1,
                    isFinished : 1,
                    lowerLimit :1,
                    upperLimit : 1,
                    startDate : { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                    expiryDate : { $dateToString: { format: "%Y-%m-%d", date: "$expiryDate" } },
                }
            }
        ])
        res.render('admin/app-coupons-list',{coupons,noHeader:true,noFooter:true});
    },
    addCoupon : async(req,res)=>{
        res.render('admin/app-coupon',{noHeader:true,noFooter:true})
    },
    add_a_coupon : async(req,res)=>{
        let checkExist = await couponSchema.findOne({code : req.body.code})
         
        if(checkExist){
            res.redirect('/admin/add-coupon')
        }else{
            req.body.type=req.body.type[0]
        if(req.body.status=='enabled'){
            req.body.status=true
        }else{
            req.body.status=false
        }
        if(req.body.type[0]=='Percentage'){
            if(req.body.discount>1 && req.body.discount<=100){
                req.body.code=req.body.code.toUpperCase()
                const code = req.body.code;
                const type = req.body.type;
                const discountValue = req.body.discountValue;
                const usageLimit = req.body.usageLimit;
                const status = req.body.status;
                const startDate = req.body.startDate;
                const expiryDate = req.body.endDate;
                const isFinished = false;
                const lowerLimit = req.body.lowerLimit;
                const upperLimit = req.body.upperLimit;
                
                const coupons = new couponSchema({
                    code : code,
                    type : type,
                    discountValue : discountValue,
                    usageLimit : usageLimit,
                    status : status,
                    startDate : startDate,
                    expiryDate : expiryDate,
                    isFinished : isFinished,
                    lowerLimit : lowerLimit,
                    upperLimit : upperLimit
                })
                coupons
                    .save()
                    .then((response)=>{
                        res.redirect('/admin/coupons-list')
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
            }else{
                res.redirect('/admin/add-coupon')
            }
        }else{
        req.body.code=req.body.code.toUpperCase()
        
        
        const code = req.body.code;
        const type = req.body.type;
        const discountValue = req.body.discountValue;
        const usageLimit = req.body.usageLimit;
        const status = req.body.status;
        const startDate = req.body.startDate;
        const expiryDate = req.body.endDate;
        const isFinished = false;
        const lowerLimit = req.body.lowerLimit;
        const upperLimit = req.body.upperLimit;
        
        const coupons = new couponSchema({
            code : code,
            type : type,
            discountValue : discountValue,
            usageLimit : usageLimit,
            status : status,
            startDate : startDate,
            expiryDate : expiryDate,
            isFinished : isFinished,
            lowerLimit : lowerLimit,
            upperLimit : upperLimit
        })
        coupons
            .save()
            .then((response)=>{
                res.redirect('/admin/coupons-list')
            })
            .catch((error)=>{
                console.log(error);
            })
        }
        }
        
        
    },
    // User
    couponsPage : async(req,res)=>{
        let coupons=await couponSchema.aggregate([
            {
                $project : {
                    code : 1,
                    type : 1,
                    discountValue : 1,
                    usageLimit : 1,
                    status : 1,
                    isFinished : 1,
                    lowerLimit :1,
                    upperLimit :1,
                    startDate : { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                    expiryDate : { $dateToString: { format: "%Y-%m-%d", date: "$expiryDate" } },
                }
            }
        ])
        for(var i=0;i<coupons.length;i++){
            if(coupons[i].type=='Percentage'){
                coupons[i].percentage=true
            }else if(coupons[i].type=='Free Shipping'){
                coupons[i].freeShipping=true
            }else{
                coupons[i].fixedValue = true
            }
        }
        let user=await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)})
        let cart = await cartSchema.findOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
        for(var i=0;i<coupons.length;i++){

            for(var j=0;j<user.usedCoupons.length;j++){
                if(coupons[i].code==user.usedCoupons[j]){
                    coupons[i].used=true
                }
            }
            if(cart.totalPrice>=coupons[i].lowerLimit && cart.totalPrice<=coupons[i].upperLimit){
                coupons[i].available=true
            }
        }
        console.log(coupons,cart)
        
        res.render('user/available_coupons',{coupons,"user" : req.session.user,"count":res.count,"userWishListCount":res.userWishListCount})
    },
    checkForAvailablity : async(req,res)=>{
        let user = await userSchema.findOne({_id:mongoose.Types.ObjectId(req.session.user._id)})
        let flag=false
        for(var i=0;i<user.usedCoupons.length;i++){
           if( user.usedCoupons[i]==req.query.code){
            flag=true
           }      
        }
        if(flag==true){
            res.json({status:false})
        }else{
            res.json({status:true})
        }
    },
    applyCoupon : async(req,res)=>{
       let couponCheck = await couponSchema.findOne({code : req.query.code})
       if(couponCheck){
        let cart=await cartSchema.updateOne(
            {
                userId : mongoose.Types.ObjectId(req.session.user._id)
            },
            {
                $set : {
                    coupon : req.query.code 
                }
            }
        )
       
        let total = await cartSchema.aggregate([
            {
                $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
            },
            {
                $project : {
                    products : 1,
                }
            },
            {
                $unwind : {
                    path : "$products"
                }
            },
            {
                $project :{
                    item : "$products.item",
                    quantity : "$products.quantity",
                    total : "$products.total"
                }
            },
            {
                $lookup :{
                    from : 'products',
                    localField : 'item',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    item : 1,
                    quantity : 1,
                    total :1,
                    product : {$arrayElemAt : ["$product",0]}
                }
            },
            {
                $group :{
                    _id:null,
                    total : {$sum:{$multiply :['$quantity','$product.discount']}}, 
                }
            },
        ])
        if(total[0]){
            total = total[0].total;
        }else{
            total = 0
        }
        let discount
        if(couponCheck.type=='Percentage'){
            total=total-(total*couponCheck.discountValue)/100
            discount=(total*couponCheck.discountValue)/100
        }else if(couponCheck.type=='Flat Discount'){
            total=total-couponCheck.discountValue
            discount=couponCheck.discountValue
        }else{
        }
        res.json({status : true,total,discount})
       }else{
        res.json({status : false})
       }
    },
    removeCoupon : async(req,res)=>{
        let couponCheck = await couponSchema.findOne({code : req.query.code})
       if(couponCheck){
        let cart=await cartSchema.updateOne(
            {
                userId : mongoose.Types.ObjectId(req.session.user._id)
            },
            {
                $unset : {
                    coupon : 1 
                }
            }
        )
       
        let total = await cartSchema.aggregate([
            {
                $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
            },
            {
                $project : {
                    products : 1,
                }
            },
            {
                $unwind : {
                    path : "$products"
                }
            },
            {
                $project :{
                    item : "$products.item",
                    quantity : "$products.quantity",
                    total : "$products.total"
                }
            },
            {
                $lookup :{
                    from : 'products',
                    localField : 'item',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    item : 1,
                    quantity : 1,
                    total :1,
                    product : {$arrayElemAt : ["$product",0]}
                }
            },
            {
                $group :{
                    _id:null,
                    total : {$sum:{$multiply :['$quantity','$product.discount']}}, 
                }
            },
        ])
        if(total[0]){
            total = total[0].total;
        }else{
            total = 0
        }
        let discount=0
        res.json({status : true,total,discount})
       }else{
        res.json({status : false})
       }
    },
    couponExistCheck : async(req,res)=>{
        let cart=await cartSchema.findOne({ userId: mongoose.Types.ObjectId(req.session.user._id)});
        if(cart.coupon){
            res.json({status : false})
        }else{
            res.json({status : true})
        }
    },
}