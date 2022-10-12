var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session')
var db= require('./config/connection');
var fileUpload = require('express-fileupload');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname : 'hbs',defaultLayout : 'layout',layoutsDir:__dirname+'/views/layout/',partialsDir : __dirname+'/views/partials/',
helpers : {
  isActiveOrNotActive : (activity,options)=>{
    if(activity==="active"){
      return options.fn(this)
    }else{
      return options.inverse(this)
    }
  }
 }
}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.use(fileUpload())

db.database();

app.use(session({
  secret: 'secret',
  cookie : {
    maxAge : 3600 *10
  },
  saveUninitialized: true,
  resave : true,
}))

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
  res.render('error',{noHeader:true,noFooter:true});
});

module.exports = app;
