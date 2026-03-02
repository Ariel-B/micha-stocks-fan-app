'use client';

import { useState, useRef, useCallback } from 'react';
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 300);
  }, []);

  const handleBadgeEnter = useCallback(() => {
    cancelClose();
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      // position: fixed — coords are viewport-relative, no scroll offset needed
      setPos({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setOpen(true);
  }, [cancelClose]);

  return (
    <span
      ref={badgeRef}
      onMouseEnter={handleBadgeEnter}
      onMouseLeave={scheduleClose}
      className="font-semibold text-amber-700 underline decoration-dotted decoration-amber-400 cursor-help"
    >
      ${symbol}

      {open &&
        createPortal(
          <span
            dir="ltr"
            style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
            className="inline-flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-lg px-1 py-1 whitespace-nowrap"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
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
