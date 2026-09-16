import { Extension, Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
    audioEmbed: {
      setAudio: (src: string) => ReturnType;
    };
    docEmbed: {
      setDocEmbed: (attrs: { src: string; filename: string }) => ReturnType;
    };
  }
}

const INDENT_TYPES = ["paragraph", "heading"];
const INDENT_STEP_EM = 2;
const INDENT_MAX_STEPS = 6;

/** 문단/제목에 margin-left를 누적 적용하는 들여쓰기 확장. */
export const Indent = Extension.create({
  name: "indent",
  addGlobalAttributes() {
    return [
      {
        types: INDENT_TYPES,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element: HTMLElement) => {
              const px = parseFloat(element.style.marginLeft || "0");
              const em = px / 16 / INDENT_STEP_EM;
              return Number.isFinite(em) ? Math.round(em) : 0;
            },
            renderHTML: (attributes: { indent?: number }) => {
              if (!attributes.indent) return {};
              return { style: `margin-left: ${attributes.indent * INDENT_STEP_EM}em` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    function step(delta: number) {
      return () =>
        ({ tr, state, dispatch }: { tr: import("@tiptap/pm/state").Transaction; state: import("@tiptap/pm/state").EditorState; dispatch?: (tr: import("@tiptap/pm/state").Transaction) => void }) => {
          const { selection, doc } = state;
          doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (!INDENT_TYPES.includes(node.type.name)) return;
            const next = Math.min(Math.max((node.attrs.indent || 0) + delta, 0), INDENT_MAX_STEPS);
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
          });
          if (dispatch) dispatch(tr);
          return true;
        };
    }
    return {
      indent: step(1),
      outdent: step(-1),
    };
  },
});

/** 오디오 파일 첨부 — <audio controls src="..."> 로 렌더링되는 atomic 블록 노드. */
export const AudioEmbed = Node.create({
  name: "audioEmbed",
  group: "block",
  atom: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "audio[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["audio", mergeAttributes(HTMLAttributes, { controls: "true" })];
  },
  addCommands() {
    return {
      setAudio:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    };
  },
});

/** 문서 첨부(pdf/docx/hwp 등) — Google Docs Viewer iframe + 다운로드 링크를 렌더링하는 atomic 블록 노드. */
export const DocEmbed = Node.create({
  name: "docEmbed",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      filename: { default: "파일" },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-doc-embed]",
        getAttrs: (element) => {
          const el = element as HTMLElement;
          return {
            src: el.getAttribute("data-src"),
            filename: el.getAttribute("data-filename") || "파일",
          };
        },
      },
    ];
  },
  renderHTML({ node }) {
    const { src, filename } = node.attrs as { src: string; filename: string };
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(src)}&embedded=true`;
    return [
      "div",
      { "data-doc-embed": "true", "data-src": src, "data-filename": filename, class: "doc-embed" },
      ["iframe", { src: viewerUrl, width: "100%", height: "600", style: "border:1px solid #e5e5e5;border-radius:8px" }],
      ["a", { href: src, target: "_blank", rel: "noopener noreferrer" }, `${filename} 다운로드`],
    ];
  },
  addCommands() {
    return {
      setDocEmbed:
        (attrs: { src: string; filename: string }) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
