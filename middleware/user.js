const mongoose = require('mongoose')
const userSchema = require('../models/user_schema')
const cartSchema = require('../models/cart_schema');

let url

module.exports = {
    verifyLogin: async(req, res, next) => {
        if (req.session.user) {
            let user = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id) })
           
            if(user.status==true){
                next()
            }else{
                res.redirect('/login')
            }   
        } else {
            req.session.url = req.url
            url = req.session.url
            res.redirect('/login')
        }
    },

    cartAndWishList: async (req, res, next) => {

        if (req.session.user) {
            const cart = await cartSchema.findOne({ userId: mongoose.Types.ObjectId(req.session.user._id) })
            if (cart) {
                res.count = cart.products.length
            } else {
                res.count = 0
            }
            userWishListCount = await userSchema.aggregate([
                {
                    $match: { _id: mongoose.Types.ObjectId(req.session.user._id) },
                },
                {
                    $project: {

                        wishListProducts: 1
                    }
                },
                {
                    $unwind: {
                        path: "$wishListProducts"
                    }
                },

                { $group: { _id: null, count: { $sum: 1 } } }

            ])

            userWishListCount[0] ? res.userWishListCount = userWishListCount[0].count : res.userWishListCount = 0
        } else {
            res.count = 0
            res.userWishListCount = 0
        }
        next();
    }
}