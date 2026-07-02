import { spawnSync } from "node:child_process";
import process from "node:process";

const title = process.argv.slice(2).join(" ").trim() || "Untitled";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: options.capture ? "pipe" : "inherit",
    shell: process.platform === "win32",
    encoding: "utf8",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }

  return result;
}

function hasGitRemote() {
  const result = run("git", ["remote"], { capture: true, allowFailure: true });
  return result.status === 0 && result.stdout.trim().length > 0;
}

function hasChanges() {
  const result = run("git", ["status", "--porcelain"], { capture: true, allowFailure: true });
  return result.status === 0 && result.stdout.trim().length > 0;
}

function main() {
  console.log("빌드를 실행합니다...");
  run("npm", ["run", "build"]);

  console.log("Git 변경 상태를 확인합니다...");
  if (!hasChanges()) {
    console.log("커밋할 변경 사항이 없습니다.");
    return;
  }

  run("git", ["add", "."]);
  run("git", ["commit", "-m", `Add blog post: ${title}`]);

  if (hasGitRemote()) {
    run("git", ["push"]);
  } else {
    console.log("Git remote가 설정되어 있지 않아 push를 건너뜁니다.");
  }
}

try {
  main();
} catch (error) {
  console.error(error?.message || error);
  console.error("빌드 또는 Git 작업이 실패하여 이후 단계를 중단했습니다.");
  process.exit(1);
}
