function sortByProperty (arr, prop, inDescendingOrder = false) {
  if (!inDescendingOrder) {
    return arr.sort(function (one, another) {
      if (one[prop] < another[prop]) return -1
      else if (one[prop] > another[prop]) return 1
      else return 0
    })
  } else { // inDescendingOrder
    return arr.sort(function (one, another) {
      if (one[prop] > another[prop]) return -1
      else if (one[prop] < another[prop]) return 1
      else return 0
    })
  }
}

module.exports = sortByProperty