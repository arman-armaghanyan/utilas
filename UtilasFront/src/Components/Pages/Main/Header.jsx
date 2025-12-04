import {Link} from 'react-router-dom';
import {useState} from 'react';
import '../../ComponentStyles/HeaderCss.css';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={`app-header ${isMenuOpen ? 'app-header--menu-open' : ''}`}>
            <div className="app-header__brand">
                <Link to="/" className="app-header__logo">
                    Utilas
                </Link>
            </div>
            <button 
                className="app-header__burger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className={`app-header__nav ${isMenuOpen ? 'app-header__nav--open' : ''}`}>
                <a href="#mini-tools" className="app-header__nav-link" onClick={() => setIsMenuOpen(false)}>
                    Tools
                </a>
                <a href="mailto:hello@utilas.app" className="app-header__nav-link" onClick={() => setIsMenuOpen(false)}>
                    Contact
                </a>
            </nav>
        </header>
    );
}