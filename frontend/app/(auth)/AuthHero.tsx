// Shared Auth hero panel — used on all auth pages
export function AuthHero({
    title,
    titleAccent,
    subtitle,
}: {
    title: string;
    titleAccent: string;
    subtitle: string;
}) {
    return (
        <div className="auth-hero">
            {/* Logo */}
            <div className="auth-hero-logo">
                <div className="auth-hero-logo-icon">⚡</div>
                <span>IBA Platform</span>
            </div>

            {/* Hero content */}
            <div className="auth-hero-content">
                <h1 className="auth-hero-headline">
                    {title}
                    <br />
                    <span>{titleAccent}</span>
                    <br />
                    Intelligence.
                </h1>
                <p className="auth-hero-sub">{subtitle}</p>

                {/* Feature cards */}
                <div className="auth-feature-cards">
                    <div className="auth-feature-card">
                        <div className="auth-feature-card-icon">📡</div>
                        <h4>Real-time Data</h4>
                        <p>Live monitoring systems</p>
                    </div>
                    <div className="auth-feature-card">
                        <div className="auth-feature-card-icon">🔒</div>
                        <h4>Secure Core</h4>
                        <p>Enterprise-grade safety</p>
                    </div>
                    <div className="auth-feature-card">
                        <div className="auth-feature-card-icon">⚡</div>
                        <h4>Instant Deploy</h4>
                        <p>One-click automation</p>
                    </div>
                    <div className="auth-feature-card">
                        <div className="auth-feature-card-icon">📊</div>
                        <h4>ROI Analytics</h4>
                        <p>Track time & cost saved</p>
                    </div>
                </div>

                {/* System status */}
                <div className="auth-hero-status">
                    <span className="auth-hero-status-dot" />
                    SYSTEM STATUS · All nodes active
                </div>
            </div>

            {/* Footer links */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                {['Documentation', 'Support Portal', 'Privacy Policy', 'Global Network'].map((l) => (
                    <a key={l} href="#" className="auth-footer-link">{l}</a>
                ))}
            </div>
        </div>
    );
}
