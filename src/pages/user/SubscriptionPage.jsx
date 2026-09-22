import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { CreditCard, CheckCircle2, Shield, Heart, ArrowRight } from 'lucide-react';

export const SubscriptionPage = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState('MONTHLY');
  const [charities, setCharities] = useState([]);
  const [selectedCharityId, setSelectedCharityId] = useState('');
  const [charityPercentage, setCharityPercentage] = useState(10);
  const [loadingCharities, setLoadingCharities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoadingCharities(true);
        const res = await api.get('/public/charities');
        const list = res.data?.data || res.data?.charities || res.data || [];
        setCharities(Array.isArray(list) ? list : []);
        if (list.length > 0) {
          setSelectedCharityId(user?.selected_charity_id || list[0].id);
        }
      } catch (err) {
        console.error('Failed to load charities:', err);
      } finally {
        setLoadingCharities(false);
      }
    };

    fetchCharities();
  }, [user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedCharityId) {
      setError('Please select a charity for your subscription.');
      return;
    }
    if (charityPercentage < 10) {
      setError('Minimum charity contribution is 10%.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        plan,
        selected_charity_id: selectedCharityId,
        charity_percentage: parseInt(charityPercentage, 10)
      };

      const res = await api.post('/user/subscription/checkout-session', payload);

      const checkoutUrl = res.data?.url ||
                         res.data?.checkout_url ||
                         res.data?.stripe_url ||
                         res.data?.data?.url ||
                         res.data?.data?.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('Checkout session created, but no URL was returned by the backend.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Unable to initiate Stripe checkout session.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isActiveSubscriber = user?.is_subscriber || user?.subscription_status === 'active';

  return (
    <div className="subscription-page">
      <div className="page-header">
        <h1 className="page-title">Digital Heroes Subscription</h1>
        <p className="page-subtitle">Join the monthly draw and support impactful causes with every swing.</p>
      </div>

      {isActiveSubscriber && (
        <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
          <CheckCircle2 size={20} />
          <div>
            <strong>Active Subscriber Status</strong> — Your subscription is active.
            {user?.renewal_date && ` Renewal date: ${new Date(user.renewal_date).toLocaleDateString()}`}
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Plan Selection Cards */}
      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        {/* Monthly Plan Card */}
        <div
          className={`card ${plan === 'MONTHLY' ? 'card-hover' : ''}`}
          style={{
            borderColor: plan === 'MONTHLY' ? 'var(--primary)' : 'var(--border)',
            background: plan === 'MONTHLY' ? 'linear-gradient(135deg, var(--surface) 0%, rgba(16, 185, 129, 0.1) 100%)' : 'var(--surface)',
            cursor: 'pointer',
            padding: '2rem'
          }}
          onClick={() => setPlan('MONTHLY')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-primary">Monthly Plan</span>
            <input type="radio" name="plan" checked={plan === 'MONTHLY'} onChange={() => setPlan('MONTHLY')} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            $19.99 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ month</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Flexible monthly participation in all draw pools. Cancel anytime.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Entry into monthly cash draws</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Score tracking & history</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Flexible charity allocation</li>
          </ul>
        </div>

        {/* Yearly Plan Card */}
        <div
          className={`card ${plan === 'YEARLY' ? 'card-hover' : ''}`}
          style={{
            borderColor: plan === 'YEARLY' ? 'var(--primary)' : 'var(--border)',
            background: plan === 'YEARLY' ? 'linear-gradient(135deg, var(--surface) 0%, rgba(16, 185, 129, 0.1) 100%)' : 'var(--surface)',
            cursor: 'pointer',
            padding: '2rem'
          }}
          onClick={() => setPlan('YEARLY')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-success">Yearly Plan (Best Value)</span>
            <input type="radio" name="plan" checked={plan === 'YEARLY'} onChange={() => setPlan('YEARLY')} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            $199.99 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ year</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Save 2 months of subscription fees with an annual pass.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary)" /> 12 Full Months of Draw Entries</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Priority winner verification</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Maximized long-term charity impact</li>
          </ul>
        </div>
      </div>

      {/* Subscription Checkout Form */}
      <div className="card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={20} color="var(--primary)" /> Configure Charity & Checkout
        </h3>

        <form onSubmit={handleCheckout}>
          <div className="form-group">
            <label className="form-label">Select Partner Charity to Support</label>
            {loadingCharities ? (
              <div className="skeleton" style={{ height: '44px' }} />
            ) : (
              <select
                className="select"
                value={selectedCharityId}
                onChange={(e) => setSelectedCharityId(e.target.value)}
                required
              >
                {charities.map((c) => (
                  <option key={c.id || c.slug} value={c.id || c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Charity Contribution Percentage</label>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{charityPercentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={charityPercentage}
              onChange={(e) => setCharityPercentage(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Minimum required contribution is 10%. Increase anytime to deepen your impact!
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }} />
                  Preparing Stripe Checkout...
                </>
              ) : (
                <>
                  Proceed to Stripe Payment <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Shield size={14} color="var(--primary)" /> Secure redirection to Stripe hosted checkout page.
          </p>
        </form>
      </div>
    </div>
  );
};
