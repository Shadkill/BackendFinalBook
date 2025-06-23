const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    genre:{
        type: String,
        maxLength: 20,
        unique: true,
        required: true
    }
});
const Genre = mongoose.model('Genre', schema);

module.exports = Genre;