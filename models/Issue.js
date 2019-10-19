const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema(
  {
    issue_title: { type: String, unique: true },
     issue_text: { type: String },
     created_by: { type: String },
    assigned_to: { type: String, default: '' },
    status_text: { type: String, default: '' },
     project_id: { type: mongoose.Types.ObjectId },
     created_on: { type: Date, default: new Date() },
     updated_on: { type: Date, default: new Date() },
           open: { type: Boolean, default: true }
  }
);


module.exports = mongoose.model('Issue', issueSchema);