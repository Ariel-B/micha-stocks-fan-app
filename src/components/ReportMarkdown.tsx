'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import TickerLinks from './TickerLinks';

// Common uppercase abbreviations that are NOT stock tickers
const NON_TICKER_WORDS = new Set([
  'AI', 'AM', 'AN', 'AS', 'AT', 'BE', 'BY', 'DO', 'GO', 'IF', 'IN', 'IS',
  'IT', 'ME', 'MY', 'NO', 'OF', 'OK', 'ON', 'OR', 'SO', 'TO', 'UP', 'US', 'WE',
  'AND', 'ARE', 'BUT', 'CAN', 'DID', 'FOR', 'GET', 'GOT', 'HAD', 'HAS',
  'HIM', 'HIS', 'HOW', 'ITS', 'LET', 'MAY', 'NEW', 'NOT', 'NOW', 'OLD', 'OUT',
  'OWN', 'PUT', 'RUN', 'SAY', 'SEE', 'SHE', 'THE', 'TRY', 'TWO', 'YEN',
  'FROM', 'HAVE', 'THAT', 'THEM', 'THEY', 'THIS', 'WERE', 'WHAT', 'WITH',
  'ALSO', 'BEEN', 'DOES', 'EACH', 'EVEN', 'MANY', 'MORE', 'MUCH', 'MUST',
  'NEXT', 'NONE', 'ONLY', 'OVER', 'SAID', 'SAME', 'SUCH', 'THAN', 'THEN',
  'WELL', 'WHEN', 'WILL', 'YOUR',
  // Finance abbreviations that aren't tickers
  'IPO', 'GDP', 'ETF', 'RSI', 'DMA', 'ATH', 'ATL', 'EPS', 'PEG', 'FCF',
  'EMA', 'SMA', 'TTM', 'YOY', 'QOQ', 'MOM', 'BPS', 'FED', 'SEC', 'IMF',
  'ECB', 'USD', 'EUR', 'GBP', 'JPY', 'URL', 'API', 'PDF', 'CEO', 'CFO', 'CTO',
]);

/**
 * Convert ticker mentions ($NVDA or bare NVDA) to markdown links using the
 * internal `ticker://SYMBOL` scheme. Skips existing links and code blocks.
 */
function preprocessTickers(content: string): string {
  // Split on tokens we must NOT modify: existing md links, fenced code, inline code
  const PRESERVE = /(\[[^\]]*\]\([^)]*\)|```[\s\S]*?```|`[^`\n]*`)/g;
  const parts = content.split(PRESERVE);

  return parts
    .map((part, i) => {
      // Odd indices are preserved tokens — leave them untouched
      if (i % 2 === 1) return part;

      // Single pass: match $SYMBOL first, then bare SYMBOL
      return part.replace(
        /\$([A-Z]{1,6})\b|(?<![[\w])\b([A-Z]{3,6})\b(?![[\w])/g,
        (match, dollarSym: string | undefined, bareSym: string | undefined) => {
          if (bareSym) {
            if (NON_TICKER_WORDS.has(bareSym)) return match;
            return `[${match}](ticker://${bareSym})`;
          }
          // dollarSym match
          return `[${match}](ticker://${dollarSym})`;
        },
      );
    })
    .join('');
}

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
  const processedContent = preprocessTickers(content);

  const components: Components = {
    a({ href, children, ...rest }) {
      if (!href) return <a {...rest}>{children}</a>;

      // Ticker links rendered as inline badge with finance shortcuts
      if (href.startsWith('ticker://')) {
        const symbol = href.slice(9);
        return <TickerLinks symbol={symbol} />;
      }

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
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
