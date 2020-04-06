// this is user model
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  date: { type: Date, default: Date.now },
});

// export variable that is having model which takes modelname and schema
module.exports = User = mongoose.model("User", UserSchema);
