import './ComponentStyles/HeaderCss.css'

export function Header() {
    return (
        <>
            <div className="app-header">
                <div className="app-header__left">
                    Logo
                </div>
                <div className="app-header__center">
                    Utilas
                </div>
                <div className="app-header__right">
                    Cooser
                </div>
            </div>
        </>
    )
}