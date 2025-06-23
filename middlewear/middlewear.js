const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authenticationToken = (requiredRoles = []) =>{//параметр для передачи ролей
    return(req,res,next)=>{
        const authHeader = req.headers['authorization'];
        if(!authHeader){//проверяем есть ли заголовок
            return res.status(401).json({error: 'Гостевой доступ запрещён'});
        }
        const token = authHeader.split(' ')[1];//берём токен из заголовка
        if(!token){
            return res.status(401).json({error: 'Токен не найден'});
        }
        jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
            if(err){
                return res.status(403).json({error: 'Токен не действителен'});
            }
            req.user =user;//добавляем данные о пользователе в запрос
            if(requiredRoles.length>0&&!requiredRoles.includes(user.role)){
                return res.status(403).json({error: 'Вы не имеете необходимых прав доступа'});
            }
            next();
        })
    }
}
module.exports = authenticationToken;