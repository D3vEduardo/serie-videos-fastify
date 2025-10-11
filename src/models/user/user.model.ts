import mongoose from "mongoose";
import { UserModelType } from "./user.type";

export const UserSchema = new mongoose.Schema<UserModelType>({
  name: String,
  email: String,
  age: Number,
});

export const UserModel = mongoose.model<UserModelType>("User", UserSchema);
