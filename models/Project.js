const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Issue = require('./Issue.js');

const projectSchema = new Schema(
  {
    project_name: String,
    issues: [{type: Schema.Types.ObjectId, ref: 'Issue', default: [] }]
  }
);

// stockSchema.methods.test = function() { console.log('testing the schema method') };

// stockSchema.methods.getPrice = () => { console.log(`Getting price from Stock model!`); };

// stockSchema.methods.getLikes = () => { console.log(`Getting likes from Stock model!`); };

module.exports = mongoose.model('Project', projectSchema);