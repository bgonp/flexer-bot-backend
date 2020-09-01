const { Schema, model } = require("mongoose");
const CryptoJS = require("crypto-js");

const BotSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  channel: {
    type: String,
  },
  avatar: {
    type: String,
  },
  refresh: {
    type: String,
  },
});

BotSchema.method("toJSON", function () {
  const object = this.toObject();

  return {
    id: object._id,
    username: object.username,
    token: CryptoJS.AES.decrypt(object.token, process.env.AES_SECRET).toString(
      CryptoJS.enc.Utf8
    ),
    channel: object.channel,
    avatar: object.avatar,
  };
});

module.exports = model("Bot", BotSchema);
