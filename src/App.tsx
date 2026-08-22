import React, { useEffect, useMemo, useState } from 'react';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import type { ProductBadge, ProductCatalogItem, ProductOffer, ProductStatus, ProductVariation, StockStatus } from './types';
import { ArrowRight, BadgeCheck, BarChart3, Bell, Boxes, Calculator, Check, ChevronRight, Copy, CreditCard, Eye, Image as ImageIcon, LayoutDashboard, LogOut, Package, PencilLine, Plus, Search, ShieldCheck, ShoppingCart, Star, Trash2, UploadCloud, Users, Wand2, X } from 'lucide-react';

const ADMIN_EMAIL = 'admin@playbeat.digital';
const ADMIN_PASSWORD = 'playbeat1122';
const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1600&q=80';
const STOCK_OPTIONS: StockStatus[] = ['In Stock', 'Low Stock', 'Out of Stock', 'Coming Soon', 'Unlimited/Digital Stock'];
const BADGE_OPTIONS: ProductBadge[] = ['NEW', 'HOT', 'TRENDING', 'BEST SELLER', 'LIMITED', 'SALE'];

const formatPrice = (amount: number, currency: 'USD' | 'PKR' = 'USD') => {
  if (currency === 'PKR') {
    return `₨${(amount * 280).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `$${amount.toFixed(2)}`;
};

const getProductStatusTone = (status: ProductStatus) => {
  switch (status) {
    case 'Published':
      return 'status-green';
    case 'Draft':
      return 'status-slate';
    case 'Hidden':
      return 'status-muted';
    case 'Scheduled':
      return 'status-amber';
    default:
      return 'status-slate';
  }
};

const getStockTone = (status: StockStatus) => {
  switch (status) {
    case 'In Stock':
      return 'stock-green';
    case 'Low Stock':
      return 'stock-amber';
    case 'Out of Stock':
      return 'stock-red';
    case 'Coming Soon':
      return 'stock-purple';
    default:
      return 'stock-blue';
  }
};

const normalizeProduct = (product: ProductOffer, index: number): ProductCatalogItem => {
  const compareAt = Number((product.basePrice * (1 + (index % 4) * 0.23 + 0.15)).toFixed(2));
  const stock = 12 + (index % 7) * 8;
  const status: StockStatus = index % 5 === 0 ? 'Low Stock' : 'In Stock';

  return {
    ...product,
    shortDescription: `${product.title} built for daily premium use and polished shopping experiences.`,
    fullDescription: `Premium ${product.category.toLowerCase()} engineered to deliver clean performance, strong value, and confidence in every purchase.`,
    compareAtPrice: compareAt,
    discountPercent: Math.min(35, 10 + (index % 6) * 5),
    subcategory: product.category,
    stock,
    stockStatus: status,
    sku: `PB-${String(index + 1).padStart(4, '0')}`,
    availability: true,
    visibility: 'Published',
    minPurchaseQty: 1,
    maxPurchaseQty: 5,
    isFeatured: index < 3,
    isTrending: index % 2 === 0,
    isComingSoon: false,
    isOnLandingPage: index < 5,
    badges: (['NEW', 'TRENDING', 'SALE'] as ProductBadge[]).slice(0, 1 + (index % 3)),
    gallery: [product.imageUrl ?? '', product.imageUrl ?? '', product.imageUrl ?? ''],
    variations: [
      {
        id: `var-${product.id}-base`,
        name: 'Standard',
        price: product.basePrice,
        stock,
        sku: `PB-${String(index + 1).padStart(4, '0')}-STD`,
        status,
        imageUrl: product.imageUrl,
        enabled: true,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
};

const seededProducts = INITIAL_PRODUCTS.map(normalizeProduct);

const initialLanding = {
  heroTitle: 'PlayBeat Digital Premium Tech Store',
  heroSubtitle: 'Built for creators, gamers, and digital-first brands that want premium devices and polished everyday experiences.',
  ctaPrimary: 'Shop Best Sellers',
  ctaSecondary: 'View New Arrivals',
  heroImage: DEFAULT_HERO_BG,
  banners: [
    { id: 'b1', title: 'Summer drops', text: 'Up to 30% off premium tech bundles.', visible: true },
    { id: 'b2', title: 'Free shipping', text: 'Fast dispatch on selected Smart Projectors.', visible: true },
  ],
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = sessionStorage.getItem('playbeat-auth');
    return session === 'true';
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [products, setProducts] = useState<ProductCatalogItem[]>(seededProducts);
  const [currentView, setCurrentView] = useState<'storefront' | 'manager' | 'landing'>('storefront');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editorProductId, setEditorProductId] = useState<string | null>(null);
  const [draftProduct, setDraftProduct] = useState<ProductCatalogItem | null>(null);
  const [variationWarning, setVariationWarning] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [landing, setLanding] = useState(initialLanding);

  useEffect(() => {
    sessionStorage.setItem('playbeat-auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    products.forEach((product) => categories.add(product.category));
    return ['All', ...Array.from(categories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesText =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.isFeatured && product.visibility === 'Published'),
    [products]
  );
  const trendingProducts = useMemo(
    () => products.filter((product) => product.isTrending && product.visibility === 'Published'),
    [products]
  );

  const openEditor = (product?: ProductCatalogItem) => {
    if (product) {
      setDraftProduct(product);
      setEditorProductId(product.id);
    } else {
      const newProduct: ProductCatalogItem = {
        ...INITIAL_PRODUCTS[0],
        id: `product-${Date.now()}`,
        shortDescription: 'New premium product description.',
        fullDescription: 'A polished product detail with premium pricing and imagery.',
        compareAtPrice: 199,
        discountPercent: 15,
        subcategory: 'New Arrivals',
        stock: 25,
        stockStatus: 'In Stock',
        sku: `PB-${Date.now().toString().slice(-6)}`,
        availability: true,
        visibility: 'Published',
        minPurchaseQty: 1,
        maxPurchaseQty: 5,
        isFeatured: true,
        isTrending: false,
        isComingSoon: false,
        isOnLandingPage: true,
        badges: ['NEW'],
        gallery: [INITIAL_PRODUCTS[0].imageUrl ?? ''],
        variations: [
          {
            id: `var-new-${Date.now()}`,
            name: 'Standard',
            price: INITIAL_PRODUCTS[0].basePrice,
            stock: 25,
            sku: `PB-${Date.now().toString().slice(-6)}-STD`,
            status: 'In Stock',
            imageUrl: INITIAL_PRODUCTS[0].imageUrl,
            enabled: true,
          },
        ],
        updatedAt: new Date().toISOString(),
      };
      setDraftProduct(newProduct);
      setEditorProductId(newProduct.id);
    }
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError('');
    setTimeout(() => {
      if (loginForm.email.trim().toLowerCase() === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setCurrentView('manager');
      } else {
        setAuthError('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleDuplicateProduct = (productId: string) => {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) return product;
        const duplicate: ProductCatalogItem = {
          ...product,
          id: `product-${Date.now()}`,
          title: `${product.title} Copy`,
          sku: `${product.sku}-COPY`,
          visibility: 'Draft',
          updatedAt: new Date().toISOString(),
        };
        return duplicate;
      })
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    if (editorProductId === productId) {
      setDraftProduct(null);
      setEditorProductId(null);
    }
  };

  const handleSaveProduct = () => {
    if (!draftProduct) return;

    setProducts((current) => {
      const exists = current.some((product) => product.id === draftProduct.id);
      if (exists) {
        return current.map((product) => (product.id === draftProduct.id ? { ...draftProduct, updatedAt: new Date().toISOString() } : product));
      }
      return [{ ...draftProduct, updatedAt: new Date().toISOString() }, ...current];
    });

    setDraftProduct(null);
    setEditorProductId(null);
  };

  const addVariation = () => {
    if (!draftProduct) return;
    const variation: ProductVariation = {
      id: `var-${Date.now()}`,
      name: 'New Color',
      price: draftProduct.basePrice,
      stock: draftProduct.stock,
      sku: `${draftProduct.sku}-VAR`,
      status: 'In Stock',
      imageUrl: draftProduct.imageUrl,
      enabled: true,
    };

    setDraftProduct({
      ...draftProduct,
      variations: [...draftProduct.variations, variation],
    });
  };

  const handleVariationAdd = (variation: ProductVariation) => {
    if (!draftProduct) return;
    const duplicates = draftProduct.variations.some(
      (item) =>
        item.name.trim().toLowerCase() === variation.name.trim().toLowerCase() ||
        item.sku.trim().toLowerCase() === variation.sku.trim().toLowerCase()
    );

    if (duplicates) {
      setVariationWarning('Duplicate variation detected. Use a unique name or SKU before saving.');
      return;
    }

    setDraftProduct({
      ...draftProduct,
      variations: [...draftProduct.variations, variation],
    });
    setVariationWarning('');
  };

  const updateVariation = (variationId: string, partial: Partial<ProductVariation>) => {
    if (!draftProduct) return;
    setDraftProduct({
      ...draftProduct,
      variations: draftProduct.variations.map((variation) =>
        variation.id === variationId ? { ...variation, ...partial } : variation
      ),
    });
  };

  const deleteVariation = (variationId: string) => {
    if (!draftProduct) return;
    setDraftProduct({
      ...draftProduct,
      variations: draftProduct.variations.filter((variation) => variation.id !== variationId),
    });
  };

  const purchaseProduct = (product: ProductCatalogItem, quantity = 1) => {
    const remaining = product.stock - quantity;
    setProducts((current) =>
      current.map((item) => {
        if (item.id !== product.id) return item;
        const nextStock = Math.max(0, remaining);
        return {
          ...item,
          stock: nextStock,
          stockStatus: nextStock <= 0 ? 'Out of Stock' : nextStock <= 5 ? 'Low Stock' : 'In Stock',
          availability: nextStock > 0,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    setCartCount((count) => count + quantity);
  };

  const totalInventory = products.reduce((sum, product) => sum + product.stock, 0);

  return (
    <div className="app-shell">
      {!isAuthenticated ? (
        <div className="login-screen">
          <div className="login-backdrop" aria-hidden="true" style={{ backgroundImage: `linear-gradient(115deg, rgba(8, 12, 28, 0.78), rgba(12, 18, 44, 0.58)), url(${DEFAULT_HERO_BG})` }} />
          <div className="login-panel">
            <div className="brand-mark">
              <div className="brand-pill">PB</div>
              <div>
                <div className="brand-name">PlayBeat Digital</div>
                <div className="brand-tag">Premium commerce dashboard</div>
              </div>
            </div>

            <div className="login-card">
              <div className="login-head">
                <p className="eyebrow">Secure access</p>
                <h1>Welcome back</h1>
                <p className="login-description">Sign in to manage your PlayBeat Digital storefront.</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                    placeholder="name@playbeat.digital"
                    autoComplete="username"
                    required
                  />
                </label>

                <label>
                  <span>Password</span>
                  <div className="password-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      required
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword((current) => !current)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>

                {authError ? <div className="form-error">{authError}</div> : null}

                <button type="submit" className="primary-btn full login-submit" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-shell">
          <header className="topbar">
            <div className="brand-block">
              <div className="brand-pill">PB</div>
              <div>
                <div className="brand-name">PLAYBEAT</div>
                <div className="brand-tag">Premium storefront</div>
              </div>
            </div>

            <nav className="main-nav">
              <button className={currentView === 'storefront' ? 'nav-item active' : 'nav-item'} onClick={() => setCurrentView('storefront')}>
                Storefront
              </button>
              <button className={currentView === 'manager' ? 'nav-item active' : 'nav-item'} onClick={() => setCurrentView('manager')}>
                Product Manager
              </button>
              <button className={currentView === 'landing' ? 'nav-item active' : 'nav-item'} onClick={() => setCurrentView('landing')}>
                Landing CMS
              </button>
            </nav>

            <div className="topbar-actions">
              <div className="cart-pill">
                <ShoppingCart size={16} />
                <span>{cartCount}</span>
              </div>
              <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </header>

          <main className="content-layout">
            {currentView === 'storefront' && (
              <>
                <section className="hero-banner">
                  <div className="hero-copy">
                    <span className="eyebrow white">PlayBeat Digital</span>
                    <h1>{landing.heroTitle}</h1>
                    <p>{landing.heroSubtitle}</p>
                    <div className="cta-row">
                      <button className="primary-btn">{landing.ctaPrimary}</button>
                      <button className="secondary-btn">{landing.ctaSecondary}</button>
                    </div>
                  </div>
                  <div className="hero-visual" style={{ backgroundImage: `url(${landing.heroImage})` }} />
                </section>

                <section className="promo-row">
                  {landing.banners.map((banner) => (
                    <div key={banner.id} className="promo-card">
                      <BadgeCheck size={16} />
                      <div>
                        <strong>{banner.title}</strong>
                        <p>{banner.text}</p>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="stats-grid">
                  <div className="stat-card">
                    <Package size={18} />
                    <div>
                      <strong>{products.length}</strong>
                      <span>Products</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Users size={18} />
                    <div>
                      <strong>{featuredProducts.length}</strong>
                      <span>Featured</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <BarChart3 size={18} />
                    <div>
                      <strong>{totalInventory}</strong>
                      <span>Units</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <ShieldCheck size={18} />
                    <div>
                      <strong>99.9%</strong>
                      <span>Uptime</span>
                    </div>
                  </div>
                </section>

                <section className="products-section">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">Trending now</p>
                      <h2>Featured products</h2>
                    </div>
                    <button className="secondary-btn">View all</button>
                  </div>

                  <div className="product-grid">
                    {featuredProducts.map((product) => (
                      <article key={product.id} className="product-card">
                        <div className="product-media" style={{ backgroundImage: `url(${product.gallery[0] || product.imageUrl})` }}>
                          {product.badges.length ? (
                            <div className="badge-strip">
                              {product.badges.map((badge) => (
                                <span key={badge} className="mini-badge">{badge}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="product-body">
                          <div className="price-row">
                            <div>
                              <div className="product-title">{product.title}</div>
                              <div className="review-row">
                                <Star size={14} fill="currentColor" />
                                <span>4.9 • 278 reviews</span>
                              </div>
                            </div>
                            <div className="price-stack">
                              <strong>{formatPrice(product.basePrice)}</strong>
                              <span>{formatPrice(product.compareAtPrice)}</span>
                            </div>
                          </div>

                          <p>{product.shortDescription}</p>

                          <div className="stock-row">
                            <span className={`status-pill ${getStockTone(product.stockStatus)}`}>{product.stockStatus}</span>
                            <span className="stock-meta">{product.stock} in stock</span>
                          </div>

                          <div className="card-actions">
                            <button className="secondary-btn small">Add to cart</button>
                            <button className="primary-btn small" onClick={() => purchaseProduct(product, 1)}>Buy Now</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="products-section soft">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">Curated</p>
                      <h2>Trending picks</h2>
                    </div>
                  </div>

                  <div className="mini-table">
                    {trendingProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="mini-row">
                        <div className="mini-thumb" style={{ backgroundImage: `url(${product.gallery[0] || product.imageUrl})` }} />
                        <div className="mini-body">
                          <strong>{product.title}</strong>
                          <span>{product.category}</span>
                        </div>
                        <div className="mini-price">{formatPrice(product.basePrice)}</div>
                        <button className="secondary-btn small" onClick={() => purchaseProduct(product, 1)}>Quick buy</button>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {currentView === 'manager' && (
              <section className="manager-layout">
                <div className="manager-topbar">
                  <div>
                    <p className="eyebrow">Catalog management</p>
                    <h2>Product manager</h2>
                  </div>
                  <div className="manager-actions">
                    <div className="search-box">
                      <Search size={16} />
                      <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search products" />
                    </div>
                    <button className="primary-btn" onClick={() => openEditor()}>
                      <Plus size={16} />
                      Add product
                    </button>
                  </div>
                </div>

                <div className="filter-row">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      className={selectedCategory === category ? 'chip active' : 'chip'}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="manager-table-wrap">
                  <table className="manager-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Variations</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="table-product">
                              <img src={product.gallery[0] || product.imageUrl} alt={product.title} />
                              <div>
                                <strong>{product.title}</strong>
                                <span>{product.sku}</span>
                              </div>
                            </div>
                          </td>
                          <td>{product.category}</td>
                          <td>{product.variations.length}</td>
                          <td>{formatPrice(product.basePrice)}</td>
                          <td>{product.stock}</td>
                          <td>
                            <span className={product.availability ? 'status-pill stock-green' : 'status-pill stock-red'}>
                              {product.availability ? 'Available' : 'Hidden'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill ${getProductStatusTone(product.visibility)}`}>{product.visibility}</span>
                          </td>
                          <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-group">
                              <button onClick={() => openEditor(product)} title="Edit"><PencilLine size={14} /></button>
                              <button onClick={() => handleDuplicateProduct(product.id)} title="Duplicate"><Copy size={14} /></button>
                              <button title="Inventory"><Boxes size={14} /></button>
                              <button title="Images"><ImageIcon size={14} /></button>
                              <button title="Variations"><Wand2 size={14} /></button>
                              <button title="Preview"><Eye size={14} /></button>
                              <button title="Delete" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {currentView === 'landing' && (
              <section className="cms-layout">
                <div className="widget-card">
                  <div className="section-header small-head">
                    <div>
                      <p className="eyebrow">Landing page</p>
                      <h3>Hero content</h3>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label>
                      <span>Hero title</span>
                      <input value={landing.heroTitle} onChange={(event) => setLanding({ ...landing, heroTitle: event.target.value })} />
                    </label>
                    <label>
                      <span>Primary CTA</span>
                      <input value={landing.ctaPrimary} onChange={(event) => setLanding({ ...landing, ctaPrimary: event.target.value })} />
                    </label>
                    <label className="full-span">
                      <span>Hero subtitle</span>
                      <textarea value={landing.heroSubtitle} onChange={(event) => setLanding({ ...landing, heroSubtitle: event.target.value })} rows={3} />
                    </label>
                    <label className="full-span">
                      <span>Background image URL</span>
                      <input value={landing.heroImage} onChange={(event) => setLanding({ ...landing, heroImage: event.target.value })} />
                    </label>
                  </div>
                </div>

                <div className="widget-card">
                  <div className="section-header small-head">
                    <div>
                      <p className="eyebrow">Promotions</p>
                      <h3>Campaign banners</h3>
                    </div>
                    <button className="primary-btn small">Add banner</button>
                  </div>
                  <div className="banner-list">
                    {landing.banners.map((banner) => (
                      <div key={banner.id} className="banner-item">
                        <input value={banner.title} onChange={(event) => setLanding({ ...landing, banners: landing.banners.map((item) => item.id === banner.id ? { ...item, title: event.target.value } : item) })} />
                        <input value={banner.text} onChange={(event) => setLanding({ ...landing, banners: landing.banners.map((item) => item.id === banner.id ? { ...item, text: event.target.value } : item) })} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      )}

      {draftProduct && (
        <div className="modal-backdrop" onClick={() => setDraftProduct(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Product editor</p>
                <h3>{draftProduct.title}</h3>
              </div>
              <button className="icon-btn" onClick={() => setDraftProduct(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="editor-grid">
              <label>
                <span>Title</span>
                <input value={draftProduct.title} onChange={(event) => setDraftProduct({ ...draftProduct, title: event.target.value })} />
              </label>
              <label>
                <span>SKU / Product ID</span>
                <input value={draftProduct.sku} onChange={(event) => setDraftProduct({ ...draftProduct, sku: event.target.value })} />
              </label>
              <label>
                <span>Category</span>
                <input value={draftProduct.category} onChange={(event) => setDraftProduct({ ...draftProduct, category: event.target.value })} />
              </label>
              <label>
                <span>Subcategory</span>
                <input value={draftProduct.subcategory} onChange={(event) => setDraftProduct({ ...draftProduct, subcategory: event.target.value })} />
              </label>
              <label>
                <span>Selling price</span>
                <input type="number" value={draftProduct.basePrice} onChange={(event) => setDraftProduct({ ...draftProduct, basePrice: Number(event.target.value) })} />
              </label>
              <label>
                <span>Compare price</span>
                <input type="number" value={draftProduct.compareAtPrice} onChange={(event) => setDraftProduct({ ...draftProduct, compareAtPrice: Number(event.target.value) })} />
              </label>
              <label>
                <span>Discount</span>
                <input type="number" value={draftProduct.discountPercent} onChange={(event) => setDraftProduct({ ...draftProduct, discountPercent: Number(event.target.value) })} />
              </label>
              <label>
                <span>Stock quantity</span>
                <input type="number" value={draftProduct.stock} onChange={(event) => setDraftProduct({ ...draftProduct, stock: Number(event.target.value) })} />
              </label>
              <label>
                <span>Min order</span>
                <input type="number" value={draftProduct.minPurchaseQty} onChange={(event) => setDraftProduct({ ...draftProduct, minPurchaseQty: Number(event.target.value) })} />
              </label>
              <label>
                <span>Max order</span>
                <input type="number" value={draftProduct.maxPurchaseQty} onChange={(event) => setDraftProduct({ ...draftProduct, maxPurchaseQty: Number(event.target.value) })} />
              </label>
              <label>
                <span>Visibility</span>
                <select value={draftProduct.visibility} onChange={(event) => setDraftProduct({ ...draftProduct, visibility: event.target.value as ProductStatus })}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Hidden">Hidden</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </label>
              <label>
                <span>Stock status</span>
                <select value={draftProduct.stockStatus} onChange={(event) => setDraftProduct({ ...draftProduct, stockStatus: event.target.value as StockStatus })}>
                  {STOCK_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="full-span">
                <span>Short description</span>
                <textarea value={draftProduct.shortDescription} onChange={(event) => setDraftProduct({ ...draftProduct, shortDescription: event.target.value })} rows={2} />
              </label>
              <label className="full-span">
                <span>Full description</span>
                <textarea value={draftProduct.fullDescription} onChange={(event) => setDraftProduct({ ...draftProduct, fullDescription: event.target.value })} rows={3} />
              </label>
              <label className="full-span">
                <span>Primary image URL</span>
                <input value={draftProduct.gallery[0] || draftProduct.imageUrl || ''} onChange={(event) => setDraftProduct({ ...draftProduct, imageUrl: event.target.value, gallery: [event.target.value, ...draftProduct.gallery.slice(1)] })} />
              </label>
            </div>

            <div className="variation-area">
              <div className="section-header small-head">
                <div>
                  <p className="eyebrow">Variation manager</p>
                  <h3>Product variations</h3>
                </div>
                <button className="primary-btn small" onClick={addVariation}>Add variation</button>
              </div>

              {variationWarning ? <div className="form-error">{variationWarning}</div> : null}

              <div className="variation-list">
                {draftProduct.variations.map((variation) => (
                  <div key={variation.id} className="variation-row">
                    <input value={variation.name} onChange={(event) => updateVariation(variation.id, { name: event.target.value })} />
                    <input type="number" value={variation.price} onChange={(event) => updateVariation(variation.id, { price: Number(event.target.value) })} />
                    <input type="number" value={variation.stock} onChange={(event) => updateVariation(variation.id, { stock: Number(event.target.value) })} />
                    <select value={variation.status} onChange={(event) => updateVariation(variation.id, { status: event.target.value as StockStatus })}>
                      {STOCK_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <input value={variation.sku} onChange={(event) => updateVariation(variation.id, { sku: event.target.value })} />
                    <button className="icon-btn danger" onClick={() => deleteVariation(variation.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setDraftProduct(null)}>Cancel</button>
              <button className="primary-btn" onClick={handleSaveProduct}>Save product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
