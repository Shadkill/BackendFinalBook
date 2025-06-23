const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const authenticationToken = require('../../middlewear/middlewear');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
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
router.post('/banUser/:id', authenticationToken(['admin']), async(req,res)=>{
    try {
        const {banDescription} = req.body;
        if(!banDescription){
            res.status(400).json({message:'Заполните причину блокировки!'});
            return;
        }
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user){
            res.status(400).json({message:'Пользователь не найден!'});
            return;
        }
        user.isBanned = true;
        await user.save();
        const templatePath = path.join(__dirname, '../../templates/banUser.html');
                   let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
                   htmlTemplate = htmlTemplate.replace('{{banDescription}}', banDescription);
                   htmlTemplate = htmlTemplate.replace('{{email}}', user.email);
                   htmlTemplate = htmlTemplate.replace('{{name}}', user.name);
                   const mailOptions = {
                       from: `"Потрясающая книга"${process.env.EMAIL}`,
                       to: user.email,
                       subject: 'Блокировка аккаунта',
                       html: htmlTemplate, // Добавлен HTML-контент
                       text: `Ваш аккаунт заблокирован по причине: ${banDescription}`
                   };
        transporter.sendMail(mailOptions, (error,info)=>{
            if (error) {
                console.error('Ошибка при отправке письма:', error);
                return res.status(500).json({ message: 'Ошибка при отправке письма' });
            }
            console.log('Письмо отправлено:', info.response);
            return res.status(200).json({message: "Пользователь успешно заблокирован!"});
        })
    } catch (error) {
        console.error(error)
    }
});


router.post('/unBanUser/:id', authenticationToken(['admin']), async(req,res)=>{
    try {
        
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user){
            res.status(400).json({message:'Пользователь не найден!'});
            return;
        }
        user.isBanned = false;
        await user.save();
        const templatePath = path.join(__dirname, '../../templates/unBanUser.html');
                   let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
                   htmlTemplate = htmlTemplate.replace('{{email}}', user.email);
                   htmlTemplate = htmlTemplate.replace('{{name}}', user.name);
                   const mailOptions = {
                       from: `"Потрясающая книга"${process.env.EMAIL}`,
                       to: user.email,
                       subject: 'Ваш аккаунт разблокирован',
                       html: htmlTemplate, // Добавлен HTML-контент
                       text: `Ваш аккаунт разблокирован`
                   };
        transporter.sendMail(mailOptions, (error,info)=>{
            if (error) {
                console.error('Ошибка при отправке письма:', error);
                return res.status(500).json({ message: 'Ошибка при отправке письма' });
            }
            console.log('Письмо отправлено:', info.response);
            return res.status(200).json({message: "Пользователь успешно разблокирован!"});
        })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router;