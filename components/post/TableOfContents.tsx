import type { TocItem } from "@/lib/markdown";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="목차" className="sticky top-28 hidden lg:block">
      <p className="eyebrow !mb-4">목차</p>
      <ul className="list-none space-y-2.5 border-l border-black/10">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.depth === 3 ? "28px" : "16px" }}>
            <a
              href={`#${item.id}`}
              className="text-[13px] text-text-sub hover:text-text transition-colors block -ml-px border-l border-transparent hover:border-black pl-[15px]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
