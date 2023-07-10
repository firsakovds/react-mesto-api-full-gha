import React from "react";
import PopupWithForm from "./PopupWithForm";
function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = React.useState('')
  const [link, setLink] = React.useState('')
  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleLinkChange(e) {
    setLink(e.target.value);
  }
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onAddPlace({
      name,
      link: link,
    });
  }
  React.useEffect(() => {
    return () => {
      setName('');
      setLink('');
    }

  }, [isOpen]);
  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="create "
      title="Новое место"
      buttonText="Создать"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="name"
        id="input-space"
        placeholder="Название"
        className="popup__input popup__input_place_space"
        minLength="2"
        maxLength="30"
        title="Длина поля должна быть 2 и более символов и менее или равно 30"
        required
        value={name}
        onChange={handleNameChange}
      />
      <span className="popup__error popup__error_type_space"></span>
      <input
        type="url"
        name="link"
        id="input-link"
        placeholder="Ссылка на картинку"
        className="popup__input popup__input_place_link"
        title="Введите адрес сайта"
        required
        value={link}
        onChange={handleLinkChange}
      />
    </PopupWithForm>
  )
}
export default AddPlacePopup