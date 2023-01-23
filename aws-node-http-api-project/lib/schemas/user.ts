import mongoose, { Model, Schema } from "mongoose";

const UserSchema = new Schema({
    fullName: String,
    email: String,
    password: String
  });

export const User: Model<any> = mongoose.model('User', UserSchema);