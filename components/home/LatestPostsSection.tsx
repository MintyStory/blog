import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/data/posts";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import LargeBgText from "@/components/ui/LargeBgText";

export default function LatestPostsSection({ posts }: { posts: Post[] }) {
  const [main, ...sub] = posts;

  return (
    <section className="relative py-20 md:py-[140px] overflow-hidden">
      <LargeBgText>LATEST POSTS</LargeBgText>
      <div className="container-blog relative z-10">
        <Reveal className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-11">
          <div>
            <Eyebrow>Latest Posts</Eyebrow>
            <h2 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">최근에 쓴 글</h2>
          </div>
          <Link href="/posts" className="btn-pill">
            전체 글 보기 &rarr;
          </Link>
        </Reveal>
        <Reveal className="flex flex-col md:flex-row gap-5 items-start">
          {main && (
            <Link
              href={`/posts/${main.slug}`}
              className="group relative block w-full md:flex-[0_0_calc(50%-10px)] aspect-[4/3] md:aspect-square overflow-hidden rounded"
            >
              <Image
                src={main.coverImage}
                alt={main.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-35% to-black/70" />
              <div className="absolute bottom-0 left-0 right-0 z-10 p-7">
                <p className="text-[10px] font-semibold tracking-[0.07em] uppercase text-white/60 mb-1.5">{main.categoryLabel}</p>
                <h3 className="text-[22px] font-extrabold text-white leading-[1.3] mb-2">{main.title}</h3>
                <p className="text-xs text-white/45">{main.date.replaceAll("-", ". ")}</p>
              </div>
            </Link>
          )}
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            {sub.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-40% to-black/70" />
                <div className="absolute bottom-0 left-0 right-0 z-10 p-[18px]">
                  <p className="text-[10px] font-semibold tracking-[0.07em] uppercase text-white/60 mb-1.5">{post.categoryLabel}</p>
                  <h3 className="text-sm font-bold text-white leading-[1.3]">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
