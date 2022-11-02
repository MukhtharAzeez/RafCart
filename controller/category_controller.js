const categorySchema = require('../models/category_schema')
const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');


module.exports = {
    categories : async(req,res)=>{
        let category = await categorySchema.find({}).lean()
        res.render('admin/app-categories-list',{noHeader:true,noFooter:true,category})
    },
    add_category : (req,res)=>{
        res.render('admin/add-category',{noHeader:true,noFooter:true})
    },
    add_a_category : async(req,res)=>{
        let category = await categorySchema.findOne({name : req.body.name})
        if(category){     
            res.redirect('/admin/add-category')
        }else if(req.file) {  
            let result;
            try{
            
                result =await cloudinary.uploader.upload(req.file.path,{
                    folder :'La Bonnz',
                    use_filename :true,
                });
            }catch(err){
                console.log(err);
            } 
            const category = new categorySchema({
                name : req.body.name,
                image : result.secure_url,
                cloudinary_id:result.public_id,
                count : 0
            });
            category
                .save()
                .then((result)=>{
                   res.redirect('/admin/categories')
                })
                .catch((error)=>{
                    console.log(error);
                })
         }else{
            res.redirect('/admin/add-category')
         }
    },
    edit_category : async(req,res)=>{
        let category = await categorySchema.findById(req.params.id).lean();
        res.render('admin/edit-category',{noHeader:true,noFooter:true,category});
    },
    edit_a_category : async(req,res) => {
        let category=await categorySchema.findById(req.params.id) 
        if(req.file){
            await cloudinary.uploader.destroy(category.cloudinary_id)  
        }
        let result;
           
            try{
                result = await cloudinary.uploader.upload(req.file.path,{
                    folder :'La Bonnz',
                    use_filename :true,
                });
            }catch(err){
                console.log(err);
            }
            if(req.file){
                categorySchema.updateOne(
                    {
                        _id : mongoose.Types.ObjectId(req.params.id)
                    },
                    {
                        $set : {
                                name : req.body.name,
                                image : result.secure_url,
                                cloudinary_id:result.public_id
                        }
                    }
                ).then((result)=>{
                    res.redirect('/admin/categories')
                })
            }else{
                categorySchema.updateOne(
                    {
                        _id : mongoose.Types.ObjectId(req.params.id)
                    },
                    {
                        $set : {
                                name : req.body.name,  
                        }
                    }
                ).then((result)=>{
                    res.redirect('/admin/categories')
                })
            }
    },
    
    delete_category : async(req,res)=>{
        let category=await categorySchema.findById(req.params.id)   
        console.log(category)
        if(category.count>0){
            res.redirect('/admin/categories')
        }else{
            await cloudinary.uploader.destroy(category.cloudinary_id)  
            categorySchema.deleteOne({_id : req.params.id}).then(()=>{
            res.redirect('/admin/categories')
            })
        }
       
    },
}
