function filterStudentPrefixedKeys (requestBody, prefix) {
  var prefixRegex = new RegExp(`^${prefix}-`)
  return Object.keys(requestBody).filter(function (key) {
    return prefixRegex.test(key)
  }).reduce(function (obj, key) {
    obj[key.replace(prefixRegex, '')] = requestBody[key]
    return obj
  }, {})
}

module.exports = filterStudentPrefixedKeys