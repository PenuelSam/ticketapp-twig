import { renderPage } from './ui.js'
import { isAuthenticated } from './auth.js'
import { toast } from './toast.js'

export const routes = [
  { path: '/', template: 'landing', auth: false },
  { path: '/auth/login', template: 'auth-login', auth: false },
  { path: '/auth/signup', template: 'auth-signup', auth: false },
  { path: '/dashboard', template: 'dashboard', auth: true },
  { path: '/tickets', template: 'tickets', auth: true },
  { path: '/tickets/:id', template: 'ticket-edit', auth: true },
]

export function navigate(path) {
  if (location.pathname === path) {
    handleRoute()
    return
  }
  window.history.pushState({}, '', path)
  handleRoute()
}

export function handleRoute() {
  const currentPath = location.pathname
  const match = matchRoute(currentPath)

  if (!match) {
    window.history.replaceState({}, '', '/')
    renderPage(routes[0], {})
    return
  }

  if (match.route.auth && !isAuthenticated()) {
    toast('error', 'Your session has expired — please log in again.')
    window.history.replaceState({}, '', '/auth/login')
    renderPage(routes[1], {})
    return
  }

  renderPage(match.route, match.params)
}

function matchRoute(path) {
  for (const route of routes) {
    const params = {}
    const routeParts = route.path.split('/').filter(Boolean)
    const pathParts = path.split('/').filter(Boolean)
    if (routeParts.length !== pathParts.length) continue

    let isMatch = true
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i]
      const pathPart = pathParts[i]
      if (routePart.startsWith(':')) {
        params[routePart.slice(1)] = decodeURIComponent(pathPart)
      } else if (routePart !== pathPart) {
        isMatch = false
        break
      }
    }
    if (isMatch) {
      return { route, params }
    }
  }
  return null
}

window.addEventListener('popstate', handleRoute)
document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-link]')
  if (link && link.getAttribute('href')) {
    const href = link.getAttribute('href')
    if (href.startsWith('http')) return
    event.preventDefault()
    navigate(href)
  }
})
