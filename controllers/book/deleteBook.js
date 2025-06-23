const express = require('express');

const router = express.Router();

const Book = require('../../models/book.model');

const authenticationToken = require('../../middlewear/middlewear');

const fs = require('fs').promises;
const User = require('../../models/user.model');
const path = require('path'); 
router.delete('/deleteBook/:id', authenticationToken(['author','admin']), async(req,res)=>{
    const bookId = req.params.id;
    const userId = req.user.id;
    try {
        const book = await Book.findById(bookId);
        if(!book){
            return res.status(404).json({message:'Книга не найдена'});
        }
        if(book.author.toString()!== userId.toString()){
            return res.status(403).json({message:'Вы не можете удалить эту книгу'});
        }
        if(book.preview){
            const previewPath = path.join(__dirname, '../../', book.preview);
            await fs.unlink(previewPath).catch(err=>console.error('Ошибка удаления обложки:', err));
        }
        if(book.music){
            const musicPath = path.join(__dirname,'../../', book.music);
            await fs.unlink(musicPath).catch(err=>console.error('Ошибка удаления музыки:', err));
        }
        for(const chapter of book.chapters){
            if(chapter.image){
                const imagePath = path.join(__dirname,'../../', chapter.image);
                await fs.unlink(imagePath).catch(err=>console.error('Ошибка удаления изображения главы', err));
            }
        }
        const deleteBook = await Book.findByIdAndDelete({
            _id:bookId,
            author:userId
        });
        if(!deleteBook){
            return res.status(404).json({message:'У вас нет прав на удаление этой книги'});
        }

        const author = await User.findById(
            userId
        );
        author.book_much -=1;
        await author.save();
        return res.status(200).json({ message: 'Книга успешно удалена' });
    } catch (error) {
        console.error(error);
    }
})


module.exports = router;