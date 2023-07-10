const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUserId,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");
router.get("/users", getUsers);
//6. Создайте контроллер и роут для получения информации о пользователе
router.get("/users/me", getCurrentUser);
router.get(
  "/users/:userId",
  celebrate({
    // валидируем параметры
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).hex().required(),
    }),
  }),
  getUserId
);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
    }),
  }),
  updateAvatar
);
module.exports = router;
