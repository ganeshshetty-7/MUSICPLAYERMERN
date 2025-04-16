const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    audioName: String,
    audioFileName: String,
    audioPath: String
});

const audioModel = mongoose.model('file', audioSchema, 'songs_db');

module.exports = audioModel;

