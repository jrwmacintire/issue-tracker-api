const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

const Project = require('./Project.js');
const Issue = require('./Issue.js');

const connectDB = () => {
    return mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
};

const models = { Project, Issue };

module.exports = { models, connectDB };