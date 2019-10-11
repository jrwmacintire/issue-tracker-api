/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'; 

const expect = require('chai').expect;
// const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

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
      
      // console.log(`'POST' request received! | project: ${projectName}`);

      if(validatedBody) {

        try {

          const project = await issueHandler.getProjectByName(projectName, true);
          const projectId = project.id;
          
          const issueBody = {
            issue_title: body.issue_title,
            issue_text: body.issue_text,
            created_by: body.created_by,
            assigned_to: body.assigned_to || '',
            status_text: body.status_text || '',
            project_id: ObjectId(projectId),
          };

          let response; 

          const issue = await issueHandler.getIssueByTitle(body.issue_title);

          if(issue) {
            // console.log(`issue found!: `, issue);
            response = {
              issue_title: issue.issue_title,
               issue_text: issue.issue_text,
               created_by: issue.created_by,
              assigned_to: issue.assigned_to,
              status_text: issue.status_text
            };

          } else {
            // console.log(`issue NOT found!`);
            // save new issue and updated project before finishing POST

            const   newIssue = await issueHandler.createIssue(issueBody),
              updatedProject = await issueHandler.updateProjectIssues(projectName, newIssue.id);

            response = {
              issue_title: newIssue.issue_title,
               issue_text: newIssue.issue_text,
               created_by: newIssue.created_by,
              assigned_to: newIssue.assigned_to,
              status_text: newIssue.status_text
            };

          }

          res.json(response);

        } catch(err) {
          throw err;
        }

      } else {
        // throw Error(`Invalid 'body' given for input!`);
        res.status(501).json({ error: `Please fill in all required fields.` });
      }

    })
    
    .put(async function (req, res){
      const projectName = req.params.project,
            body        = req.body,
            _id         = body._id;
      const inputs      = Object.keys(body);
      const inputsOnBody = inputs.length;

      async function validateInputs() {
        const validFields = [
          '_id',
          'issue_title',
          'issue_text',
          'updated_on',
          'created_on', 
          'open',
          'assigned_to',
          'created_by'
        ];
        let valid = true;
        inputs.forEach(input => {
          if(validFields.indexOf(input) < 0) valid = false;
        });
        return await valid;
      };

      if(inputsOnBody > 0 && inputs[0] === '_id') {

        try {
          const issue = await issueHandler.getIssueByID(body._id);
          if(issue && inputsOnBody === 1) {
            await issueHandler.updateIssueUpdatedOnDate(issue);
            res.json('Successfully updated issue!');
          } else if(issue && inputsOnBody > 1) {
            await issueHandler.updateIssueUpdatedOnDate(issue);
            // validate and update all other inputs on issue
            console.log(`'inputs' from 'body': `, inputs, body);
            const validInputs = validateInputs();
            if(validInputs) {
              await issueHandler.updateIssueFromBody(issue, body);
              // res.json('Successfully updated issue!');
            } else {
              throw Error('Invalid inputs found. Please revise your inputs.');
            }
          } else {
            throw Error('Cannot find an issue with that ID.');
          }
        } catch(err) {
          res.json(err);
        }

      } else {
        res.json('No update input(s) given. Please try again.');
        // throw Error('No update input given. Please try again.');
      }

    })
    
    .delete(async function (req, res){
      const projectName = req.params.project;
      console.log(`'DELETE' request received! | project: ${projectName}`);
      const issueId = req.body._id;

      try {
        const issue = await issueHandler.deleteIssueById(issueId);
      } catch(err) {
        throw err;
      }

      res.send('Testing DELETE method on route');
    });
    
};
