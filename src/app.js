import { handleRoute } from './router.js'
import { getTickets, saveTickets } from './ui.js'
import { getUsers } from './auth.js'

window.addEventListener('DOMContentLoaded', () => {
  seedDemoUser()
  seedDemoData()
  handleRoute()
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
