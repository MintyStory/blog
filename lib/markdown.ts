import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const h2 = /^##\s+(.+)/.exec(line);
    const h3 = /^###\s+(.+)/.exec(line);
    if (h2) {
      items.push({ id: slugger.slug(h2[1]), text: h2[1], depth: 2 });
    } else if (h3) {
      items.push({ id: slugger.slug(h3[1]), text: h3[1], depth: 3 });
    }
  }
  return items;
}
