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
mongoose.connect(DB_URL, { useNewUrlParser: true });

const IssueHandler = require('../controllers/issueHandler.js');
const issueHandler = new IssueHandler();

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const projectName = req.params.project;
      console.log(`'GET' request received! | project: ${projectName}`);
      // mongoose.connect(DB_URL, { useNewUrlParser: true });
      const db = mongoose.connection;
      db.on('open', async function() {
        console.log('Connected DB!');
      });
    })
    
    .post(async function (req, res){
      const projectName = req.params.project;
      console.log(`'POST' request received! | project: ${projectName}`);

      mongoose.connect(DB_URL, { useNewUrlParser: true });
      const db = mongoose.connection;

      db.on('error', console.error.bind(console, 'MongoDB/Mongoose connection error!'));

      db.on('open', async function() {
        console.log('Connected DB!');
        let response = {};
        const dummyResponse = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        };

        try {
          const project = await issueHandler.findProject(projectName);
          // TODO: Create an issue with the 'Issue' model and link the issue to the current project.
          res.json(dummyResponse);
        } catch(err) {
          throw err;
        }

      });

    })
    
    .put(function (req, res){
      const projectName = req.params.project;
      console.log(`'PUT' request received! | project: ${projectName}`);
      mongoose.connect(DB_URL, { useNewUrlParser: true });
    })
    
    .delete(function (req, res){
      const projectName = req.params.project;
      console.log(`'DELETE' request received! | project: ${projectName}`);
      mongoose.connect(DB_URL, { useNewUrlParser: true });
    });
    
};
