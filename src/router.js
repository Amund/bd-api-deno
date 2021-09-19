import { Router } from "oak";

const router = new Router();

router.get("/bd/v3/hello", (context) => {
  context.response.body = {
    success: true,
    msg: "Hello World",
  };
});

export default router;
