const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema(
  {
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: String,
    status_text: String
  }
);

// stockSchema.methods.test = () => { console.log('testing the schema method') };

// stockSchema.methods.getPrice = () => { console.log(`Getting price from Stock model!`); };

// stockSchema.methods.getLikes = () => { console.log(`Getting likes from Stock model!`); };

module.exports = mongoose.model('Issue', issueSchema);