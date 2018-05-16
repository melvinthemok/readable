module.exports = function (req, res, next) {
  if (req.user.userType !== "tutor") {
    req.flash('error', 'You must be a ReadAble tutor to access that page')
    res.redirect('/index')
  } else {
    next()
  }
}
