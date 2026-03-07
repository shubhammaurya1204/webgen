import express from "express";
import { googleAuth, logOut } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/google",googleAuth); 
authRouter.get("/logout",logOut); 

export default authRouter;

// http:localhost:8000/api/auth/google
// http:localhost:8000/api/auth/logout