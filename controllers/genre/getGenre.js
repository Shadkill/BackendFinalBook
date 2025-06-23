const Genre = require('../../models/genre.model');
const express = require('express');
const router = express.Router();


router.get('/genre/:id', async(req,res)=>{
    const id = req.params.id;
    const genres = await Genre.findById(id);
    if(!genres){
        return res.status(200).json({message: 'Жанр не найден'});
    }
    res.json(genres);
});

module.exports = router;