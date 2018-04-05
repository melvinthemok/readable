var Tutor = require('../models/tutor')
var CatchPlus = require('../models/catchPlus')
var passport = require('../config/pp-config')
require('dotenv').config({ silent: true })
var nodemailer = require('nodemailer')

var authController = {
  getSignUp: function (req, res) {
    res.render('./auth/signup')
  },

  getLogIn: function (req, res) {
    res.render('./auth/login')
  },

  getTutorSignUp: function (req, res) {
    res.render('./auth/tutor/signup')
  },

  getCatchPlusSignUp: function (req, res) {
    res.render('./auth/catchPlus/signup')
  },

  postTutorSignUp: function (req, res) {
    var tutor = new Tutor({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      age: req.body.age,
      experience: req.body.experience,
      startDate: req.body.startDate,
      password: req.body.password,
      userType: 'tutor',
      admin: req.body.adminPasswordAttempt === process.env.ADMIN_PASSWORD,
      attending: false
    })
    if (req.body.tutorSignUpAttempt !== process.env.SIGNUP_PASSWORD) {
      req.flash('error', 'The signup passphrase you have entered is incorrect')
      res.redirect('/auth/tutor/signup')
    } else {
      tutor.save(function (err) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/auth/tutor/signup')
        } else {
          passport.authenticate('tutor-local', {
            successRedirect: '/',
            successFlash: (req.body.adminPasswordAttempt === process.env.ADMIN_PASSWORD ? 'Administrator ' : 'Tutor ' ) + 'account set up successfully, ' + req.body.name + '! You\'re logged in'
          })(req, res)
        }
      })
    }
  },

  postCatchPlusSignUp: function (req, res) {
    var catchPlus = new CatchPlus({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
      userType: 'catchPlus'
    })
    if (req.body.catchPlusSignUpAttempt !== process.env.SIGNUP_PASSWORD) {
      req.flash('error', 'The signup passphrase you have entered is incorrect')
      res.redirect('/auth/catchPlus/signup')
    } else {
      catchPlus.save(function (err) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/auth/catchPlus/signup')
        } else {
          passport.authenticate('catchPlus-local', {
            successRedirect: '/',
            successFlash: 'Account set up successfully, ' + req.body.name + '! You\'re logged in'
          })(req, res)
        }
      })
    }
  },

  getTutorLogIn: function (req, res) {
    res.render('./auth/tutor/login')
  },

  getCatchPlusLogIn: function (req, res) {
    res.render('./auth/catchPlus/login')
  },

  postTutorLogIn: passport.authenticate('tutor-local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: 'You have successfully logged in'
  }),

  postCatchPlusLogIn: passport.authenticate('catchPlus-local', {
    successRedirect: '/students/attendance',
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
