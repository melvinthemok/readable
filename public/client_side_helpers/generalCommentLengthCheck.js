document.addEventListener('DOMContentLoaded', function () {
  var generalCommentFormGroup = document.getElementById('general-comment-form-group')
  var generalComment = document.getElementById('generalComment')
  var message = document.getElementById('generalCommentMessage')

  generalComment.addEventListener('input', function() {
    if (generalComment.value.length < 501) {
      generalCommentFormGroup.classList.add('has-success')
      generalComment.classList.add('form-control-success')
      generalCommentFormGroup.classList.remove('has-warning')
      generalComment.classList.remove('form-control-warning')
      message.textContent = 'Characters remaining: ' + (500 - generalComment.value.length)
    } else {
      generalCommentFormGroup.classList.add('has-warning')
      generalComment.classList.add('form-control-warning')
      generalCommentFormGroup.classList.remove('has-success')
      generalComment.classList.remove('form-control-success')
      message.textContent = 'Too much information'
    }
  })
})
