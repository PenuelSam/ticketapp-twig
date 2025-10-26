export function toast(type, message) {
  const div = document.createElement('div')
  div.className = `toast ${type}`
  div.textContent = message
  Object.assign(div.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    borderRadius: '8px',
    color: '#fff',
    zIndex: '9999',
    background: type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#6366f1',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    maxWidth: '90%',
    textAlign: 'center',
  })
  document.body.appendChild(div)
  setTimeout(() => {
    div.style.transition = 'opacity 0.3s ease'
    div.style.opacity = '0'
    setTimeout(() => div.remove(), 300)
  }, 3000)
}
