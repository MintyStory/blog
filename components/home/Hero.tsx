import Image from "next/image";
import Link from "next/link";
import HeroRotatingWord from "./HeroRotatingWord";
import type { Post } from "@/data/posts";

export default function Hero({ pick }: { pick: Post }) {
  return (
    <section className="relative h-screen min-h-[620px] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-developer-workspace.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/38 to-black/62" />
      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-[1280px] mx-auto w-full">
        <p className="text-xs font-semibold tracking-[0.1em] uppercase text-white/65 mb-7">DEV LOG &mdash; 개발 블로그</p>
        <h1 className="text-[38px] md:text-[52px] lg:text-[64px] font-extrabold text-white leading-[1.08] tracking-[-0.025em]">
          코드로 담아내는
          <br />
          <span className="block mt-1">
            <HeroRotatingWord />의 공간
          </span>
        </h1>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12 lg:px-20 pb-9 md:pb-13">
        <div className="max-w-[520px] bg-white/10 backdrop-blur-lg border border-white/18 rounded-md p-6 md:p-7">
          <span className="block text-[10px] font-bold tracking-[0.1em] uppercase text-accent mb-4">&#10022; 최신 글 Pick</span>
          <div className="flex gap-4 items-start">
            <Image
              src={pick.coverImage}
              alt={pick.title}
              width={60}
              height={60}
              className="w-[60px] h-[60px] object-cover rounded shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-white/55 block mb-1.5">{pick.categoryLabel}</span>
              <p className="text-sm font-bold text-white leading-[1.45] mb-3.5 line-clamp-2">{pick.title}</p>
              <Link href={`/posts/${pick.slug}`} className="btn-pill !text-xs !py-1.5 !px-4 !border-white/45 !text-white hover:!bg-white hover:!text-black">
                읽기 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
