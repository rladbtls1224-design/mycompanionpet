import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, "drafts", "blog-queue", "queue.json");
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: options.capture ? "pipe" : "inherit",
    shell: process.platform === "win32",
    encoding: "utf8",
  });

  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
  return result;
}

function readQueue() {
  if (!fs.existsSync(QUEUE_PATH)) {
    throw new Error(`Queue file not found: ${QUEUE_PATH}`);
  }
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
}

function hasGitRemote() {
  const result = run("git", ["remote"], { capture: true, allowFailure: true });
  return result.status === 0 && result.stdout.trim().length > 0;
}

function main() {
  const number = Number(process.argv[2]);
  if (!Number.isInteger(number) || number < 1) {
    throw new Error('Usage: npm run publish:queued -- 1');
  }

  const queue = readQueue();
  const item = queue.find((entry) => entry.number === number);
  if (!item) {
    throw new Error(`No queued post found for number ${number}`);
  }

  const sourcePath = path.join(ROOT, item.file);
  const targetPath = path.join(BLOG_DIR, `${item.slug}.md`);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Draft file not found: ${sourcePath}`);
  }
  if (fs.existsSync(targetPath)) {
    throw new Error(`Target post already exists: ${targetPath}`);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);

  console.log(`Queued post ${number} copied to ${targetPath}`);
  run("npm", ["run", "build"]);
  run("git", ["add", targetPath, QUEUE_PATH, sourcePath]);
  run("git", ["commit", "-m", `Add blog post: ${item.title}`]);

  if (hasGitRemote()) {
    run("git", ["push"]);
  } else {
    console.log("No Git remote configured; skipped push.");
  }
}

try {
  main();
} catch (error) {
  console.error(error?.message || error);
  process.exit(1);
}
