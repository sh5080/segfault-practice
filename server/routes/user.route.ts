import * as userController from "../controllers/user.controller";
import { validateToken } from "../middlewares/auth.middleware";
import router from "./auth.route";

router.post("/signup", userController.signup);
router.get("/profile", validateToken, userController.getUserProfile);

export default router;
