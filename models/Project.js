const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    project_name: { type: String, unique: true },
    issueIds: [{ type: Schema.Types.ObjectId, ref: 'Issue' }]
  }
);

// projectSchema.statics.createProject = (name) => {
//   console.log(`Creating project a '${name}' project.`);
// };

module.exports = mongoose.model('Project', projectSchema);