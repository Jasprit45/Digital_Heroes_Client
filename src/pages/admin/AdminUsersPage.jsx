import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Search, Filter, ExternalLink, Shield, AlertCircle } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/admin/users');
        const list = res.data?.data || res.data?.users || res.data || [];
        setUsers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to fetch user directory.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      (u.name || u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const isSub = u.is_subscriber || u.subscription_status === 'active';
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'SUBSCRIBER' && isSub) ||
      (statusFilter === 'FREE' && !isSub);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-users-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">View and manage registered accounts and subscription statuses.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBSCRIBER">Subscribers Only</option>
            <option value="FREE">Free / Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '50px' }} />)}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>No Users Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try changing your search terms or filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Subscription</th>
                  <th style={{ padding: '1rem' }}>Joined Date</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => {
                  const isSub = u.is_subscriber || u.subscription_status === 'active';
                  const uid = u.id || u._id || i;
                  return (
                    <tr key={uid} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{u.name || u.fullName || 'User'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : 'badge-secondary'}`}>
                          {u.role || 'USER'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${isSub ? 'badge-success' : 'badge-warning'}`}>
                          {isSub ? 'Active Subscriber' : 'Free User'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <Link to={`/admin/users/${uid}`} className="btn btn-secondary btn-sm">
                          View Details <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
