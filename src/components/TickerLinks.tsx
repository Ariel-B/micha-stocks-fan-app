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
    color: 'hover:bg-blue-100 hover:text-blue-700',
  },
  {
    label: 'YF',
    title: 'Yahoo Finance',
    url: (s: string) => `https://finance.yahoo.com/quote/${s}/`,
    color: 'hover:bg-violet-100 hover:text-violet-700',
  },
  {
    label: 'GF',
    title: 'Google Finance',
    url: (s: string) => `https://www.google.com/finance/search?q=${s}`,
    color: 'hover:bg-green-100 hover:text-green-700',
  },
  {
    label: 'PP',
    title: 'Perplexity',
    url: (s: string) => `https://www.perplexity.ai/finance/${s}`,
    color: 'hover:bg-teal-100 hover:text-teal-700',
  },
];

export default function TickerLinks({ symbol }: TickerLinksProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-block align-baseline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Ticker badge */}
      <span className="inline-block font-semibold text-amber-700 underline decoration-dotted decoration-amber-400 cursor-help select-none">
        ${symbol}
      </span>

      {/* Tooltip — rendered as a block wrapper with bottom padding to bridge
          the gap between the badge and the popup box, so the mouse never
          leaves the hover zone while moving between them. */}
      {open && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 pb-2 block"
          dir="ltr"
        >
          <span className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-lg px-1 py-1 whitespace-nowrap">
            <span className="text-xs font-bold text-slate-500 px-1 select-none">
              {symbol}
            </span>
            <span className="w-px h-4 bg-slate-200 inline-block" />
            {FINANCE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url(symbol)}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className={`text-xs font-semibold px-1.5 py-0.5 rounded text-slate-500 no-underline transition-colors ${link.color}`}
                onClick={(e) => e.stopPropagation()}
              >
                {link.label}
              </a>
            ))}
          </span>
        </span>
      )}
    </span>
  );
}
