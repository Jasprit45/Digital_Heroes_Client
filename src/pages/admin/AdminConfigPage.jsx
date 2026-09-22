import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Settings, Save, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminConfigPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const [poolPercentage, setPoolPercentage] = useState(50);
  const [match5Share, setMatch5Share] = useState(40);
  const [match4Share, setMatch4Share] = useState(35);
  const [match3Share, setMatch3Share] = useState(25);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/config/prize-pool');
      const data = res.data?.data || res.data?.config || res.data || {};
      setConfig(data);

      setPoolPercentage(data.pool_percentage ?? data.prizePoolPercentage ?? 50);
      setMatch5Share(data.match_5_percentage ?? data.match5 ?? 40);
      setMatch4Share(data.match_4_percentage ?? data.match4 ?? 35);
      setMatch3Share(data.match_3_percentage ?? data.match3 ?? 25);
    } catch (err) {
      console.error('Failed to load prize pool config:', err);
      setError('Failed to fetch prize pool configuration from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const totalSplit = (parseFloat(match5Share) || 0) + (parseFloat(match4Share) || 0) + (parseFloat(match3Share) || 0);
  const isValidTotal = Math.abs(totalSplit - 100) < 0.01;

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!isValidTotal) {
      setError(`Tier split percentages must total exactly 100%. Current total: ${totalSplit}%`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        pool_percentage: parseFloat(poolPercentage),
        match_5_percentage: parseFloat(match5Share),
        match_4_percentage: parseFloat(match4Share),
        match_3_percentage: parseFloat(match3Share),
        match5: parseFloat(match5Share),
        match4: parseFloat(match4Share),
        match3: parseFloat(match3Share)
      };

      await api.patch('/admin/config/prize-pool', payload);
      showToast('Prize pool configuration saved successfully', 'success');
      fetchConfig();
    } catch (err) {
      console.error('Failed to save config:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update prize pool configuration.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-config-page">
      <div className="page-header">
        <h1 className="page-title">Prize Pool Configuration</h1>
        <p className="page-subtitle">Configure pool percentages and tier allocation splits.</p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="skeleton" style={{ height: '300px', maxWidth: '650px' }} />
      ) : (
        <div className="card" style={{ maxWidth: '650px', padding: '2.5rem' }}>
          <form onSubmit={handleSaveConfig}>
            {/* Global Prize Pool Allocation */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Subscription Pool Allocation (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="input"
                value={poolPercentage}
                onChange={(e) => setPoolPercentage(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Percentage of net subscription revenue directed into monthly prize pools.
              </span>
            </div>

            <hr style={{ borderColor: 'var(--border)', margin: '2rem 0' }} />

            <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
              Prize Tier Breakdown Splits
            </h3>

            {/* Match 5 Share */}
            <div className="form-group">
              <label className="form-label">Match 5 Tier Share (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input"
                value={match5Share}
                onChange={(e) => setMatch5Share(e.target.value)}
                required
              />
            </div>

            {/* Match 4 Share */}
            <div className="form-group">
              <label className="form-label">Match 4 Tier Share (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input"
                value={match4Share}
                onChange={(e) => setMatch4Share(e.target.value)}
                required
              />
            </div>

            {/* Match 3 Share */}
            <div className="form-group">
              <label className="form-label">Match 3 Tier Share (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input"
                value={match3Share}
                onChange={(e) => setMatch3Share(e.target.value)}
                required
              />
            </div>

            {/* Total Validation Status Bar */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius)',
              background: isValidTotal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isValidTotal ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '1.5rem 0'
            }}>
              <span style={{ fontWeight: 600, color: isValidTotal ? 'var(--primary)' : 'var(--danger)' }}>
                Total Tier Split Sum:
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isValidTotal ? 'var(--primary)' : 'var(--danger)' }}>
                {totalSplit}% {isValidTotal ? '✓ Valid (100%)' : '✗ Must equal 100%'}
              </span>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting || !isValidTotal}
              >
                {submitting ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px' }} />
                    Saving Configuration...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Update Prize Pool Policy
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
