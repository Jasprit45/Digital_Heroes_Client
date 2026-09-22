import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, Heart, ExternalLink, Sparkles } from 'lucide-react';

export const CharityDirectoryPage = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/public/charities');
        const data = res.data?.data || res.data?.charities || res.data;
        setCharities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load charities:', err);
        setError('Unable to load partner charities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  const filteredCharities = charities.filter(c =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Partner Charity Directory</h1>
        <p className="page-subtitle">
          Discover verified non-profit partners supported by Digital Heroes subscribers. Every subscription contributes directly to these life-changing causes.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '500px', margin: '0 auto 3rem auto', position: 'relative' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="input"
          placeholder="Search charities by name or cause..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.75rem', height: '50px' }}
        />
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card" style={{ height: '240px' }}>
              <div className="skeleton" style={{ height: '40px', width: '40px', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '60px', width: '100%' }} />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCharities.length === 0 && (
        <div className="empty-state">
          <Heart className="empty-state-icon" />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Charities Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query to find partner organizations.</p>
        </div>
      )}

      {/* Charity Cards Grid */}
      {!loading && !error && filteredCharities.length > 0 && (
        <div className="grid-3">
          {filteredCharities.map((charity) => (
            <div key={charity.id || charity.slug} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {charity.logo_url || charity.logo ? (
                    <img src={charity.logo_url || charity.logo} alt={charity.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Heart size={24} color="var(--primary)" />
                  )}
                </div>
                {(charity.is_featured || charity.featured) && (
                  <span className="badge badge-primary">
                    <Sparkles size={12} /> Featured
                  </span>
                )}
              </div>

              <h3 className="card-title">{charity.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
                {charity.description ? (charity.description.length > 120 ? charity.description.substring(0, 120) + '...' : charity.description) : 'Empowering communities through direct impact programs.'}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                <Link to={`/charities/${charity.slug || charity.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  View Profile <ExternalLink size={14} />
                </Link>
                <Link to={`/donate?charity=${charity.id}`} className="btn btn-primary btn-sm">
                  Donate
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
