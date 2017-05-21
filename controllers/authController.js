var Tutor = require('../models/tutor')
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

  getTutorSignUp: function (req, res) {
    res.render('./auth/signup/tutor')
  },

  getCatchPlusSignUp: function (req, res) {
    res.render('./auth/signup/catchPlus')
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
    tutor.save(function (err) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/signup/tutor')
      } else {
        passport.authenticate('tutor-local', {
          successRedirect: '/',
          successFlash: (req.body.adminPasswordAttempt === process.env.ADMIN_PASSWORD ? 'Administrator ' : 'Tutor ' ) + 'account set up successfully, ' + req.body.name + '! You\'re logged in'
        })(req, res)
      }
    })
  },

  postCatchPlusSignUp: function (req, res) {
    var catchPlus = new CatchPlus({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
      userType: 'catchPlus'
    })
    catchPlus.save(function (err) {
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

  getTutorLogIn: function (req, res) {
    res.render('./auth/login/tutor')
  },

  getCatchPlusLogIn: function (req, res) {
    res.render('./auth/login/catchPlus')
  },

  postTutorLogIn: passport.authenticate('tutor-local', {
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
