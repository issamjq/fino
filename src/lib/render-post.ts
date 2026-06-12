import "server-only";
import sanitizeHtml from "sanitize-html";
import { toParagraphs } from "@/lib/blog";

/**
 * Turn a post body into safe HTML for rendering.
 * - Rich-text bodies (from the mjqapp editor) are HTML → sanitized (XSS-safe).
 * - Plain-text bodies (dummy fallback) are split into <p> paragraphs.
 */
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const hasTags = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);

export function renderPostBody(body: string): string {
  const raw = hasTags(body)
    ? body
    : toParagraphs(body)
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");

  return sanitizeHtml(raw, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "strike", "del",
      "code", "pre", "blockquote", "ol", "ul", "li",
      "h1", "h2", "h3", "h4", "a", "span", "hr",
      "img", "figure", "figcaption", "video", "source", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      video: ["src", "controls", "width", "height", "poster", "muted", "loop", "autoplay", "playsinline", "preload"],
      source: ["src", "type"],
      iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "title"],
      "*": ["style"],
    },
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
      video: ["http", "https"],
      source: ["http", "https"],
      iframe: ["https"],
    },
    // only embed iframes from trusted video hosts
    allowedIframeHostnames: [
      "www.youtube.com", "youtube.com",
      "www.youtube-nocookie.com", "youtube-nocookie.com",
      "player.vimeo.com", "vimeo.com",
      "www.dailymotion.com", "dailymotion.com",
    ],
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
      },
      // the editor stores image resize + centering as inline styles
      // (e.g. width:50%;display:block;margin-left:auto;margin-right:auto)
      img: {
        width: [/^\d{1,3}(\.\d+)?%$/, /^\d{1,4}(\.\d+)?px$/],
        height: [/^\d{1,4}(\.\d+)?px$/, /^auto$/],
        display: [/^(block|inline|inline-block)$/],
        "margin-left": [/^(auto|0)$/],
        "margin-right": [/^(auto|0)$/],
      },
    },
    transformTags: {
      // make external links safe
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });
}
