import React from "react";

function InfoTooltip({ isOpen, image, onClose, text}) {
  return (
    <div className={`popup  ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <img className="popup__infoTooltip-image" src={image} />
        <p className="popup__InfoTooltip-text">{text}</p>
        <button className="popup__button-close " type="button" onClick={onClose}></button>
      </div>
    </div>
  )
}
export default InfoTooltip