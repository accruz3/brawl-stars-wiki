const { useState, useEffect } = React;



function App() {
    const [brawlers, setBrawlers] = useState([]);
    const [selectedBrawler, setSelectedBrawler] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('grid');

    useEffect(() => {
        fetchBrawlers();
        const handlePopState = () => {
            const path = window.location.pathname;
            if (path === '/' || path === '/index.html') {
                setView('grid');
                setSelectedBrawler(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const fetchBrawlers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/brawlers');
            if (!response.ok) throw new Error('Failed to fetch brawlers');
            const data = await response.json();
            setBrawlers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching brawlers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBrawlerClick = (brawler) => {
        setSelectedBrawler(brawler);
        setView('detail');
        window.history.pushState({ brawlerId: brawler.Id }, '', `/brawler/${brawler.Id}`);
    };

    const handleBackToGrid = () => {
        setView('grid');
        setSelectedBrawler(null);
        window.history.pushState({}, '', '/');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Hamburger for mobile */}
            <button className="btn btn-primary d-md-none position-fixed" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas" style={{ zIndex: 1051, top: 16, left: 16 }}>
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Sidebar (offcanvas on mobile) */}
            <nav>
                <div className="offcanvas-md offcanvas-start bg-light text-dark" tabIndex="-1" id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel" style={{ width: '220px', minHeight: '100vh' }}>
                    <div className="offcanvas-header d-md-none">
                        <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">Brawl Stars Wiki</h5>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body p-3 d-flex flex-column">
                        <a href="#" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                            <img src="https://static.vecteezy.com/system/resources/previews/027/127/543/non_2x/brawl-stars-logo-brawl-stars-icon-transparent-free-png.png" alt="Brawl Stars Wiki Logo" style={{ height: '200px', width: 'auto', display: 'block' }} />
                        </a>
                        <hr className="border-secondary" />
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <a href="#" className="nav-link active bg-primary text-white" style={{fontSize: '24px'}} aria-current="page">
                                    Brawlers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1" style={{ background: 'none', height: '100vh', overflowY: 'auto' }}>
                <div className="container py-4">


                    {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>Error: {error}</div>}
                    {loading && <div style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Loading brawlers...</div>}

                    <div className="content">

                        {view === 'grid' ? (
                            <div>
                                <h1 className="mb-4" style={{ color: '#fff', textAlign: 'center' }}>BRAWLERS</h1>
                                <div className="brawler-grid">
                                    {brawlers.map(brawler => (
                                        <div
                                            key={brawler.Id}
                                            className="brawler-card"
                                            onClick={() => handleBrawlerClick(brawler)}
                                        >
                                            <div className="brawler-card-image">
                                                <img src="placeholder.png" alt={brawler.Name} />
                                                <div className="brawler-card-name-overlay">{brawler.Name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        ) : (
                            <div className="brawler-detail card shadow-sm border-0" style={{ color: '#fff' }}>
                                <button className="back-btn mb-3 text-start" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 600, display: 'block', width: '100%' }} onClick={handleBackToGrid}>← Back to Brawlers</button>
                                {selectedBrawler && (
                                    <>
                                        <div className="detail-header mb-4 text-center">
                                            <img 
                                                src="../placeholder.png" 
                                                alt={selectedBrawler.Name} 
                                                style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '1rem', background: '#e0e0e0' }} 
                                            />
                                            <h2 className="fw-bold mt-2" style={{ color: '#fff' }}>{selectedBrawler.Name}</h2>
                                            <div className="detail-meta mb-2 d-flex justify-content-center gap-2">
                                                <span className="detail-rarity me-2" style={{ background: '#a855f7', color: '#fff' }}>{selectedBrawler.Rarity}</span>
                                                <span className="detail-class" style={{ background: '#6366f1', color: '#fff' }}>{selectedBrawler.Class}</span>
                                            </div>
                                            <p className="detail-title" style={{ color: '#d5d5d5ff' }}>
                                                "{selectedBrawler.Title}"
                                            </p>
                                        </div>

                                        <div className="stats mb-4">
                                            <div className="stat" style={{ color: '#333', background: '#f7f7f7', borderRadius: 8 }}>
                                                <div className="stat-label" style={{ color: '#444' }}>Health (Lv. 11)</div>
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.HealthByLevel['11']}</div>
                                            </div>
                                            <div className="stat" style={{ color: '#333', background: '#f7f7f7', borderRadius: 8 }}>
                                                <div className="stat-label" style={{ color: '#444' }}>Attack DMG</div>
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.Attack.DamagePerShellLevel11}</div>
                                            </div>
                                            <div className="stat" style={{ color: '#333', background: '#f7f7f7', borderRadius: 8 }}>
                                                <div className="stat-label" style={{ color: '#444' }}>Range</div>
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.Attack.Range}</div>
                                            </div>
                                            <div className="stat" style={{ color: '#333', background: '#f7f7f7', borderRadius: 8 }}>
                                                <div className="stat-label" style={{ color: '#444' }}>Reload</div>
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.Attack.Reload}s</div>
                                            </div>
                                        </div>

                                        <div className="abilities">
                                            <h3 className="mb-3" style={{ color: '#ffffffff', borderTop: '3px solid #a855f7', paddingTop: '1rem' }}>ABILITIES</h3>
                                            <div className="abilities-grid">
                                                <div className="ability" style={{ background: '#f7f7f7', color: '#222', borderRadius: 8 }}>
                                                    <div className="ability-badge basic">BASIC<br />ATK</div>
                                                    <div className="ability-content">
                                                        <div className="ability-name" style={{ color: '#0a68bf' }}>Attack</div>
                                                        <div className="ability-stats">
                                                            <span>DMG: {selectedBrawler.Attack.DamagePerShellLevel11}</span>
                                                            <span>Range: {selectedBrawler.Attack.Range}</span>
                                                            <span>Projectiles: {selectedBrawler.Attack.Projectiles}</span>
                                                            <span>Reload: {selectedBrawler.Attack.Reload}s</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ability" style={{ background: '#f7f7f7', color: '#222', borderRadius: 8 }}>
                                                    <div className="ability-badge super">SUPER</div>
                                                    <div className="ability-content">
                                                        <div className="ability-name" style={{ color: '#0a68bf' }}>Super Attack</div>
                                                        <div className="ability-stats">
                                                            <span>DMG: {selectedBrawler.Super.DamagePerShellLevel11}</span>
                                                            <span>Range: {selectedBrawler.Super.Range}</span>
                                                            <span>Projectiles: {selectedBrawler.Super.Projectiles}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ability" style={{ background: '#f7f7f7', color: '#222', borderRadius: 8 }}>
                                                    <div className="ability-badge starpower">STAR<br />POWER</div>
                                                    <div className="ability-content">
                                                        <div className="ability-name" style={{ color: '#0a68bf' }}>{selectedBrawler.StarPower.Name}</div>
                                                        <div className="ability-desc" style={{ color: '#444' }}>{selectedBrawler.StarPower.Description}</div>
                                                    </div>
                                                </div>

                                                {selectedBrawler.Gadgets.map((gadget, idx) => (
                                                    <div key={idx} className="ability" style={{ background: '#f7f7f7', color: '#222', borderRadius: 8 }}>
                                                        <div className="ability-badge gadget">GADGET {idx + 1}</div>
                                                        <div className="ability-content">
                                                            <div className="ability-name" style={{ color: '#0a68bf' }}>{gadget.Name}</div>
                                                            <div className="ability-desc" style={{ color: '#444' }}>{gadget.Description}</div>
                                                            <div className="ability-stats">
                                                                <span>Cooldown: {gadget.Cooldown}s</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
