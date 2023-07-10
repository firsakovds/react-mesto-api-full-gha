import React from "react"
import "../styles/index.css"
import api from "../utils/Api"
import Card from "./Card"
import Spinner from "./Spinner"
import { CurrentUserContext } from "../contexts/CurrentUserContext"
function Main(props) {
  const currentUser = React.useContext(CurrentUserContext)
  return (
    <main className="content">
      <section className="profile">
        <button className="profile__avatar-button" onClick={props.onEditAvatar}></button>
        <img className="profile__avatar" src={currentUser.avatar} alt="изображение человека" />
        <div className="profile__info">
          <div className="profile__name">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button type="button" onClick={props.onEditProfile} className="profile__edit-button"></button>
          </div>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button type="button" className="profile__add-button" onClick={props.onAddPlace}></button>
      </section>
      <section className="elements">
        {props.isLoading ? <Spinner /> :
          props.cards.map((card) => (
            <Card card={card} key={card._id} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} />
          ))}
      </section>
    </main>
  )
}
export default Main
