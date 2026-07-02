import { spawnSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import process from "node:process";

const title = process.argv.slice(2).join(" ").trim();

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32",
    encoding: "utf8",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

async function confirmPublish() {
  if (process.env.AUTO_PUBLISH === "true") {
    return true;
  }

  const rl = readline.createInterface({ input, output });
  const answer = await rl.question("빌드 성공 시 Git commit/push까지 진행할까요? (y/N) ");
  rl.close();
  return answer.trim().toLowerCase() === "y";
}

async function main() {
  if (!title) {
    console.error('제목을 입력하세요. 예: npm run post "강아지 참외 먹어도 될까?"');
    process.exit(1);
  }

  run("node", ["scripts/create-post.js", title]);

  const shouldPublish = await confirmPublish();
  if (!shouldPublish) {
    console.log("생성만 완료했습니다. 배포하려면 npm run publish:post \"글제목\" 또는 AUTO_PUBLISH=true npm run post \"글제목\"을 실행하세요.");
    return;
  }

  run("node", ["scripts/publish-post.js", title]);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
