import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, CreditCard, Heart, Calendar } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const isSub = user?.is_subscriber || user?.subscription_status === 'active';

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">My Account Profile</h1>
        <p className="page-subtitle">Personal account details and active subscription summary.</p>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--primary)" /> Profile Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                {user?.name || user?.fullName || 'User'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '0.25rem' }}>
                {user?.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account Role</div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge ${user?.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                  {user?.role || 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="var(--accent)" /> Subscription Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subscription Status</div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge ${isSub ? 'badge-success' : 'badge-warning'}`}>
                  {isSub ? 'Active Subscriber' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Plan Type</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                {user?.subscription_plan || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selected Partner Charity</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {user?.charity_name || user?.selected_charity?.name || 'Default Partner'} ({user?.charity_percentage || 10}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
