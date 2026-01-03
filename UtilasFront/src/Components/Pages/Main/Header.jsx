import {Link, useLocation} from 'react-router-dom';
import {useState, useEffect, useCallback} from 'react';
import {useSearch} from '../../../context/SearchContext';
import '../../ComponentStyles/HeaderCss.css';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    const { openGlobalSearch } = useSearch();
    
    // Check if we are on a detail page
    const isDetailPage = location.pathname.startsWith('/app/');

    // Close menu handler
    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    useEffect(() => {
        // If not on detail page, always show header
        if (!isDetailPage) {
            setIsVisible(true);
            return;
        }

        // On detail page, header is initially hidden and shown on scroll
        setIsVisible(false);

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = window.innerHeight * 0.5;
            setIsVisible(scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDetailPage]);

    // Handle Cmd/Ctrl + K or Cmd/Ctrl + / keyboard shortcut and ESC to close menu
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === '/')) {
                e.preventDefault();
                openGlobalSearch();
            }
            if (e.key === 'Escape' && isMenuOpen) {
                e.preventDefault();
                closeMenu();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [openGlobalSearch, isMenuOpen, closeMenu]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const handleSearchClick = (e) => {
        e.preventDefault();
        openGlobalSearch();
        setIsMenuOpen(false);
    };

    const headerClass = `app-header ${isMenuOpen ? 'app-header--menu-open' : ''} ${isDetailPage ? 'app-header--detail' : ''} ${!isVisible && isDetailPage ? 'app-header--hidden' : ''}`;

    return (
        <>
            {/* Backdrop overlay - click to close */}
            <div 
                className={`app-header__backdrop ${isMenuOpen ? 'app-header__backdrop--visible' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            />
            
            <header className={headerClass}>
                <div className="app-header__brand">
                    <Link to="/" className="app-header__logo">
                        Utilas
                    </Link>
                </div>
                <button 
                    className="app-header__burger"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav className={`app-header__nav ${isMenuOpen ? 'app-header__nav--open' : ''}`}>
                    {/* Close button */}
                    <button 
                        className="app-header__close"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                        </svg>
                    </button>
                    
                    <a 
                        href="#" 
                        className="app-header__nav-link app-header__nav-link--search" 
                        onClick={handleSearchClick}
                    >
                        <span>Search</span>
                        <kbd className="app-header__hotkey">
                            {navigator.platform.indexOf('Mac') > -1 ? '⌘' : 'Ctrl+'}K
                        </kbd>
                    </a>
                </nav>
            </header>
        </>
    );
}
