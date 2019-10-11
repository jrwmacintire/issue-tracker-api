const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema(
  {
    issue_title: { type: String, unique: true, required: true},
     issue_text: { type: String, required: true},
     created_by: { type: String, required: true},
    assigned_to: { type: String, default: '', required: false },
    status_text: { type: String, default: '', required: false },
     project_id: { type: mongoose.Types.ObjectId },
     created_on: { type: Date, default: new Date() },
     updated_on: { type: Date, default: new Date() },
           open: { type: Boolean, default: true }
  }
);


module.exports = mongoose.model('Issue', issueSchema);