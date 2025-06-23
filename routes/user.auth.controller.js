const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const express = require('express');
const router =express.Router();
const Code = require('../models/code.model');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path =require('path');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
router.post('/loginCode',async(req,res)=>{
    try {
        const {email,password} = req.body;
    
    if(!email||!password)
        return res.status(400).json({
            message:'Заполните все поля'
        })
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:'Данный пользователь не найден',
        });
    }
    if(user.isBanned===true){
        return res.status(400).json({
            message:'Данный аккаунт заблокирован!',
        });
    }
    if(!(await bcrypt.compare(password, user.password))){
        return res.status(400).json({
            message:'Неверный пароль',
        });
    }
    if(password.length <8){
        return res.status(400).json({
            message:'Пароль должен быть не менее 8 символов',
        });
    }
    const resetCode = Math.floor(100000 + Math.random()*900000).toString();
    const codeExists = await Code.findOne({
        email: email,
    });
    if(codeExists)
        await Code.deleteOne({
            email: email,
        });

        const codeHash = await bcrypt.hash(resetCode, 10);
        await Code.create({
            email: email,
            code: codeHash,
        });
        const templatePath = path.join(__dirname, '../templates/emailProtected.html');
            let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
            htmlTemplate = htmlTemplate.replace('{{CODE}}', resetCode);
            const mailOptions = {
                from: `"Потрясающая книга"${process.env.EMAIL}`,
                to: email,
                subject: 'Подтверждение входа',
                html: htmlTemplate, // Добавлен HTML-контент
                text: `Ваш код для входа: ${resetCode}`
            };
        transporter.sendMail(mailOptions, (error,info)=>{
            if (error) {
                console.error('Ошибка при отправке письма:', error);
                return res.status(500).json({ message: 'Ошибка при отправке письма' });
            }
            console.log('Письмо отправлено:', info.response);
            return res.status(200).json({message: "Код отправлен на вашу почту"});
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:'Ошибка сервера'
        });
    }
    
    
});


router.post('/login',async(req,res)=>{
    const {email,password,code} = req.body;
    if(!email||!password||!code){
        return res.status(400).json({
            message:'Заполните все поля'
        })
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:'Данный пользователь не найден',
        });
    }
    if(!(await bcrypt.compare(password, user.password))){
        return res.status(400).json({
            message:'Неверный пароль',
        });
    }
    if(password.length <8){
        return res.status(400).json({
            message:'Пароль должен быть не менее 8 символов',
        });
    }
    const codeExists = await Code.findOne({
        email: email,
    })
    if(!codeExists)
        return res.status(400).json({message: 'Неверный код!'});

    const matchCode = await bcrypt.compare(code, codeExists.code);
    if(!matchCode)
        return res.status(400).json({message: 'Неверный код!'});

    await Code.deleteOne({
        email: email,
    });
    const accessToken = jwt.sign({
        id:user.id,
        login:user.login,
        role: user.role,
    },
    process.env.JWT_SECRET,{
        expiresIn:"8h"
    }
    );
    res.status(200).json({
        message:'Вы авторизованы!',
        role: user.role,
        token: accessToken
    });
});
module.exports = router;