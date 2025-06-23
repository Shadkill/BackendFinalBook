const express = require('express');
const User = require('../../models/user.model'); 
const router = express.Router();

router.get('/authors/:login', async (req,res)=>{
    const login = req.params.login;
    const author = await User.findOne({login});
    if(!author){
        return res.status(404).json({
            message: 'Автор не найден',
        });
    }
    res.json(author);
});

module.exports = router;