import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, Upload, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';

export const WinningsPage = () => {
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upload Proof Modal State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchWinnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/user/winnings');
      const list = res.data?.data || res.data?.winnings || res.data || [];
      setWinnings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching winnings:', err);
      setError('Unable to fetch your winnings history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinnings();
  }, []);

  const openUploadModal = (rec) => {
    setSelectedRecord(rec);
    setProofFile(null);
    setModalError(null);
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      setModalError('Please select a file to upload (e.g., scorecard photo or PDF).');
      return;
    }

    try {
      setUploading(true);
      setModalError(null);

      const formData = new FormData();
      formData.append('proof', proofFile);
      formData.append('file', proofFile);

      const recordId = selectedRecord.id || selectedRecord._id;

      await api.post(`/user/winnings/${recordId}/proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg('Proof uploaded successfully! Admin verification pending.');
      setSelectedRecord(null);
      fetchWinnings();
    } catch (err) {
      console.error('Failed to upload proof:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to upload proof file.';
      setModalError(msg);
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status, proofStatus) => {
    const s = (proofStatus || status || '').toUpperCase();
    if (s.includes('VERIFIED') || s.includes('PAID')) {
      return <span className="badge badge-success">Verified & Paid</span>;
    }
    if (s.includes('PENDING') || s.includes('PROOF')) {
      return <span className="badge badge-warning">Pending Proof</span>;
    }
    return <span className="badge badge-primary">{s || 'Under Review'}</span>;
  };

  return (
    <div className="winnings-page">
      <div className="page-header">
        <h1 className="page-title">My Winnings & Payouts</h1>
        <p className="page-subtitle">Track your prize earnings, upload verified scorecards, and review payout status.</p>
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

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '60px' }} />)}
          </div>
        ) : winnings.length === 0 ? (
          <div className="empty-state">
            <Award className="empty-state-icon" />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Winning Records Yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>Keep logging your golf scores! When your numbers match monthly draw results, prizes will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem' }}>Draw Period</th>
                  <th style={{ padding: '1rem' }}>Prize Tier</th>
                  <th style={{ padding: '1rem' }}>Matches</th>
                  <th style={{ padding: '1rem' }}>Prize Amount</th>
                  <th style={{ padding: '1rem' }}>Verification & Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {winnings.map((w, i) => {
                  const isPendingProof = (w.proof_status || w.status) === 'PENDING_PROOF' || !w.proof_url;
                  return (
                    <tr key={w.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', color: '#fff', fontWeight: 600 }}>
                        {w.draw_month || w.draw_date || 'Monthly Draw'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-primary">{w.tier || `MATCH ${w.matched_count}`}</span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#fff' }}>
                        {w.matched_count} / 5
                      </td>
                      <td style={{ padding: '1rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ${parseFloat(w.prize_amount || w.amount || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {getStatusBadge(w.status, w.proof_status)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {isPendingProof ? (
                          <button onClick={() => openUploadModal(w)} className="btn btn-primary btn-sm">
                            <Upload size={14} /> Upload Proof
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Proof Uploaded</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Proof Modal */}
      {selectedRecord && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                Upload Scorecard Proof
              </h3>
              <button onClick={() => setSelectedRecord(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Upload an image or document proof of your golf scorecard for the draw period ({selectedRecord.draw_month || 'Monthly Draw'}).
            </p>

            {modalError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleUploadProof}>
              <div className="form-group">
                <label className="form-label">Select File (PNG, JPG, PDF)</label>
                <div style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'var(--surface-secondary)',
                  cursor: 'pointer'
                }}>
                  <FileText size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    style={{ width: '100%' }}
                    required
                  />
                  {proofFile && (
                    <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--primary)', fontSize: '0.85rem' }}>
                      Selected: {proofFile.name}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setSelectedRecord(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Submit Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
