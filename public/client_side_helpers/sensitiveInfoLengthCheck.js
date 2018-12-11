document.addEventListener('DOMContentLoaded', function () {
  var sensitiveInfoFormGroup = document.getElementById('sensitive-info-form-group')
  var sensitiveInfo = document.getElementById('sensitiveInfo')
  var message = document.getElementById('sensitiveInfoMessage')

  sensitiveInfo.addEventListener('input', function() {
    if (sensitiveInfo.value.length < 501) {
      sensitiveInfoFormGroup.classList.add('has-success')
      sensitiveInfo.classList.add('form-control-success')
      sensitiveInfoFormGroup.classList.remove('has-warning')
      sensitiveInfo.classList.remove('form-control-warning')
      message.textContent = 'Characters remaining: ' + (500 - sensitiveInfo.value.length)
    } else {
      sensitiveInfoFormGroup.classList.add('has-warning')
      sensitiveInfo.classList.add('form-control-warning')
      sensitiveInfoFormGroup.classList.remove('has-success')
      sensitiveInfo.classList.remove('form-control-success')
      message.textContent = 'Too much information'
    }
  })
})
