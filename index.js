require('newrelic')
var express = require('express')
var app = express()
var path = require('path')
var ejsLayouts = require('express-ejs-layouts')
var mongoose = require('mongoose')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var session = require('express-session')
var flash = require('connect-flash')
var cron = require('node-schedule')

var passport = require('./config/pp-config')

var isLoggedIn = require('./middleware/isLoggedIn')

var auth = require('./routes/authRouter')
var saturdate = require('./routes/saturdateRouter')
var student = require('./routes/studentRouter')
var tutor = require('./routes/tutorRouter')
var comment = require('./routes/commentRouter')
// var attend = require('./routes/attendRouter')
// var group = require('./routes/groupRouter')

var resetStudentAttendance = require('./cron/resetStudentAttendance')

require('dotenv').config({ silent: true })

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/readable-test', { useMongoClient: true })
} else {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/readable', { useMongoClient: true })
}
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

app.use('/auth', auth)
app.use('/students', isLoggedIn, student)
app.use('/tutors', isLoggedIn, tutor)
app.use('/history', isLoggedIn, saturdate)
app.use('/comments', isLoggedIn, comment)
// app.use('/attend', attend)
// app.use('/group', group)

cron.scheduleJob({ dayOfWeek: 0, hour: 0, minute: 0 }, function () {
  resetStudentAttendance()
})

app.listen(process.env.PORT || 3000)

module.exports = app
