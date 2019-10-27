var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
let db = require('./routes/connectDB').connection;
var createError = require('http-errors');

var indexRouter = require('./routes/index');
const users = require('./routes/users');
const poems = require("./routes/poems");
const authors = require("./routes/authors");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', users);

app.get('/users', users.findAllUsers);
app.get('/users/:id', users.findOneUser);
app.get('/usersLogout',users.userLogout);
app.post('/usersRegister',users.addAUser);
app.post('/users/login',users.userLogin);
app.delete('/users/:id', users.deleteUser);

app.get('/poems', poems.findAllPoems);
app.get('/poems/:id', poems.findOnePoem)
app.post('/poems',poems.addPoem);
app.put('/poems/:id/like', poems.incrementLikes);
app.put('/poems/:id/unlike',poems.decreaseLikes);
app.delete('/poems/:id', poems.deletePoem);
// app.get('/poems/likes', poems.findTotalLikes);

app.get('/authors', authors.findAllAuthors);
app.get('/authors/:id', authors.findOneAuthor);
app.post('/authors',authors.addAuthor);
app.put('/authors/:id/like',authors.incrementLikes);
app.put('/authors/:id/unlike',authors.decreaseLikes);
app.put('/authors/:id/works',authors.incrementWorks);
app.put('/authors/:id/deleteWork',authors.deleteWorks);
app.delete('/authors/:id', authors.deleteAuthor);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
