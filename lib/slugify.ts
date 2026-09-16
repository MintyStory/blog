/** URL/Firestore 문서 ID로 안전하게 쓸 수 있게 slug를 정리한다. 한글은 그대로 유지(인코딩은 라우팅 시점에 처리). */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
