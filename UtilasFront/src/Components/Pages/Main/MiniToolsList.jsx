import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import '../../ComponentStyles/MainLayout.css';

export function MiniToolsList() {
    const [tools, setTools] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadRemoteTools = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:4011/api/tools');

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
                    <Link key={tool.id} to={`/app/${tool.id}`} className="mini-card">
                        <article className="mini-card__body">
                            <div
                                className="mini-card__thumb"
                                style={{backgroundImage: `url(${tool.thumbnail})`}}
                                aria-hidden="true"
                            />
                            <div className="mini-card__content">
                                <h2 className="mini-card__title">{tool.title}</h2>
                                <p className="mini-card__summary">{tool.summary}</p>
                            </div>
                        </article>
                    </Link>
                ))}
            </section>
        </main>
    );
}

