const User = require('../models/user')
const passport = require('../config/ppconfig')

let authController = {
  getSignUp: function (req, res) {
    res.render('./auth/signup')
  },

  postSignUp: function (req, res) {
    User.create({
      email: req.body.email,
      name: req.body.name,
      gender: req.body.gender,
      readingLevel: req.body.readingLevel,
      role: req.body.role,
      password: req.body.password
    }, function (err, createdUser) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/signup')
      } else {
        passport.authenticate('local', {
          successRedirect: '/program',
          successFlash: 'Account set up successfully, ' + req.body.name + '! You\'re logged in'
        })(req, res)
      }
    })
  },

  getLogIn: function (req, res) {
    res.render('./auth/login')
  },

  postLogIn: passport.authenticate('local', {
    successRedirect: '/program',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid username and/or password',
    successFlash: 'You have successfully logged in'
  }),

  getLogOut: function (req, res) {
    req.logout()
    req.flash('success', 'You have successfully logged out. See you soon!')
    res.redirect('/')
  }

}

module.exports = authController
