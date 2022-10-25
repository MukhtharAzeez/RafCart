const mongoose = require('mongoose');
const bannerSchema  = require('../models/banner_schema')
const cloudinary = require('../utils/cloudinary');

module.exports={
    banners : async(req,res)=>{
        let banners = await bannerSchema.find({}).lean();
        res.render('admin/app-banners-list',{noHeader :true,noFooter:true,banners})
    },
    add_banner : async(req,res)=>{
        res.render('admin/add-banner',{noHeader :true,noFooter:true})
    },
    add_a_banner : async(req,res)=>{
        
        let result
        if(req.files[0]){
            result = await cloudinary.uploader.upload(req.files[0].path,{
                folder :'La Bonnz',
                use_filename :true,
            });
            const banners=new bannerSchema({
                title : req.body.title,
                description : req.body.description,
                image : result.secure_url,
                cloudinary_id:result.public_id
            });

            banners
                .save()
                .then(async(result)=>{
                    res.redirect('/admin/banners')
                })
                .catch((error)=>{
                    console.log(error);
                })
        }else{
            res.redirect('/admin/banners')
        }
    },
    edit_banner : async(req,res)=>{
        let banner = await bannerSchema.findOne({_id:req.params.id}).lean();
        res.render('admin/edit-banner',{noHeader :true,noFooter:true,banner})
    },
    edit_a_banner : async(req,res)=>{
        let banner = await bannerSchema.findOne({_id:req.params.id}).lean();
         let result
         console.log(banner);
        if(req.files[0]){
            await cloudinary.uploader.destroy(banner.cloudinary_id)
            result = await cloudinary.uploader.upload(req.files[0].path,{
                folder :'La Bonnz',
                use_filename :true,
            });
        }else{
            result={
                secure_url:banner.image,
                public_id:banner.cloudinary_id
            }
            
        }

        await bannerSchema.updateOne(
            {
                _id:req.params.id
            },
            {
                $set :{
                    title : req.body.title,
                    description : req.body.description,
                    image : result.secure_url,
                    cloudinary_id:result.public_id
                }
            }
        ).then(()=>{
            res.redirect('/admin/banners')
        })
    },
    delete_banner : async(req,res)=>{
        let banner = await bannerSchema.findOne({_id:req.params.id}).lean();
        await cloudinary.uploader.destroy(banner.cloudinary_id)
        await bannerSchema.deleteOne({_id : req.params.id})
        res.redirect('/admin/banners')
    },
}