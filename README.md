# TicketApp (Twig Edition)

TicketApp is a lightweight help-desk demo that mirrors the UX and flows of the React and Vue builds, but implemented with static Twig templates and vanilla JavaScript. It showcases client-side routing, authentication simulated with `localStorage`, and full CRUD for support tickets without relying on a backend API.

 **Live URL:** https://ticketapp-twig-nine.vercel.app/  
 **GitHub Repository:** https://github.com/PenuelSam/ticketapp-twig

---

##  Project Overview
- **Twig templates** provide the shared layout and page structure for landing, auth, dashboard, list, and edit screens.
- **Vite** bundles the ES modules, CSS tokens, and serves Twig files through a custom plugin.
- **Vanilla JavaScript** handles navigation, auth, tickets CRUD, toast notifications, and inline validation.
- **Design tokens** ensure the color palette, typography, spacing, and elevation match the previous framework implementations.

##  Setup & Development

```bash
npm install
npm run dev
```

The Vite dev server starts at <http://localhost:5173>. All templates are available under `/templates/*` and fetched at runtime by the router. For a production build, run:

```bash
npm run build
npm run preview
```

##  Routing

A small router tracks `window.history` and renders templates client-side. Routes include:

| Path | Template | Auth Required |
| ---- | -------- | ------------- |
| `/` | `landing.twig` | No |
| `/auth/login` | `auth-login.twig` | No |
| `/auth/signup` | `auth-signup.twig` | No |
| `/dashboard` | `dashboard.twig` | Yes |
| `/tickets` | `tickets.twig` | Yes |
| `/tickets/:id` | `ticket-edit.twig` | Yes |

Unauthenticated attempts to visit restricted routes redirect to the login form with a toast notice.

##  Authentication Flow

- Credentials are saved in `localStorage` under `ticketapp_users`.
- Successful login issues a faux session (`ticketapp_session`) with a 60-minute expiry.
- Logout clears the session and returns to the landing page.
- A demo account is pre-seeded for quick access:
  - **Email:** `demo@ticketflow.dev`
  - **Password:** `password`

##  Ticket CRUD

- Tickets live in `localStorage` (`ticketapp_tickets`).
- The tickets list shows badges, descriptions, timestamps, and actions.
- “New ticket” opens a modal form with validation and toast feedback.
- Edit screens mirror the modal form, allowing status changes and description updates.
- Delete asks for confirmation before removing a ticket.

Demo tickets are seeded on first load so the dashboard, list, and edit screens have data immediately.

## Accessibility & Design Consistency

- Semantic headings and labels connect forms to inputs.
- Buttons include `aria` labels where applicable and respect keyboard navigation.
- Color contrast, spacing, and typography follow the shared design tokens to match other framework versions.
- Toasts dismiss automatically and don’t block interaction.

## Known Issues & Notes

- Twig templates are fetched client-side; there is no server-side rendering.
- Because storage is local to the browser, sessions reset per device and can be cleared by wiping site data.
- This demo intentionally omits password hashing or real authentication flows—use only for prototypes.

Enjoy exploring TicketApp in Twig!
