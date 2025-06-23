const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const Book = require('../models/book.model');
const express = require('express');
const router = express.Router();
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/authors/')
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({storage});

router.post('/addAuthor',upload.single('photo'),async(req,res)=>{
    const {name,name_center,name_end,bio,age,stage,book_much,role,login,email} = req.body;
    console.log(req.body);
    const photo = req.file.path;
    console.log(photo);
    const book_count = await Book.find({author:author._id});
    const authorExists = await Author.findOne({login,email});
    if(authorExists){
        return res.status(400).json({
            message:'Аккаунт с таким логином или адресом электронной почты уже существует'
        });
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const author = new Author({
        name,
        name_center,
        name_end,
        bio,
        age,
        stage,
        book_much:book_count.length,
        role,
        login,
        email,
        photo
    });
    await author.save();
    const accessToken = jwt.sign({
        id:author.id,
        role:author.role,
        login:author.login,
        name:author.name,
        name_center:author.name_center,
        name_end:author.name_end,
    },
    
    process.env.SECRET_KEY,
    {expiresIn:'1h'});
});
module.exports = router;

