import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

// 관리자 WYSIWYG 에디터(Tiptap)가 저장한 HTML을 그대로 신뢰하지 않고 항상 새로 살균해서 렌더링한다 —
// 이미지/오디오/유튜브·문서 임베드(iframe)를 허용하되 script 등 위험 요소는 계속 차단.
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe", "audio", "source", "video", "u"],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ["src", "width", "height", "frameBorder", "allow", "allowFullScreen", "style", "title"],
    audio: ["src", "controls"],
    video: ["src", "controls", "width", "height"],
    source: ["src", "type"],
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height", "style"],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
    div: [...(defaultSchema.attributes?.div ?? []), "style", "className", "dataDocEmbed", "dataSrc", "dataFilename"],
    span: [...(defaultSchema.attributes?.span ?? []), "style"],
    p: [...(defaultSchema.attributes?.p ?? []), "style"],
    h1: [...(defaultSchema.attributes?.h1 ?? []), "style"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "style"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "style"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "style"],
    blockquote: [...(defaultSchema.attributes?.blockquote ?? []), "style"],
    table: [...(defaultSchema.attributes?.table ?? []), "style"],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["http", "https"],
  },
};

function renderHtml(content: string): string {
  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, schema)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .processSync(content);
  return String(file);
}

export default function PostBody({ content }: { content: string }) {
  return <div className="prose-blog max-w-none" dangerouslySetInnerHTML={{ __html: renderHtml(content) }} />;
}
