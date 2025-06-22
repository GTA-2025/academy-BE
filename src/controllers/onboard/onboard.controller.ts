import User from "../../models/user.model";
import { Request, Response } from "express";
import {
  successApiResponse,
  errorApiResponse,
  ApiResponseCode,
} from "../../utils/apiResponse";
import { OnboardingStatus } from "../../types/user.types";

const setUserName = async (req: Request, res: Response) => {
  try {
    const { user_name } = req.body;
    const userId = req.user.userId;

    // Validate user_name
    if (
      !user_name ||
      typeof user_name !== "string" ||
      user_name.trim() === ""
    ) {
      return errorApiResponse(
        res,
        "Invalid user name",
        "Invalid user name",
        ApiResponseCode.BAD_REQUEST,
        "error"
      );
    }

    // Check if user_name already exists
    const existingUser = await User.findOne({
      "profile.user_name": user_name.trim() + ".gta",
    });
    if (existingUser && existingUser._id.toString() !== userId) {
      return errorApiResponse(
        res,
        "User name already exists",
        "User name already exists",
        ApiResponseCode.CONFLICT,
        "error"
      );
    }

    // Update the user's profile with the new user_name
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        "profile.user_name": user_name.trim() + ".gta",
        onboardingStatus: OnboardingStatus.IN_PROGRESS,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return errorApiResponse(
        res,
        "User not found",
        "User not found",
        ApiResponseCode.NOT_FOUND,
        "error"
      );
    }
    // Return success response
    return successApiResponse(
      res,
      "User name updated successfully",
      { user_name: updatedUser?.profile?.user_name },
      ApiResponseCode.OK,
      "info"
    );
  } catch (error) {
    console.error("Error updating user name:", error);
    return errorApiResponse(
      res,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error occurred",
      ApiResponseCode.INTERNAL_ERROR,
      "error"
    );
  }
};

const setProfileImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const { profile_image } = req.body;

    // Validate profile_image
    if (!profile_image || typeof profile_image !== "string") {
      return errorApiResponse(
        res,
        "Invalid profile image URL",
        "Invalid profile image URL",
        ApiResponseCode.BAD_REQUEST,
        "error"
      );
    }

    // Update the user's profile with the new profile_image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        "profile.profile_image": profile_image,
        onboardingStatus: OnboardingStatus.IN_PROGRESS,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return errorApiResponse(
        res,
        "User not found",
        "User not found",
        ApiResponseCode.NOT_FOUND,
        "error"
      );
    }

    // Return success response
    return successApiResponse(
      res,
      "Profile image updated successfully",
      { profile_image: updatedUser?.profile?.profile_image },
      ApiResponseCode.OK,
      "info"
    );
  } catch (error) {
    console.error("Error updating profile image:", error);
    return errorApiResponse(
      res,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error occurred",
      ApiResponseCode.INTERNAL_ERROR,
      "error"
    );
  }
};
