document.addEventListener('DOMContentLoaded', function () {
  var nameFormGroup = document.getElementById('name-form-group')
  var name = document.getElementById('name')
  var message = document.getElementById('nameLengthMessage')

  function checkName () {
    if (name.value.length > 2 && name.value.length < 41) {
      nameFormGroup.classList.add('has-success')
      name.classList.add('form-control-success')
      nameFormGroup.classList.remove('has-warning')
      name.classList.remove('form-control-warning')
      message.textContent = ''
    } else {
      nameFormGroup.classList.add('has-warning')
      name.classList.add('form-control-warning')
      nameFormGroup.classList.remove('has-success')
      name.classList.remove('form-control-success')
      switch (true) {
        case (name.value.length === 0):
          message.textContent = 'Required'
          break
        case (name.value.length > 0 && name.value.length < 3):
          message.textContent = 'Too short'
          break
        default: // name.value.length > 40
          message.textContent = 'Too long'
      }
    }
  }

  checkName()
  name.addEventListener('input', checkName)
})
