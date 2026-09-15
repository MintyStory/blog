const MOCK_COMMENTS = [
  { author: "익명의 개발자", date: "2026-09-15", text: "좋은 글 감사합니다, 많은 도움이 됐어요!" },
  { author: "코드러버", date: "2026-09-14", text: "혹시 관련해서 참고할만한 레퍼런스도 있을까요?" },
];

export default function CommentsSection() {
  return (
    <div className="mt-20 pt-12 border-t border-black/10">
      <h3 className="text-2xl font-extrabold mb-8">댓글 {MOCK_COMMENTS.length}</h3>
      <ul className="list-none space-y-6 mb-8">
        {MOCK_COMMENTS.map((c) => (
          <li key={c.author + c.date} className="border border-black/10 rounded-md p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-sm">{c.author}</span>
              <span className="text-xs text-text-sub">{c.date}</span>
            </div>
            <p className="text-sm text-text">{c.text}</p>
          </li>
        ))}
      </ul>
      <form className="flex flex-col gap-3">
        <textarea
          disabled
          placeholder="댓글 기능은 준비 중입니다 (UI 미리보기)"
          rows={3}
          className="border border-black/15 rounded-md p-4 text-sm resize-none bg-surface-muted text-text-sub"
        />
        <button type="button" disabled className="btn-pill self-end opacity-40 cursor-not-allowed">
          등록
        </button>
      </form>
    </div>
  );
}
