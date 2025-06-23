const express = require('express');
const router = express.Router();

const fs = require('fs').promises;
const path = require('path');

const Book = require('../../models/book.model');

const User =require('../../models/user.model');

const authenticationToken = require('../../middlewear/middlewear');

const nodemailer = require('nodemailer');

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

router.get('/bookGetAdmin',authenticationToken(['admin']),async(req,res)=>{
        try {
            const {query} = req.query;
            const filter = {
                isBanned:true,
                ...(query&&{title:{$regex:query, $options:'i'}})
            }
            const bookFind = await Book.find(filter);

            res.json(bookFind);
        } catch (error) {
            console.error(error);
        }
} );
router.get('/bookGetAdminUnban',authenticationToken(['admin']),async(req,res)=>{
    try {
        const {query} = req.query;
        const filter = {
            isBanned:false,
            ...(query&&{title:{$regex:query, $options:'i'}})
        }
        const bookFind = await Book.find(filter);

        res.json(bookFind);
    } catch (error) {
        console.error(error);
    }
} );
router.post('/banBook/:id', authenticationToken(['admin']),async(req,res)=>{
    try {
        const id = req.params.id;
        const {banDescription } = req.body;
        if(!banDescription){
            return res.status(401).json({message:'Заполните причину блокировки!'});
        }
        const book = await Book.findById(id);
        if(!book){
            return res.status(401).json({message:'Книга не найдена!'});
        }
        const author = await User.findById(book.author);
        if(!author){
            return res.status(401).json({message:'Автор не найден!'});
        }

        book.isBanned = true;
        await book.save();
         const templatePath = path.join(__dirname, '../../templates/BanBook.html');
                           let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
                           htmlTemplate = htmlTemplate.replace('{{banDescription}}', banDescription);
                           htmlTemplate = htmlTemplate.replace('{{title}}', book.title);
                           htmlTemplate = htmlTemplate.replace('{{name}}', author.name);
                           const mailOptions = {
                               from: `"Потрясающая книга"${process.env.EMAIL}`,
                               to: author.email,
                               subject: 'Блокировка книги',
                               html: htmlTemplate, // Добавлен HTML-контент
                               text: `Ваша книга заблокирована по причине: ${banDescription}`
                           };
                transporter.sendMail(mailOptions, (error,info)=>{
                    if (error) {
                        console.error('Ошибка при отправке письма:', error);
                        return res.status(500).json({ message: 'Ошибка при отправке письма' });
                    }
                    console.log('Письмо отправлено:', info.response);
                    return res.status(200).json({message: "Книга успешно заблокирована!"});
                })
    } catch (error) {
        console.error(error);
    }
});


router.post('/unBanBook/:id', authenticationToken(['admin']), async(req,res)=>{
    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        if(!book){
            return res.status(401).json({message:'Книга не найдена!'});
        }
        const author = await User.findById(book.author);
        if(!author){
            return res.status(401).json({message:'Автор не найден!'});
        }
        book.isBanned = false;
        await book.save();
         const templatePath = path.join(__dirname, '../../templates/UnBanBook.html');
                           let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
                           htmlTemplate = htmlTemplate.replace('{{title}}', book.title);
                           htmlTemplate = htmlTemplate.replace('{{name}}', author.name);
                           const mailOptions = {
                               from: `"Потрясающая книга"${process.env.EMAIL}`,
                               to: author.email,
                               subject: 'Разблокировка книги',
                               html: htmlTemplate, // Добавлен HTML-контент
                               text: `Ваша книга разблокирована!`
                           };
                transporter.sendMail(mailOptions, (error,info)=>{
                    if (error) {
                        console.error('Ошибка при отправке письма:', error);
                        return res.status(500).json({ message: 'Ошибка при отправке письма' });
                    }
                    console.log('Письмо отправлено:', info.response);
                    return res.status(200).json({message: "Книга успешно разблокирована!"});
                })
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;