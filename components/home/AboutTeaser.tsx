import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";

export default function AboutTeaser() {
  return (
    <section className="py-20 md:py-[120px] bg-surface-muted">
      <div className="container-blog">
        <Reveal className="flex flex-col md:flex-row items-start md:items-end justify-between gap-9">
          <div>
            <Eyebrow>About</Eyebrow>
            <h2 className="text-[32px] md:text-[48px] font-extrabold leading-[1.12] tracking-[-0.025em]">
              안녕하세요, 저는
              <br />
              기록하는
              <br />
              개발자입니다
            </h2>
          </div>
          <Link href="/about" className="btn-pill shrink-0">
            저에 대해 더 알아보기 &rarr;
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
