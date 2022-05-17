import bodyParser from "body-parser";
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var cors = require('cors')
import models from "./models";
import custom from "./middleware/logger";
/*****
 *
 * @type {Router}
 */

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var conversationRouter = require('./routes/conversation');


var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(custom);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
app.use(upload.fields([]));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/user", userRouter);
app.use("/conversation", conversationRouter);

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
  res.json({
    success:  false,
    message: err.message,
  })
});



module.exports = app;
