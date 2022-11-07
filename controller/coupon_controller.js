const mongoose = require('mongoose');
const couponSchema = require('../models/coupon_schema')
const productSchema = require('../models/product_schema')
const cartSchema = require('../models/cart_schema')
const userSchema = require('../models/user_schema')
const orderSchema = require('../models/order_schema')

module.exports = {
    // Admin
    couponsList: async (req, res) => {
        let coupons = await couponSchema.aggregate([
            {
                $project: {
                    code: 1,
                    type: 1,
                    discountValue: 1,
                    usageLimit: 1,
                    status: 1,
                    isFinished: 1,
                    lowerLimit: 1,
                    upperLimit: 1,
                    startDate: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                    expiryDate: { $dateToString: { format: "%Y-%m-%d", date: "$expiryDate" } },
                }
            }
        ])
        res.render('admin/app-coupons-list', { coupons, noHeader: true, noFooter: true });
    },
    addCoupon: async (req, res) => {
        res.render('admin/app-coupon', { noHeader: true, noFooter: true })
    },
    add_a_coupon: async (req, res) => {
        let checkExist = await couponSchema.findOne({ code: req.body.code })
        if (checkExist) {
            res.redirect('/admin/add-coupon')
        } else {
            req.body.type = req.body.type
            if (req.body.status == 'enabled') {
                req.body.status = true
            } else if (req.body.status == 'disabled') {
                req.body.status = false
            }
            if (req.body.type == 'Percentage') {
                if (req.body.discountValue > 1 && req.body.discountValue <= 100) {

                    // check coupon for every users or not
                    if (req.body.couponFor == 'offerForSomeUsers') {
                        req.body.couponFor = false
                    } else {
                        req.body.couponFor = true
                    }


                    req.body.code = req.body.code.toUpperCase()
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
                    const couponFor = req.body.couponFor;
                    const couponType = req.body.couponType;
                    const lowerLimitToGaveCoupon = req.body.lowerLimitToGaveCoupon;
                    const upperLimitToGaveCoupon = req.body.upperLimitToGaveCoupon;
                    const orderToReach = req.body.orderToReach;
                    const priceToReach = req.body.priceToReach;

                    const coupons = new couponSchema({
                        code: code,
                        type: type,
                        discountValue: discountValue,
                        usageLimit: usageLimit,
                        status: status,
                        startDate: startDate,
                        expiryDate: expiryDate,
                        isFinished: isFinished,
                        lowerLimit: lowerLimit,
                        upperLimit: upperLimit,
                        couponFor,
                        couponType,
                        lowerLimitToGaveCoupon,
                        upperLimitToGaveCoupon,
                        orderToReach,
                        priceToReach,
                    })
                    coupons
                        .save()
                        .then((response) => {
                            res.redirect('/admin/coupons-list')
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } else {
                    res.redirect('/admin/add-coupon')
                }
            } else {

                if (req.body.couponFor == 'offerForSomeUsers') {
                    req.body.couponFor = false
                } else {
                    req.body.couponFor = true
                }

                req.body.code = req.body.code.toUpperCase()

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
                const couponFor = req.body.couponFor;
                const couponType = req.body.couponType;
                const lowerLimitToGaveCoupon = req.body.lowerLimitToGaveCoupon;
                const upperLimitToGaveCoupon = req.body.upperLimitToGaveCoupon;
                const orderToReach = req.body.orderToReach;
                const priceToReach = req.body.priceToReach;

                const coupons = new couponSchema({
                    code: code,
                    type: type,
                    discountValue: discountValue,
                    usageLimit: usageLimit,
                    status: status,
                    startDate: startDate,
                    expiryDate: expiryDate,
                    isFinished: isFinished,
                    lowerLimit: lowerLimit,
                    upperLimit: upperLimit,
                    couponFor,
                    couponType,
                    lowerLimitToGaveCoupon,
                    upperLimitToGaveCoupon,
                    orderToReach,
                    priceToReach,
                })
                coupons
                    .save()
                    .then((response) => {
                        res.redirect('/admin/coupons-list')
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }


    },
    // User
    couponsPage: async (req, res) => {
        let coupons = await couponSchema.aggregate([
            {
                $project: {
                    code: 1,
                    type: 1,
                    discountValue: 1,
                    usageLimit: 1,
                    couponFor: 1,
                    status: 1,
                    isFinished: 1,
                    lowerLimit: 1,
                    upperLimit: 1,
                    couponType: 1,
                    lowerLimitToGaveCoupon: 1,
                    upperLimitToGaveCoupon: 1,
                    orderToReach: 1,
                    priceToReach: 1,
                    startDate: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                    expiryDate: { $dateToString: { format: "%Y-%m-%d", date: "$expiryDate" } },
                }
            }
        ])

        let user = await userSchema.findOne({ _id: mongoose.Types.ObjectId(req.session.user._id) })
        let cart = await cartSchema.findOne({ userId: mongoose.Types.ObjectId(req.session.user._id) })


        let totalOrder = await orderSchema.find({ userId: mongoose.Types.ObjectId(req.session.user._id) }).count()
        let userTotalOrderedPrice = await orderSchema.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(req.session.user._id)
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ])
        userTotalOrderedPrice = userTotalOrderedPrice[0].total

        for (var i = 0; i < coupons.length; i++) {


            // To add coupons to claimed coupons if its available for all users
            
            if (coupons[i].couponFor) {
                let flag=false;
                for(var j=0; j < user.claimedCoupons.length; j++) {
                    
                    if(user.claimedCoupons[j]==coupons[i].code) {
                        flag=true
                    }
                    
                }
                if(flag==false){
                    await userSchema.updateOne(
                        {
                            _id: mongoose.Types.ObjectId(req.session.user._id)
                        },
                        {
                            $push: {
                                claimedCoupons: coupons[i].code
                            }
                        }
                    )
                }
            }


            // To get type
            if (coupons[i].type == 'Percentage') {
                coupons[i].percentage = true
            } else if (coupons[i].type == 'Free Shipping') {
                coupons[i].freeShipping = true
            } else {
                coupons[i].fixedValue = true
            }

            // To know coupon is used or not
            for (var j = 0; j < user.usedCoupons.length; j++) {
                if (coupons[i].code == user.usedCoupons[j]) {
                    coupons[i].used = true
                }
            }

            // To know coupon is available for the price of cart
            if (cart) {
                if (cart.totalPrice >= coupons[i].lowerLimit && cart.totalPrice <= coupons[i].upperLimit) {
                    coupons[i].available = true
                }
            } else {
                coupons[i].available = true
            }

            // To get which offer gave to user
            if (coupons[i].couponType == 'totalOrderAchievement') {
                coupons[i].order = true

                // to know user achieve the offer 
                if (coupons[i].orderToReach <= totalOrder) {
                    coupons[i].claim = true
                }
                for (var k = 0; k < user.claimedCoupons.length; k++) {

                    if (coupons[i].code == user.claimedCoupons[k]) {
                        coupons[i].claim = false
                        coupons[i].claimed = true
                    }
                }

                // To know how much percentage completed
                coupons[i].completedPercentage=(totalOrder/coupons[i].orderToReach)*100
                coupons[i].completedPercentage=Math.round(coupons[i].completedPercentage)
                if(coupons[i].completedPercentage>100){
                    coupons[i].completedPercentage=100
                }


            } else if (coupons[i].couponType == 'totalPriceAchievement') {
                coupons[i].price = true

                // to know user achieve the offer 

                if (coupons[i].priceToReach <= userTotalOrderedPrice) {
                    coupons[i].claim = true
                }
                for (var k = 0; k < user.claimedCoupons.length; k++) {
                    if (coupons[i].code == user.claimedCoupons[k]) {
                        coupons[i].claim = false
                        coupons[i].claimed = true
                    }
                }

                // To know how much percentage completed
                coupons[i].completedPercentage=(userTotalOrderedPrice/coupons[i].priceToReach)*100
                coupons[i].completedPercentage=Math.round(coupons[i].completedPercentage)
                if(coupons[i].completedPercentage>100){
                    coupons[i].completedPercentage=100
                }
            } else {
                coupons[i].buy = true

                // to know user achieve the offer 
                for (var k = 0; k < user.couponsToClaim.length; k++) {
                    if (coupons[i].code == user.couponsToClaim[k]) {
                        coupons[i].claim = true
                    }
                }
                for (var k = 0; k < user.claimedCoupons.length; k++) {
                    console.log(coupons[i].code, user.claimedCoupons[k])
                    if (coupons[i].code == user.claimedCoupons[k]) {
                        coupons[i].claim = false
                        coupons[i].claimed = true
                    }
                }

            }




        }
        console.log(coupons)

        if (req.query.achieve) {
            res.render('user/available_coupons_for_achieve', { coupons, "user": req.session.user, "count": res.count, "userWishListCount": res.userWishListCount })
        } else {
            res.render('user/available_coupons', { coupons, "user": req.session.user, "count": res.count, "userWishListCount": res.userWishListCount })
        }
    },
    checkForAvailablity: async (req, res) => {
        let user = await userSchema.findOne({ _id: mongoose.Types.ObjectId(req.session.user._id) })
        let flag = false
        for (var i = 0; i < user.usedCoupons.length; i++) {
            if (user.usedCoupons[i] == req.query.code) {
                flag = false
            }
        }
        for (var i = 0; i < user.claimedCoupons.length; i++) {
            if (user.claimedCoupons[i] == req.query.code) {
                flag = true
            }
        }
        if (flag == true) {
            res.json({ status: true })
        } else {
            res.json({ status: false })
        }
    },
    applyCoupon: async (req, res) => {
        let couponCheck = await couponSchema.findOne({ code: req.query.code })
        if (couponCheck) {
            let cart = await cartSchema.updateOne(
                {
                    userId: mongoose.Types.ObjectId(req.session.user._id)
                },
                {
                    $set: {
                        coupon: req.query.code
                    }
                }
            )


            let total = await cartSchema.aggregate([
                {
                    $match: { userId: mongoose.Types.ObjectId(req.session.user._id) }
                },
                {
                    $project: {
                        products: 1,
                    }
                },
                {
                    $unwind: {
                        path: "$products"
                    }
                },
                {
                    $project: {
                        item: "$products.item",
                        quantity: "$products.quantity",
                        total: "$products.total"
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        total: 1,
                        product: { $arrayElemAt: ["$product", 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.discount'] } },
                    }
                },
            ])
            if (total[0]) {
                total = total[0].total;
            } else {
                total = 0
            }
            let discount
            if (couponCheck.type == 'Percentage') {
                total = total - (total * couponCheck.discountValue) / 100
                discount = (total * couponCheck.discountValue) / 100
            } else if (couponCheck.type == 'Flat Discount') {
                total = total - couponCheck.discountValue
                discount = couponCheck.discountValue
            } else {
            }
            res.json({ status: true, total, discount })
        } else {
            res.json({ status: false })
        }
    },
    removeCoupon: async (req, res) => {
        let couponCheck = await couponSchema.findOne({ code: req.query.code })
        if (couponCheck) {
            let cart = await cartSchema.updateOne(
                {
                    userId: mongoose.Types.ObjectId(req.session.user._id)
                },
                {
                    $unset: {
                        coupon: 1
                    }
                }
            )

            let total = await cartSchema.aggregate([
                {
                    $match: { userId: mongoose.Types.ObjectId(req.session.user._id) }
                },
                {
                    $project: {
                        products: 1,
                    }
                },
                {
                    $unwind: {
                        path: "$products"
                    }
                },
                {
                    $project: {
                        item: "$products.item",
                        quantity: "$products.quantity",
                        total: "$products.total"
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        total: 1,
                        product: { $arrayElemAt: ["$product", 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.discount'] } },
                    }
                },
            ])
            if (total[0]) {
                total = total[0].total;
            } else {
                total = 0
            }
            let discount = 0
            res.json({ status: true, total, discount })
        } else {
            res.json({ status: false })
        }
    },
    couponExistCheck: async (req, res) => {
        let cart = await cartSchema.findOne({ userId: mongoose.Types.ObjectId(req.session.user._id) });
        if (cart.coupon) {
            res.json({ status: false })
        } else {
            res.json({ status: true })
        }
    },
    claimCoupon: async (req, res) => {
        console.log(req.query)
        let coupon = await couponSchema.findOne({ code: req.query.code })
        console.log(coupon)
        await userSchema.updateOne(
            {
                _id: mongoose.Types.ObjectId(req.session.user._id)
            },
            {
                $push: {
                    claimedCoupons: coupon.code
                }
            }
        )
        let user = await userSchema.findOne({ _id: mongoose.Types.ObjectId(req.session.user._id) })
        for (var i = 0; i < user.couponsToClaim.length; i++) {
            if (coupon.code == user.couponsToClaim[i]) {
                await userSchema.updateOne(
                    {
                        _id: mongoose.Types.ObjectId(req.session.user._id)
                    },
                    {
                        $pull: {
                            couponsToClaim: coupon.code
                        }
                    }
                )
            }
        }
        res.json({ status: true })
    },
}