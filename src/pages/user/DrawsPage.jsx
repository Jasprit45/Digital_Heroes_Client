import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trophy, Calendar, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const DrawsPage = () => {
  const [drawHistory, setDrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrawHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/user/draws/my-history');
        const list = res.data?.data || res.data?.history || res.data || [];
        setDrawHistory(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Error loading draw history:', err);
        setError('Failed to retrieve draw participation history.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrawHistory();
  }, []);

  return (
    <div className="draws-page">
      <div className="page-header">
        <h1 className="page-title">Monthly Draw History</h1>
        <p className="page-subtitle">View your monthly draw participation records and winning number matches.</p>
      </div>

      {/* Prize Tier Breakdown Component */}
      <div className="card" style={{ marginBottom: '3rem', padding: '2.5rem', background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-secondary) 100%)' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Platform Rules
          </span>
          <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Monthly Pool Allocation Tiers</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Prizes are calculated automatically by the server based on matched numbers.
          </p>
        </div>

        <div className="grid-3">
          {[
            { tier: 'MATCH 5', share: '40%', desc: 'Match 5 of 5 published draw numbers for top pool share.' },
            { tier: 'MATCH 4', share: '35%', desc: 'Match 4 of 5 numbers for secondary pool share.' },
            { tier: 'MATCH 3', share: '25%', desc: 'Match 3 of 5 numbers for guaranteed standard share.' }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>{item.tier}</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', margin: '0.5rem 0' }}>{item.share}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* History List */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>My Participation Records</h3>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '140px' }} />)}
        </div>
      ) : drawHistory.length === 0 ? (
        <div className="empty-state">
          <Trophy className="empty-state-icon" />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Draw History Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>You will be included in the next published monthly draw once active.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {drawHistory.map((item, i) => (
            <div key={item.id || i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                    {item.draw_month || item.month || 'Monthly Draw'}
                  </span>
                </div>
                <span className={`badge ${item.is_winner || item.matched_count >= 3 ? 'badge-success' : 'badge-secondary'}`}>
                  {item.is_winner || item.matched_count >= 3 ? `Winner (Matched ${item.matched_count})` : `No Match (${item.matched_count || 0} matched)`}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Winning Numbers</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(item.winning_numbers || item.numbers || []).map((n, idx) => (
                      <span key={idx} style={{ padding: '0.35rem 0.65rem', background: 'var(--surface-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Matched Numbers</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(item.matched_numbers || []).length > 0 ? (
                      item.matched_numbers.map((mn, idx) => (
                        <span key={idx} style={{ padding: '0.35rem 0.65rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {mn}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None matched</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
