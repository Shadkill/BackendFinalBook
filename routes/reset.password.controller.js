const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Code = require('../models/code.model');
const bcrypt = require('bcrypt');
router.post('/resetPassword', async (req,res)=>{
    const {email, newPassword,repeatNewPassword, code} = req.body;
    if(!email||!code||!newPassword){
        return res.status(400).json({
            message:'Заполните все поля'
        })
    }
    if(repeatNewPassword!=newPassword){
        return res.status(400).json({message:'Пароли не совпадают!'})
    }

    const codeModel = await Code.findOne({email}); 
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: 'Пользователь не найден'
        });
    }
    if(!codeModel){
        return res.status(400).json({
            message: 'Неправильный код'
        });
    }
    if(!(await bcrypt.compare(code, codeModel.code))){
        return res.status(400).json({
            message:'Неправильный код'
        })
    }
    if( !(await bcrypt.compare(newPassword, user.password))){
        return res.status(400).json({
            message: 'Новый пароль не должен совпадать с текущим'
        });
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);

    const userPasswordUpdate = await User.updateOne({
        email,
        password: hashedPassword
    });
    await Code.deleteOne({email,code});
   
    if(!userPasswordUpdate){
        console.log(error);
    } 
    res.status(200).json({
        message: 'Пароль успешно изменен'
    });

})
module.exports= router;