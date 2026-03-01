import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { ReportMeta } from '@/lib/reports';

interface ReportCardProps {
  report: ReportMeta;
}

export default function ReportCard({ report }: ReportCardProps) {
  const { date, time, videoId, title, url } = report;
  const href = `/reports/${date}/${time}`;
  const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  // Format the time slot as an approximate time (HH-MM → HH:MM)
  const timeLabel = time.replace('-', ':');

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Thumbnail */}
      <Link href={href} className="block relative aspect-video overflow-hidden bg-slate-100">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-slate-900 text-sm font-semibold px-4 py-2 rounded-full">
            Read Report →
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Time badge */}
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
          {timeLabel} UTC
        </span>

        {/* Title */}
        <Link href={href}>
          <h3
            className="text-sm font-semibold text-slate-800 leading-snug line-clamp-3 hover:text-indigo-700 transition-colors text-right"
            dir="rtl"
            lang="he"
          >
            {title}
          </h3>
        </Link>

        {/* Footer: links */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
          <Link
            href={href}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Read full report →
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
