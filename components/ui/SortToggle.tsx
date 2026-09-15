"use client";

export type SortOption = "latest" | "popular";

export default function SortToggle({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  return (
    <div className="flex gap-2">
      {(["latest", "popular"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`btn-pill ${value === opt ? "bg-black text-white" : ""}`}
        >
          {opt === "latest" ? "최신순" : "인기순"}
        </button>
      ))}
    </div>
  );
}
