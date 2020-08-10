function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ')-' + match[2] + '-' + match[3]
  }
  return phoneNumberString
}
export { formatPhoneNumber }
