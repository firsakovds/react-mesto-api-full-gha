//Контроллер в express также называют «последней мидлвэрой».
//Потому что внутри неё мы не вызываем next, а возвращаем ответ пользователю.
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpConflictError = require('../errors/httpConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UserNotFound = require('../errors/UserNotFound');
const UnauthorizedError = require('../errors/UnauthorizedError');

//создать юзера 2. Доработайте контроллер createUser
module.exports.createUsers = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({
        name, about, avatar, email, password: hash
      })
    })
    .then((user) => {
      return res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        // Обработка ошибки
        return next(new HttpConflictError('пользователь пытается зарегистрироваться по уже существующему в базе email'))
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'))
      } else {
        next(err);
      }
    });
};

//3. Создайте контроллер login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },//Пейлоуд токена — зашифрованный в строку объект пользователя.
        'some-secret-key',
        { expiresIn: '7d' } // токен будет просрочен через 7 дней после создания
      );
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      next(err)
    });
};

//найдем всех юзеров
module.exports.getUsers = (req, res, next) => {
  return User.find({})
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch((err) => {
      next(err)
    });
};
//найдем конкретного юзера
module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new UserNotFound('Юзер не найден')
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Неверный id'))
      } else {
        next(err)
      }
    });
};
//обновим профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new UserNotFound('Юзер не найден')
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'))
      } else {
        next(err)
      }
    });
};
//обновим аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new UserNotFound('Юзер не найден')

      } else {
        return res.status(200).send({ user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'))
      } else {
        next(err)
      }
    });
};
//6. Создайте контроллер и роут для получения информации о пользователе
module.exports.getCurrentUser = (req, res, next) => {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new UserNotFound('Юзер не найден')
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((err) => {
      next(err)
    });
};