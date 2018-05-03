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
      admin: req.body.adminPasswordAttempt === process.env.ADMIN_PASSWORD
    })
    if (req.body.tutorSignUpAttempt !== process.env.SIGNUP_PASSWORD) {
      req.flash('error', 'The signup passphrase you have entered is incorrect')
      res.redirect('/auth/tutor/signup')
    } else {
      tutor.save(function (err, savedTutor) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/auth/tutor/signup')
        } else {
          passport.authenticate('tutor-local', {
            successRedirect: '/tutors/attendance/' + savedTutor.id,
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
            successRedirect: '/students/attendance',
            successFlash: 'Account set up successfully, ' + req.body.name + '! You\'re logged in'
          })(req, res)
        }
      })
    }
  },

  getTutorForgot: function (req, res) {
    res.render('./auth/tutor/forgot')
  },

  getCatchPlusForgot: function (req, res) {
    res.render('./auth/catchPlus/forgot')
  },

  putTutorForgot: function (req, res) {
    Tutor.findOneAndUpdate({
      email: req.body.email
    }, {
      resetPasswordExpires: Date.now() + 3600000
    }, function (err, chosenTutor) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/tutor/forgot')
      } else {
        if (!chosenTutor) {
          req.flash('error', 'No account with that email address exists')
          res.redirect('/auth/tutor/forgot')
        } else {
          Tutor.findOne({ email: req.body.email }, function (err, chosenTutorAgain) {
            var smtpTransport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.GMAIL_ADDRESS,
                pass: process.env.GMAIL_PASSWORD
              }
            })
            var mailOptions = {
              from: process.env.GMAIL_ADDRESS,
              to: chosenTutorAgain.email,
              subject: 'Password reset request',
              html: `
                <p>
                  Greetings from ReadAble!<br /><br />
                  You are receiving this email because you (or someone else) has requested a password reset for your account.<br /><br />
                  Please click on
                  <a href="http://${req.headers.host}/auth/tutor/reset/${chosenTutorAgain.resetPasswordToken}">this link</a>
                  to reset your password, within the hour.<br /><br />
                  If you did not request a password reset, you can ignore this email and your password will remain unchanged.<br /><br /><br />
                  Kind regards,<br/>
                  The ReadAble Team
                </p>
              `
            }
            smtpTransport.sendMail(mailOptions, function (err, info) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/auth/tutor/forgot')
              } else {
                req.flash('success', `An email has been sent to ${info.accepted}. Please follow the instructions in that email to reset your password`)
                res.redirect('/auth/tutor/forgot')
              }
            })
          })
        }
      }
    })
  },

  putCatchPlusForgot: function (req, res) {
    CatchPlus.findOneAndUpdate({
      email: req.body.email
    }, {
      resetPasswordExpires: Date.now() + 3600000
    }, function (err, chosenCatchPlus) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/catchPlus/forgot')
      } else {
        if (!chosenCatchPlus) {
          req.flash('error', 'No account with that email address exists')
          res.redirect('/auth/catchPlus/forgot')
        } else {
          CatchPlus.findOne({ email: req.body.email }, function (err, chosenCatchPlusAgain) {
            var smtpTransport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.GMAIL_ADDRESS,
                pass: process.env.GMAIL_PASSWORD
              }
            })
            var mailOptions = {
              from: process.env.GMAIL_ADDRESS,
              to: chosenCatchPlusAgain.email,
              subject: 'Password reset request',
              html: `
                <p>
                  Greetings from ReadAble!<br /><br />
                  You are receiving this email because you (or someone else) has requested a password reset for your account.<br /><br />
                  Please click on
                  <a href="http://${req.headers.host}/auth/catchPlus/reset/${chosenCatchPlusAgain.resetPasswordToken}">this link</a>
                  to reset your password, within the hour.<br /><br />
                  If you did not request a password reset, you can ignore this email and your password will remain unchanged.<br /><br /><br/>
                  Kind regards,<br />
                  The ReadAble Team
                </p>
              `
            }
            smtpTransport.sendMail(mailOptions, function (err, info) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/auth/catchPlus/forgot')
              } else {
                req.flash('success', `An email has been sent to ${info.accepted}. Please follow the instructions in that email to reset your password`)
                res.redirect('/auth/catchPlus/forgot')
              }
            })
          })
        }
      }
    })
  },

  getTutorReset: function (req, res) {
    Tutor.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, chosenTutor) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/tutor/forgot')
      } else {
        if (!chosenTutor) {
          req.flash('error', 'Your password reset token is invalid or has expired. Please request another password reset email')
          res.redirect('/auth/tutor/forgot')
        } else {
          res.render('./auth/tutor/reset', {
            chosenTutor: chosenTutor
          })
        }
      }
    })
  },

  getCatchPlusReset: function (req, res) {
    CatchPlus.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, chosenCatchPlus) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/catchPlus/forgot')
      } else {
        if (!chosenCatchPlus) {
          req.flash('error', 'Your password reset token is invalid or has expired. Please request another password reset email')
          res.redirect('/auth/catchPlus/forgot')
        } else {
          res.render('./auth/catchPlus/reset', {
            chosenCatchPlus: chosenCatchPlus
          })
        }
      }
    })
  },

  putTutorReset: function (req, res) {
    Tutor.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, chosenTutor) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/tutor/forgot')
      } else {
        if (!chosenTutor) {
          req.flash('error', 'Your password reset token is invalid or has expired. Please request another password reset email')
          res.redirect('/auth/tutor/forgot')
        } else {
          chosenTutor.password = req.body.password
          chosenTutor.resetPasswordToken = undefined
          chosenTutor.resetPasswordExpires = undefined
          chosenTutor.save(function (err, savedTutor) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/auth/tutor/forgot')
            } else {
              var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.GMAIL_ADDRESS,
                  pass: process.env.GMAIL_PASSWORD
                }
              })
              var mailOptions = {
                from: process.env.GMAIL_ADDRESS,
                to: savedTutor.email,
                subject: 'Password reset successful',
                html: `
                  <p>
                    Hi again from ReadAble!<br /><br />
                    Your password was successfully reset. Log in with your new password at
                    <a href="http://${req.headers.host}/auth/tutor/login">this link</a>.<br /><br />
                    If you did not reset your password, please reply to this email to let us know.<br /><br /><br />
                    Kind regards,<br/>
                    The ReadAble Team
                  </p>
                `
              }
              smtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/auth/tutor/forgot')
                } else {
                  req.flash('success', 'Your password was successfully changed')
                  res.redirect('/auth/tutor/login')
                }
              })
            }
          })
        }
      }
    })
  },

  putCatchPlusReset: function (req, res) {
    CatchPlus.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, chosenCatchPlus) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/auth/catchPlus/forgot')
      } else {
        if (!chosenCatchPlus) {
          req.flash('error', 'Your password reset token is invalid or has expired. Please request another password reset email')
          res.redirect('/auth/catchPlus/forgot')
        } else {
          chosenCatchPlus.password = req.body.password
          chosenCatchPlus.resetPasswordToken = undefined
          chosenCatchPlus.resetPasswordExpires = undefined
          chosenCatchPlus.save(function (err, savedCatchPlus) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/auth/catchPlus/forgot')
            } else {
              var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.GMAIL_ADDRESS,
                  pass: process.env.GMAIL_PASSWORD
                }
              })
              var mailOptions = {
                from: process.env.GMAIL_ADDRESS,
                to: savedCatchPlus.email,
                subject: 'Password reset successful',
                html: `
                  <p>
                    Hi again from ReadAble!<br /><br />
                    Your password was successfully reset. Log in with your new password at
                    <a href="http://${req.headers.host}/auth/catchPlus/login">this link</a>.<br /><br />
                    If you did not reset your password, please reply to this email to let us know.<br /><br /><br />
                    Kind regards,<br/>
                    The ReadAble Team
                  </p>
                `
              }
              smtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/auth/catchPlus/forgot')
                } else {
                  req.flash('success', 'Your password was successfully changed')
                  res.redirect('/auth/catchPlus/login')
                }
              })
            }
          })
        }
      }
    })
  },

  getTutorLogIn: function (req, res) {
    res.render('./auth/tutor/login')
  },

  getCatchPlusLogIn: function (req, res) {
    res.render('./auth/catchPlus/login')
  },

  postTutorLogIn: function (req, res, next) {
    passport.authenticate('tutor-local', function (err, user, info) {
      if (err) return next(err)
      if (!user) {
        req.flash('error', info.message)
        res.redirect('/auth/tutor/login')
      }
      req.logIn(user, function (err) {
        if (err) return next(err)
        req.flash('success', 'You have successfully logged in')
        res.redirect('/tutors/attendance/' + user.id)
      })
    })(req, res, next)
  },

  postCatchPlusLogIn: passport.authenticate('catchPlus-local', {
    successRedirect: '/students/attendance',
    failureRedirect: '/auth/catchPlus/login',
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
