const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//mongoose.connect(); // it will give us promise so we will be using sync away

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("mongoDB connected");
  } catch (err) {
    console.log(err.message);
    // exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
