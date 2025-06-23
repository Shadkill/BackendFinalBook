
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');
router.get('/userInfo', authenticationToken(), async(req,res)=>{
    const id = req.user.id;
    const user = await User.findById(id);
    if(!user){
        return res.status(404).json({
            message: 'Пользователь не найден',
        });
    }
    res.json(user);

})

module.exports = router;