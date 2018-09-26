document.addEventListener('DOMContentLoaded', function () {
  var deleteCheck = document.getElementById('deleteCheck')
  var name = document.getElementById('targetDeleteCheck').getAttribute('data-target-name')
  var deleteButton = document.getElementById('deleteButton')

  var checkAndToggleDeleteButton = function () {
    if (deleteCheck.value === name) {
      deleteButton.removeAttribute('disabled')
      deleteButton.setAttribute('style', 'cursor:pointer;')
    } else {
      deleteButton.setAttribute('disabled', true)
      deleteButton.removeAttribute('style')
    }
  }

  deleteCheck.addEventListener('input', checkAndToggleDeleteButton)
})
