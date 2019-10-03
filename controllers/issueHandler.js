const Project = require('../models/Project.js');
const Issue = require('../models/Issue.js');

function IssueHandler() {

    this.getProject = async (name, makeNewProject) => {
        console.log(`'findProject' - name: ${name}`);

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

    this.deleteProject = async (name) => {
        try {
            await Project.findOneAndDelete({ project_name: name });
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

    this.deleteIssueByTitle = async (title) => {
        try {
            await Issue.deleteOne({ issue_title: title }, () => {
                console.log(`Delete successful for '${issue}' issue!`)
            });
        } catch(err) {
            throw err;
        }
    }

    this.deleteAllIssuesFromProject = async (name) => {
        try {

            // TODO: search Issue DB for matching issues w/ ID
            // all issues found will be deleted

            const project = await Project.findOne({ project_name: name });
            if(project) {
                const issues = [...project.issues];
                if(issues.length < 1) {
                    return;
                } else {
                    // remove all issues by ID here
                }
            }
        } catch(err) {
            throw err;
        }
    }

    this.deleteIssueById = async (id) => {
        try {
            await Issue.deleteOne({ _id: id }, () => {
                console.log(`Delete successful for '${issue}' issue!`)
            });
        } catch(err) {
            throw err;
        }
    }

    this.validateBody = (body) => {
        const validTitle   = (body.issue_title !== undefined && body.issue_title !== '');
        const validText    = (body.issue_text !== undefined && body.issue_text !== '');
        const validCreator = (body.created_by !== undefined && body.created_by !== '');
        
        if(validTitle && validText && validCreator) return true;
        else return false;
    };

}

module.exports = IssueHandler;