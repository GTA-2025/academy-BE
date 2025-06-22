import { Schema, model } from "mongoose";
import { UserRole, OnboardingStatus } from "../types/user.types";

export interface UserI {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  email: string;
  password: string;
  role?: UserRole;
  full_name?: string; // Virtual field
  agree_terms: boolean;
}
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    agree_terms: {
      type: Boolean,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    onboarded: { type: Boolean, default: false },
    onboardingStatus: {
      type: String,
      enum: Object.values(OnboardingStatus),
      default: OnboardingStatus.NOT_STARTED,
    },
    profile: {
      bio: { type: String, default: "" },
      user_name: { type: String, default: "" },
      website: { type: String, default: "" },
      profile_image: { type: String, default: "" },
      avatar: { type: String, default: "" },
      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
    },
    // Additional fields for user verification and password reset
    is_verified: { type: Boolean, default: false },
    verify_email_token: String,
    verify_email_token_expires: Date,
    reset_password_token: String,
    reset_password_token_expires: Date,
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
