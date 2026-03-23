import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[KULT] Render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Intentionally uses inline styles: CSS modules may be unavailable if
      // the asset pipeline or network is the source of the error.
      return (
        <div style={{
          minHeight: '100vh',
          background: '#08080f',
          color: '#c8a96e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛧</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
            The Illusion Collapses
          </h1>
          <p style={{ color: '#7a6742', maxWidth: '400px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Something went wrong loading KULT: City of Chains.
            Please refresh to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'transparent',
              border: '1px solid #3a3020',
              color: '#c8a96e',
              padding: '8px 24px',
              fontFamily: 'Georgia, serif',
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >
            Reload
          </button>
          {this.state.error && (
            <details style={{ marginTop: '1.5rem', color: '#555', fontSize: '0.75rem', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer' }}>Error details</summary>
              <pre style={{ textAlign: 'left', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
