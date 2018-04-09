var express = require('express');
var app = express();
var cors = require('cors');

app.use(cors());

var ContentController = require('./content/ContentController');
app.use('/content', ContentController);

var LineupController = require('./lineup/LineupController');
app.use('/lineup', LineupController);


module.exports = app;