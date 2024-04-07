import * as userController from "../controllers/user.controller";
import { validateToken } from "../middlewares/auth.middleware";
import router from "./auth.route";

router.post("/signup", userController.signup);
router.get("/info", validateToken, userController.getUser);

export default router;
