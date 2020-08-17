const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
  },
  token: {
    type: String,
  },
  channel: {
    type: String,
  },
});

UserSchema.method("toJSON", function () {
  const object = this.toObject();
  delete object.password;
  return object;
});

module.exports = model("User", UserSchema);
