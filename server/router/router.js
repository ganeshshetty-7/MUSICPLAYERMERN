const express = require('express');
const router = express.Router();
const connectDB = require('../db/config');
const musicModel = require('../model/File');
const mm = require('music-metadata');
const path = require('path');
const multer = require('multer');

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage });

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//importing database fnction

connectDB();

router.post('/uploadsong', upload.single('mp3file'), async (req, res) => {
    const { path, originalname, filename } = req.file;


    console.log(req.file);

    const metadata = await mm.parseFile(path);
    const { title, artist, picture, album } = metadata.common;


    res.json({
        title: originalname,
        artist: artist ? artist : 'Unknown Artist',
        album: album ? album : 'unknown album',
        picture: picture ? picture[0].data.toString('base64') : null
    })



    const musicSchema = new musicModel({
        audioName: filename,
        audioFileName: originalname,
        audioPath: path
    })

    await musicSchema.save();

});


router.get('/getItem', async (req, res) => {
    try {
        let api_ = await musicModel.find();
        res.json(api_)
    } catch (error) {
        console.log(error)
    }
})





module.exports = router;