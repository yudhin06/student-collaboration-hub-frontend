const mongoose = require('mongoose');

const QuestionPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  year: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema); 