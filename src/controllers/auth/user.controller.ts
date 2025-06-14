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
import { generateToken } from "../../utils/tokenGenerator";
import "dotenv/config";
import { logger } from "../../utils/logger";
import { toString } from "lodash";

const secret = toString(process.env.JWT_SECRET);
if (!secret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Controller function to create a new user
 * This function handles the user creation logic, including validation and error handling
 * It uses the User model to interact with the database
 * @param req - Express Request object
 * @param res - Express Response object
 */

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

    if (!email || !password) {
      return errorApiResponse(
        res,
        "Email and password are required",
        errMessage.VALIDATION_ERROR,
        ApiResponseCode.BAD_REQUEST,
        "error"
      );
    }

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
    /**
     * Generate a token for the newly created user
     * This token can be used for authentication in future requests
     */
    const token = generateToken(secret, { userId: user._id }, expiresIn);

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in milliseconds
    });

    /**
     * Return a success response with the created user data
     * The password is excluded from the response for security reasons
     */
    return successApiResponse(
      res,
      "User created successfully",
      { ...user.toObject(), password: undefined },
      ApiResponseCode.CREATED,
      "info"
    );
  } catch (error) {
    logger.error("Error in createUser:", error);
    return errorApiResponse(
      res,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error occurred",
      ApiResponseCode.INTERNAL_ERROR,
      "error"
    );
  }
};
