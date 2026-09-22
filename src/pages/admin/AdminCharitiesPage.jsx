import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Heart, Plus, Edit2, Trash2, Sparkles, AlertCircle, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const AdminCharitiesPage = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Create / Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    banner_url: '',
    is_featured: false
  });
  const [modalError, setModalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation state
  const [deletingCharity, setDeletingCharity] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/charities').catch(() => api.get('/public/charities'));
      const list = res.data?.data || res.data?.charities || res.data || [];
      setCharities(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load charities:', err);
      setError('Unable to load charities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const openAddModal = () => {
    setEditingCharity(null);
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      banner_url: '',
      is_featured: false
    });
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setEditingCharity(c);
    setFormData({
      name: c.name || '',
      description: c.description || '',
      logo_url: c.logo_url || c.logo || '',
      banner_url: c.banner_url || c.banner || '',
      is_featured: c.is_featured || c.featured || false
    });
    setModalError(null);
    setShowModal(true);
  };

  const handleSaveCharity = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setModalError('Charity name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setModalError(null);

      if (editingCharity) {
        const id = editingCharity.id || editingCharity._id;
        await api.put(`/admin/charities/${id}`, formData);
        showToast('Charity updated successfully', 'success');
      } else {
        await api.post('/admin/charities', formData);
        showToast('Charity created successfully', 'success');
      }

      setShowModal(false);
      fetchCharities();
    } catch (err) {
      console.error('Failed to save charity:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to save charity.';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCharity) return;

    try {
      setDeleting(true);
      const id = deletingCharity.id || deletingCharity._id;
      await api.delete(`/admin/charities/${id}`);
      showToast('Charity removed successfully', 'success');
      setDeletingCharity(null);
      fetchCharities();
    } catch (err) {
      console.error('Failed to delete charity:', err);
      showToast('Failed to delete charity', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-charities-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Charities Management</h1>
          <p className="page-subtitle">Manage partner non-profit organizations and spotlight campaigns.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Add New Charity
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="grid-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '180px' }} />)}
          </div>
        ) : charities.length === 0 ? (
          <div className="empty-state">
            <Heart className="empty-state-icon" />
            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>No Charities Registered</h3>
            <p style={{ color: 'var(--text-muted)' }}>Click "Add New Charity" to create your first non-profit partner.</p>
          </div>
        ) : (
          <div className="grid-3">
            {charities.map((c, i) => {
              const cid = c.id || c._id || i;
              return (
                <div key={cid} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--surface-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {c.logo_url || c.logo ? (
                        <img src={c.logo_url || c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Heart size={20} color="var(--danger)" />
                      )}
                    </div>
                    {(c.is_featured || c.featured) && (
                      <span className="badge badge-primary"><Sparkles size={12} /> Featured</span>
                    )}
                  </div>

                  <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{c.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1, lineHeight: '1.5', marginBottom: '1.25rem' }}>
                    {c.description ? (c.description.length > 90 ? c.description.substring(0, 90) + '...' : c.description) : 'No description provided.'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button onClick={() => openEditModal(c)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => setDeletingCharity(c)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="card-title" style={{ margin: 0 }}>
                {editingCharity ? 'Edit Charity' : 'Add New Charity'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCharity}>
              <div className="form-group">
                <label className="form-label">Charity Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Organization Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Brief mission summary..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Logo URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://example.com/banner.jpg"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <label htmlFor="is_featured" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                  Spotlight as Featured Charity on Home Page
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Charity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingCharity}
        title="Delete Charity Partner?"
        message={`Are you sure you want to remove "${deletingCharity?.name}"? This operation cannot be undone.`}
        confirmText="Delete Charity"
        isDanger={true}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCharity(null)}
      />
    </div>
  );
};
