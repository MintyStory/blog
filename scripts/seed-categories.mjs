// 시드 데이터를 Firestore categories 컬렉션에 채워 넣는 1회성 스크립트.
// 실행: npm run seed:categories
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { seedCategories } from "../data/seedCategories.ts";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("FIREBASE_ADMIN_* 환경변수가 없습니다. .env.local을 확인하세요.");
  process.exit(1);
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);

let created = 0;
let skipped = 0;

for (const category of seedCategories) {
  const ref = db.collection("categories").doc(category.slug);
  const existing = await ref.get();
  if (existing.exists) {
    skipped++;
    continue;
  }
  const { slug, ...rest } = category;
  await ref.set(rest);
  created++;
  console.log(`+ ${slug}`);
}

console.log(`\n완료: ${created}개 생성, ${skipped}개는 이미 존재해 건너뜀.`);
process.exit(0);
