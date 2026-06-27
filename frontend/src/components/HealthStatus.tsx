import { useEffect, useState } from 'react';
import { healthService } from '../services/health.service';
import type { HealthResponse } from '../types/health';

function getStatusColor(status: string): string {
  if (status === 'connected' || status === 'healthy') return '#22c55e';
  if (status === 'disconnected' || status === 'unhealthy') return '#ef4444';
  return '#f59e0b';
}

export function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<string>('');

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthService.getHealth();
      setHealth(data);
      setLastFetch(new Date().toLocaleTimeString());
    } catch {
      setError('Unable to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div style={card}>
        <h2 style={title}>Backend Health</h2>
        <p style={loading_style}>Loading server status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={card}>
        <h2 style={title}>Backend Health</h2>
        <p style={error_style}>{error}</p>
        <button style={btn} onClick={fetchHealth}>Retry</button>
      </div>
    );
  }

  return (
    <div style={card}>
      <h2 style={title}>Backend Health</h2>
      <div style={grid}>
        <Row label="Status"      value={health?.status}               color={getStatusColor(health?.status ?? '')} />
        <Row label="Database"    value={health?.database}             color={getStatusColor(health?.database ?? '')} />
        <Row label="Environment" value={health?.runtime.environment} />
        <Row label="API Version" value={health?.application.apiVersion} />
        <Row label="App Version" value={health?.application.version} />
        <Row label="Node.js"     value={health?.runtime.node} />
        <Row label="Platform"    value={health?.runtime.platform} />
        <Row label="Uptime"      value={health?.uptime} />
        <Row label="Heap Used"   value={health?.memory.heapUsed} />
        <Row label="Heap Total"  value={health?.memory.heapTotal} />
        <Row label="RSS"         value={health?.memory.rss} />
        <Row label="Last Updated" value={lastFetch} />
      </div>
      <button style={btn} onClick={fetchHealth}>Refresh</button>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value?: string; color?: string }) {
  return (
    <div style={row}>
      <span style={lbl}>{label}</span>
      {color ? (
        <span style={{ ...badge, backgroundColor: color }}>{value}</span>
      ) : (
        <span style={val}>{value}</span>
      )}
    </div>
  );
}

const card: React.CSSProperties = { maxWidth: '520px', margin: '40px auto', padding: '32px', borderRadius: '12px', backgroundColor: '#1e1e2e', color: '#cdd6f4', fontFamily: 'monospace', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' };
const title: React.CSSProperties = { fontSize: '1.4rem', marginBottom: '24px', color: '#89b4fa', borderBottom: '1px solid #313244', paddingBottom: '12px' };
const grid: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' };
const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #313244' };
const lbl: React.CSSProperties = { color: '#a6adc8', fontSize: '0.9rem' };
const val: React.CSSProperties = { color: '#cdd6f4', fontSize: '0.9rem', fontWeight: 600 };
const badge: React.CSSProperties = { padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, color: '#fff' };
const btn: React.CSSProperties = { width: '100%', padding: '10px', backgroundColor: '#89b4fa', color: '#1e1e2e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' };
const loading_style: React.CSSProperties = { color: '#a6adc8', textAlign: 'center', padding: '24px 0' };
const error_style: React.CSSProperties = { color: '#f38ba8', textAlign: 'center', padding: '24px 0' };