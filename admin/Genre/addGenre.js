const Genre = require('../../models/genre.model');
const express = require('express');
const router = express.Router();
const authenticationToken = require('../../middlewear/middlewear');
router.post('/addGenre',authenticationToken(['admin']), async(req,res)=>{
try{
    const {genre} = req.body;
    const genreExists = await Genre.findOne({genre});
    if(genreExists){
        return res.status(400).json({
            message:'Такой жанр уже существует'
        })
    }else{
        const newGenre = await Genre.create({
        genre: genre
    });
    
    res.json({message: 'Жанр успешно добавлен'}); 
    }
   
}catch(error){
    console.error(error);
    return res.status(500).json({
        message: 'Ошибка'
    });
}
    
});

router.get('/getAllGenres', async(req,res)=>{
    try{
        const genres = await Genre.find();
        res.json(genres);
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: 'Ошибка'
        });
    }
 });

module.exports = router;