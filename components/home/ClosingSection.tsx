import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function ClosingSection() {
  return (
    <section className="relative h-[68vh] min-h-[460px] flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/images/closing-night-workspace.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </div>
      <div className="absolute inset-0 bg-surface-dark/58" />
      <Reveal className="relative z-10 text-center px-6">
        <p className="text-sm text-white/65 tracking-[0.04em] mb-5">오늘도 무언가를 만들고 기록하는 중.</p>
        <h2 className="text-[34px] md:text-[52px] font-extrabold text-white tracking-[-0.025em] leading-[1.1] mb-11">
          가장 최근에 쓴 글
          <br />
          읽어보시겠어요?
        </h2>
        <Link href="/posts" className="btn-pill btn-pill-white">
          전체 글 보러가기 &rarr;
        </Link>
      </Reveal>
    </section>
  );
}
