const { useState, useEffect } = React;

function App() {
    const [brawlers, setBrawlers] = useState([]);
    const [selectedBrawler, setSelectedBrawler] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('grid');
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [ip, setIp] = useState('');
    const handleAddComment = (brawlerId) => {
        if (!newComment.trim() || !commentAuthor.trim()) return;
        const comment = {
            id: Date.now(),
            author: commentAuthor,
            text: newComment,
            date: new Date().toLocaleString()
        };
        setComments(prev => ({
            ...prev,
            [brawlerId]: [...(prev[brawlerId] || []), comment]
        }));
        setNewComment('');
    };

    const ALL_BRAWLERS_API = 'https://ylznvr2bhf.execute-api.ap-southeast-1.amazonaws.com/default/GetAllBrawlers';

    useEffect(() => {
        fetchBrawlers();
        fetchHostname();
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

    useEffect(() => {
        if (selectedBrawler && view === 'detail') {
            fetchComments(selectedBrawler.Id);
        }
    }, [selectedBrawler, view]);

    const fetchBrawlers = async () => {
        try {
            setLoading(true);
            const response = await fetch(ALL_BRAWLERS_API);
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

        const fetchHostname = async () => {
        try {
            const response = await fetch('/hostname.txt');
            if (response.ok) {
                const text = await response.text();
                if (text.trim()) {
                    setIp(text.trim());
                }
            }
        } catch (err) {
            console.error('Error fetching hostname:', err);
        }
    };

    const fetchComments = async (brawlerId) => {
        try {
            setCommentsLoading(true);
            const response = await fetch(`${GET_COMMENTS_API}?brawlerId=${encodeURIComponent(brawlerId)}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();
            const list = Array.isArray(data) ? data : [];
            const filtered = list.filter(c => String(c.brawlerId) === String(brawlerId));
            const sorted = filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            const total = sorted.length;
            const normalized = sorted.map((c, idx) => ({
                ...c,
                author: c.author || `Anon${total - idx}`,
                date: c.timestamp ? new Date(c.timestamp * 1000).toLocaleString() : '',
                commentText: c.commentText || c.text || ''
            }));

            setComments(prev => ({ ...prev, [brawlerId]: normalized }));
            setCommentCount(prev => ({ ...prev, [brawlerId]: normalized.length }));
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleBrawlerClick = (brawler) => {
        setSelectedBrawler(brawler);
        setView('detail');
    };

    const handleBackToGrid = () => {
        setView('grid');
        setSelectedBrawler(null);
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Hamburger for mobile */}
            <button className="btn btn-primary d-md-none position-fixed" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas" style={{ zIndex: 1051, top: 16, left: 16 }}>
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Sidebar (offcanvas on mobile) */}
            <nav>
                <div className="offcanvas-md offcanvas-start" tabIndex="-1" id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel" style={{ width: '220px', minHeight: '100vh', background: 'linear-gradient(180deg, #0a68bf 0%, #084a8a 100%)' }}>

                    <div className="offcanvas-header d-md-none" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <h5 className="offcanvas-title text-white" id="sidebarOffcanvasLabel">Brawl Stars Wiki</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body p-3 d-flex flex-column">
                        <p>Hostname IP: {ip}</p>
                        <div className="text-center mb-3">
                            <img src="https://static.vecteezy.com/system/resources/previews/027/127/543/non_2x/brawl-stars-logo-brawl-stars-icon-transparent-free-png.png" alt="Brawl Stars Wiki Logo" style={{ height: '150px', width: 'auto', display: 'block', margin: '0 auto', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }} />
                        </div>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '0.5rem 0 1rem' }} />
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <p href="#" className="nav-link active" style={{ fontSize: '18px', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', padding: '12px 16px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }} aria-current="page">
                                    🎮 Brawlers
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1" style={{ background: 'none', height: '100vh', overflowY: 'auto' }}>
                {/* Hero Header */}
                <div className="hero-header">
                    <h1 className="" style={{ color: '#fff', textAlign: 'center' }}>BRAWLERS</h1>
                </div>

                <div className="container py-4">

                    {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>Error: {error}</div>}
                    {loading && <div style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Loading brawlers...</div>}

                    <div className="content">

                        {view === 'grid' ? (
                            <div>
                                <div className="brawler-grid">
                                    {brawlers.map(brawler => (
                                        <div
                                            key={brawler.Id}
                                            className="brawler-card"
                                            onClick={() => handleBrawlerClick(brawler)}
                                        >
                                            <div className="brawler-card-image">
                                                <img src={brawler.ImageLink} alt={brawler.Name} />
                                            </div>
                                            <div className="brawler-card-name-overlay" title={brawler.Name}>{brawler.Name}</div>
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
                                                src={selectedBrawler.ImageLink}
                                                alt={selectedBrawler.Name}
                                                style={{ width: '180px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '1rem', background: 'linear-gradient(to top, rgba(0, 122, 222, 0.9) 0%, rgba(0, 122, 222, 0.7) 70%, transparent 100%)' }}
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
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.HealthByLevel?.['11'] || 'N/A'}</div>
                                            </div>
                                            <div className="stat" style={{ color: '#333', background: '#f7f7f7', borderRadius: 8 }}>
                                                <div className="stat-label" style={{ color: '#444' }}>Attack DMG</div>
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.Attack?.Damage || 'N/A'}</div>
                                            </div>
                                            <div className="stat" style={{ color: '#333', background: '#f7f7f7', borderRadius: 8 }}>
                                                <div className="stat-label" style={{ color: '#444' }}>Range</div>
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.Attack?.Range || 'N/A'}</div>
                                            </div>
                                            <div className="stat" style={{ color: '#333', background: '#f7f7f7', borderRadius: 8 }}>
                                                <div className="stat-label" style={{ color: '#444' }}>Reload</div>
                                                <div className="stat-value" style={{ color: '#0a68bf' }}>{selectedBrawler.Attack?.Reload ? `${selectedBrawler.Attack.Reload}s` : 'N/A'}</div>
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
                                                            <span>DMG: {selectedBrawler.Attack?.DamagePerShellLevel11 || selectedBrawler.Attack?.Damage || 'N/A'}</span>
                                                            <span>Range: {selectedBrawler.Attack?.Range || 'N/A'}</span>
                                                            <span>Projectiles: {selectedBrawler.Attack?.Projectiles || 'N/A'}</span>
                                                            <span>Reload: {selectedBrawler.Attack?.Reload ? `${selectedBrawler.Attack.Reload}s` : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {selectedBrawler.Super && selectedBrawler.Super.Range && (
                                                    <div className="ability" style={{ background: '#f7f7f7', color: '#222', borderRadius: 8 }}>
                                                        <div className="ability-badge super">SUPER</div>
                                                        <div className="ability-content">
                                                            <div className="ability-name" style={{ color: '#0a68bf' }}>Super Attack</div>
                                                            <div className="ability-stats">
                                                                {selectedBrawler.Super.DamagePerShellLevel11 && <span>DMG: {selectedBrawler.Super.Damage}</span>}
                                                                <span>Range: {selectedBrawler.Super.Range}</span>
                                                                {selectedBrawler.Super.Projectiles && <span>Projectiles: {selectedBrawler.Super.Projectiles}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedBrawler.StarPower && selectedBrawler.StarPower.Name && (
                                                    <div className="ability" style={{ background: '#f7f7f7', color: '#222', borderRadius: 8 }}>
                                                        <div className="ability-badge starpower">STAR<br />POWER</div>
                                                        <div className="ability-content">
                                                            <div className="ability-name" style={{ color: '#0a68bf' }}>{selectedBrawler.StarPower.Name}</div>
                                                            {selectedBrawler.StarPower.Description && (
                                                                <div className="ability-desc" style={{ color: '#444' }}>{selectedBrawler.StarPower.Description}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedBrawler.Gadgets && selectedBrawler.Gadgets.map((gadget, idx) => (
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

                                        {/* Comments Section */}
                                        <div className="comments-section mt-4" style={{ borderTop: '3px solid #a855f7', paddingTop: '1rem' }}>
                                            <h3 className="mb-3" style={{ color: '#fff' }}>COMMENTS</h3>

                                            {/* Add Comment Form */}
                                            <div className="add-comment mb-4 p-3" style={{ background: '#f7f7f7', borderRadius: 8 }}>

                                                <textarea
                                                    className="form-control mb-2"
                                                    placeholder="Write a comment..."
                                                    value={newCommentText}
                                                    onChange={(e) => setNewCommentText(e.target.value)}
                                                    rows="3"
                                                    style={{ background: '#fff', color: '#333' }}
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleAddComment(selectedBrawler.Id)}
                                                    disabled={commentLoading || !newCommentText.trim()}
                                                >
                                                    {commentLoading ? 'Posting...' : 'Post Comment'}
                                                </button>
                                            </div>

                                            {/* Comments List */}
                                            <div className="comments-list">
                                                {commentsLoading ? (
                                                    <p style={{ color: '#FFF' }}>Loading comments...</p>
                                                ) : (comments[selectedBrawler.Id] || []).length === 0 ? (
                                                    <p style={{ color: '#FFF' }}>No comments yet. Be the first to comment!</p>
                                                ) : (
                                                    (comments[selectedBrawler.Id] || []).map(comment => (
                                                        <div key={comment.commentId || comment.timestamp} className="comment mb-3 p-3" style={{ background: '#f7f7f7', borderRadius: 8 }}>
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <strong style={{ color: '#0a68bf' }}>{comment.author}</strong>
                                                                <small style={{ color: '#888' }}>{comment.date}</small>
                                                            </div>
                                                            <p style={{ color: '#333', margin: 0 }}>{comment.commentText}</p>
                                                        </div>
                                                    ))
                                                )}
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
