const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const Book = require('../../models/book.model');
const authenticationToken = require('../../middlewear/middlewear');


router.get('/watchBook', authenticationToken(), async (req,res)=>{
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        const books = await Book.find({_id: {$in: user.watch}});//ну тут по id ищется все книги которые есть в массиве looked
        if(!books){
            return res.status(404).json({message: 'Книги не найдены'});
        }
        res.json(books);
    } catch (error) {
        console.log(error);
    }
});
router.get('/lookedBook', authenticationToken(), async (req,res)=>{
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        const books = await Book.find({_id: {$in: user.looked}});//ну тут по id ищется все книги которые есть в массиве looked
        if(!books){
            return res.status(404).json({message: 'Книги не найдены'});
        }
        res.json(books);
    } catch (error) {
        console.log(error);
    }
});
router.get('/watchFutureBook', authenticationToken(), async (req,res)=>{
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        const books = await Book.find({_id: {$in: user.watch_future}});//ну тут по id ищется все книги которые есть в массиве looked
        if(!books){
            return res.status(404).json({message: 'Книги не найдены'});
        }
        res.json(books);
    } catch (error) {
        console.log(error);
    }
});


module.exports= router;