const mongoose = require("mongoose");
const Card = require("../models/card");
const BadRequestError = require('../errors/BadRequestError');
const UserNotFound = require('../errors/UserNotFound');
const HttpForbiddenError = require('../errors/HttpForbiddenError')
//найдем все карточки
module.exports.getCards = (req, res, next) => {
  return Card.find({})
    .then((card) => {
      return res.status(200).send({ card });
    })
    .catch((err) => {
      next(err)
    });
};
//создадим каточку
module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => {
      return res.status(201).send({ card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'))
      } else {
        next(err)
      }
    });
};
//удалим карточку
module.exports.deleteCards = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new UserNotFound('Карточка не найдена')
      } if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new HttpForbiddenError('Карточка не ваша')
      } else {
        return Card.findByIdAndDelete(cardId)
      }
    })
    .then(() => {
      return res.status(200).send({ message: 'Карточка удалена' })
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Неверный id'))
      } else {
        next(err)
      }
    });
};
// поставим лайк
module.exports.likeCard = (req, res, next) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new UserNotFound('Карточка не найдена')
      } else {
        return res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Неверный id'))
      } else {
        next(err);
      }
    });
};
//уберем лайк
module.exports.dislikeCard = (req, res, next) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new UserNotFound('Карточка не найдена')
      } else {
        return res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Неверный id'))
      } else {
        next(err)
      }
    });
};
