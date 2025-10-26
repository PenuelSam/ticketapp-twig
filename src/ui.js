import { navigate } from './router.js'
import { login, logout, signup, isAuthenticated, getSession } from './auth.js'
import { validateCredentials } from './validate.js'
import { toast } from './toast.js'

export async function renderPage(route, params) {
  const main = document.getElementById('app')
  if (!main) return

  const templatePath = `/templates/${route.template}.twig`
  try {
    const res = await fetch(templatePath)
    if (!res.ok) throw new Error(`Failed to load template: ${templatePath}`)
    const html = await res.text()
    main.innerHTML = html
  } catch (error) {
    console.error(error)
    main.innerHTML = `<section class="container" style="padding:3rem 0;"><div class="card"><h1>Something went wrong</h1><p>${error.message}</p></div></section>`
    return
  }

  document.title = getPageTitle(route)
  hydrateNavigation()

  switch (route.template) {
    case 'auth-login':
      setupLogin()
      break
    case 'auth-signup':
      setupSignup()
      break
    case 'dashboard':
      populateDashboard()
      break
    case 'tickets':
      import('./tickets.js').then((module) => module.initTickets())
      break
    case 'ticket-edit':
      import('./tickets.js').then((module) => module.initTicketEditor(params?.id))
      break
    default:
      break
  }
}

function getPageTitle(route) {
  switch (route.template) {
    case 'landing':
      return 'TicketFlow – Manage support the modern way'
    case 'auth-login':
      return 'Login · TicketFlow'
    case 'auth-signup':
      return 'Create Account · TicketFlow'
    case 'dashboard':
      return 'Dashboard · TicketFlow'
    case 'tickets':
      return 'Tickets · TicketFlow'
    case 'ticket-edit':
      return 'Edit Ticket · TicketFlow'
    default:
      return 'TicketFlow'
  }
}

function hydrateNavigation() {
  const logoutBtn = document.getElementById('logout-btn')
  if (logoutBtn) {
    if (isAuthenticated()) {
      logoutBtn.hidden = false
      logoutBtn.onclick = (event) => {
        event.preventDefault()
        logout()
      }
    } else {
      logoutBtn.hidden = true
      logoutBtn.onclick = null
    }
  }

  const navLinks = document.querySelectorAll('a[data-link]')
  navLinks.forEach((link) => {
    const href = link.getAttribute('href')
    if (!href) return
    if (href === location.pathname) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

function setupLogin() {
  const form = document.getElementById('login-form')
  if (!form) return
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(form))
    const errors = validateCredentials(formData)
    setFormErrors(form, errors)
    if (Object.keys(errors).length) return
    if (login(formData.email, formData.password)) {
      navigate('/dashboard')
    }
  })
}

function setupSignup() {
  const form = document.getElementById('signup-form')
  if (!form) return
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(form))
    const errors = validateCredentials(formData)
    setFormErrors(form, errors)
    if (Object.keys(errors).length) return
    if (signup(formData.email, formData.password)) {
      navigate('/auth/login')
    }
  })
}

function setFormErrors(form, errors) {
  const errorEls = form.querySelectorAll('[data-error]')
  errorEls.forEach((el) => {
    const key = el.getAttribute('data-error')
    el.textContent = errors[key] || ''
  })
}

function populateDashboard() {
  const tickets = getTickets()
  const total = tickets.length
  const open = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length
  const closed = tickets.filter((t) => t.status === 'closed').length

  const totalEl = document.querySelector('[data-stat="total"]')
  const openEl = document.querySelector('[data-stat="open"]')
  const closedEl = document.querySelector('[data-stat="closed"]')

  if (totalEl) totalEl.textContent = total.toString()
  if (openEl) openEl.textContent = open.toString()
  if (closedEl) closedEl.textContent = closed.toString()

  const session = getSession()
  if (session?.user?.email) {
    toast('info', `Signed in as ${session.user.email}`)
  }
}

export function getTickets() {
  try {
    return JSON.parse(localStorage.getItem('ticketapp_tickets') || '[]')
  } catch {
    return []
  }
}

export function saveTickets(tickets) {
  localStorage.setItem('ticketapp_tickets', JSON.stringify(tickets))
}
