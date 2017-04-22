const User = require('../models/user')
const passport = require('../config/ppconfig')

let userController = {
  getSignUp: function (req, res) {
    res.render('./user/signup')
  },

  postSignUp: function (req, res) {
    User.create({
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      readingLevel: req.body.readingLevel,
      // previousStudents: req.body.previousStudents,
      gender: req.body.gender,
      age: req.body.age,
      password: req.body.password,
      attending: false
    }, function (err, createdUser) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/user/signup')
      } else {
        passport.authenticate('local', {
          successRedirect: '/attend',
          successFlash: 'Account set up successfully, ' + req.body.name + '! You\'re logged in'
        })(req, res)
      }
    })
  },

  getLogIn: function (req, res) {
    res.render('./user/login')
  },

  postLogIn: passport.authenticate('local', {
    successRedirect: '/attend',
    failureRedirect: '/user/login',
    failureFlash: 'Invalid username and/or password',
    successFlash: 'You have successfully logged in'
  }),

  getLogOut: function (req, res) {
    req.logout()
    req.flash('success', 'You have successfully logged out. See you soon!')
    res.redirect('/')
  }

}

module.exports = userController
