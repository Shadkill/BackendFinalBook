const express = require('express');
const router = express.Router();
const Book = require('../../models/book.model');
const User = require('../../models/user.model');
const authenticationToken = require('../../middlewear/middlewear');

router.post('/addBookLooked/:id',authenticationToken(),  async (req,res)=>{
    try {
        const id =req.user.id;
        const {step} = req.body;
        const bookId = req.params.id;        
        const book = await Book.findById(bookId);
        if(!book){
            return res.status(404).json({message: 'Книга не найдена'});
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        if(step === 1){
            if(user.watch.includes(bookId)){
                return res.status(200).json({message: 'Книга уже добавлена в "Читаю"'});
            }else if(user.watch_future.includes(bookId)){
                const index = user.watch_future.indexOf(bookId);
                if(index>-1){
                    user.watch_future.splice(index,1);
                    user.watch.push(bookId);
                    await user.save();
                    return res.status(200).json({message: 'Книга удалена из "В планах" и добавлена в "Читаю"'});
                }
            }else if(user.looked.includes(bookId)){
                const index = user.looked.indexOf(bookId);
                if(index>-1){
                    user.looked.splice(index,1);
                    user.watch.push(bookId);
                    await user.save();
                    return res.status(200).json({message: 'Книга удалена из "Прочитано" и добавлена в "Читаю"'});
                }
            }else{
                user.watch.push(bookId);
                await user.save();
                return res.status(200).json({message: 'Книга добавлена в "Читаю" '});
            }
            
            
        }else if(step === 2){
            if(user.looked.includes(bookId)){
                return res.status(200).json({message: 'Книга уже добавлена в "Прочитано"'});
            }else if(user.watch_future.includes(bookId)){
                const index = user.watch_future.indexOf(bookId);
                if(index>-1){
                    user.watch_future.splice(index,1);
                    user.looked.push(bookId);
                    await user.save();
                    return res.status(200).json({message: 'Книга удалена из "В планах" и добавлена в "Прочитано"'});
                }
            }else if(user.watch.includes(bookId)){
                const index = user.watch.indexOf(bookId);
                if(index>-1){
                    user.watch.splice(index,1);
                    user.looked.push(bookId);
                    await user.save();
                    return res.status(200).json({message: 'Книга удалена из "Читаю" и добавлена в "Прочитано"'});
                }
            }else{
                user.looked.push(bookId);
                await user.save();
                return res.status(200).json({message: 'Книга добавлена в "Прочитано" '});
            }
        }else if(step === 3){
            if(user.watch_future.includes(bookId)){
                return res.status(200).json({message: 'Книга уже добавлена в "В планах"'});
            }else if(user.watch.includes(bookId)){
                const index = user.watch.indexOf(bookId);
                if(index>-1){
                    user.watch.splice(index,1);
                    user.watch_future.push(bookId);
                    await user.save();
                    return res.status(200).json({message: 'Книга удалена из "Читаю" и добавлена в "В планах"'});
                }
            }else if(user.looked.includes(bookId)){
                const index = user.looked.indexOf(bookId);
                if(index>-1){
                    user.looked.splice(index,1);
                    user.watch_future.push(bookId);
                    await user.save();
                    return res.status(200).json({message: 'Книга удалена из "Прочитано" и добавлена в "В планах"'});
                }
            }else{
                user.watch_future.push(bookId);
                await user.save();
                return res.status(200).json({message: 'Книга добавлена в "Прочитано" '});
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Ошибка при изменении списка просмотренных книг'});
    }
    

});
router.get('/bookLooked/:id', authenticationToken(), async (req,res)=>{
    try {
        const bookId = req.params.id;
        const id = req.user.id;
        let state = '';
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        if(user.watch.includes(bookId)){
            state = 'Читаю';
            return res.json(state);
        }
        if(user.looked.includes(bookId)){
            state = 'Прочитано';
            return res.json(state);
        }
        if(user.watch_future.includes(bookId)){
            state = 'В планах';
            return res.json(state);
        }
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;