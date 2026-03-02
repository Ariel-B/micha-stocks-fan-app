'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TickerLinksProps {
  symbol: string;
}

const FINANCE_LINKS = [
  {
    title: 'TradingView',
    url: (s: string) => `https://www.tradingview.com/chart/?symbol=${s}`,
    favicon: 'tradingview.com',
  },
  {
    title: 'Yahoo Finance',
    url: (s: string) => `https://finance.yahoo.com/chart/${s}`,
    favicon: 'finance.yahoo.com',
  },
  {
    title: 'Google Finance',
    url: (s: string) => `https://www.google.com/finance/quote/${s}`,
    favicon: 'google.com',
  },
  {
    title: 'Perplexity',
    url: (s: string) => `https://www.perplexity.ai/finance/${s}`,
    favicon: 'perplexity.ai',
  },
];

export default function TickerLinks({ symbol }: TickerLinksProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const badgeRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
    setOpen(true);
  };

  return (
    <span
      ref={badgeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
      className="font-semibold text-amber-700 underline decoration-dotted decoration-amber-400 cursor-help"
    >
      ${symbol}

      {open &&
        createPortal(
          <span
            dir="ltr"
            style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999 }}
            className="inline-flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-lg px-1 py-1 whitespace-nowrap"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {FINANCE_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.url(symbol)}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-slate-100 transition-colors no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${link.favicon}&sz=16`}
                  alt={link.title}
                  width={14}
                  height={14}
                  className="rounded-sm"
                />
              </a>
            ))}
          </span>,
          document.body,
        )}
    </span>
  );
}
