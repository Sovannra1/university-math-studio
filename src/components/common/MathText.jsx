"use client";

import React, { useMemo } from "react";
import katex from "katex";

/**
 * Extracts KaTeX math expressions (`$$...$$`, `\[...\]`, `\(...\)`, `$...$`),
 * parses `**bold**` and `` `code` `` across the remaining text (even when bold
 * wraps inline math), and renders everything cleanly.
 */
function renderMixedContent(text) {
  if (!text || typeof text !== "string") return null;

  const mathRegex =
    /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$(?!\$)(?:\\.|[^$\\\n])+?\$)/g;

  const mathTokens = [];
  const withPlaceholders = text.replace(mathRegex, (raw) => {
    let latex = raw;
    let displayMode = false;

    if (raw.startsWith("$$") && raw.endsWith("$$")) {
      latex = raw.slice(2, -2).trim();
      displayMode = true;
    } else if (raw.startsWith("\\[") && raw.endsWith("\\]")) {
      latex = raw.slice(2, -2).trim();
      displayMode = true;
    } else if (raw.startsWith("\\(") && raw.endsWith("\\)")) {
      latex = raw.slice(2, -2).trim();
      displayMode = false;
    } else if (raw.startsWith("$") && raw.endsWith("$")) {
      latex = raw.slice(1, -1).trim();
      displayMode = false;
    }

    const idx = mathTokens.length;
    mathTokens.push({ latex, displayMode });
    return `\u0000MATH_${idx}\u0000`;
  });

  // Render a chunk that may contain \u0000MATH_k\u0000 placeholders
  const renderChunkWithMath = (chunk, keyPrefix) => {
    const parts = chunk.split(/(\u0000MATH_\d+\u0000)/g);
    return parts.map((part, i) => {
      const m = /^\u0000MATH_(\d+)\u0000$/.exec(part);
      if (!m) {
        return <React.Fragment key={`${keyPrefix}-t-${i}`}>{part}</React.Fragment>;
      }
      const token = mathTokens[Number(m[1])];
      try {
        const html = katex.renderToString(token.latex, {
          displayMode: token.displayMode,
          throwOnError: false,
          strict: false,
        });
        if (token.displayMode) {
          return (
            <span
              key={`${keyPrefix}-m-${i}`}
              className="block my-3 overflow-x-auto text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <span
            key={`${keyPrefix}-m-${i}`}
            className="inline-block align-baseline mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return (
          <code key={`${keyPrefix}-e-${i}`} className="text-[#db073d] font-mono text-sm">
            {token.latex}
          </code>
        );
      }
    });
  };

  // Now parse **bold** and `code` even if they wrap math placeholders
  const mdParts = withPlaceholders.split(/(\*\*[\s\S]+?\*\*|`[^`]+`)/g);

  return mdParts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={`b-${idx}`} className="font-bold text-[#9c0329]">
          {renderChunkWithMath(part.slice(2, -2), `b-${idx}`)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={`c-${idx}`}
          className="rounded-md bg-[#ffe9e8] border border-[#fdbcbc] px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-[#7e021f]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return (
      <React.Fragment key={`n-${idx}`}>
        {renderChunkWithMath(part, `n-${idx}`)}
      </React.Fragment>
    );
  });
}

export default function MathText({ text, className = "" }) {
  const content = useMemo(() => renderMixedContent(text), [text]);
  return <span className={className}>{content}</span>;
}
