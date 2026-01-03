import {Link, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import '../../ComponentStyles/MainLayout.css';
import {API_URL, BASE_API_URL} from '../../../config';

// Helper to extract text from rich content objects or plain strings
const getText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field.text) return field.text;
    return '';
};

export function MiniToolsList() {
    const location = useLocation();
    const [tools, setTools] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadRemoteTools = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_API_URL}/${API_URL}`);

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data = await response.json();

                if (isMounted && Array.isArray(data)) {
                    setTools(data);
                }
            } catch (err) {
                console.error('Failed to fetch tools list', err);
                if (isMounted) {
                    setError('Could not load the latest tools.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadRemoteTools();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main className="page-shell" id="mini-tools">
            <section className="hero">
                <span className="hero__eyebrow">Utilas</span>
                <h1 className="hero__title">Discover compact productivity helpers</h1>
                <p className="hero__subtitle">
                    A curated collection of in-browser utilities for design, collaboration, and content
                    work.
                </p>
            </section>

            {error && <div className="mini-grid__alert">{error}</div>}

            {isLoading && <div className="mini-grid__alert">Loading new tools…</div>}

            <section className="mini-grid">
                {tools.map((tool) => (
                    <Link key={tool.id} to={`/app/${tool.id}`} state={{ from: location.pathname }} className="mini-card">
                        <div className="mini-card__visual">
                            <div
                                className="mini-card__thumb"
                                style={{backgroundImage: `url(${tool.thumbnail})`}}
                                aria-hidden="true"
                            />
                        </div>
                        <div className="mini-card__content">
                            <h2 className="mini-card__title">{getText(tool.title)}</h2>
                            <p className="mini-card__summary">{getText(tool.summary)}</p>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}
