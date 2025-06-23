const express = require('express');
const router = express.Router();

const User = require('../../models/user.model');
const authenticationToken = require('../../middlewear/middlewear');
router.get('/getUserAdmin',authenticationToken(['admin']), async(req,res)=>{
    try {
        const {query} = req.query;
        const filterUser = {
            role:'user',
            ...(query && {$or:[
                {login:{$regex:query, $options:'i'}},
                {name:{$regex:query,$options:'i'}}
            ]})
        }
        const users = await User.find(filterUser);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(401).json({message:'Ошибка сервера'})
    }
} );

router.get('/getAuthorAdmin', authenticationToken(['admin']), async(req,res)=>{
    try {
        const {query} = req.query;
        const filterAuthor = {
            role:'author',
            ...(query && {$or:[
                {login:{$regex:query, $options:'i'}},
                {name:{$regex:query,$options:'i'}}
            ]})
        }
        const authors = await User.find(filterAuthor);
        res.status(200).json(authors);
    } catch (error) {
        console.error(error);
        res.status(401).json({message:'Ошибка сервера'})
    }
})

module.exports = router;