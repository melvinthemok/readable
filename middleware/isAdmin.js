module.exports = function (req, res, next) {
  if (!req.user.admin) {
    req.flash('error', 'You must be a ReadAble administrator to access that page')
    res.redirect('/index')
  } else {
    next()
  }
}
