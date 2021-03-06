/* Dependencies */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');

/* Configuration files */
const dbConfig = require('./config/dbConfig.json')

/* Mongoose Promise */
mongoose.Promise = global.Promise;

/* Connecting to database */
mongoose.connect(dbConfig.dbKind + '://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.dbName, function(err) {
    if (err) {
        throw err;
    }
    return console.log('Connected to MongoDB!');
});

/* Configuring app */
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
// app.use(favicon(__dirname + 'public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'jfh2v58g723u9hfun9a28342', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
const routes = require('./routes/index');
app.use('/', routes);

/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

/* Development error handler ( will print stacktrace ) */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).send(err.message);
    });
}

/* Production error handler ( no stacktraces leaked to user )*/
app.use(function(err, req, res, next) {
    var message = err.message;
    res.status(err.status || 500).send(err.message);
});

module.exports = app;