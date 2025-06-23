const express = require('express');
const router = express.Router();
const Book = require('../../models/book.model');
const authenticationToken = require('../../middlewear/middlewear');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const User = require('../../models/user.model');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads/book_preview');
    },
    filename: (req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const upload = multer({storage});
router.post('/bookCreate',authenticationToken(),upload.fields([ {name:'preview'}, {name: 'music'}]), async(req,res) =>{
    try{
        const {title, genre,description,year_released} = req.body;
        const _id = req.user.id;
        const preview = req.files['preview'] ? req.files['preview'][0].path : null;
        if (!preview) {
            return res.status(400).json({ message: 'Обложка книги обязательна.' });
        }
        const music = req.files['music'] ? req.files['music'][0].path : null;
        if(title.length>50){
            return res.status(400).json({message: 'Название книги не должно превышать 50 символов'});
        }
        if(description.length>500){
            return res.status(400).json({message: 'Описание книги не должно превышать 200 символов'});
        }
        if(description.length<10){
            return res.status(400).json({message: 'Описание книги должно быть больше 10 символов'});
        }
        const newBook = new Book({
            title,
            author:_id,
            genre,
            music: music,
            preview: preview,
            description,
            year_released
        });
        await newBook.save();
        const author = await User.findById(_id);
        if(!author){
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
        
        author.book_much = parseInt(author.book_much||0) +1;
        await author.save();
        res.status(201).json(newBook);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Ошибка при создании книги'});
    }
    
    
} );


router.post('/books/:id/chapters', upload.single('image'), async (req,res)=>{
    try{
        const id = req.params.id;
        const {title, content} = req.body;
        const image = req.file? req.file.path : null;

        const book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: 'Книга не найдена'});
            
        }
        book.chapters.push({title, content, image: image});
        await book.save();
        res.status(201).json(book);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Ошибка при создании главы'});
        
    }
})

module.exports = router;