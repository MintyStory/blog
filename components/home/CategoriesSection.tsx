import { categories } from "@/data/categories";
import ImageOverlayCard from "@/components/cards/ImageOverlayCard";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";

export default function CategoriesSection() {
  return (
    <section className="py-20 md:py-[140px]">
      <div className="container-blog">
        <Reveal className="mb-[52px]">
          <Eyebrow>Categories</Eyebrow>
          <h2 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">
            탐색하고 싶은
            <br />
            주제를 골라보세요
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={0.05 + i * 0.1}>
              <ImageOverlayCard href={`/categories/${cat.slug}`} image={cat.coverImage} alt={`${cat.label} 카테고리`} aspect="aspect-[4/5]">
                <span className="text-[11px] font-semibold tracking-[0.07em] uppercase text-white/70 mb-2 block">
                  {cat.label}
                </span>
                <h3 className="text-xl font-extrabold text-white leading-[1.3] mb-5">{cat.description}</h3>
                <span className="btn-circle text-white border-white/45 group-hover:bg-white group-hover:text-black">
                  &rarr;
                </span>
              </ImageOverlayCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
