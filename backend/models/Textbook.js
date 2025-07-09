const mongoose = require('mongoose');

const TextbookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  subject: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Textbook', TextbookSchema); 