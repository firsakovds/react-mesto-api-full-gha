import "../styles/index.css";
import React from "react";
function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup popup_type_image-closer ${card.link && "popup_opened"}`}
    >
      <div className="popup__image-container">
        <img className="popup__photo" src={card.link} alt={card.name} />
        <p className="popup__photo-text">{card.name}</p>
        <button
          type="button"
          className="popup__button-close popup__button-close_type_image"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}
export default ImagePopup;
