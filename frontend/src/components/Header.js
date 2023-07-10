import "../styles/index.css"
import { Routes, Route, Link } from "react-router-dom"
import logo from "../images/header-logo.svg"
function Header({ userEmail, onSignOut }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип" />
      <Routes>
        (isLoggedIn ?
        (<Route path="/" element={
          <Link to="/sign-in" onClick={onSignOut} className="header__auth">
            <p className="header__user-email" >{userEmail}</p>
            <p className="header__link">Выйти</p>
          </Link>} />
        )
        : (<Route path="/sign-in" element={<Link to="/sign-up" className="header__link">Регистрация</Link>} />)
        )
        <Route path="/sign-up" element={<Link to="/sign-in" className="header__link">Войти</Link>} />
      </Routes>
    </header>
  )
}
export default Header;