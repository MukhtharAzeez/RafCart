const userSchema = require('../models/user_schema')
const adminSchema = require('../models/admin_schema')
const productSchema = require('../models/product_schema')
const categorySchema = require('../models/category_schema')
const cloudinary = require('../utils/cloudinary');
const multer = require('../utils/multer');
const orderSchema = require('../models/order_schema')
const couponSchema = require('../models/coupon_schema')
const reviewSchema  = require('../models/review_schema')
const mongoose = require('mongoose');

module.exports = {
    writeReview : async (req,res)=>{
       try {
        let product = await productSchema.findOne({_id : mongoose.Types.ObjectId(req.query.productId)}).lean()
        res.render('user/account-review-details',{product,"user" : req.session.user,"count":res.count,"userWishListCount":res.userWishListCount});
       } catch (error) {
        res.redirect('/not-found')
       }
    },
    writeAReview : async(req,res)=>{
        try {
            if(req.body.rating1){
                req.body.rating1=parseInt(req.body.rating1)
                let review={
                    productId : mongoose.Types.ObjectId(req.query.productId),
                    rating : req.body.rating1,
                    details : req.body.details,
                    date : new Date()
                }
                let reviewExistForUser = await reviewSchema.findOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
                if(reviewExistForUser){
                    
                    await reviewSchema.updateOne(
                        {
                            userId : mongoose.Types.ObjectId(req.session.user._id)
                        },
                        {
                            $push : {
                                reviews : review
                            }
                        }
                    )
                }else{
                    const newReview = new reviewSchema({
                        userId: req.session.user._id,
                        reviews: [review],
                    })
        
                    newReview.save().then((response) => {
                        
                    })
                }
            res.render('user/review-placed',{"user" : req.session.user,"count":res.count,"userWishListCount":res.userWishListCount})
    
            }else{
                res.redirect('back')
            }
        } catch (error) {
            res.redirect('/not-found')
        }
    },
}