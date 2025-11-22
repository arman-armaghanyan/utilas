import {Link, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import '../../ComponentStyles/DetailPage.css';

export function MiniToolDetail() {
    const {appId} = useParams();
    const navigate = useNavigate();

    const [tool, setTool] = useState();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;


        const fetchTool = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:4010/api/tools');

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data = await response.json();

                if (!isMounted || !Array.isArray(data)) {
                    return;
                }

                const normalizedRemote = data
                    .filter(Boolean)
                    .find((item) => item.id === appId);

                setTool(normalizedRemote ?? null);
            } catch (err) {
                console.error('Unable to load tool detail', err);
                if (isMounted) {
                    setError('Could not load this tool right now.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchTool();

        return () => {
            isMounted = false;
        };
    }, [appId]);

    if (isLoading) {
        return (
            <section className="detail-shell__empty">
                <h2>Loading…</h2>
                <p>We are fetching the latest information about this tool.</p>
            </section>
        );
    }

    if (!tool) {
        return (
            <section className="detail-shell__empty">
                <h2>Tool not found</h2>
                <p>The mini app you are trying to open may have moved or been removed.</p>
                {error ? <p>{error}</p> : null}
                <Link to="/" className="detail-shell__home">
                    Return home
                </Link>
            </section>
        );
    }

    if (!tool) {
        return (
            <section className="detail-shell__empty">
                <h2>Tool not found</h2>
                <p>The mini app you are trying to open may have moved or been removed.</p>
                {error ? <p>{error}</p> : null}
                <Link to="/" className="detail-shell__home">
                    Return home
                </Link>
            </section>
        );
    }

    return (
        <section className="detail-shell">
            <button className="detail-shell__back" type="button" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <header className="detail-shell__header">
                <h1 className="detail-shell__title">{tool.title}</h1>
                <p className="detail-shell__summary">{tool.summary}</p>
            </header>
            <iframe
                className="detail-shell__iframe"
                src={tool.iframeUrl}
                title={tool.title}
                allow="clipboard-write; fullscreen; accelerometer; gyroscope"
            />
            <article className="detail-shell__info">
                <h2>About this tool</h2>
                <p>{tool.description}</p>
                <a
                    className="detail-shell__visit"
                    href={tool.iframeUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    Open in new tab →
                </a>
            </article>
        </section>
    );
}

