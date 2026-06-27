import { HealthStatus } from './components/HealthStatus';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#181825', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <h1 style={{ color: '#cdd6f4', fontFamily: 'monospace', marginBottom: '8px', fontSize: '1.2rem' }}>
        Billing and Inventory Management System
      </h1>
      <p style={{ color: '#a6adc8', fontFamily: 'monospace', marginBottom: '32px', fontSize: '0.85rem' }}>
        Sprint 1 - Backend Foundation
      </p>
      <HealthStatus />
    </div>
  );
}

export default App;