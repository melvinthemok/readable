var User = require('../models/user')

var attendController = {
  getAttend: function (req, res) {
    res.render('./user/attend')
  },

  postAttend: function (req, res) {
    User.findOneAndUpdate({
      _id: req.user.id
    }, {
      attending: req.body.attending,
    }, function (err, updatedUser) {
      if (err) {
        req.flash('error', 'Error updating attendance')
        res.redirect('/attend')
      } else {
        req.flash('success', 'Attendance successfully updated!')
        res.redirect('/')
      }
    })
  }
}

module.exports = attendController
