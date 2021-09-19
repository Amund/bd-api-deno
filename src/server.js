import * as requirements from "./requirements.js";
import * as yaml from "std/encoding/yaml.ts";
import { Application } from "oak";
import router from "./router.js";

const config = yaml.parse(await Deno.readTextFile("./config.yml"));
if (!await requirements.checkAll(config.requirements || [])) {
  throw new Error("Please check requirements.");
}

// const env = Deno.env.toObject();
// const HOST = env.HOST || "localhost";
// const PORT = env.PORT || 3000;
const HOST = "localhost";
const PORT = 3000;

const app = new Application();
// app.use(errorHandler);
app.use(router.routes());
app.use(router.allowedMethods());
// app.use(_404);

console.log(`Server running on port ${PORT}`);

app.listen(`${HOST}:${PORT}`);
