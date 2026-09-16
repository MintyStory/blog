import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import type { Element, Root, RootContent } from "hast";

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

function textContent(node: Element | RootContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map(textContent).join("");
  return "";
}

/**
 * 글 본문(Tiptap이 저장한 HTML)에서 h2/h3만 뽑아 목차를 만든다.
 * ID는 PostBody의 rehype-slug와 동일하게 github-slugger로 생성 — 두 곳이 어긋나면 앵커 링크가 깨진다.
 */
export function extractToc(html: string): TocItem[] {
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html) as Root;
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "element", (node: Element) => {
    if (node.tagName !== "h2" && node.tagName !== "h3") return;
    const text = textContent(node).trim();
    if (!text) return;
    items.push({ id: slugger.slug(text), text, depth: node.tagName === "h2" ? 2 : 3 });
  });

  return items;
}
