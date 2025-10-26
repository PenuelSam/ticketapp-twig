import { validateTicket } from './validate.js'
import { toast } from './toast.js'
import { getTickets, saveTickets } from './ui.js'
import { navigate } from './router.js'

export function initTickets() {
  const listEl = document.getElementById('ticket-list')
  if (!listEl) return

  renderTickets(listEl)

  const newBtn = document.getElementById('new-ticket-btn')
  newBtn?.addEventListener('click', () => openTicketModal(listEl))

  listEl.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-action]')
    if (!target) return
    const id = target.dataset.id
    const action = target.dataset.action
    if (action === 'delete') {
      deleteTicket(id, listEl)
    }
    if (action === 'edit') {
      navigate(`/tickets/${id}`)
    }
  })
}

export function initTicketEditor(id) {
  const form = document.getElementById('ticket-edit-form')
  if (!form) return
  const tickets = getTickets()
  const ticket = tickets.find((t) => t.id === id)
  if (!ticket) {
    form.innerHTML = '<p>Ticket not found. <a href="/tickets" data-link>Return to tickets.</a></p>'
    return
  }

  form.elements.id.value = ticket.id
  form.elements.title.value = ticket.title || ''
  form.elements.status.value = ticket.status || 'open'
  form.elements.description.value = ticket.description || ''

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(form))
    const errors = validateTicket(formData)
    setFormErrors(form, errors)
    if (Object.keys(errors).length) return

    const nextTickets = tickets.map((t) => (t.id === ticket.id ? { ...t, ...formData } : t))
    saveTickets(nextTickets)
    toast('success', 'Ticket updated successfully.')
    navigate('/tickets')
  })
}

function renderTickets(container) {
  const tickets = getTickets()
  if (!tickets.length) {
    container.innerHTML = '<p>No tickets yet. Create one to get started.</p>'
    return
  }

  container.innerHTML = tickets
    .map((ticket) => {
      const createdAt = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ''
      return `
        <article class="card ticket-card" role="listitem">
          <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem;">
            <h3>${escapeHtml(ticket.title)}</h3>
            <span class="badge ${ticket.status}">${formatStatus(ticket.status)}</span>
          </header>
          <p>${escapeHtml(ticket.description || 'No description provided.')}</p>
          <div class="status-indicator">
            <span>Created</span>
            <time datetime="${ticket.createdAt || ''}">${createdAt}</time>
          </div>
          <div class="ticket-actions" style="margin-top:1rem;">
            <button class="button secondary" data-action="edit" data-id="${ticket.id}">Edit</button>
            <button class="button outline" data-action="delete" data-id="${ticket.id}">Delete</button>
          </div>
        </article>
      `
    })
    .join('')
}

function openTicketModal(listEl) {
  const root = document.getElementById('modal-root')
  if (!root) return

  const backdrop = document.createElement('div')
  backdrop.className = 'modal-backdrop'
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="new-ticket-heading">
      <button class="modal-close" aria-label="Close" type="button">×</button>
      <h2 id="new-ticket-heading">New ticket</h2>
      <form id="ticket-form" novalidate>
        <label>
          Title
          <input type="text" name="title" required placeholder="Issue summary">
          <span class="inline-error" data-error="title"></span>
        </label>
        <label>
          Status
          <select name="status" required>
            <option value="open" selected>Open</option>
            <option value="in_progress">In progress</option>
            <option value="closed">Closed</option>
          </select>
          <span class="inline-error" data-error="status"></span>
        </label>
        <label>
          Description
          <textarea name="description" rows="4" placeholder="Add details to help resolve the request"></textarea>
          <span class="inline-error" data-error="description"></span>
        </label>
        <div class="ticket-actions" style="margin-top:1rem;">
          <button type="submit" class="button">Create ticket</button>
          <button type="button" class="button secondary" data-close>Cancel</button>
        </div>
      </form>
    </div>
  `

  root.appendChild(backdrop)

  const form = backdrop.querySelector('#ticket-form')
  form?.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(form))
    const errors = validateTicket(formData)
    setFormErrors(form, errors)
    if (Object.keys(errors).length) return

    const tickets = getTickets()
    tickets.push({
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date().toISOString(),
    })
    saveTickets(tickets)
    toast('success', 'Ticket created successfully.')
    renderTickets(listEl)
    closeModal(backdrop)
  })

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      closeModal(backdrop)
    }
  })

  backdrop.querySelector('.modal-close')?.addEventListener('click', () => closeModal(backdrop))
  backdrop.querySelector('[data-close]')?.addEventListener('click', () => closeModal(backdrop))
}

function deleteTicket(id, listEl) {
  if (!confirm('Delete this ticket?')) return
  const tickets = getTickets().filter((ticket) => ticket.id !== id)
  saveTickets(tickets)
  toast('success', 'Ticket deleted.')
  renderTickets(listEl)
}

function closeModal(node) {
  node.remove()
}

function setFormErrors(form, errors) {
  const errorEls = form.querySelectorAll('[data-error]')
  errorEls.forEach((el) => {
    const key = el.getAttribute('data-error')
    el.textContent = errors[key] || ''
  })
}

function escapeHtml(value) {
  return value
    ? value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    : ''
}

function formatStatus(status) {
  switch (status) {
    case 'open':
      return 'Open'
    case 'in_progress':
      return 'In progress'
    case 'closed':
      return 'Closed'
    default:
      return status
  }
}
