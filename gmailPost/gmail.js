const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const User = require('../models/user.model');
const Code = require('../models/code.model');
const fs = require('fs').promises;
const path =require('path');
const bcrypt =require('bcrypt');
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

router.post('/sendCode', async (req, res) => {
    try {
        const {email} = req.body;
    if(!email){
        return res.status(400).json({message:'Email обязателен'})
    }
    const user = await User.findOne({email});
 
    if(!user){
        return res.status(400).json({message: 'Пользователь с таким email не найден'});

    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExists = await Code.findOne({ email: email })
    if(codeExists)
            await Code.deleteOne({
                email: email,
            });
            const codeHash = await bcrypt.hash(resetCode, 10);
    await Code.create({
        email: email,
        code: codeHash
    });
    const templatePath = path.join(__dirname, '../templates/emailTemplate.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    htmlTemplate = htmlTemplate.replace('{{CODE}}', resetCode);
    const mailOptions = {
        from: `"Потрясающая книга"${process.env.EMAIL}`,
        to: email,
        subject: 'Сброс пароля',
        html: htmlTemplate, // Добавлен HTML-контент
        text: `Ваш код для сброса пароля: ${resetCode}`
    };
     transporter.sendMail(mailOptions, (error,info)=>{
        if (error) {
            console.error('Ошибка при отправке письма:', error);
            return res.status(500).json({ message: 'Ошибка при отправке письма' });
        }
        console.log('Письмо отправлено:', info.response);
        res.status(200).json({message: 'Код был отправлен на вашу электронную почту!'});
    })
    } catch (error) {
        res.status(400).json({message:'Ошибка при обработке запроса'});
        console.log(error);
    }
    
    
})
module.exports = router;
