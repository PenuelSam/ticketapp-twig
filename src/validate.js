export function validateTicket(input) {
  const errors = {}
  if (!input.title?.trim()) errors.title = 'Title is required.'
  if (!['open', 'in_progress', 'closed'].includes(input.status)) {
    errors.status = 'Status must be open, in_progress, or closed.'
  }
  if (input.description?.length > 1000) {
    errors.description = 'Description too long (max 1000 chars).'
  }
  return errors
}

export function validateCredentials({ email, password }) {
  const errors = {}
  if (!email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!password?.trim()) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  return errors
}
