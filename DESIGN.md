# 디자인 정의서 (Design Guideline)

> 참고 사이트: [HD현대 채용](https://recruit.hd.com/) (GDWEB 2024 WINNER PRIZE 선정작 / 제작사: 나인파이브)
> 심사 키워드: 안정적, 모던한, 깔끔한, 신뢰적인 / 주색상: BLUE, WHITE

참고 사이트는 기업 채용 사이트이므로, 개인 블로그에 맞게 **레이아웃 문법과 인터랙션 패턴**은 최대한 가져오고 **콘텐츠/톤**만 블로그에 맞게 재해석한다.

---

## 1. 디자인 컨셉

| 항목 | 내용 |
|---|---|
| 무드 | 안정적 · 모던 · 깔끔 · 신뢰감 (여백 많은 에디토리얼 스타일) |
| 주 색상 | Blue + White 베이스, Black 텍스트 |
| 타이포그래피 | 큰 사이즈의 굵은 헤드라인 + 절제된 본문 |
| 레이아웃 톤 | 풀블리드(전체 폭) 이미지/영상 섹션 + 여백 넓은 그리드 |
| 인터랙션 톤 | 화려하지 않고 절제된 스크롤 리빌, 마이크로 인터랙션 위주 |

---

## 2. 컬러 시스템

원본 사이트에서 추출한 값 기준. 블로그는 그린(HD 로고 컬러) 대신 **블로그 고유 포인트 컬러 1개**로 대체 권장.

```css
:root {
  /* Base */
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-text-sub: #707070;      /* 보조 텍스트 / outline 버튼 gray */

  /* Brand / Point */
  --color-primary: #1E3A8A;        /* Deep Blue - 원본 참고사이트의 Blue 톤 */
  --color-primary-light: #4F7CFF;  /* 링크, hover, 배지 */
  --color-accent: #22C55E;         /* 포인트 컬러 1개 (선택, 로고/CTA 강조용) */

  /* Surface */
  --color-surface-dark: #0F172A;   /* 이미지 오버레이 카드 배경 */
  --color-surface-muted: #F5F6F8;  /* 섹션 구분용 연한 배경 */

  /* Gradient (섹션 전환용) */
  --gradient-blue: linear-gradient(180deg, #ffffff 0%, #A9C1F5 100%);
}
```

- 카드형 이미지 위에는 **다크 오버레이(rgba(0,0,0,0.4~0.55))** + 흰색 텍스트 조합 사용
- 버튼 보더는 기본 `#000`, 비활성/보조는 `#707070`
- 라운드는 버튼(pill, radius 999px)에만 적용하고 카드/이미지는 각진 사각형 또는 최소 radius(4~8px) 유지 → "깔끔함" 유지

---

## 3. 타이포그래피

원본 사이트 실측 폰트: **Pretendard** (sans-serif) — 무료 한글 폰트, 눈누에서도 배포됨.

### 폰트 적용 방식 (눈누 → 페이지 로드)
1. 눈누(noonnu.cc)에서 무료 폰트 확인 → **Pretendard** (본문/UI 겸용) 선정
2. CDN 또는 self-hosting 방식으로 적용

```css
/* CDN 방식 (빠른 적용) */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');

/* 또는 self-hosting: public/fonts 에 woff2 저장 후 */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
```

> Next.js 사용 시 `next/font/local`로 눈누에서 받은 woff2 파일을 로드하면 FOIT 없이 최적화된 방식으로 적용 가능.

### 타입 스케일

| 용도 | 크기(desktop) | 크기(mobile) | weight |
|---|---|---|---|
| Hero 헤드라인 (H1) | 56~64px | 32px | 800 (ExtraBold) |
| 섹션 타이틀 (H2) | 32~40px | 24px | 800 |
| 카드 타이틀 (H3) | 20~24px | 18px | 700 |
| 본문 | 16px | 15px | 400~500 |
| 보조/캡션 | 13~14px | 13px | 400, color: --color-text-sub |
| 라벨(Eyebrow, 예: "Our story") | 13px, letter-spacing 0.05em, uppercase | 동일 | 500 |

특징: 헤드라인은 굵고 크게, 줄바꿈을 의도적으로 넣어 2줄 구성. 본문/보조 텍스트는 상대적으로 작고 절제됨 → 대비를 통한 위계 강조.

---

## 4. 레이아웃 & 페이지 구조 (블로그 홈 기준 재해석)

원본 사이트의 섹션 흐름을 블로그 홈 화면에 매핑:

```
[Header]      투명 배경 + 스크롤 시 sticky, 좌측 로고 / 우측 햄버거 아이콘만
[Hero]        풀블리드 배경(사진/영상) + 대형 타이포 헤드라인(2줄)
              하단에 반투명 카드로 "최신 글 Pick" 노출 (원본의 "Apply Now" 카드 자리)
[Section 1]   3분할 카드 그리드 - 카테고리별 대표글 (다크 오버레이 이미지 + 라벨 + 제목 + 화살표 버튼)
[Section 2]   좌측 텍스트("Our story"류 eyebrow + 타이틀) / 우측 CTA 버튼 - 소개/About 유도
[Section 3]   가로 스크롤 카드 (인물 사진 → 블로그는 "인기 글 썸네일"로 대체)
[Section 4]   비대칭 이미지 배치 + 배경에 큰 페이드 텍스트(예: "LATEST POSTS") - 최신글 에디토리얼 노출
[Section 5]   화이트→블루 그라데이션 배경 + 중앙 정렬 카피 + CTA 버튼 (뉴스레터 구독 유도)
[Section 6]   풀블리드 무드 사진(어두운 톤) - 마무리 임팩트 섹션
[Footer]      좌측 정렬 텍스트 링크(소개/약관/사이트맵) + 소셜 아이콘 + Copyright
[Fixed UI]    우측 하단 원형 "맨 위로" 버튼 (스크롤 시 노출)
```

### 그리드 규칙
- 컨테이너 최대 너비: 1280px, 좌우 여백 최소 24px(mobile) / 80px(desktop)
- 카드 그리드: desktop 3~4col / tablet 2col / mobile 1col, gap 16~24px
- 섹션 간 수직 여백(padding-block): 120~160px(desktop), 64px(mobile) — "여백 많은" 톤 유지

---

## 5. 컴포넌트 스타일

### 버튼
- **Pill 아웃라인 버튼**: `border: 1px solid #000; border-radius: 999px; padding: 10px 20px;` + 우측 화살표 아이콘(→), hover 시 배경 검정/텍스트 흰색으로 반전
- **원형 아이콘 버튼**: 캐러셀 화살표, 맨 위로 버튼 — 지름 48px, border 1px, hover 시 배경 채움

### 카드 (이미지 오버레이형)
```css
.card {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
}
.card img { object-fit: cover; transition: transform .6s ease; }
.card:hover img { transform: scale(1.05); }
.card::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.6) 100%);
}
.card .label { font-size: 13px; opacity: .8; } /* 카테고리명 */
.card .title { font-size: 22px; font-weight: 800; color: #fff; }
```

### 헤더 / 내비게이션
- 기본: 배경 투명, 히어로 이미지 위에 흰색 텍스트
- 스크롤 후: 흰 배경 + 그림자(box-shadow) 부여, 텍스트 검정으로 전환
- 햄버거 클릭 → **풀스크린 오버레이 메뉴**: 아코디언(depth-1 항목 클릭 시 하위 메뉴 펼침, chevron 아이콘 회전), 하단에 언어/외부링크 바

---

## 6. 인터랙션 & 모션

| 요소 | 효과 |
|---|---|
| Hero 헤드라인 | 일정 주기로 키워드 단어가 교체되는 텍스트 스왑 애니메이션 (예: "미래" ↔ "당신") + fade/slide 전환 |
| Hero 배경 | 영상 자동재생 + 재생/일시정지 토글 버튼(원형) 제공 |
| 스크롤 리빌 | 섹션 진입 시 opacity 0→1 + translateY(30px→0), IntersectionObserver 기반, 200~400ms ease-out |
| 대형 배경 텍스트 | 섹션 배경에 매우 큰 폰트(예 120px+)의 옅은 회색/아웃라인 텍스트를 장식적으로 배치 (에디토리얼 느낌) |
| 카드 hover | 이미지 스케일업(1.05), 그림자 강화, 화살표 버튼 배경 반전 |
| 가로 스크롤 캐러셀 | 좌우 화살표 버튼 클릭 or 드래그/스와이프로 이동, 부드러운 easing |
| 그라데이션 섹션 | 스크롤 진행률에 따라 배경색이 white → blue로 서서히 전환 (scroll-linked) |
| Sticky 맨 위로 버튼 | 일정 스크롤 이후 우측 하단 고정 노출, fade-in |
| 헤더 스크롤 전환 | 스크롤 방향에 따라 표시/숨김 (아래로 스크롤 시 숨김, 위로 스크롤 시 재노출) — 선택 적용 |

> 모션은 과하지 않게: duration 200~600ms, easing은 `ease-out` 또는 `cubic-bezier(0.16, 1, 0.3, 1)` 계열 사용 (부드럽고 신뢰감 있는 느낌 유지).

---

## 7. 블로그 적용 매핑 요약

| 원본(채용사이트) | 블로그 적용 |
|---|---|
| Hero: 회사 슬로건 + 건물 이미지 | Hero: 블로그 타이틀/한줄소개 + 대표 이미지 또는 코드/작업 사진 |
| "Apply Now" 카드 | "최근 발행글" 하이라이트 카드 |
| 3분할 사업부문 카드 | 3~4분할 카테고리 카드 (예: 개발, 회고, 리뷰) |
| 직무 인터뷰 가로스크롤 | 인기글/추천글 가로 스크롤 |
| 복지 이미지 비대칭 배치 + 큰 배경 텍스트 | 최신글 비대칭 갤러리 + "LATEST POSTS" 대형 배경 텍스트 |
| 그라데이션 CTA (인재 채용 유도) | 그라데이션 CTA (뉴스레터 구독/RSS 구독 유도) |
| 마무리 건물 풀샷 | 마무리 무드 사진 또는 About 유도 섹션 |
| 푸터 | 동일 패턴 (법적고지/사이트맵/소셜 아이콘) |

---

## 8. 다음 단계
1. 눈누에서 Pretendard(또는 대체 폰트 후보 1~2개) 최종 선정 및 라이선스(상업적 이용 범위) 확인
2. Tailwind 기준 컬러/타입 토큰(`tailwind.config`)으로 위 값 반영
3. Hero 섹션부터 컴포넌트 단위로 퍼블리싱 → 스크롤 리빌 인터랙션 적용
4. [sitemap.md](sitemap.md)의 페이지 구조에 본 디자인 시스템 적용
