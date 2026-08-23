const { spawn } = require("child_process");
const path = require("path");

const cwd = __dirname;
const tsc = require.resolve("typescript/bin/tsc");

function run(cmd, args) {
  return spawn(cmd, args, { cwd, stdio: "inherit", shell: false });
}

function compileOnce() {
  return new Promise((resolve, reject) => {
    const proc = run(process.execPath, [tsc, "-p", "tsconfig.build.json"]);
    proc.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("tsc failed"))));
    proc.on("error", reject);
  });
}

async function main() {
  await compileOnce();
  run(process.execPath, [tsc, "-p", "tsconfig.build.json", "-w", "--preserveWatchOutput"]);
  const node = run(process.execPath, ["--watch", "dist/main.js"]);
  node.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
