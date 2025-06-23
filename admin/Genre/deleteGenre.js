const express =require('express');
const router = express.Router();
const Genre = require('../../models/genre.model');
const authenticationToken = require('../../middlewear/middlewear');




router.delete('/deleteGenre/:id',authenticationToken(['admin']), async(req,res)=>{
    try {
        const id = req.params.id;
        const GenrebyId = await Genre.findByIdAndDelete(id);
        if(!GenrebyId){
            res.status(400).json({message:'Ошибка удаления жанра'});
        }
        res.status(200).json({message:'Жанр успешно удалён!'});
    } catch (error) {
        console.error(error);
    }
})

module.exports= router;