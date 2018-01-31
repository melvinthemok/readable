document.addEventListener('DOMContentLoaded', function () {
  var listeningInputs = document.querySelectorAll('.required-group > input, #generalComment')
  var name = document.getElementById('name')
  var generalComment = document.getElementById('generalComment')
  var saturdatesCheckboxes = document.querySelectorAll("input[name='saturdates']")
  var bookSelects = document.querySelectorAll("select[name='fitzroyBooks']")
  var submitButton = document.getElementById('submitButton')

  function runAllRequiredChecks () {
    var requiredGroups = document.querySelectorAll('.required-group')
    var required = document.querySelectorAll('.required-group > input, .required-group > select')

    requiredGroups.forEach(function (requiredGroup) {
      var input = requiredGroup.querySelector('input:not(#name):not(.form-check-input)')
      var select = requiredGroup.querySelector('select')

      if (input) {
        if (input.value !== '') {
          requiredGroup.classList.add('has-success')
          requiredGroup.classList.remove('has-warning')
          input.classList.add('form-control-success')
          input.classList.remove('form-control-warning')
          if (requiredGroup.querySelector('.form-control-feedback')) {
            requiredGroup.querySelector('.form-control-feedback').textContent = ''
          }
        } else {
          requiredGroup.classList.remove('has-success')
          requiredGroup.classList.add('has-warning')
          input.classList.remove('form-control-success')
          input.classList.add('form-control-warning')
          if (requiredGroup.querySelector('.form-control-feedback')) {
            requiredGroup.querySelector('.form-control-feedback').textContent = 'Required'
          }
        }
      }

      if (select) {
        if (select.value !== '') {
          requiredGroup.classList.add('has-success')
          requiredGroup.classList.remove('has-warning')
          select.classList.add('form-control-success')
          select.classList.remove('form-control-warning')
          if (requiredGroup.querySelector('.form-control-feedback')) {
            requiredGroup.querySelector('.form-control-feedback').textContent = ''
          }
        } else {
          requiredGroup.classList.remove('has-success')
          requiredGroup.classList.add('has-warning')
          select.classList.remove('form-control-success')
          select.classList.add('form-control-warning')
          if (requiredGroup.querySelector('.form-control-feedback')) {
            requiredGroup.querySelector('.form-control-feedback').textContent = 'Required'
          }
        }
      }
    })

    if (!Array.prototype.some.call(required, function (item) {
      return item.value === ''
    }) && name.value.length > 2 && name.value.length < 41 && generalComment.value.length < 501) {
      submitButton.removeAttribute('disabled')
      submitButton.setAttribute('style', 'cursor:pointer;')
    } else {
      submitButton.setAttribute('disabled', true)
      submitButton.removeAttribute('style')
    }
  }

  function attachEventListenersToNonBookSelects () {
    var requiredNonBookSelects = document.querySelectorAll(".required-group > select:not([name='fitzroyBooks'])")
    requiredNonBookSelects.forEach(function (requiredNonBookSelect) {
      requiredNonBookSelect.addEventListener('change', runAllRequiredChecks)
    })
  }

  attachEventListenersToNonBookSelects()

  listeningInputs.forEach(function (requiredInput) {
    requiredInput.addEventListener('input', runAllRequiredChecks)
  })

  saturdatesCheckboxes.forEach(function (checkbox, index) {
    var tutor = document.getElementById('fitzroy.' + index + '.tutor')
    var book = document.getElementById('fitzroy.' + index + '.book')
    var completed = document.getElementById('fitzroy.' + index + '.completed')

    if (checkbox.checked) {
      tutor.classList.add('required-group')
      tutor.removeAttribute('style')
      book.classList.add('required-group')
      book.removeAttribute('style')
    }

    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        tutor.classList.add('required-group')
        tutor.removeAttribute('style')
        book.classList.add('required-group')
        book.removeAttribute('style')
      } else {
        tutor.classList.remove('required-group')
        tutor.querySelector('select').selectedIndex = 0
        tutor.setAttribute('style', 'display:none; visibility:hidden')
        book.classList.remove('required-group')
        book.querySelector('select').selectedIndex = 0
        book.setAttribute('style', 'display:none; visibility:hidden')
        completed.querySelector('select').selectedIndex = 0
        completed.setAttribute('style', 'display:none; visibility:hidden')
      }
      attachEventListenersToNonBookSelects()
      runAllRequiredChecks()
    })
  })

  bookSelects.forEach(function (bookSelect, index) {
    var completed = document.getElementById('fitzroy.' + index + '.completed')

    if (bookSelect.value > 0) {
      completed.classList.add('required-group')
      completed.removeAttribute('style')
    }

    bookSelect.addEventListener('change', function () {
      if (this.value > 0) {
        completed.classList.add('required-group')
        completed.removeAttribute('style')
      } else {
        completed.classList.remove('required-group')
        completed.querySelector('select').selectedIndex = 0
        completed.setAttribute('style', 'display:none; visibility:hidden')
      }
      attachEventListenersToNonBookSelects()
      runAllRequiredChecks()
    })
  })
})
