import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-dark pt-18 pb-10">
      <div className="container-blog">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 pb-14 border-b border-white/7">
          <div>
            <div className="text-[17px] font-extrabold text-white tracking-[0.06em] mb-2.5">DEV LOG</div>
            <p className="text-[13px] text-white/35">생각을 코드로, 코드를 기록으로.</p>
          </div>
          <div className="flex flex-wrap gap-16">
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.07em] uppercase text-white/35 mb-5">탐색</h4>
              <ul className="flex flex-col gap-3 list-none">
                <li><Link href="/posts" className="text-sm text-white/60 hover:text-white transition-colors">전체 글</Link></li>
                <li><Link href="/categories" className="text-sm text-white/60 hover:text-white transition-colors">카테고리</Link></li>
                <li><Link href="/tags" className="text-sm text-white/60 hover:text-white transition-colors">태그</Link></li>
                <li><Link href="/archive" className="text-sm text-white/60 hover:text-white transition-colors">아카이브</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.07em] uppercase text-white/35 mb-5">더 보기</h4>
              <ul className="flex flex-col gap-3 list-none">
                <li><Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">소개</Link></li>
                <li><Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">검색</Link></li>
                <li><Link href="/rss.xml" className="text-sm text-white/60 hover:text-white transition-colors">RSS</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2.5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="/rss.xml"
              aria-label="RSS 피드"
              className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-center md:text-left">
          <p className="text-xs text-white/25">&copy; 2026 DEV LOG. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <Link href="/privacy" className="text-xs text-white/25 hover:text-white/55 transition-colors">개인정보처리방침</Link>
            <Link href="/sitemap.xml" className="text-xs text-white/25 hover:text-white/55 transition-colors">사이트맵</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
