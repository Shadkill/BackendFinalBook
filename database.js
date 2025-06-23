const dotenv = require('dotenv');
const db = require('mongoose');
dotenv.config();
try{
    db.connect(process.env.database);
    console.log('connection');
}catch(e){
    console.error(e);
    console.log('connection error');
}

