const express = require('express');//подключает epxress

const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const db =require('./database');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended:false}));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  }));
  
  // Явные заголовки для статических файлов
 app.use('/uploads', express.static('uploads')); // Разрешаем доступ к папке uploads
// Дополнительная настройка CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const userController = require('./routes/user.controller'); // Убедитесь, что файл.exports корректен
const authorController = require('./routes/author.controller');
const authController = require('./routes/user.auth.controller');
const emailSend = require('./gmailPost/gmail');
const userInformation = require('./controllers/userInformation')
const resetPassword = require('./routes/reset.password.controller');
const avatarUpdate = require('./controllers/update/userUpdate.Profile');
const authorCreate = require('./controllers/update/userCreateAuthor');
const authorGet = require('./controllers/authors/author.get');
const authorOneGet = require('./controllers/authors/author.getOne');
const bookCreate = require('./controllers/book/bookCreate');
const addGenre = require('./admin/Genre/addGenre');
const getMyBook = require('./controllers/book/getMyBook');
const getNewBooks = require('./controllers/book/getNewBooks');
const getGenre = require('./controllers/genre/getGenre');
const addLookeed = require('./controllers/book/addBookLooked');
const LookedBook = require('./controllers/book/getBookLooked');
const BookRead = require('./controllers/book/getBookRead');
const bookUpdate = require('./controllers/book/bookUpdate');
const bookDelete = require('./controllers/book/deleteBook');
const genreUpdate = require('./admin/Genre/updateGenre');
const genreDelete = require('./admin/Genre/deleteGenre');
const UserGet = require('./admin/User/getUsers');
const BanUser = require('./admin/User/banUser');
const BanBook = require('./admin/Book/bookBan');
const commentAuthor = require('./controllers/authors/comment.author');

app.use('/api/user',userController);
app.use('/api/user',authController);
app.use('/api/author',authorController);
app.use('/api/sendEmail', emailSend);
app.use('/api/resetPassword', resetPassword);
app.use('/api', userInformation);
app.use('/api',avatarUpdate);
app.use('/api', authorCreate);
app.use('/api',authorGet);
app.use('/api', authorOneGet);
app.use('/api', bookCreate);
app.use('/api', addGenre);
app.use('/api', getMyBook);
app.use('/api', getNewBooks);
app.use('/api', getGenre);
app.use('/api', addLookeed);
app.use('/api', LookedBook);
app.use('/api',BookRead);
app.use('/api',bookUpdate);
app.use('/api',bookDelete);
app.use('/api',genreUpdate);
app.use('/api',genreDelete);
app.use('/api',UserGet);
app.use('/api',BanUser);
app.use('/api',BanBook);
app.use('/api',commentAuthor);
app.listen(PORT, ()=>{
    console.log('server run in port '+ PORT);
});
