const userSchema = require('../models/user_schema')
const adminSchema = require('../models/admin_schema')
const productSchema = require('../models/product_schema')
const categorySchema = require('../models/category_schema')
const cloudinary = require('../utils/cloudinary');
const multer = require('../utils/multer');
const orderSchema = require('../models/order_schema')
const couponSchema = require('../models/coupon_schema')
const mongoose = require('mongoose');


var path = require('path');


module.exports = {

    home : async(req,res)=>{
        let totalSells=await orderSchema.find({status:'delivered'}).count()
        newDate= new Date();
        let totalIncome = await orderSchema.aggregate([
            {
                $match : {
                    "deliveredDate" : { $lte : newDate }
                    }
            },
            {
                $group : {
                    _id : null,
                    totalIncome : {$sum : "$total"}
                }
            },
        ])
        
        if(totalIncome[0]){
            totalIncome=(totalIncome[0].totalIncome/100)*25 
            totalIncome=Math.round(totalIncome)
        }

        let todayDate = new Date();
        let thirtyDaysAgo = new Date(new Date().getTime()-(30*24*60*60*1000));
        let oneWeekAgo = new Date(new Date().getTime()-(7*24*60*60*1000));
        let oneYearAgo = new Date(new Date().getTime()-(12*30*24*60*60*1000));
        
        


        let totalSellsInThisMonth=await orderSchema.find({"deliveredDate" : { $gte : thirtyDaysAgo }}).count()
        
        let totalIncomeInThisMonth=await orderSchema.aggregate([
            {
                $match : {
                "deliveredDate" : { $gte : thirtyDaysAgo }
                }
            },
            {
                $group : {
                    _id : null,
                    total : {$sum : "$total"}
                }
            }
        ])
        
        if(totalIncomeInThisMonth[0]){
         totalIncomeInThisMonth=(totalIncomeInThisMonth[0].total/100)*25  
         totalIncomeInThisMonth=Math.round(totalIncomeInThisMonth)

        }

        let orders=await orderSchema.aggregate([
            {
                $lookup : {
                    from : 'users',
                    localField : 'userId',
                    foreignField : '_id',
                    as : 'users'
                }
            },
            {
                $project : {
                    paymentMethod : 1,
                    total : 1,
                    status : 1,
                    purchaseDate : { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
                    user : {$arrayElemAt: ["$users", 0]}
                }
            },
        ]).sort ({purchaseDate : -1}).limit(8)
       
        let incomeStatistics = await  orderSchema.aggregate([
            {
                $match : {
                "deliveredDate" : { $gte : oneYearAgo }
                }
            },
            {
                $project:
                {
                    purchaseDate: 1,
                    total : 1,
                }
            },
            {
                $group: {
                    _id: { $month: "$purchaseDate"},
                    total: { $sum: "$total" }
                }
            },
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [" ","Jan", "Feb", "Mar", "Apr", "May", "June", 
                                "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id']
                            }
                        }
                    }
                }
            }
        ]).sort({month : -1})
       
        let totalSellsInThisYear = await  orderSchema.aggregate([
            {
                $match : {
                "deliveredDate" : { $gte : oneYearAgo }
                }
            },
            {
                $project:
                {
                    purchaseDate: 1,
                }
            },
            {
                $group: {
                    _id: { $month: "$purchaseDate"},
                    count: { $count: {}}
                }
            },
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: ["Jan", "Feb", "Mar", "Apr", "May", "June", 
                                "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id']
                            }
                        }
                    }
                }
            }
        ]).sort({month : -1})

        let totalUsersInThisYear = await  userSchema.aggregate([
            {
                $match : {
                "createdDate" : { $gte : oneYearAgo }
                }
            },
            {
                $project:
                {
                    createdDate: 1,
                }
            },
            {
                $group: {
                    _id: { $month: "$createdDate"},
                    count: { $count: {}}
                }
            },
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: ["Jan", "Feb", "Mar", "Apr", "May", "June", 
                                "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id']
                            }
                        }
                    }
                }
            }
        ]).sort({month : -1})
        

       
        let weeklySalesReport=await orderSchema.aggregate([
            {
                $match : {
                "deliveredDate" : { $gte : oneWeekAgo }
                }
            },
            {
                $project:
                {
                    purchaseDate: 1,
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$purchaseDate"},
                    count: { $count: {}}
                }
            },
        ])
     
        
        let usedCoupons = await couponSchema.aggregate([
            {
                $project : {
                    code : 1,
                    usedCounts : 1,
                }
            }
            
        ])

        let years =[]
        let currentYear=new Date();
        for(var i=1;i<10;i++){
            years.push(currentYear.getFullYear()-i);
        }
        

        res.render('admin/index',{years,incomeStatistics,totalUsersInThisYear,totalSellsInThisYear,usedCoupons,weeklySalesReport,noHeader:true,noFooter:true,totalSells,totalIncome,totalSellsInThisMonth,totalIncomeInThisMonth,orders})        
    },
    login : async(req,res)=>{
        res.render('admin/auth-sign-in',{noHeader:true,noFooter:true})
    },
    postSignup : async(req,res)=>{
        let adminDetails=await adminSchema.findOne({email:req.body.email,password : req.body.password})
        if(adminDetails){
            req.session.admin=adminDetails
            req.session.adminLoggedIn=true
            res.redirect('/admin')
        }else{
            res.redirect('/admin/admin-auth')
        }
    },
    customers : async (req,res)=>{
        let customers = await userSchema.find({}).lean()
        
        res.render('admin/app-customers-list',{noHeader:true,noFooter:true,customers})
    },
    blockUser : async(req,res)=>{
        let user = await userSchema.findById(req.params.id)
        if(user.status){
            userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.params.id)
                },
                {
                    $set : {
                        status : false
                    }
                }
            ).then(()=>{
                res.redirect('/admin/customers')
            })
        }else{
            userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.params.id)
                },
                {
                    $set : {
                        status :true
                    }
                }
            ).then(()=>{
                res.redirect('/admin/customers')
            })
        }
        
    },
    yearInvoice : async(req,res)=>{
        // req.query.year=parseInt(req.query.year)+1
        // req.query.year=''+req.query.year
        wantDate=new Date(req.query.year)
        let year=parseInt(req.query.year)+1;
        year=''+year
        limitDate = new Date(year)
        let incomeStatistics = await  orderSchema.aggregate([
            {
                $match : {
                "deliveredDate" : { $gte : wantDate }
                }
            },
            {
                $match : {
                "deliveredDate" : { $lte : limitDate }
                }
            },
            {
                $project:
                {
                    purchaseDate: 1,
                    total : 1,
                }
            },
            {
                $group: {
                    _id: { $month: "$purchaseDate"},
                    total: { $sum: "$total" }
                }
            },
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: ["Jan", "Feb", "Mar", "Apr", "May", "June", 
                                "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id']
                            }
                        }
                    }
                }
            }
        ]).sort({month : -1})
        
        res.json({incomeStatistics})
    },
    MonthInvoice : async(req,res)=>{
        date=new Date().getFullYear()
        date=date+'-'+req.query.month
        date=new Date(date)

        req.query.month=parseInt(req.query.month)+1

        limitDate = new Date().getFullYear()
        limitDate=limitDate+'-'+req.query.month
        limitDate=new Date(limitDate)
        
        let incomeStatistics = await  orderSchema.aggregate([
            {
                $match : {
                "deliveredDate" : { $gte : date }
                }
            },
            {
                $match : {
                "deliveredDate" : { $lte : limitDate }
                }
            },
            {
                $project:
                {
                    purchaseDate: 1,
                    total : 1,
                }
            },
            {
                $group: {
                    _id: { $week: "$purchaseDate"},
                    total: { $sum: "$total" }
                }
            },
        
    ]).sort({week : -1})
        res.json({incomeStatistics})
        
    },
    WeekInvoice : async(req,res)=>{
        year=new Date().getFullYear()
        month=new Date().getMonth()+1

        let limit=parseInt(req.query.week)+1
        limit=year+'-'+month+'-'+limit
        limit=new Date(limit)

        let start=parseInt(req.query.week)-6
        start=year+'-'+month+'-'+start
        start=new Date(start)
       
        let weeklySalesReport=await orderSchema.aggregate([
            {
                $match : {
                "deliveredDate" : { $gte : start }
                }
            },
            {
                $match : {
                "deliveredDate" : { $lte : limit }
                }
            },
            {
                $project:
                {
                    purchaseDate: 1,
                    total : 1
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$purchaseDate"},
                    count: { $count: {}},
                    total : {$sum : "$total"}
                }
            },
        ]).sort({_id : 1})

        res.json({weeklySalesReport})
    },
    logout : async(req,res)=>{
        req.session.destroy();
        res.redirect('/admin')
    },
}