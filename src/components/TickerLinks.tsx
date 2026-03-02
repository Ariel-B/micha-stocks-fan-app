'use client';

import { useState } from 'react';

interface TickerLinksProps {
  symbol: string;
}

const FINANCE_LINKS = [
  {
    title: 'TradingView',
    url: (s: string) => `https://www.tradingview.com/symbols/${s}/`,
    favicon: 'tradingview.com',
  },
  {
    title: 'Yahoo Finance',
    url: (s: string) => `https://finance.yahoo.com/chart/${s}`,
    favicon: 'finance.yahoo.com',
  },
  {
    title: 'Google Finance',
    url: (s: string) => `https://www.google.com/finance/quote/${s}:NASDAQ`,
    favicon: 'google.com',
  },
  {
    title: 'TradingView Chart',
    url: (s: string) => `https://www.tradingview.com/chart/?symbol=NASDAQ%3A${s}`,
    favicon: 'tradingview.com',
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

      {/* Inline icon buttons — appear right after the ticker text on hover */}
      {open && (
        <span className="inline-flex items-center gap-0.5">
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
        </span>
      )}
    </span>
  );
}
