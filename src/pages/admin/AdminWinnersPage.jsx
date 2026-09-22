import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Award, CheckCircle2, XCircle, DollarSign, FileText, ExternalLink, AlertCircle, Filter } from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const AdminWinnersPage = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');

  // Proof Viewer Modal State
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Payout Confirmation Modal State
  const [payoutWinner, setPayoutWinner] = useState(null);
  const [payingOut, setPayingOut] = useState(false);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/winners');
      const list = res.data?.data || res.data?.winners || res.data || [];
      setWinners(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load winners:', err);
      setError('Unable to fetch winners directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleVerifyProof = async (action) => {
    if (!selectedWinner) return;

    if (action === 'REJECT' && !rejectReason) {
      showToast('Please provide a reason for rejecting the proof.', 'error');
      return;
    }

    try {
      setVerifying(true);
      const wid = selectedWinner.id || selectedWinner._id;

      const payload = {
        action,
        rejection_reason: action === 'REJECT' ? rejectReason : undefined
      };

      await api.patch(`/admin/winners/${wid}/verify`, payload);

      showToast(`Proof ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully`, 'success');
      setSelectedWinner(null);
      setRejectReason('');
      fetchWinners();
    } catch (err) {
      console.error('Verification error:', err);
      showToast('Failed to update proof status', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmPayout = async () => {
    if (!payoutWinner) return;

    try {
      setPayingOut(true);
      const wid = payoutWinner.id || payoutWinner._id;

      await api.patch(`/admin/winners/${wid}/payout`);

      showToast('Payout status marked as PAID!', 'success');
      setPayoutWinner(null);
      fetchWinners();
    } catch (err) {
      console.error('Payout error:', err);
      showToast('Failed to mark payout as paid', 'error');
    } finally {
      setPayingOut(false);
    }
  };

  const filteredWinners = winners.filter(w => {
    const s = (w.proof_status || w.status || '').toUpperCase();
    const t = (w.tier || `MATCH_${w.matched_count}`).toUpperCase();

    const matchesStatus = statusFilter === 'ALL' || s.includes(statusFilter);
    const matchesTier = tierFilter === 'ALL' || t.includes(tierFilter);

    return matchesStatus && matchesTier;
  });

  const getBadgeClass = (statusStr) => {
    const s = (statusStr || '').toUpperCase();
    if (s.includes('PAID') || s.includes('VERIFIED') || s.includes('APPROVE')) return 'badge-success';
    if (s.includes('REJECT')) return 'badge-danger';
    return 'badge-warning';
  };

  return (
    <div className="admin-winners-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Winners & Payout Audit</h1>
          <p className="page-subtitle">Verify scorecard proof files and authorize prize payouts.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '200px' }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter Status</label>
          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="PENDING_PROOF">PENDING_PROOF</option>
            <option value="PROOF_SUBMITTED">PROOF_SUBMITTED</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PAID">PAID</option>
          </select>
        </div>

        <div style={{ width: '200px' }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter Prize Tier</label>
          <select className="select" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
            <option value="ALL">All Tiers</option>
            <option value="5">MATCH 5</option>
            <option value="4">MATCH 4</option>
            <option value="3">MATCH 3</option>
          </select>
        </div>
      </div>

      {/* Winners Directory */}
      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '55px' }} />)}
          </div>
        ) : filteredWinners.length === 0 ? (
          <div className="empty-state">
            <Award className="empty-state-icon" />
            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>No Winning Records Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem' }}>Winner / User</th>
                  <th style={{ padding: '1rem' }}>Draw Month</th>
                  <th style={{ padding: '1rem' }}>Tier & Matches</th>
                  <th style={{ padding: '1rem' }}>Prize Amount</th>
                  <th style={{ padding: '1rem' }}>Verification Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWinners.map((w, i) => {
                  const wid = w.id || w._id || i;
                  const status = w.proof_status || w.status || 'PENDING_PROOF';
                  const isVerified = status === 'VERIFIED' || status === 'APPROVED';
                  const isPaid = status === 'PAID';

                  return (
                    <tr key={wid} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{w.user_name || w.user?.name || w.user_email || 'Winner'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.user_email || w.user?.email}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#fff', fontWeight: 600 }}>
                        {w.draw_month || w.month || 'Draw'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-primary">{w.tier || `MATCH ${w.matched_count}`}</span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ${parseFloat(w.prize_amount || w.amount || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${getBadgeClass(status)}`}>{status}</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          {(w.proof_url || w.file_url) && (
                            <button onClick={() => setSelectedWinner(w)} className="btn btn-secondary btn-sm">
                              <FileText size={14} /> Review Proof
                            </button>
                          )}
                          {!isPaid && isVerified && (
                            <button onClick={() => setPayoutWinner(w)} className="btn btn-primary btn-sm">
                              <DollarSign size={14} /> Process Payout
                            </button>
                          )}
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

      {/* Proof Audit Modal */}
      {selectedWinner && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Audit Scorecard Proof</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Review the scorecard file uploaded for {selectedWinner.draw_month || 'Draw'}.
            </p>

            {/* Proof Link */}
            <div style={{ padding: '1rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <a
                href={selectedWinner.proof_url || selectedWinner.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ExternalLink size={16} /> Open Uploaded Proof File
              </a>
            </div>

            <div className="form-group">
              <label className="form-label">Rejection Reason (Required if rejecting)</label>
              <textarea
                className="textarea"
                rows={2}
                placeholder="State why the proof file is invalid..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setSelectedWinner(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyProof('REJECT')}
                className="btn btn-danger"
                disabled={verifying}
              >
                Reject Proof
              </button>
              <button
                type="button"
                onClick={() => handleVerifyProof('APPROVE')}
                className="btn btn-primary"
                disabled={verifying}
              >
                Approve & Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Confirmation Modal */}
      <ConfirmModal
        isOpen={!!payoutWinner}
        title="Authorize Prize Payout?"
        message={`Confirm payout of $${(payoutWinner?.prize_amount || payoutWinner?.amount || 0).toFixed(2)} to ${payoutWinner?.user_name || payoutWinner?.user_email}?`}
        confirmText="Confirm Payout"
        isDanger={false}
        loading={payingOut}
        onConfirm={handleConfirmPayout}
        onCancel={() => setPayoutWinner(null)}
      />
    </div>
  );
};
