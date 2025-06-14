import express from "express";
import {
  validateSignInInput,
  validateLoginInput,
} from "../middlewares/validation/user.validate";
import {
  createUser,
  loginUser,
  getCurrentUser,
} from "../controllers/auth/user.controller";
const router = express.Router();

// User registration route
router.post("/sign-up", validateSignInInput, createUser);
// User login route
router.post("/sign-in", validateLoginInput, loginUser);
// Get current user route
router.get("/current", getCurrentUser);

// Export the router
export default router;
