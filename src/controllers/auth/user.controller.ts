import { Request, Response } from "express";
import User from "../../models/user.model";
import { UserI } from "../../models/user.model";
import {
  successApiResponse,
  errorApiResponse,
  ApiResponseCode,
  errMessage,
} from "../../utils/apiResponse";
import { validationResult } from "express-validator";
import * as argon2 from "argon2";

export const createUser = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorApiResponse(
        res,
        "Validation Error",
        errMessage.VALIDATION_ERROR,
        ApiResponseCode.BAD_REQUEST,
        "error"
      );
    }

    const { first_name, last_name, phone, country, email, password }: UserI =
      req.body;

    /**
     * Check if the email already exists in the database
     * If it does, return a 409 Conflict error
     * This prevents duplicate email registrations
     */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorApiResponse(
        res,
        "Email already exists",
        errMessage.BAD_REQUEST,
        ApiResponseCode.CONFLICT,
        "error"
      );
    }

    // Create a new user instance
    /**
     * Create a new user instance with the provided data
     * This will be saved to the database
     */
    const hashedPassword = await argon2.hash(password);
    const user = new User({
      first_name,
      last_name,
      phone,
      country,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();
    return successApiResponse(
      res,
      "User created successfully",
      { ...user.toObject(), password: undefined },
      ApiResponseCode.CREATED,
      "info"
    );
  } catch (error) {
    return errorApiResponse(
      res,
      "Internal Server Error",
      error,
      ApiResponseCode.INTERNAL_ERROR,
      "error"
    );
  }
};
