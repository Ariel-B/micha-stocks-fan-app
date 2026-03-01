import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ChevronRight } from 'lucide-react';
import { getReport, getAllReportParams, formatReportDate } from '@/lib/reports';
import VideoPlayer from '@/components/VideoPlayer';
import ReportMarkdown from '@/components/ReportMarkdown';

export async function generateStaticParams() {
  return getAllReportParams();
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ date: string; time: string }>;
}) {
  const { date, time } = await params;
  const report = getReport(date, time);

  if (!report) {
    notFound();
  }

  // Format time slot for display (HH-MM → HH:MM UTC)
  const timeLabel = time.replace('-', ':');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navigation bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-1.5 text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/reports" className="hover:text-emerald-600 transition-colors font-medium">
            Reports
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-slate-400 truncate max-w-[200px]">
            {formatReportDate(date)} · {timeLabel} UTC
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Back link */}
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All reports
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
            {formatReportDate(date)} · {timeLabel} UTC
          </p>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight text-right"
            dir="rtl"
            lang="he"
          >
            {report.title}
          </h1>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Watch on YouTube
          </a>
        </div>

        {/* Video player */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <VideoPlayer source={report.url} />
        </div>

        {/* Markdown report */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <ReportMarkdown content={report.content} />
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 text-center">
          ⚠ AI-generated summary for educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
