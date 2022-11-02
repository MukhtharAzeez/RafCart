const mongoose = require('mongoose');
const couponSchema = require('../models/coupon_schema')

module.exports = {
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
        if(req.body.status=='enabled'){
            req.body.status=true
        }else{
            req.body.status=false
        }
        
        req.body.code=req.body.code.toUpperCase()
        console.log(req.body)
        
        const code = req.body.code;
        const type = req.body.type;
        const discountValue = req.body.discountValue;
        const usageLimit = req.body.usageLimit;
        const status = req.body.status;
        const startDate = req.body.startDate;
        const expiryDate = req.body.endDate;
        const isFinished = false;

        
        const coupons = new couponSchema({
            code : code,
            type : type,
            discountValue : discountValue,
            usageLimit : usageLimit,
            status : status,
            startDate : startDate,
            expiryDate : expiryDate,
            isFinished : isFinished
        })
        coupons
            .save()
            .then((response)=>{
                res.redirect('/admin/coupons-list')
            })
            .catch((error)=>{
                console.log(error);
            })
    },
}