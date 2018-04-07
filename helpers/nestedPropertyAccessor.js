function nestedPropertyAccessor (obj, str) {
  return str.split('.').reduce(function (a, b) {
    return a[b]
  }, obj)
}

module.exports = nestedPropertyAccessor