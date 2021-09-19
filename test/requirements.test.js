import { assertEquals } from "std/testing/asserts.ts";
import * as requirements from "../src/requirements.js";

Deno.test({
  name: "check: binary not installed, without satisfies",
  fn: async () => {
    const name = "test", path = "unknown", versionArgs = "", satisfies = null;
    const output = await requirements.check(name, path, versionArgs, satisfies);
    assertEquals(output, {
      name,
      path,
      versionArgs,
      satisfies,
      version: null,
      valid: false,
      message: "✘ test is not installed",
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "check: binary not installed, whith satisfies",
  fn: async () => {
    const name = "test",
      path = "unknown",
      versionArgs = "",
      satisfies = ">=1.0.0";
    const output = await requirements.check(name, path, versionArgs, satisfies);
    assertEquals(output, {
      name,
      path,
      versionArgs,
      satisfies,
      version: null,
      valid: false,
      message: "✘ test is not installed (must satisfies >=1.0.0)",
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "check: binary installed, version not detected, without satisfies",
  fn: async () => {
    const name = "test",
      path = "echo",
      versionArgs = "not-a-version",
      satisfies = null;
    const output = await requirements.check(name, path, versionArgs, satisfies);
    assertEquals(output, {
      name,
      path,
      versionArgs,
      satisfies,
      version: null,
      valid: true,
      message: "🗸 test v[?]",
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "check: binary installed, version not detected, with satisfies",
  fn: async () => {
    const name = "test",
      path = "echo",
      versionArgs = "not-a-version",
      satisfies = ">=1.0.0";
    const output = await requirements.check(name, path, versionArgs, satisfies);
    assertEquals(output, {
      name,
      path,
      versionArgs,
      satisfies,
      version: null,
      valid: false,
      message: "✘ test v[?], must satisfies >=1.0.0",
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "check: binary installed, version detected, without satisfies",
  fn: async () => {
    const name = "test",
      path = "echo",
      versionArgs = "v1.5.0",
      satisfies = null;
    const output = await requirements.check(name, path, versionArgs, satisfies);
    assertEquals(output, {
      name,
      path,
      versionArgs,
      satisfies,
      version: "1.5.0",
      valid: true,
      message: "🗸 test v1.5.0",
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "check: binary installed, version detected, unsatisfied",
  fn: async () => {
    const name = "test",
      path = "echo",
      versionArgs = "v1.5.0",
      satisfies = ">=2.0.0";
    const output = await requirements.check(name, path, versionArgs, satisfies);
    assertEquals(output, {
      name,
      path,
      versionArgs,
      satisfies,
      version: "1.5.0",
      valid: false,
      message: "✘ test v1.5.0, must satisfies >=2.0.0",
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "check: binary installed, version detected, satisfied",
  fn: async () => {
    const name = "test",
      path = "echo",
      versionArgs = "v1.5.0",
      satisfies = ">=1.0.0";
    const output = await requirements.check(name, path, versionArgs, satisfies);
    assertEquals(output, {
      name,
      path,
      versionArgs,
      satisfies,
      version: "1.5.0",
      valid: true,
      message: "🗸 test v1.5.0 (satisfies >=1.0.0)",
    });
  },
  sanitizeResources: false,
});

Deno.test("checkAll: check an empty collection of checks", async () => {
  const inputs = [];
  const output = await requirements.checkAll(inputs);
  assertEquals(output, []);
});

Deno.test("checkAll: check a collection of checks", async () => {
  const check = { name: "test", cmd: "unknown" };
  const output = await requirements.checkAll([check, check], false);
  assertEquals(output.length, 2);
});
