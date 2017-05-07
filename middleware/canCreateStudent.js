module.exports = function (req, res, next) {
  console.log(req.user.admin)
  if (req.user.userType !== "catchPlus" && !req.user.admin) {
    req.flash('error', 'You must be either a ReadAble administrator or from Catch+ to access that page')
    res.redirect('/')
  } else {
    next()
  }
}
