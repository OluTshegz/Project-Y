import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUser } from "../controllers/user.controllers.js";

const userRoutes = express.Router();

userRoutes.get("/profile/:username", protectRoute, getUserProfile);
userRoutes.get("/suggested", protectRoute, getSuggestedUsers);
userRoutes.post("/follow/:id", protectRoute, followUnfollowUser);
userRoutes.post("/update", protectRoute, updateUser);

export default userRoutes;
