import { Router } from "express";
import * as taskController from "./task.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticateJWT); // Protect all task routes

router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);
router.patch("/:id/toggle", taskController.toggleTaskStatus);
router.delete("/:id", taskController.deleteTask);

export default router;
