'use client';

import { useState } from 'react';

interface TickerLinksProps {
  symbol: string;
}

const FINANCE_LINKS = [
  {
    label: 'TV',
    title: 'TradingView',
    url: (s: string) => `https://www.tradingview.com/symbols/${s}/`,
    color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  },
  {
    label: 'YF',
    title: 'Yahoo Finance',
    url: (s: string) => `https://finance.yahoo.com/quote/${s}/`,
    color: 'bg-violet-50 text-violet-700 hover:bg-violet-100',
  },
  {
    label: 'GF',
    title: 'Google Finance',
    url: (s: string) => `https://www.google.com/finance/search?q=${s}`,
    color: 'bg-green-50 text-green-700 hover:bg-green-100',
  },
  {
    label: 'PP',
    title: 'Perplexity',
    url: (s: string) => `https://www.perplexity.ai/finance/${s}`,
    color: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
  },
];

export default function TickerLinks({ symbol }: TickerLinksProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-1 align-baseline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Ticker badge */}
      <span className="font-semibold text-amber-700 underline decoration-dotted decoration-amber-400 cursor-help">
        ${symbol}
      </span>

      {/* Inline buttons — appear right after the ticker text on hover */}
      {open && (
        <span className="inline-flex items-center gap-0.5">
          {FINANCE_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url(symbol)}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
              className={`text-[11px] font-bold px-1 py-0.5 rounded no-underline leading-none ${link.color}`}
              onClick={(e) => e.stopPropagation()}
            >
              {link.label}
            </a>
          ))}
        </span>
      )}
    </span>
  );
}
