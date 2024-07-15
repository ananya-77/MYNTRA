// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('File', fileSchema);
