/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const ObjectID = require('mongodb').ObjectID;

const IssueHandler = require('../controllers/IssueHandler.js');
const issueHandler = new IssueHandler();

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {

      this.beforeAll(function(done) {
        console.log(`Deleting items from DB.`);
        issueHandler.deleteAllIssuesFromProject('test')
          .then(() => done());                                                                                                                                                                                                                                                                                                                                                                                                                           
      });

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          const { body } = res;
          assert.equal(res.status, 200);
          assert.equal(body.issue_title, 'Title');
          assert.equal(body.issue_text, 'text');
          assert.equal(body.created_by, 'Functional Test - Every field filled in');
          assert.equal(body.assigned_to, 'Chai and Mocha');
          assert.equal(body.status_text, 'In QA');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title2',
            issue_text: 'text',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err, res) {
            if(err) throw err;
            const { body } = res;
            assert.equal(res.status, 200);
            assert.equal(body.issue_title, 'Title2');
            assert.equal(body.issue_text, 'text');
            assert.equal(body.created_by, 'Functional Test - Required fields filled in');
            assert.equal(body.assigned_to, '');
            assert.equal(body.status_text, '');
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: '',
            issue_text: '',
            created_by: '',
            assigned_to: '',
            status_text: ''
          })
          .end(function(err, res) {
            if(err) throw err;
            const { body } = res;
            assert.equal(res.status, 501);
            assert.equal(body.error, `Please fill in all required fields.`);
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      // Use issueHandler to find the issue ID
      // using the this.beforeAll method prior
      // to executing the PUT tests.

      let issueID;

      this.beforeAll(function(done) {
        issueHandler.getIssueByTitle('Title')
          .then(issue => {
            // console.log(`issue: `, issue);
            issueID = issue._id;
            // console.log(`issue._id: ${issueID}`);
            done();
          })
          .catch(done);
      });

      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end(function(err, res) {
            // console.log(`res: `, res);
            assert.equal(res.body, 'No update input(s) given. Please try again.');
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ _id: issueID })
          .end(function(err, res) {
            // console.log(`res: `, res);
            assert.equal(res.body, `Successfully updated issue!`);
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: issueID,
            issue_text: 'Some new text here',
            assigned_to: 'Myah'
          })
          .end(function(err, res) {
            assert.equal(res.body, `Successfully updated issue!`);
            done();
          });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
        // done();

      });
      
      test('One filter', function(done) {
        // chai.request(server)
        //   .get('/api/issues/test')
        //   .query({})
        //   .end(function(err, res){
        //     assert.equal(res.status, 200);
        //     assert.isArray(res.body);
        //     assert.property(res.body[0], 'issue_title');
        //     assert.property(res.body[0], 'issue_text');
        //     assert.property(res.body[0], 'created_on');
        //     assert.property(res.body[0], 'updated_on');
        //     assert.property(res.body[0], 'created_by');
        //     assert.property(res.body[0], 'assigned_to');
        //     assert.property(res.body[0], 'open');
        //     assert.property(res.body[0], 'status_text');
        //     assert.property(res.body[0], '_id');
        //     done();
        //   });
        // done();
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        // done();
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        // chai.request(server)
        //   .delete('/api/issues/test')
        // done();
      });
      
      test('Valid _id', function(done) {
        // chai.request(server)
        //   .delete('/api/issues/test')
        //   .end(function(err, res) {
        //     assert.equal(res.status, 200);
        //     done();
        //   });
        done();
      });
      
    });

});
