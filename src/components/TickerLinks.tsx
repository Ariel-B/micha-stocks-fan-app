'use client';

import { useState, useRef, useEffect } from 'react';
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
  const panelRef = useRef<HTMLSpanElement>(null);

  // Click-to-toggle the panel
  const handleClick = () => {
    if (!open && badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen((v) => !v);
  };

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        badgeRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <span
      ref={badgeRef}
      onClick={handleClick}
      className="font-semibold text-amber-700 underline decoration-dotted decoration-amber-400 cursor-pointer"
    >
      ${symbol}

      {open &&
        createPortal(
          <span
            ref={panelRef}
            dir="ltr"
            style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
            className="inline-flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-lg px-1 py-1 whitespace-nowrap"
          >
            {FINANCE_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.url(symbol)}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-slate-100 transition-colors no-underline"
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
