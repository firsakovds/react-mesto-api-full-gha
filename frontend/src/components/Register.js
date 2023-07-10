import React from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [userData, setUserData] = React.useState({
    email: '',
    password: '',
  });
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onRegister(userData);
  };
  return (
    <div className="auth__component">
      <h2 className="auth__component-title">Регистрация</h2>
      <form className="auth__component-form" onSubmit={handleSubmit}>
        <input
          className="auth__input-email"
          id="email"
          type="email"
          placeholder="Email"
          name="email"
          value={userData.email || ''}
          onChange={handleChange}
          required
        />
        <input
          className="auth__input-password"
          id="password"
          type="password"
          placeholder="Пароль"
          name="password"
          value={userData.password || ''}
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth__button auth__button-register">
          Зарегистрироваться
        </button>
      </form>
      <div className="auth__register-signin">
        <p className="auth__register-signin_type_text">Уже зарегистрированы?</p>
        <Link className="auth__register-signin_type_link" to="/sign-in">
          Войти
        </Link>
      </div>
    </div>
  );
}

export default Register;
