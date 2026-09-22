import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, CreditCard, DollarSign, Heart, Trophy, Award, RotateCcw, BarChart3, AlertCircle } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/admin/analytics');
        const data = res.data?.data || res.data?.analytics || res.data || {};
        setMetrics(data);
      } catch (err) {
        console.error('Failed to fetch admin analytics:', err);
        setError('Failed to load admin metrics. Verify backend authorization.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cards = [
    { label: 'Total Users', value: metrics?.total_users ?? metrics?.totalUsers ?? 0, icon: Users, color: 'var(--accent)' },
    { label: 'Active Subscribers', value: metrics?.active_subscribers ?? metrics?.activeSubscribers ?? 0, icon: CreditCard, color: 'var(--primary)' },
    { label: 'Total Prize Pool', value: `$${(metrics?.total_prize_pool ?? metrics?.prizePool ?? 0).toFixed(2)}`, icon: DollarSign, color: 'var(--warning)' },
    { label: 'Charity Contributions', value: `$${(metrics?.charity_contributions ?? metrics?.charityTotal ?? 0).toFixed(2)}`, icon: Heart, color: 'var(--danger)' },
    { label: 'Total Winners', value: metrics?.total_winners ?? metrics?.totalWinners ?? 0, icon: Trophy, color: 'var(--primary)' },
    { label: 'Paid Winnings', value: `$${(metrics?.paid_winnings ?? metrics?.paidWinnings ?? 0).toFixed(2)}`, icon: Award, color: 'var(--success)' },
    { label: 'Published Draws', value: metrics?.published_draws ?? metrics?.publishedDraws ?? 0, icon: BarChart3, color: 'var(--accent)' },
    { label: 'Rollover Balance', value: `$${(metrics?.rollover ?? metrics?.rolloverAmount ?? 0).toFixed(2)}`, icon: RotateCcw, color: 'var(--warning)' }
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview & live system metrics.</p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="skeleton" style={{ height: '130px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : (
        <div className="grid-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="card card-hover" style={{ padding: '1.75rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{card.label}</span>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--surface-secondary)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color
                  }}>
                    <Icon size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
