import { createRoot } from 'react-dom/client'

// Minimal test - no imports, no React overhead
document.getElementById('root').innerHTML = `
  <div style="
    background:#080808; color:#c8a96e; 
    min-height:100vh; display:flex; 
    flex-direction:column; align-items:center; justify-content:center;
    font-family:serif; font-size:1.4rem;
  ">
    <div style="font-size:4rem;margin-bottom:16px">⛧</div>
    <div>KULT: City of Chains</div>
    <div style="font-size:0.9rem;color:#555;margin-top:12px">Loading game engine...</div>
  </div>
`;

// Now try loading React
setTimeout(async () => {
  try {
    const { default: App } = await import('./App.jsx');
    const { StrictMode } = await import('react');
    const { jsx } = await import('react/jsx-runtime');
    createRoot(document.getElementById('root')).render(
      jsx(StrictMode, { children: jsx(App, {}) })
    );
  } catch(e) {
    document.getElementById('root').innerHTML = `
      <div style="background:#111;color:#f44;padding:40px;font-family:monospace;min-height:100vh;white-space:pre-wrap">
CRASH LOADING APP:\n${e.message}\n\n${e.stack}
      </div>
    `;
  }
}, 100);
