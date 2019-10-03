/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'; 

const DB_URL = process.env.DB_URL;
const expect = require('chai').expect;
// const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);

const IssueHandler = require('../controllers/issueHandler.js');
const issueHandler = new IssueHandler();

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const projectName = req.params.project,
            body        = req.body;
      console.log(`'GET' request received! | project: ${projectName}`);
    })
    
    .post(async function (req, res){
      const projectName = req.params.project,
            body        = req.body;

      const validatedBody = issueHandler.validateBody(body);
      
      console.log(`'POST' request received! | project: ${projectName}`);

      if(validatedBody) {

        try {

          
          const project = await issueHandler.getProject(projectName, true);
          const projectId = project.id;
          const issues = [...project.issues];
          
          const issueBody = {
            issue_title: body.issue_title,
            issue_text: body.issue_text,
            created_by: body.created_by,
            assigned_to: body.assigned_to || '',
            status_text: body.status_text || '',
            project_id: projectId
          };

          const issue = issueHandler.getIssueByTitle(body.issue_title);

          if(issue) {
            // console.log(`issue found!: `, issue);
          } else {
            // console.log(`issue NOT found!: `, issue);

          }

          // TODO: 
          // make new 'issue' with values from body
          // include ObjectId from current 'project'
          // add 'issue.id' to 'project.issues' array

          // issueHandler.addNewIssueToProject(project, newIssue);

          res.json(issueBody);

        } catch(err) {
          throw err;
        }

      } else {
        // throw Error(`Invalid 'body' given for input!`);
        res.status(501).json({ error: `Please fill in all required fields.` });
      }

    })
    
    .put(function (req, res){
      const projectName = req.params.project,
            body        = req.body;
      console.log(`'PUT' request received! | project: ${projectName}`);

    })
    
    .delete(function (req, res){
      const projectName = req.params.project;
      console.log(`'DELETE' request received! | project: ${projectName}`);
    });
    
};
