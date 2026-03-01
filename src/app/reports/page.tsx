import Link from 'next/link';
import { BarChart2, ArrowLeft } from 'lucide-react';
import { getAllReports, formatReportDate } from '@/lib/reports';
import ReportCard from '@/components/ReportCard';

export const dynamic = 'force-static';

export default function ReportsPage() {
  const reports = getAllReports();

  // Group by date
  const byDate = new Map<string, typeof reports>();
  for (const report of reports) {
    const group = byDate.get(report.date) ?? [];
    group.push(report);
    byDate.set(report.date, group);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white py-16 px-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <BarChart2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
                Daily Market Reports
              </h1>
              <p className="text-emerald-100 text-lg mt-1">
                AI-generated insights from Micha&apos;s daily market commentary
              </p>
            </div>
          </div>
          <p className="text-emerald-200 text-sm mt-2 max-w-2xl">
            ⚠ These reports are AI-generated summaries for educational purposes only. Nothing here
            constitutes financial advice.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-12 px-6 space-y-14">
        {reports.length === 0 ? (
          <p className="text-slate-400 text-center py-20">No reports available yet.</p>
        ) : (
          Array.from(byDate.entries()).map(([date, dateReports]) => (
            <section key={date}>
              {/* Date heading */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-slate-200" />
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {formatReportDate(date)}
                </h2>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dateReports.map((report) => (
                  <ReportCard key={`${report.date}-${report.time}`} report={report} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
