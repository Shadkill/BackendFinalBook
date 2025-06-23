const express = require('express');
const router = express.Router();
const Book = require('../../models/book.model');

router.get('/bookRead/:id', async (req,res)=>{
    const id = req.params.id;
    const book = await Book.findById(id);
    if(!book){
        return res.status(404).json({message: 'Книга не найдена'});
    }
    res.json(book.chapters);
 });

module.exports = router;