const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String, // тип — String
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator() {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
        },
      },
    },
    owner: {
      required: [true, 'Поле "owner" должно быть заполнено'],
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
    },
    likes: [
      {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId,
        default: [],
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);
// создаём модель и экспортируем её
module.exports = mongoose.model("card", cardSchema);
