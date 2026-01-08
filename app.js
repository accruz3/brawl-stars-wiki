const { useState, useEffect } = React;

function App() {
    const [brawlers, setBrawlers] = useState([]);
    const [selectedBrawler, setSelectedBrawler] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('grid'); // 'grid' or 'detail'

    // Fetch all brawlers on component mount
    useEffect(() => {
        fetchBrawlers();
        
        // Handle browser back/forward buttons
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
        // Update URL without page reload
        window.history.pushState({ brawlerId: brawler.Id }, '', `/brawler/${brawler.Id}`);
    };

    const handleBackToGrid = () => {
        setView('grid');
        setSelectedBrawler(null);
        // Update URL back to home
        window.history.pushState({}, '', '/');
    };

    return (
        <div className="container">
            <header>
                <h1>Brawl Stars Wiki</h1>
                <h2>Characters</h2>
            </header>

            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>Error: {error}</div>}
            {loading && <div style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Loading brawlers...</div>}

            <div className="content">
                {view === 'grid' ? (
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
                ) : (
                    <div className="brawler-detail">
                        <button className="back-btn" onClick={handleBackToGrid}>← Back to Brawlers</button>
                        {selectedBrawler && (
                            <>
                                <div className="detail-header">
                                    <h2>{selectedBrawler.Name}</h2>
                                    <div className="detail-meta">
                                        <span className="detail-rarity">{selectedBrawler.Rarity}</span>
                                        <span className="detail-class">{selectedBrawler.Class}</span>
                                    </div>
                                    <p className="detail-title">"{selectedBrawler.Title}"</p>
                                </div>

                                <div className="stats">
                                    <div className="stat">
                                        <div className="stat-label">Health (Lv. 11)</div>
                                        <div className="stat-value">{selectedBrawler.HealthByLevel['11']}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-label">Attack DMG</div>
                                        <div className="stat-value">{selectedBrawler.Attack.DamagePerShellLevel11}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-label">Range</div>
                                        <div className="stat-value">{selectedBrawler.Attack.Range}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-label">Reload</div>
                                        <div className="stat-value">{selectedBrawler.Attack.Reload}s</div>
                                    </div>
                                </div>

                                <div className="abilities">
                                    <h3>ABILITIES</h3>
                                    <div className="abilities-grid">
                                        <div className="ability">
                                            <div className="ability-badge basic">BASIC<br/>ATK</div>
                                            <div className="ability-content">
                                                <div className="ability-name">Attack</div>
                                                <div className="ability-stats">
                                                    <span>DMG: {selectedBrawler.Attack.DamagePerShellLevel11}</span>
                                                    <span>Range: {selectedBrawler.Attack.Range}</span>
                                                    <span>Projectiles: {selectedBrawler.Attack.Projectiles}</span>
                                                    <span>Reload: {selectedBrawler.Attack.Reload}s</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ability">
                                            <div className="ability-badge super">SUPER</div>
                                            <div className="ability-content">
                                                <div className="ability-name">Super Attack</div>
                                                <div className="ability-stats">
                                                    <span>DMG: {selectedBrawler.Super.DamagePerShellLevel11}</span>
                                                    <span>Range: {selectedBrawler.Super.Range}</span>
                                                    <span>Projectiles: {selectedBrawler.Super.Projectiles}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ability">
                                            <div className="ability-badge starpower">STAR<br/>POWER</div>
                                            <div className="ability-content">
                                                <div className="ability-name">{selectedBrawler.StarPower.Name}</div>
                                                <div className="ability-desc">{selectedBrawler.StarPower.Description}</div>
                                            </div>
                                        </div>

                                        {selectedBrawler.Gadgets.map((gadget, idx) => (
                                            <div key={idx} className="ability">
                                                <div className="ability-badge gadget">GADGET {idx + 1}</div>
                                                <div className="ability-content">
                                                    <div className="ability-name">{gadget.Name}</div>
                                                    <div className="ability-desc">{gadget.Description}</div>
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
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
