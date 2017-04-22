var express = require('express')
var app = express()
var path = require('path')
var ejsLayouts = require('express-ejs-layouts')
var mongoose = require('mongoose')
var user = require('./routes/userRouter')
var attend = require('./routes/attendRouter')
var group = require('./routes/groupRouter')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var session = require('express-session')
var flash = require('connect-flash')
var passport = require('./config/ppconfig')
var isLoggedIn = require('./middleware/isLoggedIn')
require('dotenv').config({ silent: true })

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/readable')
mongoose.Promise = global.Promise
 
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(morgan('dev'))

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(ejsLayouts)

app.use(function (req, res, next) {
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', function (req, res) {
  res.render('index')
})

app.use('/user', user)
app.use('/attend', attend)
app.use('/group', group)

app.use(isLoggedIn)

// app.get('/attend', function (req, res) {
//  res.render('attend')
// })

app.listen(process.env.PORT || 3000)