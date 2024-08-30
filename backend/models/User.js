import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'username is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.post("save", async function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error(`${Object.keys(error.keyValue)[0]} already exists`));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
