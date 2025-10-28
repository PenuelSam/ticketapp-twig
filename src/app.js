import { handleRoute } from './router.js'
import { getTickets, saveTickets } from './ui.js'
import { getUsers } from './auth.js'
import { isAuthenticated, logout } from './auth.js';
import { getSession } from './auth.js'


window.addEventListener('DOMContentLoaded', () => {
  seedDemoUser()
  seedDemoData()
  handleRoute()
   initNavbar()
   updateDashboardUser()
})

window.addEventListener('storage', (event) => {
  if (event.key === 'ticketapp_tickets') {
    handleRoute()
  }
})

function seedDemoUser() {
  const users = getUsers()
  if (users.some((user) => user.email === 'demo@ticketflow.dev')) return
  users.push({ email: 'demo@ticketflow.dev', password: 'password' })
  localStorage.setItem('ticketapp_users', JSON.stringify(users))
}

function seedDemoData() {
  const tickets = getTickets()
  if (tickets.length) return
  const now = new Date().toISOString()
  const demoTickets = [
    {
      id: crypto.randomUUID(),
      title: 'Customer unable to reset password',
      status: 'open',
      description: 'User reports password reset email not arriving. Investigate email provider logs.',
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: 'Billing discrepancy on invoice #4832',
      status: 'in_progress',
      description: 'Finance team reviewing invoice for incorrect tax calculation in EU region.',
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: 'Feature request: Bulk ticket export',
      status: 'closed',
      description: 'Closed after confirming the roadmap timeline and notifying customer.',
      createdAt: now,
    },
  ]
  saveTickets(demoTickets)
}

function initNavbar() {
  const navToggle = document.querySelector('.nav-toggle')
  const navLinks = document.querySelector('.nav-links')
  const logoutBtn = document.getElementById('logout-btn')

  // Handle mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open')
      const isOpen = navLinks.classList.contains('open')
      navToggle.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
    })
  }

  // Handle authentication state
  if (navLinks) {
    if (!isAuthenticated()) {
      navLinks.innerHTML = `
       <a href="/auth/login" data-link> <button class="button button-secondary">Login</button></a>
      `
    } else if (logoutBtn) {
      logoutBtn.addEventListener('click', logout)
    }
  }
}

 export function updateDashboardUser() {
  const session = getSession()

  // Wait for element if not yet rendered
  const tryUpdate = () => {
    const emailEl = document.getElementById('user-email')
    if (!emailEl) {
      // Retry after a short delay until it's rendered
      return setTimeout(tryUpdate, 50)
    }

    // When found, update the text
    if (session && session.user && session.user.email) {
      emailEl.textContent = session.user.email
    } else {
      emailEl.textContent = 'Guest'
    }
  }

  tryUpdate()
}

