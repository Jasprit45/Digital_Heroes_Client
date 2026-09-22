import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BarChart3, Calendar, Filter, Users, CreditCard, DollarSign, Heart, Trophy, Award, AlertCircle } from 'lucide-react';

export const AdminAnalyticsPage = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async (fromVal = fromDate, toVal = toDate) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (fromVal) params.from = fromVal;
      if (toVal) params.to = toVal;

      const res = await api.get('/admin/analytics', { params });
      const data = res.data?.data || res.data?.analytics || res.data || {};
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics query error:', err);
      setError('Failed to fetch analytics metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAnalytics(fromDate, toDate);
  };

  return (
    <div className="admin-analytics-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Platform Analytics & Financial Reports</h1>
          <p className="page-subtitle">Deep dive into user growth, subscription totals, and charity impact distributions.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Date Range Filter Bar */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
            <Filter size={16} /> Filter Metrics
          </button>
        </form>
      </div>

      {/* Analytics Cards Grid */}
      {loading ? (
        <div className="grid-3">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ height: '140px' }} />)}
        </div>
      ) : (
        <div className="grid-3">
          <div className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Accounts Registered</span>
              <Users size={20} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              {analytics?.total_users ?? analytics?.totalUsers ?? 0}
            </div>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Subscribers</span>
              <CreditCard size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {analytics?.active_subscribers ?? analytics?.activeSubscribers ?? 0}
            </div>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gross Prize Pool</span>
              <DollarSign size={20} color="var(--warning)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>
              ${(analytics?.total_prize_pool ?? analytics?.prizePool ?? 0).toFixed(2)}
            </div>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Charity Disbursed</span>
              <Heart size={20} color="var(--danger)" fill="currentColor" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>
              ${(analytics?.charity_contributions ?? analytics?.charityTotal ?? 0).toFixed(2)}
            </div>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Draw Winner Count</span>
              <Trophy size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              {analytics?.total_winners ?? analytics?.totalWinners ?? 0}
            </div>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Disbursed Winner Payouts</span>
              <Award size={20} color="var(--success)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
              ${(analytics?.paid_winnings ?? analytics?.paidWinnings ?? 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
