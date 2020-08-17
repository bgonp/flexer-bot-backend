const { Mongoose } = require("mongoose");

const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("db connected");
  } catch (error) {
    console.log("db connection error");
    throw new Error("db connection error");
  }
};

module.exports = connection;
