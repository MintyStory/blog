"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import { Indent, AudioEmbed, DocEmbed } from "@/lib/tiptapExtensions";

const btnClass =
  "px-2.5 py-1.5 text-xs font-bold border border-black/15 rounded-md bg-white hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed";
const activeBtnClass = "bg-black text-white hover:bg-black";
const selectClass = "px-2 py-1.5 text-xs border border-black/15 rounded-md bg-white";

const FONTS = [
  { label: "고딕", value: "sans-serif" },
  { label: "명조", value: "serif" },
  { label: "고정폭", value: "monospace" },
];

const SIZES = [
  { label: "작게", value: "0.85em" },
  { label: "보통", value: "1em" },
  { label: "크게", value: "1.25em" },
  { label: "아주 크게", value: "1.5em" },
];

const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"];

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function Toolbar({ editor }: { editor: Editor }) {
  function insertImage() {
    const url = window.prompt("이미지 URL을 입력하세요 (구글 드라이브·네이버 MYBOX 등에 올린 뒤 공유 링크 사용)");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  function insertFile() {
    const url = window.prompt("첨부할 파일(음악·문서 등)의 URL을 입력하세요");
    if (!url) return;
    const isAudio = AUDIO_EXTENSIONS.some((ext) => url.toLowerCase().split("?")[0].endsWith(ext));
    if (isAudio) {
      editor.chain().focus().setAudio(url).run();
      return;
    }
    const filename = decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? "파일");
    editor.chain().focus().setDocEmbed({ src: url, filename }).run();
  }

  function insertVideo() {
    const url = window.prompt("유튜브 영상 URL을 입력하세요");
    if (!url) return;
    if (!extractYoutubeId(url)) {
      window.alert("유효한 유튜브 URL이 아닙니다.");
      return;
    }
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  function insertLink() {
    const url = window.prompt("링크 URL을 입력하세요");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 border border-black/15 border-b-0 rounded-t-md bg-surface-muted">
      <select
        className={selectClass}
        value=""
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else if (v === "quote") editor.chain().focus().toggleBlockquote().run();
          else if (v) editor.chain().focus().toggleHeading({ level: Number(v) as 1 | 2 | 3 }).run();
        }}
      >
        <option value="" disabled>
          본문
        </option>
        <option value="p">본문</option>
        <option value="1">제목1</option>
        <option value="2">제목2</option>
        <option value="3">제목3</option>
        <option value="quote">인용구</option>
      </select>

      <select
        className={selectClass}
        value=""
        onChange={(e) => {
          if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
        }}
      >
        <option value="">폰트</option>
        {FONTS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value=""
        onChange={(e) => {
          if (e.target.value) editor.chain().focus().setFontSize(e.target.value).run();
        }}
      >
        <option value="">크기</option>
        {SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <div className="w-px h-5 bg-black/15" />

      <button
        type="button"
        className={`${btnClass} ${editor.isActive("bold") ? activeBtnClass : ""}`}
        title="굵게"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        type="button"
        className={`${btnClass} italic ${editor.isActive("italic") ? activeBtnClass : ""}`}
        title="기울임"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>
      <button
        type="button"
        className={`${btnClass} underline ${editor.isActive("underline") ? activeBtnClass : ""}`}
        title="밑줄"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </button>

      <div className="w-px h-5 bg-black/15" />

      <button
        type="button"
        className={`${btnClass} ${editor.isActive({ textAlign: "left" }) ? activeBtnClass : ""}`}
        title="왼쪽 정렬"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ⯇
      </button>
      <button
        type="button"
        className={`${btnClass} ${editor.isActive({ textAlign: "center" }) ? activeBtnClass : ""}`}
        title="가운데 정렬"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ▤
      </button>
      <button
        type="button"
        className={`${btnClass} ${editor.isActive({ textAlign: "right" }) ? activeBtnClass : ""}`}
        title="오른쪽 정렬"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ⯈
      </button>
      <button type="button" className={btnClass} title="들여쓰기" onClick={() => editor.chain().focus().indent().run()}>
        들여쓰기+
      </button>
      <button type="button" className={btnClass} title="내어쓰기" onClick={() => editor.chain().focus().outdent().run()}>
        들여쓰기-
      </button>

      <div className="w-px h-5 bg-black/15" />

      <button type="button" className={btnClass} title="링크" onClick={insertLink}>
        링크
      </button>
      <button
        type="button"
        className={`${btnClass} ${editor.isActive("codeBlock") ? activeBtnClass : ""}`}
        title="코드블록"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        코드
      </button>
      <button
        type="button"
        className={btnClass}
        title="표"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        표
      </button>
      <button type="button" className={btnClass} title="구분선" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        구분선
      </button>

      <div className="w-px h-5 bg-black/15" />

      <button type="button" className={btnClass} title="사진 삽입 (URL)" onClick={insertImage}>
        사진
      </button>
      <button type="button" className={btnClass} title="파일/음악 첨부 (URL)" onClick={insertFile}>
        파일/음악
      </button>
      <button type="button" className={btnClass} title="동영상 삽입 (유튜브)" onClick={insertVideo}>
        동영상
      </button>
    </div>
  );
}

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Indent,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      TableKit.configure({ table: { resizable: true } }),
      Youtube,
      AudioEmbed,
      DocEmbed,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose-blog max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
    // 부모가 넘겨준 content가 바뀔 때만(예: 다른 글 로드) 동기화 — 매 타이핑마다 재실행하지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return <div className="border border-black/15 rounded-md p-6 min-h-[300px] text-text-sub text-sm">에디터 로딩 중...</div>;

  return (
    <div>
      <Toolbar editor={editor} />
      <div className="border border-black/15 rounded-b-md">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
