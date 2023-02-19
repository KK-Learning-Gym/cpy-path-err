import { basename, dirname, join } from "path";
import { promises as fs, existsSync } from "fs";
import { rm } from "fs/promises";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import assert from "assert";
import cpy from "cpy";

const FIXTURES_DIR = fileURLToPath(new URL("fixtures", import.meta.url));

const add = async function (src, dist) {
  const srcBasename = basename(src);

  // for v8
  // const srcGlob = (await fs.stat(src)).isDirectory() ? `${srcBasename}/**` : srcBasename;
  // await cpy(srcGlob, dist, { cwd: dirname(src), parents: true, overwrite: true })

  // with v9 (using currently)
  const srcGlob = srcBasename;
  await cpy(srcGlob, dist, { cwd: dirname(src), overwrite: true });
  console.log({ srcGlob, src, cwd: dirname(src), dist });
};

const dist = await fs.mkdtemp(join(tmpdir(), "test-functions-utils-"));

try {
  await add(`${FIXTURES_DIR}/directory/test`, dist);
  assert.ok(existsSync(`${dist}/test/index.js`));
} finally {
  await rm(dist, { force: true, recursive: true });
}
