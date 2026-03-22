import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Catch and display any crash visibly
window.addEventListener('error', (e) => {
  document.body.innerHTML = `<div style="color:red;padding:20px;font-family:monospace;background:#111;min-height:100vh">
    <h2>JS Error</h2>
    <pre>${e.message}\n\n${e.filename}:${e.lineno}\n\n${e.error?.stack || ''}</pre>
  </div>`;
});

window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML = `<div style="color:orange;padding:20px;font-family:monospace;background:#111;min-height:100vh">
    <h2>Promise Rejection</h2>
    <pre>${e.reason?.message || e.reason}\n\n${e.reason?.stack || ''}</pre>
  </div>`;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
