const express = require('express');
const router = express.Router();
const Book = require('../../models/book.model');
const authenticationToken = require('../../middlewear/middlewear');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads/book_preview');
    },
    filename: (req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const upload = multer({storage});
router.put('/bookUpdate/:id',authenticationToken(),upload.fields([ {name:'preview'}, {name: 'music'}]), async(req,res)=>{
    try {
        const {title,year_released,genreId, description} = req.body;
        const userId  = req.user.id;
        const bookId = req.params.id;
        if(title.length>50){
            return res.status(400).json({message: 'Название книги не должно превышать 50 символов'});
        }
        if(description.length>500){
            return res.status(400).json({message: 'Описание книги не должно превышать 200 символов'});
        }
        if(description.length<10){
            return res.status(400).json({message: 'Описание книги должно быть больше 10 символов'});
        }
        const AuthorBook = await Book.findById({
            _id: bookId,
            author: userId 
        });
        if(!AuthorBook){
            return res.status(400).json({message: 'Вы можете редактировать только книги которые принадлежат вам!'});
        }
        AuthorBook.title = title;
        AuthorBook.year_released = year_released;
        AuthorBook.genre = genreId;
        if (req.files['preview']) {
            // Удаляем старую обложку
            if (AuthorBook.preview) {
                const oldPreviewPath = path.join(__dirname, '../../', AuthorBook.preview);
                if (fs.existsSync(oldPreviewPath)) {
                    fs.unlinkSync(oldPreviewPath);
                }
            }
            AuthorBook.preview = req.files['preview'][0].path;
        }
        if (req.files['music']) {
            // Удаляем старую музыку
            if (AuthorBook.music) {
                const oldMusicPath = path.join(__dirname, '../../', AuthorBook.music);
                if (fs.existsSync(oldMusicPath)) {
                    fs.unlinkSync(oldMusicPath);
                }
            }
            AuthorBook.music = req.files['music'][0].path;
        }
        await AuthorBook.save();
        return res.status(200).json({message:'Данные успешно обновлены'});
    } catch (error) {
        console.error(error);
    }
} );

const chapterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/book_preview'); // Папка для изображений глав
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Уникальное имя файла
    }
});
const chapterUpload = multer({ storage: chapterStorage }).any();
router.put('/chaptersUpdate/:id', authenticationToken(),chapterUpload, async(req,res) =>{
    try {
        const {chapters} = req.body;
        const id = req.params.id;
        const userId = req.user.id;
        const AuthorBook = await Book.findOne({
            _id:id,
            author:userId
        });
        if(!AuthorBook){
            return res.status(400).json({message:'Вы можете редактировать только книги которые принадлежат вам!'});
        }
        const parsedChapters = typeof chapters === 'string' ? JSON.parse(chapters) : chapters;

        // Собираем пути к новым изображениям
        const newImages = {};
        req.files.forEach(file => {
            const match = file.fieldname.match(/image_(\d+)/);
            if (match) {
                newImages[match[1]] = file.path;
            }
        });

        // Обновляем главы
        const updatedChapters = parsedChapters.map((chapter, index) => {
            // Если есть новое изображение - используем его, иначе оставляем старое
            const imagePath = newImages[index] || chapter.image;
            
            if (!imagePath) {
                throw new Error(`Изображение для главы ${index + 1} обязательно`);
            }

            return {
                title: chapter.title,
                content: chapter.content,
                image: imagePath
            };
        });

        AuthorBook.chapters = updatedChapters;
        await AuthorBook.save();
        return res.status(200).json({message:'Данные успешно обновлены'});
    } catch (error) {
        console.error(error);
    }
} )

module.exports= router;