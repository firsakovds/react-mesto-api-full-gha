const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const helmet = require("helmet");
const { login, createUsers } = require("./controllers/users");
const auth = require('./middlewares/auth');
const { celebrate, Joi, errors } = require('celebrate');
const UserNotFound = require("./errors/UserNotFound");
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
mongoose
  //использовал .connect("mongodb://0.0.0.0:27017/mestodb", с loсalhost не было ответа от сервера
  .connect("mongodb://0.0.0.0:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Хьюстон! Мы на связи!");
  });
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//4. Создайте роут для логина и регистрации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/)
  }),
}), createUsers);
app.use(auth);
app.use("/", userRouter);
app.use("/", cardRouter);
app.use("*", (req, res, next) => {
   next(new UserNotFound('Такого роута нет'));
   return
});
app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
  next();
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
