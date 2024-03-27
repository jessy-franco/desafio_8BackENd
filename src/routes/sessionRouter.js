import express from "express";
import passport from "passport";
import sessionController from "../controllers/SessionControllers.js";

const router = express.Router();

router.post("/register", sessionController.register);
router.post("/login", sessionController.login);
router.get("/current", passport.authenticate("jwt", { session: false }), sessionController.getCurrentUser);
router.get("/logout", sessionController.logout);
router.get("/github", sessionController.authenticateWithGithub);
router.get("/githubcallback", sessionController.githubCallback);
router.get("/logout/github", sessionController.logoutGithub);
router.get('/check-admin', sessionController.check);
export default router;
