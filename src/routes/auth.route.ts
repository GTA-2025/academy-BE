import express from "express";
import { validateUserInput } from "../middlewares/validation/user.validate";
import { createUser } from "../controllers/auth/user.controller";
const router = express.Router();

// User registration route
router.post("/sign-up", validateUserInput, createUser);

// Export the router
export default router;
