const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    code:{
        type: String,
    },
    email:{
        type: String,

    }
})
const Code =mongoose.model('Code', Schema);
module.exports = Code;