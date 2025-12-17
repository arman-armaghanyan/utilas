import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../context/SearchContext';
import '../../ComponentStyles/SearchStyles.css';

// Helper to extract text from rich content objects or plain strings
const getText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field.text) return field.text;
    return '';
};

export function GlobalSearchModal() {
    const {
        searchQuery,
        searchResults,
        isGlobalSearchOpen,
        isSearching,
        searchError,
        closeGlobalSearch,
        performSearch,
        clearSearch,
    } = useSearch();

    const inputRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    // Focus input when modal opens
    useEffect(() => {
        if (isGlobalSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isGlobalSearchOpen]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isGlobalSearchOpen) {
                e.preventDefault();
                closeGlobalSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isGlobalSearchOpen, closeGlobalSearch]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isGlobalSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isGlobalSearchOpen]);

    // Debounced search handler
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        
        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Debounce the search to avoid too many API calls
        debounceRef.current = setTimeout(() => {
            performSearch(value);
        }, 300);
    }, [performSearch]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const handleClear = useCallback(() => {
        clearSearch();
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    }, [clearSearch]);

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            closeGlobalSearch();
        }
    }, [closeGlobalSearch]);

    const handleResultClick = useCallback((toolId) => {
        closeGlobalSearch();
        clearSearch();
        navigate(`/app/${toolId}`);
    }, [closeGlobalSearch, clearSearch, navigate]);

    if (!isGlobalSearchOpen) {
        return null;
    }

    const hasResults = searchResults && searchResults.length > 0;
    const hasNoResults = searchResults && searchResults.length === 0 && searchQuery && !isSearching;
    const showHint = !searchQuery && !isSearching;

    return (
        <div className="global-search-overlay" onClick={handleBackdropClick}>
            <div className="global-search-modal">
                <div className="global-search-modal__header">
                    <div className="global-search-modal__input-wrapper">
                        <svg 
                            className="global-search-modal__search-icon" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            className="global-search-modal__input"
                            placeholder="Search tools..."
                            defaultValue={searchQuery}
                            onChange={handleInputChange}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                        {isSearching && (
                            <div className="global-search-modal__spinner" />
                        )}
                        {searchQuery && !isSearching && (
                            <button 
                                className="global-search-modal__clear"
                                onClick={handleClear}
                                aria-label="Clear search"
                            >
                                <svg 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button 
                        className="global-search-modal__close"
                        onClick={closeGlobalSearch}
                        aria-label="Close search"
                    >
                        <kbd>ESC</kbd>
                    </button>
                </div>

                {/* Search Results */}
                <div className="global-search-modal__results">
                    {isSearching && (
                        <div className="global-search-modal__loading">
                            <div className="global-search-modal__spinner" />
                            <span>Searching...</span>
                        </div>
                    )}

                    {searchError && (
                        <div className="global-search-modal__error">
                            {searchError}
                        </div>
                    )}

                    {hasResults && (
                        <div className="global-search-modal__results-list">
                            {searchResults.map((tool) => (
                                <button
                                    key={tool.id}
                                    className="global-search-modal__result-item"
                                    onClick={() => handleResultClick(tool.id)}
                                >
                                    <div 
                                        className="global-search-modal__result-thumb"
                                        style={{ backgroundImage: `url(${tool.thumbnail})` }}
                                    />
                                    <div className="global-search-modal__result-content">
                                        <h4 className="global-search-modal__result-title">
                                            {getText(tool.title)}
                                        </h4>
                                        <p className="global-search-modal__result-summary">
                                            {getText(tool.summary)}
                                        </p>
                                    </div>
                                    <svg 
                                        className="global-search-modal__result-arrow"
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}

                    {hasNoResults && (
                        <div className="global-search-modal__empty">
                            <svg 
                                className="global-search-modal__empty-icon"
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                                <path d="M8 8l6 6" />
                                <path d="M14 8l-6 6" />
                            </svg>
                            <h4 className="global-search-modal__empty-title">No tools found</h4>
                            <p className="global-search-modal__empty-text">
                                No results for "{searchQuery}". Try a different search term.
                            </p>
                        </div>
                    )}

                    {showHint && (
                        <div className="global-search-modal__hint">
                            Type to search for tools or press <kbd>ESC</kbd> to close
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}