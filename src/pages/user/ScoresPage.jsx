import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Target, Plus, Edit2, Trash2, Calendar, AlertCircle, CheckCircle2, X } from 'lucide-react';

export const ScoresPage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [scoreValue, setScoreValue] = useState('');
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0]);
  const [modalError, setModalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchScores = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/user/scores');
      const list = res.data?.data || res.data?.scores || res.data || [];
      setScores(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError('Unable to load your scores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const openAddModal = () => {
    setEditingScore(null);
    setScoreValue('');
    setPlayedAt(new Date().toISOString().split('T')[0]);
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (sc) => {
    setEditingScore(sc);
    setScoreValue(sc.score_value || sc.score || '');
    const d = sc.played_at || sc.date;
    setPlayedAt(d ? new Date(d).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setModalError(null);
    setShowModal(true);
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    setModalError(null);

    const scoreNum = parseInt(scoreValue, 10);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setModalError('Score must be a valid integer between 1 and 45.');
      return;
    }

    if (!playedAt) {
      setModalError('Please select a valid date.');
      return;
    }

    const selectedDate = new Date(playedAt);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      setModalError('Future dates are not permitted.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        score_value: scoreNum,
        score: scoreNum,
        played_at: playedAt,
        date: playedAt
      };

      if (editingScore) {
        const id = editingScore.id || editingScore._id;
        await api.put(`/user/scores/${id}`, payload);
        setSuccessMsg('Score updated successfully!');
      } else {
        await api.post('/user/scores', payload);
        setSuccessMsg('Score added successfully!');
      }

      setShowModal(false);
      fetchScores();
    } catch (err) {
      console.error('Error saving score:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to save score.';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScore = async (id) => {
    if (!window.confirm('Are you sure you want to delete this score entry?')) return;

    try {
      setLoading(true);
      await api.delete(`/user/scores/${id}`);
      setSuccessMsg('Score entry removed.');
      fetchScores();
    } catch (err) {
      console.error('Failed to delete score:', err);
      setError('Failed to delete score entry.');
      setLoading(false);
    }
  };

  return (
    <div className="scores-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Golf Scores History</h1>
          <p className="page-subtitle">Track and manage your latest 5 score submissions for monthly draws.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Add Score Entry
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Scores Table / Card List */}
      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '50px' }} />)}
          </div>
        ) : scores.length === 0 ? (
          <div className="empty-state">
            <Target className="empty-state-icon" />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Scores Recorded</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Submit your verified 18-hole golf scores to participate in draw matching.</p>
            <button onClick={openAddModal} className="btn btn-primary">Add First Score</button>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem' }}>Date Played</th>
                  <th style={{ padding: '1rem' }}>Score Value</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((sc, i) => {
                  const id = sc.id || sc._id || i;
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', color: '#fff', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} color="var(--primary)" />
                          {new Date(sc.played_at || sc.date || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {sc.score_value || sc.score}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-success">Recorded</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button onClick={() => openEditModal(sc)} className="btn btn-secondary btn-sm" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteScore(id)} className="btn btn-danger btn-sm" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Score Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                {editingScore ? 'Edit Score Entry' : 'Add New Golf Score'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveScore}>
              <div className="form-group">
                <label className="form-label">Score Value (1–45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  className="input"
                  placeholder="e.g. 18"
                  value={scoreValue}
                  onChange={(e) => setScoreValue(e.target.value)}
                  required
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Must be an integer between 1 and 45.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Date Played</label>
                <input
                  type="date"
                  className="input"
                  max={new Date().toISOString().split('T')[0]}
                  value={playedAt}
                  onChange={(e) => setPlayedAt(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
