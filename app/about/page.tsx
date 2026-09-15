import Image from "next/image";
import type { Metadata } from "next";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = { title: "소개 — DEV LOG" };

const TIMELINE = [
  { period: "2024 — 현재", text: "프론트엔드/백엔드를 오가며 실무 프로젝트 진행 중" },
  { period: "2023", text: "사이드 프로젝트를 통해 인프라 자동화에 관심을 갖기 시작" },
  { period: "2022", text: "개발을 처음 시작, 웹 프론트엔드부터 학습" },
];

export default function AboutPage() {
  return (
    <div className="pb-24 md:pb-32">
      <div className="relative h-[46vh] min-h-[320px] flex items-end">
        <div className="absolute inset-0">
          <Image src="/images/hero-developer-workspace.webp" alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-surface-dark/55" />
        <div className="container-blog relative z-10 pb-12">
          <Eyebrow>About</Eyebrow>
          <h1 className="text-[32px] md:text-[48px] font-extrabold text-white leading-[1.15] tracking-[-0.025em]">
            안녕하세요, 저는
            <br />
            기록하는 개발자입니다
          </h1>
        </div>
      </div>

      <div className="container-blog pt-16 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-16">
        <div>
          <p className="text-base leading-[1.8] mb-6">
            배우고 경험한 것을 코드와 글로 남기는 것을 좋아합니다. 프론트엔드부터 인프라까지 폭넓게 관심을 두고 있으며,
            직접 부딪혀서 얻은 실전 지식을 이 블로그에 정리하고 있습니다.
          </p>
          <p className="text-base leading-[1.8] mb-14">
            완벽한 답보다는 정직한 시행착오의 기록을 남기려 합니다. 같은 문제로 고민하는 누군가에게 도움이 되었으면 합니다.
          </p>

          <h2 className="text-2xl font-extrabold mb-8">타임라인</h2>
          <ul className="list-none space-y-6">
            {TIMELINE.map((item) => (
              <li key={item.period} className="flex gap-6 border-b border-black/8 pb-6">
                <span className="text-sm text-text-sub w-28 shrink-0">{item.period}</span>
                <span className="text-[15px]">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside>
          <h3 className="eyebrow">Connect</h3>
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-11 h-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
