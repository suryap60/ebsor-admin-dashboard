"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useMemo } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],

        ["bold", "italic", "underline", "strike"],

        [{ color: [] }, { background: [] }],

        [{ script: "sub" }, { script: "super" }],

        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],

        [{ align: [] }],

        ["blockquote", "code-block"],

        ["link", "image"],

        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="h-64 mb-12 text-black dark:text-white"
      />
    </div>
  );
}