const express = require('express');
const multer = require('multer');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded successfully');
})
