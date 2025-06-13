import { Schema, model } from "mongoose";

export interface UserI {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  email: string;
  password: string;
  role?: "admin" | "user";
  full_name?: string; // Virtual field
}
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

const User = model("User", userSchema);
export default User;
