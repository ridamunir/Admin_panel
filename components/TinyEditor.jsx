"use client";

import { Editor } from "@tinymce/tinymce-react";

// Self-hosted TinyMCE — no cloud API key.
// Assets are copied to public/tinymce by scripts/copy-tinymce.js (postinstall).
//
// Toolbar matches the in-chat demo exactly, in the same order:
// H1–H6, Paragraph, Bold, Italic, bullet/numbered lists, Link, Clear,
// Code, Preview — all as visible buttons.
//
// Why the old toolbar showed NONE of this: it used `formatselect`, which
// does not exist in TinyMCE 7 (package.json: tinymce ^7.3.0) — unknown
// toolbar items are silently dropped, so no Paragraph dropdown ever
// rendered on the live site. The "p" at the bottom-left of the editor
// is only the status bar showing the current block, not a button.
// Headings are therefore registered here as real toggle buttons.
export default function TinyEditor({ value, onChange, height = 220 }) {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      value={value || ""}
      onEditorChange={(content) => onChange && onChange(content)}
      init={{
        height,
        menubar: false,
        plugins: "link lists code preview",
        toolbar:
          "h1 h2 h3 h4 h5 h6 p | bold italic | bullist numlist | link | removeformat | code preview",
        branding: false,
        promotion: false,
        license_key: "gpl",
        setup(editor) {
          const blocks = [
            { tag: "h1", label: "H1" },
            { tag: "h2", label: "H2" },
            { tag: "h3", label: "H3" },
            { tag: "h4", label: "H4" },
            { tag: "h5", label: "H5" },
            { tag: "h6", label: "H6" },
            { tag: "p", label: "P" },
          ];
          blocks.forEach(({ tag, label }) => {
            editor.ui.registry.addToggleButton(tag, {
              text: label,
              tooltip: tag === "p" ? "Paragraph" : `Heading ${tag.slice(1)}`,
              onAction() {
                editor.formatter.toggle(tag);
              },
              onSetup(api) {
                const handler = () => api.setActive(editor.formatter.match(tag));
                editor.on("NodeChange", handler);
                return () => editor.off("NodeChange", handler);
              },
            });
          });
        },
      }}
    />
  );
}
