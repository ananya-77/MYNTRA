const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

const analyzeImage = async (fileUrl) => {
  const [result] = await client.labelDetection(fileUrl);
  const labels = result.labelAnnotations;
  return labels.map(label => label.description);
};

// After uploading, call the analyzeImage function
app.post('/upload', upload.single('file'), async (req, res) => {
  // ... existing code ...

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    const labels = await analyzeImage(publicUrl);
    // Store file metadata and labels in MongoDB
    const file = new File({ url: publicUrl, name: req.file.originalname, labels });
    await file.save();
    res.status(200).send({ message: 'File uploaded and analyzed successfully', url: publicUrl, labels });
  });

  blobStream.end(req.file.buffer);
});
