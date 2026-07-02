import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");
const PROMPT_PATH = path.join(ROOT, "content-prompt.md");
const AGENTS_PATH = path.join(ROOT, "AGENTS.md");

const DOG_WORDS = ["강아지", "개", "반려견", "dog", "puppy"];
const CAT_WORDS = ["고양이", "반려묘", "냥이", "cat", "kitten"];
const COMPARE_WORDS = ["비교", "차이", "공통", "둘 다", "함께", "강아지와 고양이", "개와 고양이", "dog and cat"];

const KEYWORD_SLUGS = [
  ["강아지", "dog"],
  ["반려견", "dog"],
  ["개", "dog"],
  ["puppy", "puppy"],
  ["dog", "dog"],
  ["고양이", "cat"],
  ["반려묘", "cat"],
  ["냥이", "cat"],
  ["kitten", "kitten"],
  ["cat", "cat"],
  ["참외", "korean-melon"],
  ["멜론", "melon"],
  ["수박", "watermelon"],
  ["사과", "apple"],
  ["바나나", "banana"],
  ["딸기", "strawberry"],
  ["포도", "grape"],
  ["복숭아", "peach"],
  ["토마토", "tomato"],
  ["오이", "cucumber"],
  ["당근", "carrot"],
  ["고구마", "sweet-potato"],
  ["감자", "potato"],
  ["닭고기", "chicken"],
  ["계란", "egg"],
  ["우유", "milk"],
  ["치즈", "cheese"],
  ["요거트", "yogurt"],
  ["습식", "wet-food"],
  ["사료", "food"],
  ["간식", "treats"],
  ["영양제", "supplement"],
  ["급여", "feeding"],
  ["먹어도", "can-eat"],
  ["알레르기", "allergy"],
  ["비만", "obesity"],
  ["다이어트", "diet"],
];

function getTitle() {
  return process.argv.slice(2).join(" ").trim();
}

function includesAny(text, words) {
  const normalized = text.toLowerCase();
  return words.some((word) => normalized.includes(word.toLowerCase()));
}

function detectAnimalType(title) {
  const hasDog = includesAny(title, DOG_WORDS);
  const hasCat = includesAny(title, CAT_WORDS);
  const isCompare = (hasDog && hasCat) || includesAny(title, COMPARE_WORDS);

  if (isCompare) return "compare";
  if (hasCat) return "cat";
  if (hasDog) return "dog";
  return "general";
}

function todayKorea() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

function createSlug(title, animalType, date) {
  const lowerTitle = title.toLowerCase();
  const parts = [];

  for (const [keyword, slug] of KEYWORD_SLUGS) {
    if (lowerTitle.includes(keyword.toLowerCase()) && !parts.includes(slug)) {
      parts.push(slug);
    }
  }

  const ascii = lowerTitle
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const usefulAscii = ascii
    .split("-")
    .filter((part) => part.length > 1 && !["can", "eat", "is", "the", "for"].includes(part));

  for (const part of usefulAscii) {
    if (!parts.includes(part)) parts.push(part);
  }

  if (parts.length === 0 && animalType !== "general") {
    parts.push(animalType, "nutrition");
  }

  return `${date}-${parts.length > 0 ? parts.join("-") : "pet-nutrition-post"}`;
}

function uniquePath(slug) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });

  let candidate = path.join(BLOG_DIR, `${slug}.md`);
  let index = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(BLOG_DIR, `${slug}-${index}.md`);
    index += 1;
  }
  return candidate;
}

function escapeYaml(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function categoryFor(animalType) {
  if (animalType === "dog") return "강아지 영양";
  if (animalType === "cat") return "고양이 영양";
  if (animalType === "compare") return "강아지 고양이 비교";
  return "반려동물 영양";
}

function tagsFor(title, animalType) {
  const base = ["반려동물 영양", "급여 가이드"];
  if (animalType === "dog") base.unshift("강아지");
  if (animalType === "cat") base.unshift("고양이");
  if (animalType === "compare") base.unshift("강아지", "고양이");

  for (const [keyword] of KEYWORD_SLUGS) {
    if (title.includes(keyword) && !base.includes(keyword)) base.push(keyword);
  }
  return base.slice(0, 8);
}

function descriptionFor(title, animalType) {
  const target = animalType === "dog" ? "강아지" : animalType === "cat" ? "고양이" : animalType === "compare" ? "강아지와 고양이" : "반려동물";
  return `${title}에 대해 ${target} 기준으로 급여 가능 여부, 주의사항, 적정량, 상담이 필요한 상황을 정리했습니다.`;
}

function thumbnailFor(slug) {
  return `${slug}-hero.webp`;
}

function buildPrompt({ title, animalType, pubDate, slug }) {
  const promptTemplate = fs.existsSync(PROMPT_PATH) ? fs.readFileSync(PROMPT_PATH, "utf8") : "";
  const agentRules = fs.existsSync(AGENTS_PATH) ? fs.readFileSync(AGENTS_PATH, "utf8") : "";
  return `${agentRules}

---

${promptTemplate
  .replaceAll("{{title}}", title)
  .replaceAll("{{animalType}}", animalType)
  .replaceAll("{{pubDate}}", pubDate)
  .replaceAll("{{slug}}", slug)}
`;
}

async function generateWithOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "You write careful Korean pet nutrition blog posts. Return Markdown body only, without YAML frontmatter.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_output_tokens: 5000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const text = data.output
    ?.flatMap((item) => item.content || [])
    ?.map((content) => content.text)
    ?.filter(Boolean)
    ?.join("\n")
    ?.trim();

  return text || null;
}

function animalLabel(animalType) {
  if (animalType === "dog") return "강아지";
  if (animalType === "cat") return "고양이";
  if (animalType === "compare") return "강아지와 고양이";
  return "반려동물";
}

function fallbackDraft({ title, animalType, slug, prompt }) {
  const label = animalLabel(animalType);
  const speciesLine =
    animalType === "compare"
      ? "이 글은 비교 글이므로 강아지와 고양이를 구분해서 다룹니다."
      : `이 글은 ${label} 전용 글이므로 다른 동물 전용 섹션은 넣지 않습니다.`;
  const safePrompt = prompt.trim().replaceAll("```", "~~~");

  return `> OPENAI_API_KEY가 없어 자동 완성 글 대신 작성용 초안 템플릿을 생성했습니다. 아래 프롬프트를 AI 도구에 넣거나 OPENAI_API_KEY를 설정한 뒤 다시 실행하면 본문 생성까지 자동화할 수 있습니다.

## 도입부

${title}라는 질문은 보호자가 일상에서 자주 마주치는 상황과 연결됩니다. ${label}가 사람 음식을 먹어도 되는지 판단할 때는 단순히 "먹을 수 있다" 또는 "먹으면 안 된다"로만 나누기보다, 양, 조리 상태, 기존 건강 상태, 알레르기 가능성, 평소 식단을 함께 봐야 합니다. ${speciesLine}

![${title} 대표 이미지](${slug}-hero.webp)

## 핵심 개념 설명

보호자가 먼저 확인해야 할 핵심은 해당 음식이나 식재료가 ${label}의 기본 식단을 대체할 수 있는지, 아니면 아주 제한적인 간식 수준으로만 볼 수 있는지입니다. 대부분의 사람 음식은 반려동물의 주식으로 설계된 것이 아니므로, 안전성이 비교적 높아 보이는 재료라도 급여량과 빈도를 조절해야 합니다. 특히 당분, 지방, 염분, 첨가물, 씨앗, 껍질, 양념 여부는 반드시 확인해야 합니다.

## 해당 동물 기준 영양 정보

${label} 기준으로 영양 정보를 볼 때는 단백질, 지방, 탄수화물, 섬유질, 수분, 미네랄 균형을 함께 생각해야 합니다. 특정 재료에 비타민이나 수분이 들어 있다고 해서 그 자체가 반드시 좋은 간식이 되는 것은 아닙니다. 평소 먹는 사료가 이미 균형 잡힌 영양을 제공한다면 추가 간식은 전체 하루 열량의 일부로만 계산하는 편이 안전합니다.

## 먹어도 되는지 또는 급여 가능 여부

이 주제의 최종 판단은 재료 자체의 독성 여부, 급여 형태, 양, 개별 반응에 따라 달라집니다. 소량을 처음 시도하는 경우라면 아주 작은 양으로 시작하고, 이후 구토, 설사, 가려움, 기운 저하, 과도한 침 흘림 같은 이상 반응이 있는지 관찰해야 합니다. 기존 질환이 있거나 처방식을 먹고 있다면 임의로 급여하기보다 수의사와 먼저 상담하는 것이 좋습니다.

![${title} 급여 예시](${slug}-feeding-example.webp)

## 급여 시 주의할 점

- 양념, 설탕, 소금, 기름, 소스가 들어간 형태는 피합니다.
- 씨앗, 단단한 껍질, 질긴 심지처럼 목에 걸리거나 소화가 어려운 부분은 제거합니다.
- 처음 급여할 때는 소량만 주고 최소 하루 정도 반응을 관찰합니다.
- 어린 동물, 노령 동물, 임신 중인 동물, 만성 질환이 있는 동물은 더 보수적으로 판단합니다.
- 식단을 장기적으로 바꿔야 하는 상황이라면 수의사 상담을 우선합니다.

## 적정 급여량 또는 판단 기준

간식은 일반적으로 하루 총 섭취 열량의 작은 일부로 제한하는 것이 좋습니다. 정확한 양은 체중, 활동량, 중성화 여부, 나이, 평소 사료량에 따라 달라집니다. 숫자 하나로 모든 ${label}에게 같은 기준을 적용하기보다, 처음에는 아주 적은 양으로 반응을 확인하고 평소 변 상태와 체중 변화를 함께 보는 방식이 현실적입니다.

![${title} 주의사항 인포그래픽](${slug}-feeding-caution.webp)

## 보호자가 자주 하는 오해

사람에게 건강한 음식이면 반려동물에게도 늘 좋다고 생각하기 쉽지만 그렇지 않습니다. 반려동물은 사람과 소화 방식, 필요한 영양 균형, 민감하게 반응하는 성분이 다를 수 있습니다. 또 한 번 먹고 괜찮았다고 해서 매일 먹여도 된다는 뜻은 아닙니다. 반대로 소량 섭취 후 특별한 증상이 없더라도, 장기적으로는 열량 과잉이나 영양 불균형이 생길 수 있습니다.

## 실제 상황별 예시

### 아주 소량을 실수로 먹은 경우

먼저 먹은 양과 시간을 기록합니다. 위험 성분이 의심되지 않고 평소와 같은 모습이라면 짧은 시간 안에 과도하게 걱정하기보다 상태를 관찰합니다. 다만 반복 구토, 설사, 무기력 등이 보이면 병원에 문의합니다.

### 보호자가 간식으로 주고 싶은 경우

주식 사료를 줄이고 사람 음식을 늘리는 방식은 권장하지 않습니다. 간식으로 줄 수 있는 상황인지 확인하고, 가능한 한 단순한 원재료 상태로 소량만 제공합니다.

### 기존 건강 문제가 있는 경우

신장, 췌장, 당 조절, 알레르기, 소화기 문제가 있거나 처방식을 먹는 경우에는 일반적인 인터넷 정보만으로 판단하지 않는 것이 좋습니다.

## 보호자 체크리스트

- [ ] 이 음식이 ${label}에게 알려진 위험 성분을 포함하는지 확인했다.
- [ ] 양념, 소금, 설탕, 기름, 소스를 제거했다.
- [ ] 씨앗, 껍질, 단단한 부분을 제거했다.
- [ ] 처음에는 아주 적은 양만 제공했다.
- [ ] 급여 후 변 상태, 구토, 피부 반응, 활력을 관찰했다.
- [ ] 이상 증상이 있으면 급여를 중단하고 수의사에게 문의할 준비가 되어 있다.

![${title} 보호자 체크리스트](${slug}-checklist.webp)

## 수의사 상담이 필요한 경우

반복적인 구토나 설사, 혈변, 심한 복통으로 보이는 자세, 기운 저하, 호흡 이상, 경련, 얼굴이나 입 주변 부기, 심한 가려움이 보이면 빠르게 병원에 문의해야 합니다. 많은 양을 먹었거나 정확히 무엇을 먹었는지 알 수 없는 경우에도 상담이 필요합니다. 이 글은 일반적인 판단 기준을 돕기 위한 것이며 개별 진료를 대신할 수 없습니다.

## 결론

${title}에 대한 답은 재료와 상황에 따라 달라집니다. 보호자는 "먹어도 된다"는 한 문장보다 급여량, 형태, 개별 건강 상태, 이상 반응 여부를 함께 확인해야 합니다. 안전이 애매하다면 급여하지 않는 쪽이 더 신중한 선택이며, 건강 문제가 있거나 증상이 나타난 경우에는 수의사의 조언을 받는 것이 좋습니다.

## FAQ

### Q1. 처음 먹일 때 어느 정도부터 시작하면 좋나요?

아주 작은 조각이나 소량으로 시작하고 하루 정도 반응을 관찰하는 방식이 좋습니다.

### Q2. 한 번 먹고 괜찮으면 계속 줘도 되나요?

한 번 괜찮았다는 사실이 장기 급여의 안전성을 보장하지는 않습니다. 빈도와 양을 제한해야 합니다.

### Q3. 어린 ${label}에게도 같은 기준을 적용해도 되나요?

어린 동물은 소화가 더 민감할 수 있으므로 더 보수적으로 판단하는 편이 좋습니다.

### Q4. 이상 반응은 언제까지 보면 되나요?

급여 직후부터 다음 날까지 구토, 설사, 가려움, 활력 저하 등을 관찰합니다.

### Q5. 처방식을 먹는 경우에도 간식으로 줄 수 있나요?

처방식을 먹는 경우에는 식단 목적이 흐트러질 수 있으므로 수의사와 먼저 상담하는 것이 좋습니다.

## 내부 링크 추천

- /dog-nutrition
- /cat-nutrition
- /food-label
- /calorie-calculator
- /disclaimer

## 후속 글 주제 추천

- ${label}가 먹으면 피해야 할 사람 음식 정리
- ${label} 간식 하루 적정량 계산법
- ${label} 구토와 설사 시 보호자 관찰 포인트
- ${label} 알레르기 의심 증상과 식단 기록법
- ${label} 사료와 간식 열량 함께 관리하는 법

## 이미지 제작 메모

| 삽입 위치 | 이미지 용도 | 이미지 설명 | alt 텍스트 | 이미지 파일명 추천 | 이미지 생성 프롬프트 |
| --- | --- | --- | --- | --- | --- |
| 도입부 아래 | 대표 이미지 | 밝은 주방 또는 식탁 옆에서 보호자가 ${label} 급여 가능 여부를 확인하는 장면 | ${title} 대표 이미지 | ${slug}-hero.webp | 한국 반려동물 영양 블로그용 사실적인 대표 이미지, 밝고 깨끗한 실내, ${label}, 보호자가 안전하게 음식을 확인하는 장면 |
| 급여 가능 여부 아래 | 급여 예시 이미지 | 작은 접시와 적은 양의 예시를 보여주는 장면 | ${title} 급여 예시 | ${slug}-feeding-example.webp | ${label}에게 간식을 소량만 준비한 예시 사진, 과장 없는 현실적인 스타일 |
| 주의할 점 아래 | 주의사항 인포그래픽 | 제거해야 할 부분과 피해야 할 조리 형태를 정리한 이미지 | ${title} 급여 시 주의사항 | ${slug}-feeding-caution.webp | 한국어 반려동물 블로그용 간단한 주의사항 인포그래픽, 깨끗한 배경, 명확한 아이콘 |
| 체크리스트 위 | 체크리스트 이미지 | 급여 전 확인 항목을 시각적으로 정리한 이미지 | ${title} 보호자 체크리스트 | ${slug}-checklist.webp | 보호자가 급여 전 확인할 체크리스트 인포그래픽, 반려동물 영양, 차분한 색감 |

## 글 생성용 원본 프롬프트

\`\`\`text
${safePrompt}
\`\`\`
`;
}

function frontmatter({ title, pubDate, animalType, slug }) {
  const tags = tagsFor(title, animalType).map((tag) => `"${escapeYaml(tag)}"`).join(", ");
  return `---
title: "${escapeYaml(title)}"
description: "${escapeYaml(descriptionFor(title, animalType))}"
pubDate: "${pubDate}"
category: "${escapeYaml(categoryFor(animalType))}"
tags: [${tags}]
thumbnail: "${thumbnailFor(slug)}"
---
`;
}

async function main() {
  const title = getTitle();
  if (!title) {
    console.error('제목을 입력하세요. 예: npm run new:post "강아지 참외 먹어도 될까?"');
    process.exit(1);
  }

  const pubDate = todayKorea();
  const animalType = detectAnimalType(title);
  const slug = createSlug(title, animalType, pubDate);
  const filePath = uniquePath(slug);
  const finalSlug = path.basename(filePath, ".md");
  const prompt = buildPrompt({ title, animalType, pubDate, slug: finalSlug });

  let body = null;
  if (process.env.OPENAI_API_KEY) {
    body = await generateWithOpenAI(prompt);
  }

  if (!body) {
    body = fallbackDraft({ title, animalType, slug: finalSlug, prompt });
  }

  const markdown = `${frontmatter({ title, pubDate, animalType, slug: finalSlug })}

${body.trim()}
`;

  fs.writeFileSync(filePath, markdown, { encoding: "utf8", flag: "wx" });

  console.log(`POST_FILE=${filePath}`);
  console.log(`POST_TITLE=${title}`);
  console.log(`POST_SLUG=${finalSlug}`);
  console.log(`ANIMAL_TYPE=${animalType}`);
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY가 없어 글 작성용 프롬프트가 포함된 초안 템플릿을 생성했습니다.");
  }
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
