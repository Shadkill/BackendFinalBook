const express = require('express');
const router = express.Router();
const Genre = require('../../models/genre.model');
const authenticationToken = require('../../middlewear/middlewear');

router.put('/updateGenre/:id', authenticationToken(['admin']), async(req,res)=>{
    try {
        const id = req.params.id;
        const {genre} = req.body;
        const GenrebyId = await Genre.findById(id);
        if(!GenrebyId){
            res.status(400).json({message:'Такого жанра нет!'});
        }
        GenrebyId.genre = genre;
        await GenrebyId.save();
        res.status(200).json({message:'Жанр успешно обновлён!'})
        

    } catch (error) {
        console.error(error);
    }
})

module.exports= router;