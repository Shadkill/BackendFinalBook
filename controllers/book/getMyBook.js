const express = require('express');
const router = express.Router();
const Book = require('../../models/book.model');
const authenticationToken = require('../../middlewear/middlewear');
const User = require('../../models/user.model')

router.get('/myBook', authenticationToken(), async(req,res)=>{
    try {
        const id = req.user.id;
        const books = await Book.find({author: id});
        res.json(books);
    } catch (error) {
        console.log(error);
    }
    
    
});

router.get('/book_detail/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const book = await Book.findById(id).populate('author').populate('genre');
        if(!book){
            return res.status(404).json({message: 'Книга не найдена'});
        }
        
        const response = {
            book:book,
            author:{
                id:book.author._id,
                name: book.author.name,
            },
            genre:{
                id: book.genre._id,
                genre: book.genre.genre,
            },
        }
        res.json(response);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;