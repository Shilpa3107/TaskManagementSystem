import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticateJWT, authController.logout);

export default router;
