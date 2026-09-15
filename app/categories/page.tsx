import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getPostsByCategory } from "@/data/posts";
import ImageOverlayCard from "@/components/cards/ImageOverlayCard";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = { title: "카테고리 — DEV LOG" };

export default function CategoriesPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container-blog">
        <div className="mb-11">
          <Eyebrow>Categories</Eyebrow>
          <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">카테고리</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const count = getPostsByCategory(cat.slug).length;
            return (
              <ImageOverlayCard key={cat.slug} href={`/categories/${cat.slug}`} image={cat.coverImage} alt={`${cat.label} 카테고리`}>
                <span className="text-[11px] font-semibold tracking-[0.07em] uppercase text-white/70 mb-2 block">
                  {cat.label} &middot; {count}편
                </span>
                <h2 className="text-xl font-extrabold text-white leading-[1.3] mb-5">{cat.description}</h2>
                <span className="btn-circle text-white border-white/45 group-hover:bg-white group-hover:text-black">&rarr;</span>
              </ImageOverlayCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
