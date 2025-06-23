const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const authenticationToken = require('../../middlewear/middlewear');

router.put('/authorCreate', authenticationToken(), async(req,res)=>{
    const {pseudonym, bio,name} = req.body;
    const id = req.user.id;
    try{
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        user.pseudonym = pseudonym;
        user.name = name;
        user.bio = bio;
        user.role = 'author';
        user.book_much = 0;
        await user.save();
        res.status(200).json({
            message: 'Вы успешно стали автором!'
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: 'Ошибка'
        });
    }
});


module.exports = router;