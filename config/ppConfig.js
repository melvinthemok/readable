var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var Teacher = require('../models/teacher')
var CatchPlus = require('../models/catchPlus')

passport.serializeUser(function (user, done) {
  var key = {
    id: user.id,
    type: user.userType
  }
  done(null, key)
})

passport.deserializeUser(function (key, done) {
  var Model
  switch (key.type) {
    case 'teacher':
      Model = Teacher
      break
    case 'catchPlus':
      Model = CatchPlus
      break
  }
  Model.findOne({
    _id: key.id
  }, function (err, user) {
    done(err, user)
  })
})

passport.use('teacher-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  Teacher.findOne({ email: email }, function (err, user) {
    if (err) return done(err)
    if (!user) return done(null, false, { message: 'Oops - there\'s no teacher with that email address!' })
    if (!user.validPassword(password)) return done(null, false, { message: 'Oops - that wasn\'t a valid password!' })
    return done(null, user)
  })
}))

passport.use('catchPlus-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  CatchPlus.findOne({ email: email }, function (err, user) {
    if (err) return done(err)
    if (!user) return done(null, false, { message: 'Oops - there\'s no Catch+ volunteer with that email address!' })
    if (!user.validPassword(password)) return done(null, false, { message: 'Oops - that wasn\'t a valid password!' })
    return done(null, user)
  })
}))

module.exports = passport
