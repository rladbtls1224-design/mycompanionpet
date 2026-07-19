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

function getKoreaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function updatePublishDates(markdown, pubDate) {
  const datePattern = /^([a-zA-Z]+Date):\s*["']?\d{4}-\d{2}-\d{2}["']?\s*$/m;
  let result = markdown;

  for (const key of ["pubDate", "updatedDate"]) {
    const keyPattern = new RegExp(`^${key}:\\s*["']?\\d{4}-\\d{2}-\\d{2}["']?\\s*$`, "m");
    const dateLine = `${key}: "${pubDate}"`;

    if (keyPattern.test(result)) {
      result = result.replace(keyPattern, dateLine);
      continue;
    }

    if (key === "updatedDate" && datePattern.test(result)) {
      result = result.replace(datePattern, (line) => `${line}\n${dateLine}`);
      continue;
    }

    result = result.replace(/^---\r?\n/, `---\n${dateLine}\n`);
  }

  return result;
}

function hasGitRemote() {
  const result = run("git", ["remote"], { capture: true, allowFailure: true });
  return result.status === 0 && result.stdout.trim().length > 0;
}

function main() {
  const number = Number(process.argv[2]);
  const dateArgIndex = process.argv.indexOf("--date");
  const pubDate = dateArgIndex >= 0 ? process.argv[dateArgIndex + 1] : getKoreaDate();

  if (!Number.isInteger(number) || number < 1) {
    throw new Error('Usage: npm run publish:queued -- 1 [--date YYYY-MM-DD]');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pubDate)) {
    throw new Error(`Invalid date: ${pubDate}. Use YYYY-MM-DD.`);
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
  const markdown = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(targetPath, updatePublishDates(markdown, pubDate), "utf8");

  item.status = "published";
  item.publishedDate = pubDate;
  item.updatedDate = pubDate;
  fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`, "utf8");

  console.log(`Queued post ${number} copied to ${targetPath}`);
  console.log(`pubDate and updatedDate set to ${pubDate}`);
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
