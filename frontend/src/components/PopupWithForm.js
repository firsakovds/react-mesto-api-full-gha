import "../styles/index.css"
import React from "react";
function PopupWithForm(props) {
  return (
    <div className={props.isOpen ? `popup popup_type_${props.name} popup_opened` : `popup popup_type_${props.name}`}>
      <div className="popup__container">
        <h3 className="popup__title">{props.title}</h3>
        <form onSubmit={props.onSubmit} name={`${props.name}`} className={`popup__form popup__form_type_${props.name}`}>
          <fieldset className="popup__fielset">
            {props.children}
            <button type="submit" className={`popup__button popup__${props.name}`} >{props.buttonText || "Сохранить"}</button>
          </fieldset>
        </form>
        <button type="button" onClick={props.onClose} className={`popup__button-close popup__button-close_type_${props.name}`}></button>
      </div>
    </div>
  )
}
export default PopupWithForm