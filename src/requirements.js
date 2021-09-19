import * as semver from "semver";
import { green, red } from "std/fmt/colors.ts";

async function check(name, path, versionArgs = "", satisfies = null) {
  let version = null;
  let valid = false;
  let message = "";
  const cmd = [path, ...versionArgs.split(" ")];
  try {
    const p = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
    await p.status();
    const textDecoder = new TextDecoder();
    const stdout = textDecoder.decode(await p.output());
    version = semver.coerce(stdout)?.version || null;
    if (!version) {
      if (!satisfies) {
        valid = true;
        message = `🗸 ${name} v[?]`;
      } else {
        valid = false;
        message = `✘ ${name} v[?], must satisfies ${satisfies}`;
      }
    } else {
      if (!satisfies) {
        valid = true;
        message = `🗸 ${name} v${version}`;
      } else {
        valid = semver.satisfies(version, satisfies);
        if (!valid) {
          message = `✘ ${name} v${version}, must satisfies ${satisfies}`;
        } else {
          message = `🗸 ${name} v${version} (satisfies ${satisfies})`;
        }
      }
    }
  } catch (_err) {
    if (!satisfies) {
      message = `✘ ${name} is not installed`;
    } else {
      message = `✘ ${name} is not installed (must satisfies ${satisfies})`;
    }
  }
  return { name, path, versionArgs, satisfies, version, valid, message };
}

async function checkAll(collection, log = true) { // 🗸 ✘
  let output = true;
  if (!Array.isArray(collection)) {
    throw new Error("collection must be an array");
  }
  if (collection.length === 0) {
    return output;
  }
  for (const { name, path, versionArgs, satisfies } of collection) {
    const result = await check(name, path, versionArgs, satisfies || null);
    const { valid, message } = result;
    if (log) console.log(valid ? green(message) : red(message));
    if (!valid) {
      output = false;
    }
  }
  return output;
}

export { check, checkAll };
