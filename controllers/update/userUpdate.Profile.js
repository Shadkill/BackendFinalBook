const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const authenticationToken = require('../../middlewear/middlewear');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({//обращаемся в библиотеку multer и указываем место хранения файлов
    destination: (req,file,cb)=>{
        cb(null,'uploads/user_avatar');///в какую папку сохранять(папка должна быть создана заранее)

    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)//генерируем уникальное имя файла
    }
});
const upload = multer({storage});
router.put('/userUpdateProfile', authenticationToken(),upload.single('avatar'), async(req,res)=>{
    
    const userId = req.user.id;
    const {name,age,login,pseudonym,bio} = req.body;

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
        if (req.file) {
            const newAvatar = req.file.path; // Полный путь к файлу
            
            // Удаляем старый аватар (если он есть)
            if (user.avatar) {
                const oldAvatarPath = path.join(__dirname, '..', '..', user.avatar);
                fs.unlink(oldAvatarPath, (err) => {
                    if (err) console.error('Ошибка удаления старого аватара:', err);
                });
            }
            
            // Сохраняем относительный путь (например: 'uploads/user_avatar/12345-image.jpg')
            user.avatar = `uploads/user_avatar/${req.file.filename}`;
        }
        
        user.name = name;
        user.age=age;
        user.login = login;
        if(pseudonym)
        user.pseudonym = pseudonym;
        if(bio)
            user.bio = bio;
    
            await user.save(); // Сохраняем изменения
    
            res.status(200).json({
                message: 'Данные успешно обновлены',
                avatar: user.avatar // Возвращаем новый путь к аватару (опционально)
            });
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при изменении аватара' });
    }


  

});

module.exports = router;