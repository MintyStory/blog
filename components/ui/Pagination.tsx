"use client";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="페이지네이션" className="flex items-center justify-center gap-2 mt-16">
      <button
        type="button"
        aria-label="이전 페이지"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-circle text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white"
      >
        &larr;
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`btn-pill !px-4 !py-2 min-w-10 justify-center ${
            p === page ? "bg-black text-white" : ""
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="btn-circle text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white"
      >
        &rarr;
      </button>
    </nav>
  );
}
