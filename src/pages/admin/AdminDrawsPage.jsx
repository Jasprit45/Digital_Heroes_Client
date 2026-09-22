import React, { useState } from 'react';
import api from '../../services/api';
import { Trophy, Play, CheckCircle2, AlertCircle, Sparkles, Send, Shield } from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const AdminDrawsPage = () => {
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [generationType, setGenerationType] = useState('RANDOM');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Publish Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!month) {
      setError('Please select a target draw month.');
      return;
    }

    try {
      setSimulating(true);
      setError(null);
      setSimulationResult(null);

      const payload = {
        month,
        draw_month: month,
        type: generationType,
        algorithm: generationType
      };

      const res = await api.post('/admin/draws/simulate', payload);
      const data = res.data?.data || res.data?.simulation || res.data || {};
      setSimulationResult(data);
      showToast('Draw simulation computed successfully!', 'success');
    } catch (err) {
      console.error('Draw simulation error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to generate draw simulation.';
      setError(msg);
    } finally {
      setSimulating(false);
    }
  };

  const handlePublishDraw = async () => {
    if (!simulationResult) return;

    try {
      setPublishing(true);
      const drawId = simulationResult.id || simulationResult.draw_id || simulationResult._id;

      await api.post(`/admin/draws/${drawId}/publish`);

      showToast('Draw published officially!', 'success');
      setSimulationResult({
        ...simulationResult,
        status: 'PUBLISHED',
        is_published: true
      });
      setShowPublishModal(false);
    } catch (err) {
      console.error('Publish error:', err);
      showToast('Failed to publish draw', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="admin-draws-page">
      <div className="page-header">
        <h1 className="page-title">Monthly Draw Management</h1>
        <p className="page-subtitle">Simulate algorithmically generated winning numbers and publish official monthly draw results.</p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Simulation Trigger Form */}
      <div className="card" style={{ maxWidth: '700px', marginBottom: '2.5rem', padding: '2rem' }}>
        <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Play size={20} color="var(--primary)" /> Generate Draw Simulation
        </h3>

        <form onSubmit={handleSimulate}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Draw Month (YYYY-MM)</label>
              <input
                type="month"
                className="input"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Generation Algorithm</label>
              <select
                className="select"
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value)}
              >
                <option value="RANDOM">RANDOM (Cryptographic RNG)</option>
                <option value="ALGORITHMIC">ALGORITHMIC (Score Distribution)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={simulating}>
              {simulating ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px' }} />
                  Computing Simulation...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run Draw Simulation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Simulation Results View */}
      {simulationResult && (
        <div className="card" style={{ maxWidth: '850px', padding: '2.5rem', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className={`badge ${simulationResult.status === 'PUBLISHED' || simulationResult.is_published ? 'badge-success' : 'badge-warning'}`} style={{ marginBottom: '0.5rem' }}>
                {simulationResult.status === 'PUBLISHED' || simulationResult.is_published ? 'OFFICIALLY PUBLISHED' : 'SIMULATED (Draft)'}
              </span>
              <h2 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>
                Draw Results for {simulationResult.month || simulationResult.draw_month || month}
              </h2>
            </div>

            {(!simulationResult.is_published && simulationResult.status !== 'PUBLISHED') && (
              <button onClick={() => setShowPublishModal(true)} className="btn btn-primary btn-lg">
                <Send size={18} /> Publish Draw Results
              </button>
            )}
          </div>

          {/* Winning Numbers */}
          <div style={{ textAlign: 'center', margin: '2rem 0', padding: '2rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Simulated Winning Numbers
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(simulationResult.winning_numbers || simulationResult.numbers || [7, 14, 22, 31, 40]).map((num, i) => (
                <div key={i} style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: '#fff', fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Financial & Winner Metrics Breakdown */}
          <div className="grid-3">
            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Subscribers</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{simulationResult.active_subscribers ?? 0}</div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gross Pool Amount</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>${(simulationResult.gross_pool ?? 0).toFixed(2)}</div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Previous Rollover</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--warning)' }}>${(simulationResult.previous_rollover ?? 0).toFixed(2)}</div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Match 5 Pool</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>${(simulationResult.match_5_pool ?? 0).toFixed(2)}</div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Match 4 Pool</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>${(simulationResult.match_4_pool ?? 0).toFixed(2)}</div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Match 3 Pool</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>${(simulationResult.match_3_pool ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal before publishing */}
      <ConfirmModal
        isOpen={showPublishModal}
        title="Publish Official Draw?"
        message={`Are you sure you want to publish the draw results for ${simulationResult?.month || month}? Once published, winners will be notified and payout claims will unlock.`}
        confirmText="Publish Draw Now"
        isDanger={false}
        loading={publishing}
        onConfirm={handlePublishDraw}
        onCancel={() => setShowPublishModal(false)}
      />
    </div>
  );
};
