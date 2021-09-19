import * as requirements from "./requirements.js";
import * as yaml from "std/encoding/yaml.ts";
import { green, red } from "std/fmt/colors.ts";
import { Application } from "oak";
import router from "./router.js";

console.log(`BD API v0.0.1`);

console.log(`\nRequirements`);
const config = yaml.parse(await Deno.readTextFile("./config.yml"));
if (!await requirements.checkAll(config.requirements || [])) {
  console.log(red(`\nPlease check requirements.\n`));
  Deno.exit(1);
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

console.log(`\nServer running on http://${HOST}:${PORT}`);

app.listen(`${HOST}:${PORT}`);
