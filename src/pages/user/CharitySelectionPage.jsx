import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Heart, CheckCircle2, AlertCircle, Save, Sparkles } from 'lucide-react';

export const CharitySelectionPage = () => {
  const { user, refreshUserData } = useAuth();
  const [charities, setCharities] = useState([]);
  const [selectedCharityId, setSelectedCharityId] = useState(user?.selected_charity_id || '');
  const [percentage, setPercentage] = useState(user?.charity_percentage || 10);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        const res = await api.get('/public/charities');
        const list = res.data?.data || res.data?.charities || res.data || [];
        setCharities(Array.isArray(list) ? list : []);
        if (!selectedCharityId && list.length > 0) {
          setSelectedCharityId(list[0].id || list[0].slug);
        }
      } catch (err) {
        console.error('Failed to load charities:', err);
        setError('Failed to fetch available partner charities.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedCharityId) {
      setError('Please select a charity.');
      return;
    }
    const percVal = parseInt(percentage, 10);
    if (isNaN(percVal) || percVal < 10) {
      setError('Minimum charity contribution percentage is 10%.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = {
        charity_id: selectedCharityId,
        charityId: selectedCharityId,
        selected_charity_id: selectedCharityId,
        charity_percentage: percVal,
        percentage: percVal
      };

      await api.patch('/user/subscription/charity', payload);
      await refreshUserData();

      setSuccess('Charity selection and contribution percentage updated successfully!');
    } catch (err) {
      console.error('Failed to update charity selection:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update charity preference.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="charity-selection-page">
      <div className="page-header">
        <h1 className="page-title">Manage Charity Selection</h1>
        <p className="page-subtitle">Select which partner non-profit receives your monthly subscription allocation.</p>
      </div>

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Percentage Selector */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="var(--primary)" fill="currentColor" /> Contribution Allocation
          </h3>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label">Selected Percentage</label>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{percentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', height: '8px' }}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Backend policy requires a minimum of 10%. Higher percentages mean greater direct impact for your chosen cause.
            </p>
          </div>
        </div>

        {/* Charity Card Grid */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>Choose Partner Charity</h3>

        {loading ? (
          <div className="grid-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '200px' }} />)}
          </div>
        ) : (
          <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
            {charities.map((charity) => {
              const cid = charity.id || charity.slug;
              const isSelected = selectedCharityId === cid;
              return (
                <div
                  key={cid}
                  className={`card ${isSelected ? 'card-hover' : ''}`}
                  style={{
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                    background: isSelected ? 'linear-gradient(135deg, var(--surface) 0%, rgba(16, 185, 129, 0.12) 100%)' : 'var(--surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => setSelectedCharityId(cid)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {charity.logo_url || charity.logo ? (
                        <img src={charity.logo_url || charity.logo} alt={charity.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Heart size={20} color="var(--primary)" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="selected_charity"
                      checked={isSelected}
                      onChange={() => setSelectedCharityId(cid)}
                    />
                  </div>

                  <h4 style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{charity.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1, lineHeight: '1.5' }}>
                    {charity.description ? charity.description.substring(0, 100) + '...' : 'Verified partner charity.'}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px' }} />
                Updating Selection...
              </>
            ) : (
              <>
                <Save size={18} /> Save Charity Selection
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
