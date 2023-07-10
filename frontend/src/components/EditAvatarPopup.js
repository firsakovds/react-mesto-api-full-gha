import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditAvatarPopup({isOpen,onClose, onUpdateAvatar}) {
  const currentUser = React.useContext(CurrentUserContext)
  const avatarRef = React.useRef();
  React.useEffect(() => {
    avatarRef.current.value = ''
  }, [currentUser]); 

  function handleSubmit(e) {
    e.preventDefault();
  
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  } 
  return (
    <PopupWithForm
        isOpen={isOpen}
        onClose={onClose}
        name="save-avatar"
        title="Обновить аватар" 
        onSubmit={handleSubmit}       
      >
        <input
          type="url"
          name="avatar"
          id="input-avatar"
          placeholder="Ссылка на аватар"
          className="popup__input popup__input_type_avatar-link"
          title="Введите адрес сайта"
          required
          ref={avatarRef}
        />
        <span className="popup__error popup__error_type_link"></span>
      </PopupWithForm>

  )
}
export default EditAvatarPopup