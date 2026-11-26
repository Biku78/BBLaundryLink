export function validateRegistration(values) {
  if (!values.name.trim() || values.name.length > 100) return 'Please enter your full name (up to 100 characters).'
  if (!/^[0-9]{10}$/.test(values.mobile)) return 'Please enter a 10-digit mobile number.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return 'Please enter a valid email address.'
  if ([...values.password].length < 8 || new TextEncoder().encode(values.password).length > 72) return 'Password must have at least 8 characters and no more than 72 bytes.'
  if (values.password !== values.confirm_password) return 'Passwords do not match.'
  if (!values.accept_terms) return 'Please accept the terms and privacy notice.'
  return ''
}
