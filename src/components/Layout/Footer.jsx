// src/components/Layout/Footer.jsx
import React from 'react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="footer-content">
                {/* Left Section */}
                <div className="footer-section">
                    <div className="footer-brand">
                        <span className="footer-logo">📄</span>
                        <span className="footer-name">DocTranslate</span>
                    </div>
                    <p className="footer-tagline">
                        AI-Powered Document Translation
                    </p>
                </div>

                {/* Middle Section - Links */}
                <div className="footer-section">
                    <div className="footer-links">
                        <a href="#about" className="footer-link">About</a>
                        <a href="#privacy" className="footer-link">Privacy</a>
                        <a href="#terms" className="footer-link">Terms</a>
                        <a href="#contact" className="footer-link">Contact</a>
                    </div>
                </div>

                {/* Right Section */}
                <div className="footer-section">
                    <div className="footer-stats">
                        <div className="stat-item">
                            <span className="stat-value">5</span>
                            <span className="stat-label">Languages</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">90%+</span>
                            <span className="stat-label">Accuracy</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">Free</span>
                            <span className="stat-label">Forever</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <p className="copyright">
                    © {currentYear} DocTranslate. Built with ❤️ using n8n & React
                </p>
                <div className="footer-tech">
                    <span className="tech-badge">n8n</span>
                    <span className="tech-badge">React</span>
                    <span className="tech-badge">LibreTranslate</span>
                </div>
            </div>
        </footer>
    );
}