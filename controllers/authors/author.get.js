const express = require('express');
const router =express.Router();
const User = require('../../models/user.model'); 
const Book = require('../../models/book.model'); 
const authenticationToken = require('../../middlewear/middlewear');
router.get('/getAuthors', async (req,res)=>{
    const {query} = req.query;
    const filter = {
        role: 'author', // Все авторы
        ...(query && { name: { $regex: query, $options: 'i' } }) // Если есть запрос, добавляем фильтр по имени
    };
    try {
        const authors = await User.find(filter);
        res.json(authors);
    } catch (error) {
        res.status(404).json({message: 'Ошибка сервера'});
    }
});
router.get('/getAuthorByBook/:id',authenticationToken(), async(req,res)=>{
    try {
        const id = req.params.id;
        const getBook = await Book.findById(id).populate('author');
        if (!getBook) {
            return res.status(404).json({ message: 'Книга не найдена' });
        }
        const author = getBook.author;
        if (!author) {
            return res.status(404).json({ message: 'Автор не найден' });
        }
        res.json(author);
    } catch (error) {
        console.error(error);
    }
})
router.get('/searchBooks', async (req, res) => {
    const query = req.query.query; 
    if (!query) {
        return res.status(400).json({ message: 'Не указан запрос для поиска' });
    }

    try {
        const books = await Book.find({ 
            title: { $regex: query, $options: 'i' } // Поиск по заголовку книги (не чувствителен к регистру)
        });
        res.json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при выполнении поиска' });
    }
});
module.exports = router;