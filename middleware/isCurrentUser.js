module.exports = function (req, res, next) {
  if (req.user.id !== req.params.id) {
    req.flash('error', 'You can only do that for your own account')
    res.redirect('/index')
  } else {
    next()
  }
}
