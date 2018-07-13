document.addEventListener('DOMContentLoaded', function () {
  var password1 = document.getElementById('passwordDraft')
  // show password confirmation only on input in passwordDraft
  var description = document.getElementById('passwordDescription')
  var password2 = document.getElementById('password')
  var passwordFormGroup = document.getElementById('password-form-group')
  // show alert if passwordDraft too short or too long
  var message = document.getElementById('passwordMessage')

  function checkPassword() {
    if (password1.value.length > 7 && password1.value.length < 31) {
      passwordFormGroup.classList.remove('has-warning')
      password1.classList.remove('form-control-warning')
      message.textContent = ''
    } else {
      passwordFormGroup.classList.add('has-warning')
      password1.classList.add('form-control-warning')
      switch (true) {
        case (password1.value.length === 0):
          message.textContent = 'Required'
          break
        case (password1.value.length > 0 && password1.value.length < 8):
          message.textContent = 'Too short'
          break
        default: // password.value.length > 30
          message.textContent = 'Too long'
      }
    }
  }

  checkPassword()

  password1.addEventListener('input', function () {
    description.removeAttribute('style')
    password2.removeAttribute('style')
    checkPassword()
  })
})
