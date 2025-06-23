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
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


router.post('/addUserCode',async(req,res)=>{
    const {name,age,email,login,password,confirmPassword} = req.body; 

    const userExists  = await User.findOne({email,login});
    if(userExists){
        return res.status(400).json({
            message:'Такой пользователь уже существует'
        })
    }
    if(!name||!age||!email||!login||!password||!confirmPassword){
        return res.status(400).json({
            message:'Заполните все поля'
        })
    }
    if(name.length<2){
        return res.status(400).json({
            message:'Имя должно быть больше 2 символов'
        })
    }else if(name.length>30){
        return res.status(400).json({
            message:'Имя не должно быть больше 30 символов'
        })
    }
    if(password.length<8){
        return res.status(400).json({
            message:'Пароль должен быть не менее 8 символов'
        })
    }
    if(password!==confirmPassword){
        return res.status(400).json({
            message:'Пароли не совпадают'
        })
    }
    const resetCode = Math.floor(100000 + Math.random()*900000).toString();
    const codeExists = await Code.findOne({
        email: email,
    });
    console.log(email);
    if(codeExists)
        await Code.deleteOne({
            email: email,
        });

        const codeHash = await bcrypt.hash(resetCode, 10);
        await Code.create({
            email: email,
            code: codeHash,
        });
       const templatePath = path.join(__dirname, '/../templates/emailProtected.html');
                   let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
                   htmlTemplate = htmlTemplate.replace('{{CODE}}', resetCode);
                   const mailOptions = {
                       from: `"Потрясающая книга"${process.env.EMAIL}`,
                       to: email,
                       subject: 'Подтверждения почты',
                       html: htmlTemplate, // Добавлен HTML-контент
                       text: `Ваш код для подтверждения почты: ${resetCode}`
                   };
       await transporter.sendMail(mailOptions);
    return res.status(200).json({message:'Код отправлен на вашу электронную почту!'})
});
router.post('/addUser', async(req,res)=>{
    const {name,age,email,login,password,confirmPassword,code} = req.body;
    const userExists  = await User.findOne({email,login});
    if(userExists){
        return res.status(400).json({
            message:'Такой пользователь уже существует'
        })
    }
    if(!name||!age||!email||!login||!password||!confirmPassword){
        return res.status(400).json({
            message:'Заполните все поля'
        })
    }
    if(name.length<2){
        return res.status(400).json({
            message:'Имя должно быть больше 2 символов'
        })
    }else if(name.length>30){
        return res.status(400).json({
            message:'Имя не должно быть больше 30 символов'
        })
    }
    if(password.length<8){
        return res.status(400).json({
            message:'Пароль должен быть не менее 8 символов'
        })
    }
    if(login.length> 20){
        return res.status(400).json({
            message:'Логин должен быть не больше 20 символов'
        })
    }
    if(password!==confirmPassword){
        return res.status(400).json({
            message:'Пароли не совпадают'
        })
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
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        age,
        email,
        login,
        password: hashedPassword,
    });

    const accessToken = jwt.sign({
        id:user.id,
        login:user.email,
        role: user.role,

    },
    process.env.JWT_SECRET,{
        expiresIn:"8h"
    }
    );
    res.status(200).json({
        message:'Пользователь успешно создан',
        role: user.role,
        token: accessToken
    });
});




module.exports = router;