import { Suspense } from 'react';
import Link from 'next/link';
import courseDataRaw from '@/data/course.json';
import { TrendingUp, BarChart2 } from 'lucide-react';
import CourseBrowser from '@/components/CourseBrowser';

type Lesson = {
  id: string;
  title: string;
  source?: string;
  learn_items?: string[];
  concepts: { title: string; body: string; timestamp?: number }[];
  takeaways?: { text: string; level: number }[];
  glossary?: { term: string; definition: string }[];
  important_context?: string | null;
};

const courseData = courseDataRaw as Lesson[];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white py-20 px-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-sm">Micha Stocks Academy</h1>
          </div>
          <p className="text-indigo-100 text-2xl max-w-3xl leading-relaxed font-medium">
            Your comprehensive guide to the stock market, investing, and financial freedom.
            Explore the lessons below to start your journey.
          </p>
          <div className="mt-6">
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors backdrop-blur-sm"
            >
              <BarChart2 className="w-4 h-4" />
              Daily Market Reports →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <Suspense fallback={<div className="text-slate-400 text-center py-12">Loading…</div>}>
          <CourseBrowser lessons={courseData} />
        </Suspense>
      </main>
    </div>
  );
}
