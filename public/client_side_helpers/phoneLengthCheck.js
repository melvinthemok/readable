document.addEventListener('DOMContentLoaded', function () {
  var phoneFormGroup = document.getElementById('phone-form-group')
  var phone = document.getElementById('phone')
  var message = document.getElementById('phoneLengthMessage')
  var submitButton = document.getElementById('submitButton')
  phone.onkeyup = function () {
    if (phone.value.length === 8) {
      phoneFormGroup.classList.add('has-success')
      phoneFormGroup.classList.remove('has-warning')
      phone.classList.add('form-control-success')
      phone.classList.remove('form-control-warning')
      message.textContent = ''
      submitButton.removeAttribute('disabled')
    } else if (phone.value.length < 8) {
      if (!phone.classList.contains('form-control-warning') && !phoneFormGroup.classList.contains('has-warning')) {
        phone.classList.add('form-control-warning')
        phoneFormGroup.classList.add('has-warning')
      }
      if (phone.classList.contains('form-control-success') && phoneFormGroup.classList.contains('has-success')) {
        phone.classList.remove('form-control-success')
        phoneFormGroup.classList.remove('has-success')
      }
      message.textContent = 'Too short'
      submitButton.setAttribute('disabled', true)
    } else {
      if (!phone.classList.contains('form-control-warning') && !phoneFormGroup.classList.contains('has-warning')) {
        phone.classList.add('form-control-warning')
        phoneFormGroup.classList.add('has-warning')
      }
      if (phone.classList.contains('form-control-success') && phoneFormGroup.classList.contains('has-success')) {
        phone.classList.remove('form-control-success')
        phoneFormGroup.classList.remove('has-success')
      }
      message.textContent = 'Too long'
      submitButton.setAttribute('disabled', true)
    }
  }
})
