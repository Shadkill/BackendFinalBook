const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        maxLength: 50
    },
    content:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    }
});

const schema =  new mongoose.Schema({
    title:{
        type: String,
        required: true,
        maxLength: 50,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    preview:{
        type: String,
        required: true,
    },
    genre:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    chapters:[chapterSchema],
    music:{
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    description:{
        type:String,
        required: true,
        maxLength: 200,
        minLength: 10,
    },
    year_released:{
        type: String,

    },
    isBanned:{
        type: Boolean,
        default: false
    }
});

const Book = mongoose.model('Book', schema);
module.exports = Book;