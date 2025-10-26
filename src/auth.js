import { toast } from './toast.js'

const SESSION_KEY = 'ticketapp_session'
const USERS_KEY = 'ticketapp_users'

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function isAuthenticated() {
  const s = getSession()
  return Boolean(s && (!s.exp || Date.now() < s.exp))
}

export function signup(email, password) {
  if (!email || !password) {
    toast('error', 'Email and password required.')
    return false
  }
  const users = getUsers()
  if (users.some((u) => u.email === email)) {
    toast('error', 'An account with that email already exists.')
    return false
  }
  users.push({ email, password })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  toast('success', 'Account created. You can log in now.')
  return true
}

export function login(email, password) {
  if (!email || !password) {
    toast('error', 'Email and password required.')
    return false
  }
  const users = getUsers()
  const match = users.find((u) => u.email === email)
  if (!match) {
    toast('error', 'No account found for that email.')
    return false
  }
  if (match.password !== password) {
    toast('error', 'Incorrect password.')
    return false
  }
  const session = {
    token: crypto.randomUUID(),
    user: { email },
    exp: Date.now() + 3600_000,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  toast('success', 'Login successful')
  return true
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  toast('info', 'Logged out')
  location.href = '/'
}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}
