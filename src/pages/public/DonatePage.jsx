import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { Heart, DollarSign, Mail, Shield, ArrowRight } from 'lucide-react';

export const DonatePage = () => {
  const [searchParams] = useSearchParams();
  const initialCharityId = searchParams.get('charity') || '';

  const [charities, setCharities] = useState([]);
  const [selectedCharityId, setSelectedCharityId] = useState(initialCharityId);
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [loadingCharities, setLoadingCharities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoadingCharities(true);
        const res = await api.get('/public/charities');
        const list = res.data?.data || res.data?.charities || res.data;
        setCharities(Array.isArray(list) ? list : []);
        if (!initialCharityId && list?.length > 0) {
          setSelectedCharityId(list[0].id);
        }
      } catch (err) {
        console.error('Error loading charities:', err);
      } finally {
        setLoadingCharities(false);
      }
    };

    fetchCharities();
  }, [initialCharityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount);

    if (!selectedCharityId) {
      setError('Please select a charity.');
      return;
    }
    if (!email) {
      setError('Please provide your donor email address.');
      return;
    }
    if (isNaN(finalAmount) || finalAmount <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        charity_id: selectedCharityId,
        charityId: selectedCharityId,
        charity: selectedCharityId,
        donor_email: email,
        email: email,
        amount: finalAmount
      };

      const res = await api.post('/public/donations/independent', payload);

      const checkoutUrl = res.data?.url ||
                         res.data?.checkout_url ||
                         res.data?.stripe_url ||
                         res.data?.data?.url ||
                         res.data?.data?.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('Donation created successfully, but no redirect URL was returned by server.');
      }
    } catch (err) {
      console.error('Donation submission error:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to process donation session. Please try again.';
      setError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const presetAmounts = [10, 25, 50, 100];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
        <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
          <Heart size={14} fill="currentColor" /> Direct Giving
        </span>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Independent Donation</h1>
        <p className="page-subtitle">
          Support verified charities directly without an active platform subscription. 100% of independent donations go straight to partner projects.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
        {error && (
          <div className="alert alert-danger">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Select Charity */}
          <div className="form-group">
            <label className="form-label">Select Charity</label>
            {loadingCharities ? (
              <div className="skeleton" style={{ height: '44px', width: '100%' }} />
            ) : (
              <select
                className="select"
                value={selectedCharityId}
                onChange={(e) => setSelectedCharityId(e.target.value)}
                required
              >
                <option value="">-- Choose a Partner Charity --</option>
                {charities.map((c) => (
                  <option key={c.id || c.slug} value={c.id || c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Donor Email */}
          <div className="form-group">
            <label className="form-label">Your Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="input"
                placeholder="donor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="form-group">
            <label className="form-label">Donation Amount ($USD)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {presetAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  className={`btn ${amount === amt && !customAmount ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setAmount(amt);
                    setCustomAmount('');
                  }}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              <DollarSign size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="number"
                min="1"
                step="any"
                className="input"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div style={{ margin: '2rem 0 1rem 0' }}>
            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }} />
                  Connecting to Secure Checkout...
                </>
              ) : (
                <>
                  Proceed to Secure Checkout <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Shield size={14} color="var(--primary)" /> Payments encrypted & processed by Stripe
          </p>
        </form>
      </div>
    </div>
  );
};
