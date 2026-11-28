import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Crown,
  Diamond,
  Facebook,
  Gamepad2,
  Globe,
  Headphones,
  Headset,
  Instagram,
  Laptop,
  LayoutGrid,
  Lock,
  Music2,
  Play,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Star,
  Twitter,
  User,
  Users,
  Youtube,
  Zap,
} from 'lucide-react';
import type { ProductCatalogItem } from '../types';

interface LandingContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImage: string;
}

interface StorefrontProps {
  products: ProductCatalogItem[];
  landing: LandingContent;
  formatPrice: (amount: number, currency?: 'USD' | 'PKR') => string;
  cartCount: number;
  onBuy: (product: ProductCatalogItem) => void;
  onOpenDashboard: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#pb-home' },
  { label: 'Products', href: '#pb-products' },
  { label: 'Categories', href: '#pb-categories' },
  { label: 'About Us', href: '#pb-about' },
  { label: 'Contact', href: '#pb-contact' },
];

const CATEGORY_CELLS = [
  { label: 'Streaming Products', icon: Play },
  { label: 'AI Tools', icon: Cpu },
  { label: 'Software', icon: Laptop },
  { label: 'Games & Credits', icon: Gamepad2 },
  { label: 'Gadgets & Devices', icon: Headphones },
  { label: 'Security & VPN', icon: ShieldCheck },
  { label: 'Productivity', icon: Rocket },
  { label: 'All Products', icon: LayoutGrid },
];

const TRUST_CHIPS = [
  { icon: CheckCircle2, label: 'Genuine Products' },
  { icon: Zap, label: 'Instant Delivery' },
  { icon: Star, label: 'Best Rates' },
  { icon: Headset, label: '24/7 Support' },
];

const STATS = [
  { icon: Users, value: '100K+', label: 'Happy Customers' },
  { icon: Globe, value: '180+', label: 'Countries Covered' },
  { icon: Zap, value: '99%', label: 'Positive Reviews' },
  { icon: ShieldCheck, value: '100%', label: 'Secure & Guaranteed' },
];

const WHY_CARDS = [
  { icon: Crown, title: 'Premium Quality', text: '100% original products' },
  { icon: Zap, title: 'Instant Delivery', text: 'Get access in minutes' },
  { icon: Lock, title: 'Secure Payments', text: 'Multiple payment options' },
  { icon: Headset, title: '24/7 Support', text: "We're always here" },
  { icon: User, title: 'User Friendly', text: 'Simple & easy to use' },
  { icon: Diamond, title: 'Best Prices', text: 'More value, less cost' },
];

const PREMIUM_CHECKS = [
  '100% Genuine Products',
  'Instant Delivery',
  'Best Prices',
  'Secure Payments',
  '24/7 Support',
];

export default function Storefront({ products, landing, formatPrice, cartCount, onBuy, onOpenDashboard }: StorefrontProps) {
  const published = products.filter((product) => product.visibility === 'Published');
  const featuredPool = published.filter((product) => product.isFeatured);
  const topPicks = (featuredPool.length ? featuredPool : published).slice(0, 8);

  const titleWords = landing.heroTitle.trim().split(/\s+/).filter(Boolean);
  const accentWords = titleWords.length > 2 ? titleWords.slice(-2).join(' ') : landing.heroTitle;
  const leadWords = titleWords.length > 2 ? titleWords.slice(0, -2).join(' ') : '';

  const heroStyle = landing.heroImage
    ? { backgroundImage: `linear-gradient(180deg, rgba(3, 7, 26, 0.82) 0%, rgba(3, 7, 26, 0.55) 45%, rgba(3, 7, 26, 0.96) 100%), url(${landing.heroImage})` }
    : undefined;

  return (
    <div className="pb-storefront">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="pb-header">
        <div className="pb-header-inner">
          <a className="pb-brand" href="#pb-home">
            <span className="pb-brand-badge">
              <Zap size={22} fill="currentColor" strokeWidth={1.5} />
            </span>
            <span className="pb-brand-text">
              PLAY<em>BEAT</em>
              <small>. DIGITAL .</small>
            </span>
          </a>

          <nav className="pb-nav">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pb-header-actions">
            <label className="pb-search">
              <Search size={16} />
              <input type="search" placeholder="Search products..." aria-label="Search products" />
            </label>
            <button className="pb-icon-btn" onClick={onOpenDashboard} title="Account / Dashboard">
              <User size={18} />
            </button>
            <button className="pb-icon-btn pb-cart" title="Cart">
              <ShoppingCart size={18} />
              <span className="pb-cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="pb-hero" id="pb-home" style={heroStyle}>
        <div className="pb-glow pb-glow-a" aria-hidden="true" />
        <div className="pb-glow pb-glow-b" aria-hidden="true" />
        <div className="pb-hero-inner">
          <div className="pb-hero-copy">
            <p className="pb-eyebrow">PREMIUM DIGITAL PRODUCTS &amp; SUBSCRIPTIONS</p>
            <h1>
              {leadWords ? `${leadWords} ` : ''}
              <span className="pb-grad">{accentWords}</span>
            </h1>
            <p className="pb-hero-line">Movies &nbsp;•&nbsp; Streaming &nbsp;•&nbsp; Software &nbsp;•&nbsp; Games &nbsp;•&nbsp; Gadgets</p>
            <p className="pb-hero-desc">{landing.heroSubtitle}</p>

            <div className="pb-chips">
              {TRUST_CHIPS.map((chip) => (
                <span key={chip.label} className="pb-chip">
                  <chip.icon size={15} />
                  {chip.label}
                </span>
              ))}
            </div>

            <div className="pb-cta-row">
              <a href="#pb-products" className="pb-btn-yellow">
                {landing.ctaPrimary} <ArrowRight size={17} />
              </a>
              <a href="#pb-categories" className="pb-btn-ghost">
                {landing.ctaSecondary}
              </a>
            </div>
          </div>

          <div className="pb-hero-visual" aria-hidden="true">
            <div className="pb-logo-orb">
              <Zap size={64} fill="currentColor" strokeWidth={1.2} />
            </div>
            <div className="pb-logo-word">
              PLAY<em>BEAT</em>
            </div>
            <div className="pb-logo-sub">. DIGITAL .</div>
            <div className="pb-logo-tag">THE GATEWAY TO DIGITAL SUBSCRIPTIONS</div>
          </div>
        </div>
      </section>

      {/* ── Category bar ───────────────────────────────────── */}
      <section className="pb-section" id="pb-categories">
        <div className="pb-cat-bar">
          {CATEGORY_CELLS.map((cell) => (
            <a key={cell.label} href="#pb-products" className="pb-cat-cell">
              <cell.icon size={22} strokeWidth={1.6} />
              <span>{cell.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Top picks ──────────────────────────────────────── */}
      <section className="pb-section" id="pb-products">
        <div className="pb-section-head">
          <div>
            <p className="pb-eyebrow pb-eyebrow-yellow">FEATURED PRODUCTS</p>
            <h2>
              Top Picks for <span className="pb-grad">You</span>
            </h2>
            <p className="pb-section-sub">The most loved digital products. Trusted by millions worldwide.</p>
          </div>
          <a className="pb-view-all" href="#pb-products">
            View All Products <ArrowRight size={15} />
          </a>
        </div>

        <div className="pb-picks-scroll">
          {topPicks.map((product) => (
            <article key={product.id} className="pb-pick-card">
              <div
                className="pb-pick-media"
                style={product.gallery[0] || product.imageUrl ? { backgroundImage: `url(${product.gallery[0] || product.imageUrl})` } : undefined}
              >
                {product.badges.length ? (
                  <div className="pb-pick-badges">
                    {product.badges.slice(0, 2).map((badge) => (
                      <span key={badge}>{badge}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="pb-pick-body">
                <h3>{product.title}</h3>
                <p>{product.subcategory || product.category}</p>
                <div className="pb-pick-price">{formatPrice(product.basePrice)}</div>
                <button className="pb-buy" onClick={() => onBuy(product)}>
                  <ShoppingCart size={14} /> Buy Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Premium access ─────────────────────────────────── */}
      <section className="pb-section">
        <div className="pb-premium">
          <div className="pb-premium-copy">
            <p className="pb-eyebrow pb-eyebrow-yellow">UNLOCK PREMIUM ACCESS</p>
            <h2>
              Premium Access <span className="pb-grad">Worldwide</span>
            </h2>
            <p>
              Get the best digital subscriptions, software, and entertainment — all in one place. Instant delivery,
              secure payments, and unbeatable prices.
            </p>
            <a href="#pb-products" className="pb-btn-yellow">
              Get Started Now <ArrowRight size={17} />
            </a>
          </div>

          <div className="pb-tiles" aria-hidden="true">
            <div className="pb-tile pb-tile-netflix">N</div>
            <div className="pb-tile pb-tile-spotify">
              <Music2 size={22} />
            </div>
            <div className="pb-tile pb-tile-disney">
              Disney<sup>+</sup>
            </div>
            <div className="pb-tile pb-tile-youtube">
              <Play size={18} fill="currentColor" />
            </div>
            <div className="pb-tile pb-tile-hbo">
              HBO<em>max</em>
            </div>
            <div className="pb-tile pb-tile-xbox">X</div>
            <div className="pb-tile pb-tile-ps">PS</div>
            <div className="pb-tile pb-tile-prime">prime video</div>
          </div>

          <ul className="pb-check-list">
            {PREMIUM_CHECKS.map((item) => (
              <li key={item}>
                <span className="pb-check">
                  <CheckCircle2 size={15} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────────────── */}
      <section className="pb-section">
        <div className="pb-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="pb-stat">
              <stat.icon size={22} />
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why choose ─────────────────────────────────────── */}
      <section className="pb-section" id="pb-about">
        <div className="pb-why">
          <div className="pb-why-copy">
            <p className="pb-eyebrow pb-eyebrow-yellow">WHY CHOOSE PLAYBEAT?</p>
            <h2>
              Built for a <span className="pb-grad">Smarter Digital Life</span>
            </h2>
            <p>
              From entertainment to productivity, gaming to gadgets — PlayBeat.Digital brings the digital world closer
              to you.
            </p>
            <a href="#pb-categories" className="pb-btn-yellow">
              Explore All Categories <ArrowRight size={17} />
            </a>
          </div>

          <div className="pb-feature-grid">
            {WHY_CARDS.map((card) => (
              <div key={card.title} className="pb-feature-card">
                <span className="pb-feature-icon">
                  <card.icon size={20} />
                </span>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ───────────────────────────────────────── */}
      <section className="pb-section">
        <div className="pb-cta-band">
          <div>
            <h2>Ready to Level Up?</h2>
            <p>Join Playbeat today and unlock a world of endless possibilities.</p>
          </div>
          <a href="#pb-products" className="pb-btn-yellow pb-btn-lg">
            Get Started Now <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="pb-footer" id="pb-contact">
        <div className="pb-footer-grid">
          <div className="pb-footer-brand">
            <a className="pb-brand" href="#pb-home">
              <span className="pb-brand-badge">
                <Zap size={22} fill="currentColor" strokeWidth={1.5} />
              </span>
              <span className="pb-brand-text">
                PLAY<em>BEAT</em>
                <small>. DIGITAL .</small>
              </span>
            </a>
            <p>The Gateway to Digital Subscriptions</p>
          </div>

          <div className="pb-footer-col">
            <h4>Quick Links</h4>
            <a href="#pb-home">Home</a>
            <a href="#pb-products">Products</a>
            <a href="#pb-categories">Categories</a>
            <a href="#pb-about">About Us</a>
            <a href="#pb-contact">Contact</a>
          </div>

          <div className="pb-footer-col">
            <h4>Help &amp; Support</h4>
            <a href="#pb-contact">FAQs</a>
            <a href="#pb-contact">Terms &amp; Conditions</a>
            <a href="#pb-contact">Privacy Policy</a>
            <a href="#pb-contact">Refund Policy</a>
            <a href="#pb-contact">Shipping Policy</a>
          </div>

          <div className="pb-footer-col">
            <h4>Follow Us</h4>
            <div className="pb-socials">
              <a href="#pb-contact" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#pb-contact" aria-label="YouTube">
                <Youtube size={16} />
              </a>
              <a href="#pb-contact" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#pb-contact" aria-label="TikTok">
                <Music2 size={16} />
              </a>
              <a href="#pb-contact" aria-label="X">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          <div className="pb-footer-col pb-footer-news">
            <h4>Stay Updated</h4>
            <p>Get the latest deals and updates</p>
            <form className="pb-newsletter" onSubmit={(event) => event.preventDefault()}>
              <input type="email" placeholder="Enter your email address" aria-label="Email address" />
              <button type="submit" aria-label="Subscribe">
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="pb-footer-bottom">
          <span>© 2025 PlayBeat Digital. All rights reserved.</span>
          <span>PlayBeat.Digital &nbsp;|&nbsp; Your Trusted Digital Partner</span>
        </div>
      </footer>
    </div>
  );
}
