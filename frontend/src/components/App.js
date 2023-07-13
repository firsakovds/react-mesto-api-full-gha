import "../styles/index.css";
import React from "react";
import { Routes, Route, Navigate, useNavigate} from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import imageError from "../images/signDown.svg";
import imageSuccess from "../images/signUp.svg";
import auth from "../utils/Auth";
function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [infoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [infoTooltipImage, setInfoTooltipImage] = React.useState(null);
  const [text, setText] = React.useState('');
  const navigate = useNavigate();
  function tokenCheck() {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          if (res.data) {
            setUserEmail(res.data.email);
            setLoggedIn(true);
            navigate("/");           
             
          }
        })
        .catch((err) => {
          console.log(err);;
        })
    }
  }
  React.useEffect(() => {
    //setIsLoading(true);
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
         // setIsLoading(false);
        });
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    tokenCheck()
  }, []);

  function handleRegister(registerData) {
    auth.register(registerData)
      .then(() => {
        setInfoTooltipImage(imageSuccess);
        setText("Вы успешно зарегистрировались!");
        setInfoTooltipOpen(true);
        navigate("/sign-in");
      })
      .catch((err) => {
        setInfoTooltipOpen(true);
        setInfoTooltipImage(imageError);
        setText("Что-то пошло не так! Попробуйте ещё раз.");
        console.log(err);
      });
  }

  function handleLogin(loginData) {
    auth.authorize(loginData)
      .then((res) => {
        if (res.token) {
          setLoggedIn(true);
          localStorage.setItem("jwt", res.token);
          tokenCheck();
          navigate('/');
        }
      })
      .catch((err) => {
        setInfoTooltipOpen(true);
        setInfoTooltipImage(imageError);
        setText("Что-то пошло не так! Попробуйте ещё раз.");
        console.log(err);
      })
  }
  //удаляем токен
  function handleSingOut() {
    localStorage.removeItem("jwt")
    setLoggedIn(false)
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setInfoTooltipOpen(false)
  }
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id && c));
    })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateUser(name, about) {
    api
      .patchUserInfo(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateAvatar(avatar) {
    api
      .patchAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleAddPlaceSubmit(data) {
    api
      .postNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          isLoggedIn={isLoggedIn}
          onSignOut={handleSingOut}
          userEmail={userEmail}
        />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
              isLoading={isLoading}
            />} />
          <Route path="/sign-up" element={<Register onRegister={handleRegister} />} />
          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />} />
        </Routes>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <InfoTooltip
          isOpen={infoTooltipOpen}
          onClose={closeAllPopups}
          text={text}
          image={infoTooltipImage} />
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
