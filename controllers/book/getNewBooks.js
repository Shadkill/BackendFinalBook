const express = require('express');
const router = express.Router();
const Book = require('../../models/book.model');
const User = require('../../models/user.model');

router.get('/newBooks', async(req,res)=>{
    try {
        const currentDate = new Date();
        const last5Days = new Date(currentDate.setDate(currentDate.getDate()-5));
        const newBooks = await Book.find({createdAt:{$gte:last5Days}, isBanned:false})
        .sort({createdAt:-1});
        res.json(newBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Ошибка при получении новых книг'});
    }
});

router.get('/genreBook/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const genreBook = await Book.find({genre: id, isBanned:false});
        if(genreBook.length==0){
             res.status(200).json({message: 'Книги данного жанра не найдены'});
             return;
        }
        
        res.json(genreBook);
    } catch (error) {
        console.log(error);
    }
});

router.get('/bookByAuthor/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: 'Книга не найдена'});
        }
        const author = await User.findById(book.author);
        if(!author){
            return res.status(404).json({message: 'Автор не найден'});
        }
        const bookAuthor = await Book.find({author:book.author,isBanned:false});
        if(bookAuthor.length===0){
            return res.status(200).json({message: 'Книг данного автора не найдены'});
        }
        const response = {
            author,
            bookAuthor
        }
        res.json(response);
    } catch (error) {
        console.log(error);
    }
});

router.get('/bookByAuthorLogin/:login', async (req, res) => {
    try {
        const login = req.params.login;
        const user = await User.findOne({login});
        if(!user){
            return res.status(404).json({message: 'Автор не найден'});
        }
        const bookAuthor = await Book.find({author: user._id, isBanned:false});
        if(bookAuthor.length===0){
            return res.status(200).json({message: 'Книг данного автора не найдены'});
        }
        res.json(bookAuthor);
    } catch (error) {
        console.error(error);
    }
})


module.exports = router;