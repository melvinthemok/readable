document.addEventListener('DOMContentLoaded', function () {
  var listeningInputs = document.querySelectorAll('.required-group > input, #generalComment')
  // enable submit only if other client-side helper checks succeed
  var name = document.getElementById('name')
  var generalComment = document.getElementById('generalComment')
  var saturdatesCheckboxes = document.querySelectorAll("input[name='saturdates']")
  var submitButton = document.getElementById('submitButton')

  function runAllRequiredChecks () {
    // checking if required form elements have values
    var requiredGroups = document.querySelectorAll('.required-group')
    var required = document.querySelectorAll('.required-group > input, .required-group > select')

    requiredGroups.forEach(function (requiredGroup) {
      var input = requiredGroup.querySelector('input:not(#name):not(.form-check-input)')
      // to avoid encroaching on responsibility of individual checks
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

  function attachEventListenersToSelects () {
    var requiredSelects = document.querySelectorAll(".required-group > select:not([name='fitzroyBooks'])")
    requiredSelects.forEach(function (requiredSelect) {
      requiredSelect.addEventListener('change', runAllRequiredChecks)
    })
  }

  attachEventListenersToSelects()

  listeningInputs.forEach(function (requiredInput) {
    requiredInput.addEventListener('input', runAllRequiredChecks)
  })

  saturdatesCheckboxes.forEach(function (checkbox, index) {
    var tutor = document.getElementById('student.' + index + '.tutor')

    function prepareCheckboxDependentElementsAndRunChecks () {
      if (checkbox.checked) {
        tutor.classList.add('required-group')
        tutor.removeAttribute('style')
      } else {
        tutor.classList.remove('required-group')
        tutor.querySelector('select').selectedIndex = 0
        tutor.setAttribute('style', 'display:none; visibility:hidden')
      }
      attachEventListenersToSelects()
      runAllRequiredChecks()
    }

    prepareCheckboxDependentElementsAndRunChecks()
    checkbox.addEventListener('change', prepareCheckboxDependentElementsAndRunChecks)
  })

  runAllRequiredChecks()
})
