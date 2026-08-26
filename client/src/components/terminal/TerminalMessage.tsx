import React, { useState, memo } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalMessageProps {
  content: string;
  className?: string;
}

export const TerminalMessage = memo(function TerminalMessage({
  content,
  className,
}: TerminalMessageProps) {
  // Parse blocks (code blocks vs text paragraphs/lists)
  const blocks = parseMarkdownBlocks(content);

  return (
    <div
      className={cn(
        "space-y-3 font-mono text-[13px] leading-relaxed text-ink/90",
        className,
      )}
    >
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <CodeBlock key={idx} language={block.language} code={block.text} />
          );
        }
        return <TextBlock key={idx} text={block.text} />;
      })}
    </div>
  );
});

interface MarkdownBlock {
  type: "text" | "code";
  text: string;
  language?: string;
}

function parseMarkdownBlocks(raw: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = raw.split("\n");
  let inCode = false;
  let codeLang = "";
  let codeLines: string[] = [];
  let textLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.trim().startsWith("```")) {
      if (inCode) {
        // End code block
        blocks.push({
          type: "code",
          text: codeLines.join("\n"),
          language: codeLang || "text",
        });
        codeLines = [];
        codeLang = "";
        inCode = false;
      } else {
        // Flush previous text
        if (textLines.length > 0) {
          const text = textLines.join("\n").trim();
          if (text) blocks.push({ type: "text", text });
          textLines = [];
        }
        inCode = true;
        codeLang = line.trim().replace(/^```/, "").trim();
      }
    } else if (inCode) {
      codeLines.push(line);
    } else {
      textLines.push(line);
    }
  }

  if (inCode && codeLines.length > 0) {
    blocks.push({
      type: "code",
      text: codeLines.join("\n"),
      language: codeLang || "text",
    });
  } else if (textLines.length > 0) {
    const text = textLines.join("\n").trim();
    if (text) blocks.push({ type: "text", text });
  }

  return blocks;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-2 overflow-hidden rounded-md border border-border bg-surface-2/60 text-xs">
      <div className="flex items-center justify-between border-b border-border/80 bg-surface-2 px-3 py-1.5 text-[11px] text-muted">
        <span className="font-mono uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1 text-muted transition-colors hover:text-ink cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-circuit" />
              <span className="text-circuit">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }

        // Bullet item
        if (/^[-*•]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="flex-1">{renderInlineMarkdown(itemText)}</span>
            </div>
          );
        }

        // Numbered list item
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numberedMatch && numberedMatch[1] && numberedMatch[2]) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1">
              <span className="font-mono text-xs text-circuit">
                {numberedMatch[1]}.
              </span>
              <span className="flex-1">
                {renderInlineMarkdown(numberedMatch[2])}
              </span>
            </div>
          );
        }

        // Heading ##
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={lIdx}
              className="pt-2 font-display text-[14px] font-semibold text-ink"
            >
              {renderInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={lIdx}
              className="pt-2.5 font-display text-[15px] font-semibold text-ink"
            >
              {renderInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
            </h3>
          );
        }

        return <p key={lIdx}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Regex to match inline tokens: **bold**, `code`, [title](url)
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Bold
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-sm border border-border/80 bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-accent dark:text-accent"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown link [title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch && linkMatch[1] && linkMatch[2]) {
      const title = linkMatch[1];
      const url = linkMatch[2];
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-circuit underline decoration-circuit/40 underline-offset-2 transition-colors hover:text-circuit/80"
        >
          {title}
          <ExternalLink size={11} className="shrink-0" />
        </a>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
