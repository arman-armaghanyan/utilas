import '../../ComponentStyles/MainLayout.css';

export function Footer() {
    return (
        <footer className="app-footer">
            <div className="app-footer__links">
                <div>
                    <h3>Resources</h3>
                    <a href="#mini-tools">Tool catalog</a>
                    <a href="mailto:hello@utilas.app">Support</a>
                    <a href="https://github.com/" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                </div>
                <div>
                    <h3>Stay in the loop</h3>
                    <p>
                        Get quarterly updates about new utilities and features delivered straight to your
                        inbox.
                    </p>
                    <form className="app-footer__form">
                        <input type="email" name="email" placeholder="you@example.com" />
                        <button type="submit">Notify me</button>
                    </form>
                </div>
            </div>
            <div className="app-footer__note">
                © {new Date().getFullYear()} Utilas. Crafted with care for modern makers.
            </div>
        </footer>
    );
}