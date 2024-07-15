// server.js
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const mongoose = require('mongoose');

const app = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb://localhost/myntra', { useNewUrlParser: true, useUnifiedTopology: true });

const storage = new Storage();
const bucket = storage.bucket('YOUR_BUCKET_NAME');

app.post('/upload', upload.single('file'), async (req, res) => {
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    // Store file metadata in MongoDB
    const file = new File({ url: publicUrl, name: req.file.originalname });
    await file.save();
    res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
  });

  blobStream.end(req.file.buffer);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
