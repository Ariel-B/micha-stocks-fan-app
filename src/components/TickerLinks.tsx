'use client';

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
  return (
    <span className="relative inline-block group align-baseline">
      {/* Ticker badge */}
      <span className="inline-block font-semibold text-amber-700 underline decoration-dotted decoration-amber-400 cursor-help select-none">
        ${symbol}
      </span>

      {/* Hover tooltip */}
      <span
        className="
          absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5
          flex items-center gap-0.5 bg-white border border-slate-200
          rounded-lg shadow-lg px-1 py-1
          opacity-0 pointer-events-none
          group-hover:opacity-100 group-hover:pointer-events-auto
          transition-opacity duration-150
          whitespace-nowrap
        "
        dir="ltr"
      >
        <span className="text-xs font-bold text-slate-500 px-1 select-none">{symbol}</span>
        <span className="w-px h-4 bg-slate-200" />
        {FINANCE_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url(symbol)}
            target="_blank"
            rel="noopener noreferrer"
            title={link.title}
            className={`text-xs font-semibold px-1.5 py-0.5 rounded text-slate-500 transition-colors ${link.color}`}
            onClick={(e) => e.stopPropagation()}
          >
            {link.label}
          </a>
        ))}
      </span>
    </span>
  );
}
