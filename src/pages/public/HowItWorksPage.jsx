import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Target, Trophy, Award, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      step: 1,
      title: 'Subscription',
      icon: CreditCard,
      description: 'Select your preferred plan (Monthly or Yearly). Choose a partner charity and set your contribution percentage (minimum 10%). Payment is processed securely via Stripe.',
      detail: 'Flexible options allow you to change your selected charity at any time.'
    },
    {
      step: 2,
      title: 'Golf Scores',
      icon: Target,
      description: 'Play golf as usual and submit your latest verified 18-hole scores (values 1–45). Keep track of your last 5 scores directly inside your user dashboard.',
      detail: 'Scores are stored with strict date validation and serve as your monthly draw entries.'
    },
    {
      step: 3,
      title: 'Monthly Draw',
      icon: Trophy,
      description: 'At the end of each monthly period, official draw numbers are published by the platform. Active subscribers are automatically evaluated.',
      detail: 'Draws are fully audited for fairness and published publicly.'
    },
    {
      step: 4,
      title: 'Prize Tiers',
      icon: Award,
      description: 'Prizes are allocated according to match count: Match 5 (40% pool), Match 4 (35% pool), and Match 3 (25% pool).',
      detail: 'Calculations are handled authoritative by the backend server.'
    },
    {
      step: 5,
      title: 'Winner Verification',
      icon: ShieldCheck,
      description: 'Winners submit score proof (e.g. verified scorecard image/document). Once verified by administrators, payouts are disbursed directly.',
      detail: 'Transparent verification status keeps you informed every step of the way.'
    },
    {
      step: 6,
      title: 'Charity Impact',
      icon: Heart,
      description: 'The allocated portion of your subscription fee is transferred to your chosen non-profit partner, making a lasting real-world impact.',
      detail: 'Over $100,000+ has been contributed across all partner non-profits.'
    }
  ];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem auto' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How Digital Heroes Works</h1>
        <p className="page-subtitle">
          From your tee shot to real charitable funding—here is how our transparent subscription and monthly draw engine functions.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="card card-hover" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                shrink: 0,
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
              }}>
                <Icon size={30} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">Step {item.step}</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{item.title}</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: '1.6' }}>
                  {item.description}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  💡 {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Bottom Banner */}
      <div className="card" style={{ maxWidth: '900px', margin: '4rem auto 0 auto', padding: '3rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-secondary) 100%)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Ready to Become a Digital Hero?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Join thousands of players making a difference today.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create Account <ArrowRight size={18} />
          </Link>
          <Link to="/subscription" className="btn btn-secondary btn-lg">
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
};
