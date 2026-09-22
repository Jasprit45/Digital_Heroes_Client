import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, User, CreditCard, Heart, Target, Edit2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminUserDetailPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Score editing modal state
  const [editingScore, setEditingScore] = useState(null);
  const [newScoreVal, setNewScoreVal] = useState('');
  const [submittingScore, setSubmittingScore] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/users/${id}`);
      const data = res.data?.data || res.data?.user || res.data || {};
      setUserData(data);
    } catch (err) {
      console.error('Failed to fetch user detail:', err);
      setError('Could not fetch details for the requested user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const handleUpdateScore = async (e) => {
    e.preventDefault();
    const scoreNum = parseInt(newScoreVal, 10);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setModalError('Score value must be an integer between 1 and 45.');
      return;
    }

    try {
      setSubmittingScore(true);
      setModalError(null);

      const scoreId = editingScore.id || editingScore._id;
      await api.patch(`/admin/users/${id}/scores/${scoreId}`, {
        score_value: scoreNum,
        score: scoreNum
      });

      showToast('User score updated successfully', 'success');
      setEditingScore(null);
      fetchUserDetail();
    } catch (err) {
      console.error('Failed to patch user score:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update user score.';
      setModalError(msg);
    } finally {
      setSubmittingScore(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '40px', height: '40px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading user record...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          <span>{error || 'User not found.'}</span>
        </div>
        <Link to="/admin/users" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Users Directory
        </Link>
      </div>
    );
  }

  const scores = userData.scores || userData.recent_scores || [];
  const isSub = userData.is_subscriber || userData.subscription_status === 'active';

  return (
    <div className="admin-user-detail-page">
      <Link to="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Users List
      </Link>

      <div className="page-header">
        <h1 className="page-title">{userData.name || userData.fullName || 'User Profile'}</h1>
        <p className="page-subtitle">User ID: {id}</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Profile Details */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary)" /> Profile Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Email:</span>
              <div style={{ color: '#fff', fontWeight: 600 }}>{userData.email}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Role:</span>
              <div><span className="badge badge-primary">{userData.role || 'USER'}</span></div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Joined:</span>
              <div style={{ color: '#fff' }}>{userData.created_at ? new Date(userData.created_at).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="var(--accent)" /> Subscription Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <div>
                <span className={`badge ${isSub ? 'badge-success' : 'badge-warning'}`}>
                  {isSub ? 'Active Subscriber' : 'Inactive / Free'}
                </span>
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Plan:</span>
              <div style={{ color: '#fff', fontWeight: 600 }}>{userData.subscription_plan || 'N/A'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Renewal Date:</span>
              <div style={{ color: '#fff' }}>{userData.renewal_date ? new Date(userData.renewal_date).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Selected Charity */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={18} color="var(--danger)" fill="currentColor" /> Selected Charity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Charity Name:</span>
              <div style={{ color: '#fff', fontWeight: 600 }}>{userData.charity_name || 'None selected'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Contribution Share:</span>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>
                {userData.charity_percentage || 10}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Scores & Admin Score Patch */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={18} color="var(--primary)" /> Registered Golf Scores
        </h3>

        {scores.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No scores submitted for this user.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem' }}>Date Played</th>
                  <th style={{ padding: '0.75rem' }}>Score Value</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((sc, i) => {
                  const scId = sc.id || sc._id || i;
                  return (
                    <tr key={scId} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', color: '#fff' }}>
                        {new Date(sc.played_at || sc.date || Date.now()).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                        {sc.score_value || sc.score}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setEditingScore(sc);
                            setNewScoreVal(sc.score_value || sc.score);
                            setModalError(null);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit2 size={14} /> Edit Score
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Score Modal */}
      {editingScore && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Edit User Score</h3>
              <button onClick={() => setEditingScore(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateScore}>
              <div className="form-group">
                <label className="form-label">Score Value (1–45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  className="input"
                  value={newScoreVal}
                  onChange={(e) => setNewScoreVal(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingScore(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingScore}>
                  {submittingScore ? 'Saving...' : 'Update Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
