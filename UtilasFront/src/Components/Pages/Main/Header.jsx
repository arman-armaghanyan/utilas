import {Link} from 'react-router-dom';
import '../../ComponentStyles/HeaderCss.css';

export function Header() {
    return (
        <header className="app-header">
            <div className="app-header__brand">
                <Link to="/" className="app-header__logo">
                    Utilas<span>Mini</span>
                </Link>
                <p className="app-header__tagline">Curated tools for everyday tasks</p>
            </div>
            <nav className="app-header__nav">
                <a href="#mini-tools" className="app-header__nav-link">
                    Tools
                </a>
                <a href="mailto:hello@utilas.app" className="app-header__nav-link">
                    Contact
                </a>
                <a
                    href="https://github.com/"
                    className="app-header__cta"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>
            </nav>
        </header>
    );
}