import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const currentUser = React.useContext(CurrentUserContext)

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }
  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="edit-profile"
      title="Редактировать профиль"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="name"
        id="input-name"
        placeholder="Введите имя"
        className="popup__input popup__input_place_name"
        minLength="2"
        maxLength="40"
        title="Длина поля должна быть 2 и более символов и менее или равно 40"
        required
        value={name || ''}
        onChange={handleNameChange}
      />
      <span className="popup__error popup__error_type_name"></span>
      <input
        type="text"
        name="about"
        id="input-job"
        placeholder="Введите род деятельности"
        className="popup__input popup__input_place_job"
        minLength="2"
        maxLength="200"
        title="Длина поля должна быть 2 и более символов и менее или равно 200"
        required
        //в консоли вылезло сообщение что поля должны быть под управлением поэтому указал или значение или пусто
        value={description || ''}
        onChange={handleDescriptionChange}
      />
      <span className="popup__error popup__error_type_job"></span>
    </PopupWithForm>

  )
}
export default EditProfilePopup;