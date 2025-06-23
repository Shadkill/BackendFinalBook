const express = require('express');
const router = express.Router();
const Book = require('../../models/book.model');
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
router.post('/commentAuthor/:id', authenticationToken(),async(req,res)=>{
    try {
        const {comment} = req.body;
        if(!comment){
            return res.status(400).json({message:'Заполните отзыв!'})
        }
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message:'id не найден!'})
        }
        const BookFind = await Book.findById(id);
        if(!BookFind){
            return res.status(400).json({message:'Книга не найдена!'})
        }
        const authorByBook = await Book.findById(id).populate('author');
        if(!authorByBook){
            return res.status(400).json({message:'Автор не найден!'})
        }
        const userId = req.user.id;
        const userFind = await User.findById(userId);
        if(!userFind){
            return res.status(400).json({message:'Пользователь не найден!'})
        }
        const templatePath = path.join(__dirname, '../../templates/commentBook.html');
                           let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
                           htmlTemplate = htmlTemplate.replace('{{comment}}', comment);
                           htmlTemplate = htmlTemplate.replace('{{userName}}', userFind.login);
                           htmlTemplate = htmlTemplate.replace('{{name}}', authorByBook.author.name);
                           htmlTemplate = htmlTemplate.replace('{{BookName}}', BookFind.title);
                           const mailOptions = {
                               from: `"Потрясающая книга"${process.env.EMAIL}`,
                               to: authorByBook.author.email,
                               subject: 'Отзыв о книге',
                               html: htmlTemplate, // Добавлен HTML-контент
                               text: `О вашей книге ${BookFind.title} написали отзыв! `
                           };
                transporter.sendMail(mailOptions, (error,info)=>{
                    if (error) {
                        console.error('Ошибка при отправке письма:', error);
                        return res.status(500).json({ message: 'Ошибка при отправке письма' });
                    }
                    console.log('Письмо отправлено:', info.response);
                    return res.status(200).json({message: "Отзыв отправлен!"});
                })
    } catch (error) {
        console.error(error);
    }
});


module.exports = router;