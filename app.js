var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// middleware to handle css request
app.use('/css',express.static(path.join(__dirname, 'public/assets/stylesheets')));
app.use('/fonts',express.static(path.join(__dirname, 'public/assets/fonts')));
app.use('/img',express.static(path.join(__dirname, 'public/assets/img')));

var router = express.Router();

router.route('/')
  .get(function(req,res){
  // check jwt token
  res.sendFile('index.html', { root: path.join(__dirname, 'public/templates') });
});

router.route('/login')
  .get(function(req,res){
    // login
    res.sendFile('login.html', { root: path.join(__dirname, 'public/templates') });
  })
  .post(function(req, res) {
    // sign up
    var token = jwt.sign(req.body, 'secret', {
      expiresIn:60*60*24
    });
    res.json({
      success:true,
      message: 'this is the tokken',
      token:token
    })
});

router.route('/pay')
  .get(function(req, res){
    // invalid
    res.json({ message: 'invalid;'});
    console.log(req);
  })
  .post(function(req, res){
    //check jwt
    //check stripe
    //if valid
    res.render('success', { title: 'Express' });
});

router.route('/profile')
  .get(function(req, res){
    // check jwt
    // query username and payment history
    res.sendFile('profile.html', { root: path.join(__dirname, 'public/templates') });
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ message: 'error'});
});

module.exports = app;
