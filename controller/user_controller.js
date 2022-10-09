const db = require('../config/connection');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user_schema')

module.exports = {
    home : (req,res)=>{
        res.render('user/index-3',{noHeader:true,noFooter:true});
    },
    login : (req,res)=>{
        res.render('user/login',{noHeader:true,noFooter:true});
    },
    signup : (req,res)=>{
        res.render('user/register',{noHeader:true,noFooter:true});
    },
    postSignup : async (req,res)=>{
       
        let user =await userSchema.find({email:req.body.email})
        
        if(user[0]){
            res.redirect('/register')
            console.log("user exist");
        }else 
            if(req.body.password !== req.body.confirmPassword){
            res.redirect('/register')
            

        }else{
            return new Promise (async(resolve, reject) => {
                const userName = req.body.userName;
                const email = req.body.email;
                const phone = req.body.phone;
                const password = await bcrypt.hash(req.body.password,10);

                const user = new userSchema({
                    userName : userName,
                    email : email,
                    phone : phone,
                    password : password
                });
                user
                   .save()
                   .then((result)=>{
                    res.redirect('/')
                   })
                   .catch((error)=>{
                    console.log(error);
                   })
            })
        }
    },
    postLogin : (req,res)=>{
        userSchema.find({email:req.body.email}).then((result)=>{
            console.log(result[0]);
            bcrypt.compare(req.body.password,result[0].password).then((status)=>{
                if(status){
                   res.redirect('/')
                }else{
                   res.redirect('/login')
                }
            })
        })
    },
    
}