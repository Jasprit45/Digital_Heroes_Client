import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Heart, Calendar, ArrowLeft, ExternalLink, Sparkles, CheckCircle } from 'lucide-react';

export const CharityDetailPage = () => {
  const { slug } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharityDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/public/charities/${slug}`);
        const data = res.data?.data || res.data?.charity || res.data;
        setCharity(data);
      } catch (err) {
        console.error('Failed to load charity detail:', err);
        setError('Charity details could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharityDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '40px', height: '40px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading charity details...</p>
      </div>
    );
  }

  if (error || !charity) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 className="card-title" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Charity Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error || 'The requested charity profile does not exist.'}</p>
          <Link to="/charities" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="charity-detail-page">
      {/* Banner */}
      <div style={{
        height: '240px',
        background: charity.banner_url || charity.banner ? `url(${charity.banner_url || charity.banner}) center/cover` : 'linear-gradient(135deg, var(--surface-secondary) 0%, var(--surface) 100%)',
        position: 'relative',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 15, 25, 0.6)' }} />
      </div>

      <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10, paddingBottom: '4rem' }}>
        {/* Back Link */}
        <Link to="/charities" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600, marginBottom: '1.5rem', background: 'rgba(19, 27, 46, 0.8)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={16} /> Back to All Charities
        </Link>

        {/* Profile Card Header */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius)',
                background: 'var(--surface-secondary)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)'
              }}>
                {charity.logo_url || charity.logo ? (
                  <img src={charity.logo_url || charity.logo} alt={charity.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Heart size={36} color="var(--primary)" />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{charity.name}</h1>
                  {(charity.is_featured || charity.featured) && (
                    <span className="badge badge-primary"><Sparkles size={12} /> Featured</span>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Verified Non-Profit Partner</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to={`/donate?charity=${charity.id}`} className="btn btn-secondary">
                Make Independent Donation
              </Link>
              <Link to="/subscription" className="btn btn-primary">
                Support via Subscription
              </Link>
            </div>
          </div>
        </div>

        {/* Detail Content Grid */}
        <div className="grid-3">
          <div style={{ gridColumn: 'span 2' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h2 className="card-title" style={{ marginBottom: '1rem' }}>About {charity.name}</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1rem', whitespace: 'pre-line' }}>
                {charity.description || 'This organization works diligently to transform lives through community-based initiatives, sustainability programs, and direct support.'}
              </p>
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Calendar size={20} color="var(--primary)" /> Upcoming Events & Milestones
              </h2>

              {charity.upcoming_events && charity.upcoming_events.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {charity.upcoming_events.map((evt, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>{evt.title || evt.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{evt.date || 'TBA'}</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{evt.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No public events scheduled currently. Check back soon!</p>
              )}
            </div>
          </div>

          <div>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Impact Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Digital Heroes Grant Status</div>
                  <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.1rem', marginTop: '0.25rem' }}>Active Beneficiary</div>
                </div>

                <div style={{ padding: '1rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Minimum Contribution</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginTop: '0.25rem' }}>10% of Plan</div>
                </div>

                <Link to="/subscription" className="btn btn-primary btn-full">
                  Choose This Charity <Heart size={16} fill="currentColor" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
