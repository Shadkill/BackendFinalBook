const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String,
        minLength:2,
        required:true
    },
    age:{
        type: String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true

    },
    login:{
        type:String,
        unique:true,
        required:true

    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type: String,
        
    },
    pseudonym:{
        type: String,
        
    },
    bio:{
        type:String,

    },
    book_much:{
        type:String,

    },
    role:{
        type:String,
        enum:['user', 'admin','author'],
        default: 'user'
    },
    watch:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    looked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    watch_future:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    code:{
        type: String,
    },
    isBanned:{
        type:Boolean,
        default: false
    }

});
const User =mongoose.model('User', schema);
module.exports = User;