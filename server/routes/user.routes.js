import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me",isAuth,getCurrentUser);
// userRouter.get("/gen", generateDemo); // for checking purpose only

export default userRouter;

// http:localhost:8000/api/auth/google
// http:localhost:8000/api/auth/logout