const router = require("express").Router();
const {celebrate, Joi} = require('celebrate');
const {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
router.get("/cards", getCards);

router.post("/cards", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/)
  }),
}), createCards);

router.delete("/cards/:cardId", celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCards);

router.put("/cards/:cardId/likes", celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

router.delete("/cards/:cardId/likes", celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
