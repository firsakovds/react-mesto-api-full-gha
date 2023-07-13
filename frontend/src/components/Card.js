import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext"
function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext)
  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = (`element__delete-button ${!isOwn && 'element__delete-button_hidden'}`)
  const isLiked = card.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = (`element__like ${isLiked && 'element__like_active'}`);
  function handleClick() {
    onCardClick(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }
  function handleDeleteClick() {
    onCardDelete(card)
  }
  return (
    <div className="element">
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <img
        className="element__foto"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <div className="element__group">
        <h2 className="element__title">{card.name}</h2>
        <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
        <p className="element__like-counter">{card.likes.length}</p>
      </div>
    </div>
  );
}
export default Card;
