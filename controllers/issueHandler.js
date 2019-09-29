const Project = require('../models/Project.js');
const Issue = require('../models/Issue.js');

function IssueHandler() {

    this.createIssue = async (issue) => {
        console.log(`'createIssue' - issue: `, issue);
        return;
    }

    this.findProject = async (name) => {
        console.log(`'findProject' - name: ${name}`);

        try {
            const project = await Project.findOne({ project_name: name });
            if(project === null) {
                return await this.createProject(name);
            } else {
                return project;
            }
        } catch(err) {
            throw err;
        }
    }

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
    }

}

module.exports = IssueHandler;