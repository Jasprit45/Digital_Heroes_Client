import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  CreditCard,
  Target,
  Heart,
  Trophy,
  Award,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, refreshUserData } = useAuth();
  const [scores, setScores] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await refreshUserData();

        // Fetch scores
        const scoresRes = await api.get('/user/scores').catch(() => null);
        const scoresList = scoresRes?.data?.data || scoresRes?.data?.scores || scoresRes?.data || [];
        setScores(Array.isArray(scoresList) ? scoresList.slice(0, 5) : []);

        // Fetch winnings
        const winningsRes = await api.get('/user/winnings').catch(() => null);
        const winningsList = winningsRes?.data?.data || winningsRes?.data?.winnings || winningsRes?.data || [];
        setWinnings(Array.isArray(winningsList) ? winningsList : []);

        // Fetch latest public draw
        const drawRes = await api.get('/public/draws/published/latest').catch(() => null);
        setLatestDraw(drawRes?.data?.data || drawRes?.data?.draw || drawRes?.data || null);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalWon = winnings.reduce((acc, curr) => acc + (parseFloat(curr.prize_amount || curr.amount || 0)), 0);
  const subscriptionActive = user?.is_subscriber || user?.subscription_status === 'active';

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Subscriber Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name || user?.fullName || 'Hero'}!</p>
        </div>
        <Link to="/scores" className="btn btn-primary">
          <Plus size={18} /> Add New Score
        </Link>
      </div>

      {/* Grid of Key Overview Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Subscription Status Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <CreditCard size={20} />
            </div>
            <span className={`badge ${subscriptionActive ? 'badge-success' : 'badge-warning'}`}>
              {subscriptionActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Subscription Plan</h3>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.25rem 0 0.5rem 0' }}>
            {user?.subscription_plan || (subscriptionActive ? 'Monthly Subscriber' : 'No Active Plan')}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {user?.renewal_date ? `Renews on ${new Date(user.renewal_date).toLocaleDateString()}` : 'Subscribe to join monthly draws'}
          </p>
          <Link to="/subscription" className="btn btn-secondary btn-sm btn-full">
            Manage Subscription <ArrowRight size={14} />
          </Link>
        </div>

        {/* Selected Charity Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <Heart size={20} fill="currentColor" />
            </div>
            <span className="badge badge-primary">
              {user?.charity_percentage || 10}% Share
            </span>
          </div>
          <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Selected Charity</h3>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0.25rem 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.charity_name || user?.selected_charity?.name || 'Partner Charity'}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Direct monthly contribution allocated from your subscription.
          </p>
          <Link to="/charity" className="btn btn-secondary btn-sm btn-full">
            Change Charity <ArrowRight size={14} />
          </Link>
        </div>

        {/* Winnings Summary Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
              <Award size={20} />
            </div>
            <span className="badge badge-warning">
              {winnings.length} Claim(s)
            </span>
          </div>
          <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Total Winnings</h3>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0 0.5rem 0' }}>
            ${totalWon.toFixed(2)}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {winnings.filter(w => w.status === 'PENDING_PROOF').length} record(s) pending score proof
          </p>
          <Link to="/winnings" className="btn btn-secondary btn-sm btn-full">
            View Winnings & Upload Proof <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Grid for Scores & Draw Participation */}
      <div className="grid-2">
        {/* Latest Scores Table Widget */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--primary)" /> Latest 5 Golf Scores
            </h3>
            <Link to="/scores" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>View All</Link>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: '120px' }} />
          ) : scores.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>No scores entered yet.</p>
              <Link to="/scores" className="btn btn-primary btn-sm">Add First Score</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {scores.map((sc, i) => (
                <div key={sc.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>Score: {sc.score_value || sc.score}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(sc.played_at || sc.date || Date.now()).toLocaleDateString()}</div>
                  </div>
                  <span className="badge badge-primary">Validated</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Draw Participation Widget */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={18} color="var(--accent)" /> Active Draw Status
            </h3>
            <Link to="/draws" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>History</Link>
          </div>

          {latestDraw ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
                {latestDraw.month || latestDraw.draw_date || 'Current Draw'}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Official Published Winning Numbers:
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {(latestDraw.winning_numbers || latestDraw.numbers || [7, 14, 22, 31, 40]).map((n, idx) => (
                  <div key={idx} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {n}
                  </div>
                ))}
              </div>
              <Link to="/draws" className="btn btn-outline btn-sm">
                Check My Matches
              </Link>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No published draw for the current period yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
