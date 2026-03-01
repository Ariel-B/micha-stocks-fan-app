'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface ReportMarkdownProps {
  content: string;
}

function extractYouTubeTimestamp(href: string): number | null {
  try {
    const url = new URL(href);
    const isYouTube =
      url.hostname === 'www.youtube.com' ||
      url.hostname === 'youtube.com' ||
      url.hostname === 'youtu.be';
    if (!isYouTube) return null;
    const t = url.searchParams.get('t');
    if (!t) return null;
    const seconds = parseInt(t, 10);
    return isFinite(seconds) ? seconds : null;
  } catch {
    return null;
  }
}

export default function ReportMarkdown({ content }: ReportMarkdownProps) {
  const components: Components = {
    a({ href, children, ...rest }) {
      if (!href) return <a {...rest}>{children}</a>;

      const timestamp = extractYouTubeTimestamp(href);

      if (timestamp !== null) {
        return (
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('jumpToTime', { detail: { timestamp } }),
              );
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer text-emerald-600 hover:underline bg-transparent border-none p-0 font-inherit text-inherit"
            type="button"
          >
            {children}
          </button>
        );
      }

      // Non-YouTube links open normally
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    },
  };

  return (
    <div
      dir="rtl"
      lang="he"
      className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-emerald-400 prose-blockquote:not-italic prose-th:text-right prose-td:text-right"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
