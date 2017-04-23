var Teacher = require('../models/teacher')
var CatchPlus = require('../models/catchPlus')
var passport = require('../config/ppconfig')
require('dotenv').config({ silent: true })

var authController = {
  getSignUp: function (req, res) {
    res.render('./auth/signup/index')
  },

  getLogIn: function (req, res) {
    res.render('./auth/login/index')
  },

  getTeacherSignUp: function (req, res) {
    res.render('./auth/signup/teacher')
  },

  getCatchPlusSignUp: function (req, res) {
    res.render('./auth/signup/catchPlus')
  },

  postTeacherSignUp: function (req, res) {
    var teacher = new Teacher({
      email: req.body.email,
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      experience: req.body.experience || null,
      startDate: req.body.startDate,
      password: req.body.password,
      userType: 'teacher',
      admin: req.body.adminPasswordAttempt === process.env.ADMIN_PASSWORD,
      attending: false
    })
    teacher.markModified('startDate')
    teacher.save(function (err) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/signup/teacher')
      } else {
        passport.authenticate('teacher-local', {
          successRedirect: '/',
          successFlash: 'Account set up successfully, ' + req.body.name + '! You\'re logged in'
        })(req, res)
      }
    })
  },

  postCatchPlusSignUp: function (req, res) {
    CatchPlus.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      userType: 'catchPlus'
    }, function (err, createdCatchPlus) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/signup/catchPlus')
      } else {
        passport.authenticate('catchPlus-local', {
          successRedirect: '/',
          successFlash: 'Account set up successfully, ' + req.body.name + '! You\'re logged in'
        })(req, res)
      }
    })
  },

  getTeacherLogIn: function (req, res) {
    res.render('./auth/login/teacher')
  },

  getCatchPlusLogIn: function (req, res) {
    res.render('./auth/login/catchPlus')
  },

  postTeacherLogIn: passport.authenticate('teacher-local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: 'You have successfully logged in'
  }),

  postCatchPlusLogIn: passport.authenticate('catchPlus-local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: 'You have successfully logged in'
  }),

  getLogOut: function (req, res) {
    req.logout()
    req.flash('success', 'You have successfully logged out. See you soon!')
    res.redirect('/')
  }

}

module.exports = authController
