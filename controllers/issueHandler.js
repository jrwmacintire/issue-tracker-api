const Project = require('../models/Project.js');
const Issue = require('../models/Issue.js');
const ObjectId = require('mongodb').ObjectID;

function IssueHandler() {

    this.getProjectByName = async (name, makeNewProject) => {
        // console.log(`'getProjectByName' - name: ${name}`);

        try {
            const project = await Project.findOne({ project_name: name });
            if(project === null && makeNewProject) {
                const newProject = await this.createProject(name);
                return newProject;
            }
            return project;
        } catch(err) {
            throw err;
        }
    };

    this.createProject = async (name) => {
        try {
            const newProject = await new Project({
                project_name: name
            });
            await newProject.save(function(doc) {
                console.log(`New project '${name}' created!`)
            })
            return newProject;
        } catch(err) {
            throw err;
        }
    };

    this.updateProjectIssues = async (name, issueId) => {
        try {
            if(issueId === null || issueId === undefined) {
                throw Error(`Please provide a valid 'issueId'`);
            }
            const updatedProject = await Project.findOneAndUpdate({ project_name: name },{ $push: { issueIds: issueId }, $set: { updated_on: new Date }});
            return updatedProject;
        } catch(err) {
            throw err;
        }
    };

    this.deleteProject = async (name) => {
        try {
            await Project.findOneAndDelete({ project_name: name });
        } catch(err) {
            throw err;
        }
    }

    this.deleteAllIssuesFromProject = async (name) => {
        try {
            const project = await Project.findOne({ project_name: name });
            const projectId = project.id;
            await Issue.deleteMany({ project_id: projectId }, function(err) {
                if(err) throw err;
                console.log(`Issues deleted from '${name}' project`);
            });
            await Project.updateOne({ project_name: name }, { $set: { issueIds: new Array() }});
        } catch(err) {
            throw err;
        }
    }

    this.createIssue = async (body) => {
        const issue = new Issue({
            issue_title: body.issue_title,
            issue_text: body.issue_text,
            created_by: body.created_by,
            assigned_to: body.assigned_to || '',
            status_text: body.status_text || '',
            project_id: body.project_id
          });
        
        return await issue.save();
    };

    this.getIssueByTitle = async (title) => {
        try {
            const issue = await Issue.findOne({ issue_title: title });
            return issue;
        } catch(err) {
            throw err;
        }
    };

    this.getIssueByID = async (id) => {
        try {
            return await Issue.findOne({ _id: id });
        } catch(err) {
            throw err;
        }
    };

    this.updateIssueUpdatedOnDate = async (issue) => {
        try {
            issue.updated_on = new Date();
            await issue.save();
            return issue;
        } catch(err) {
            throw err;
        }
    };

    this.updateIssueFromBody = async (issue, body) => {
        try {
            // console.log(`Updating these input fields: `, inputs);
            const fields = Object.keys(body);
            fields.forEach((field, index) => {
                switch(field) {
                    case '_id':
                        break;
                    case 'issue_title':
                        issue.issue_title = body.issue_title;
                        break;
                    case 'issue_text':
                        issue.issue_text = body.issue_text;
                        break;
                    case 'updated_on':
                        issue.updated_on = body.updated_on;
                        break;
                    case 'created_on':
                        issue.created_on = body.created_on;
                        break;
                    case 'open':
                        issue.open = body.open;
                        break;
                    case 'assigned_to':
                        issue.assigned_to = body.assigned_to;
                        break;
                    case 'created_by':
                        issue.created_by = body.created_by;
                        break;
                    default:
                        return `No '${field}' found in issue`;
                }
            }); 
            await issue.save();
            return issue;
        } catch(err) {
            throw err;
        }
    };

    this.deleteIssueByTitle = async (title) => {
        try {
            await Issue.deleteOne({ issue_title: title }, () => {
                console.log(`Delete successful for '${issue}' issue!`)
            });
        } catch(err) {
            throw err;
        }
    }

    this.deleteIssueById = async (id) => {
        try {
            await Issue.findOneAndDelete({ _id: id }, () => {
                console.log(`Delete successful for '${issue}' issue!`)
            });
        } catch(err) {
            throw err;
        }
    };

    this.validateBody = (body) => {
        const validTitle   = (body.issue_title !== undefined && body.issue_title !== '');
        const validText    = (body.issue_text !== undefined && body.issue_text !== '');
        const validCreator = (body.created_by !== undefined && body.created_by !== '');
        
        if(validTitle && validText && validCreator) return true;
        else return false;
    };

}

module.exports = IssueHandler;