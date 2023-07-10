import React from "react";

function Login({ onLogin }) {
  const [userData, setUserData] = React.useState({
    email: '',
    password: '',
  });
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setUserData({
      ...userData, 
      [name]: value
    });
  }
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin(userData);
    setUserData({ email: '', password: '' });
  }
  return (
    <div className="auth__component">
      <h2 className="auth__component-title">Вход</h2>
      <form className="auth__component-form" onSubmit={handleSubmit}>
        <input
          className="auth__input-email"
          id="email"
          name="email"
          type="email"
          value={userData.email || ''}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="auth__input-password"
          id="password"
          type="password"
          placeholder="Пароль"
          value={userData.password || ''}
          onChange={handleChange}
          name="password"
          required
        />
        <button type="submit" className="auth__button auth__button-register">
          Войти
        </button>
      </form>
    </div>
  );
}
export default Login