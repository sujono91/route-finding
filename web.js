'use strict';

var gzippo = require('gzippo');
var logger = require('morgan');
var express = require('express');
var nodeApp = express();

nodeApp.use(logger);
nodeApp.use(gzippo.staticGzip('' + __dirname + '/build'));
nodeApp.listen(process.env.PORT || 3000);
console.log('jalan', __dirname);
