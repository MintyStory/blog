import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import type { Post } from "@/types/post";
import Eyebrow from "@/components/ui/Eyebrow";
import { CategoryPill } from "@/components/ui/TagPill";

export const metadata: Metadata = { title: "아카이브 — DEV LOG" };
export const dynamic = "force-dynamic";

function groupByYearMonth(list: Post[]) {
  const years = new Map<string, Map<string, Post[]>>();
  for (const post of [...list].sort((a, b) => b.date.localeCompare(a.date))) {
    const [year, month] = post.date.split("-");
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year)!;
    if (!months.has(month)) months.set(month, []);
    months.get(month)!.push(post);
  }
  return years;
}

export default async function ArchivePage() {
  const posts = await getAllPosts();
  const years = groupByYearMonth(posts);

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container-blog">
        <div className="mb-14">
          <Eyebrow>Archive</Eyebrow>
          <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">아카이브</h1>
        </div>

        {[...years.entries()].map(([year, months]) => (
          <section key={year} className="relative mb-16">
            <div
              aria-hidden="true"
              className="absolute -top-6 left-0 text-[96px] md:text-[160px] font-black text-transparent select-none pointer-events-none leading-none"
              style={{ WebkitTextStroke: "1px rgba(0,0,0,0.06)" }}
            >
              {year}
            </div>
            <h2 className="relative text-2xl font-extrabold mb-8 pt-6">{year}</h2>
            <div className="relative space-y-10">
              {[...months.entries()].map(([month, monthPosts]) => (
                <div key={month}>
                  <h3 className="text-sm font-bold text-text-sub mb-4">{month}월</h3>
                  <ul className="list-none divide-y divide-black/8 border-t border-b border-black/8">
                    {monthPosts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="flex items-center justify-between gap-4 py-4 hover:text-primary transition-colors"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <CategoryPill label={post.categoryLabel} />
                            <span className="truncate font-medium">{post.title}</span>
                          </span>
                          <span className="text-xs text-text-sub shrink-0">{post.date.replaceAll("-", ". ")}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
