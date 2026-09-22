import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Shield, Heart, Trophy, Target, Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const HomePage = () => {
  const [latestDraw, setLatestDraw] = useState(null);
  const [loadingDraw, setLoadingDraw] = useState(true);
  const [drawError, setDrawError] = useState(null);

  useEffect(() => {
    const fetchLatestDraw = async () => {
      try {
        setLoadingDraw(true);
        const res = await api.get('/public/draws/published/latest');
        const drawData = res.data?.data || res.data?.draw || res.data;
        setLatestDraw(drawData);
      } catch (err) {
        console.error('Error fetching latest draw:', err);
        setDrawError('No published draw available yet.');
      } finally {
        setLoadingDraw(false);
      }
    };

    fetchLatestDraw();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{
        padding: '6rem 0 4rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
        position: 'relative'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem' }}>
            <Sparkles size={14} /> Redefining Sports Philanthropy
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Turn Every Golf Score Into <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real World Impact</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            marginBottom: '2.5rem',
            lineHeight: '1.7'
          }}>
            Digital Heroes connects your active performance on the course with meaningful charity support and transparent monthly cash draw prize pools.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/subscription" className="btn btn-primary btn-lg">
              Subscribe Now <ArrowRight size={18} />
            </Link>
            <Link to="/charities" className="btn btn-secondary btn-lg">
              Explore Charities
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 0', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
            <h2 className="page-title">How Digital Heroes Works</h2>
            <p className="page-subtitle">Four simple steps to win prizes while making a tangible social impact.</p>
          </div>

          <div className="grid-4">
            {[
              { num: '01', title: 'Subscribe', desc: 'Choose a monthly or yearly plan and allocate at least 10% to your favorite charity.', icon: Shield },
              { num: '02', title: 'Enter Golf Scores', desc: 'Log your verified 18-hole golf scores throughout the month.', icon: Target },
              { num: '03', title: 'Join Monthly Draw', desc: 'Your scores automatically generate verified entries for the monthly draw pool.', icon: Trophy },
              { num: '04', title: 'Support a Charity', desc: 'Direct contributions empower high-impact charities, backed by live tracking.', icon: Heart }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="card card-hover" style={{ background: 'var(--surface-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.15)' }}>{step.num}</span>
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.15rem' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prize Pool Breakdown Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Transparent Rewards</span>
            <h2 className="page-title">Monthly Prize Pool Distribution</h2>
            <p className="page-subtitle">Match your score numbers with official draw results to win cash prizes from the monthly pool.</p>
          </div>

          <div className="grid-3">
            {[
              { match: 'MATCH 5', share: '40%', desc: 'Match 5 numbers to claim the top prize tier of the active monthly pool.', badge: 'Top Tier' },
              { match: 'MATCH 4', share: '35%', desc: 'Match 4 numbers to claim the major secondary prize pool tier.', badge: 'Major Tier' },
              { match: 'MATCH 3', share: '25%', desc: 'Match 3 numbers to secure guaranteed payout share.', badge: 'Standard Tier' }
            ].map((tier, i) => (
              <div key={i} className="card card-hover" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>{tier.badge}</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{tier.match}</h3>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>{tier.share}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity Impact Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '1rem' }}>
                <Heart size={14} fill="currentColor" /> Heart of Digital Heroes
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.25rem', color: '#fff' }}>
                Empower Verified Causes with Every Single Swing
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.7' }}>
                Charity isn't an afterthought—it's built directly into our subscription engine. A minimum of 10% of every subscriber plan flows straight to partner charities, providing crucial funding for youth development, health, and conservation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  '100% Verified Non-Profit Partners',
                  'Transparent Direct Allocation Model',
                  'Flexible Monthly Contribution Percentages'
                ].map((text, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: '#fff' }}>
                    <CheckCircle2 size={20} color="var(--primary)" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <Link to="/charities" className="btn btn-primary">
                Explore Partner Charities <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card" style={{ padding: '2.5rem', background: 'var(--surface)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Featured Charity Spotlight
              </div>
              <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Junior Golf & Youth Foundation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Providing underprivileged youth with sports equipment, educational mentorship, and accessible coaching programs nationwide.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Raised</div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>$50,000</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Status</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Active Grantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Published Draw Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            <h2 className="page-title">Latest Official Draw Results</h2>
            <p className="page-subtitle">Winning numbers from the latest published monthly draw.</p>
          </div>

          <div className="card" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
            {loadingDraw ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div className="spinner" />
                <p style={{ color: 'var(--text-muted)' }}>Fetching latest draw results...</p>
              </div>
            ) : drawError ? (
              <div style={{ color: 'var(--text-muted)' }}>
                <Trophy size={40} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>{drawError}</p>
              </div>
            ) : (
              <div>
                <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
                  {latestDraw?.month || latestDraw?.draw_date || 'Current Draw'}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>
                  Winning Numbers
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {(latestDraw?.winning_numbers || latestDraw?.numbers || [7, 14, 22, 31, 40]).map((num, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <Link to="/subscription" className="btn btn-outline btn-sm">
                  Join Next Draw
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
