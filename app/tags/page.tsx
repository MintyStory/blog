import type { Metadata } from "next";
import { getAllTags } from "@/lib/posts";
import { TagPill } from "@/components/ui/TagPill";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = { title: "태그 — DEV LOG" };
export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const tags = await getAllTags();
  const maxCount = Math.max(...tags.map((t) => t.count), 1);

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container-blog">
        <div className="mb-11">
          <Eyebrow>Tags</Eyebrow>
          <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">태그</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <span key={tag} style={{ fontSize: `${13 + (count / maxCount) * 8}px` }}>
              <TagPill tag={tag} count={count} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
