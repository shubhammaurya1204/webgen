import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { changes, deploy, generateWebsite, getAll, getBySlug, getWebsiteById } from "../controller/website.controller.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebsite);  // POST request, becouse hum Response lekar a rahe hai server se
websiteRouter.post("/update/:id", isAuth, changes);  
websiteRouter.get("/get-by-id/:id",isAuth,getWebsiteById)  // GET request, Server par response 
websiteRouter.get("/get-all",isAuth,getAll);
websiteRouter.get("/deploy/:id",isAuth,deploy);
websiteRouter.get("/get-by-slug/:slug",isAuth,getBySlug)  // GET request, Server par response 

export default websiteRouter;

// http:localhost:8000/api/user/me