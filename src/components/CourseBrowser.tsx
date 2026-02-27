'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  PlayCircle,
  Target,
  Building2,
  Brain,
  BarChart2,
  CandlestickChart,
  ArrowLeftRight,
  Layers,
  TrendingUp,
  Globe,
  Wrench,
} from 'lucide-react';
import {
  SECTIONS,
  SECTION_COLORS,
  getLessonNum,
  getSectionForLesson,
} from '@/data/sections';
import InlineMarkdown from '@/components/InlineMarkdown';

/** Extract YouTube video ID from a watch URL, e.g. https://www.youtube.com/watch?v=ABC123 → "ABC123" */
function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

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

const SECTION_ICONS: Record<string, React.ReactNode> = {
  all:              <BookOpen className="w-4 h-4" />,
  foundations:      <Building2 className="w-4 h-4" />,
  psychology:       <Brain className="w-4 h-4" />,
  fundamentals:     <BarChart2 className="w-4 h-4" />,
  technical:        <CandlestickChart className="w-4 h-4" />,
  'buying-selling': <ArrowLeftRight className="w-4 h-4" />,
  instruments:      <Layers className="w-4 h-4" />,
  earnings:         <TrendingUp className="w-4 h-4" />,
  macro:            <Globe className="w-4 h-4" />,
  tools:            <Wrench className="w-4 h-4" />,
};

export default function CourseBrowser({ lessons }: { lessons: Lesson[] }) {
  const searchParams = useSearchParams();
  const initialSection = searchParams.get('section') ?? 'all';
  const [activeSection, setActiveSection] = useState(
    SECTIONS.some(s => s.id === initialSection) ? initialSection : 'all'
  );

  // Sync if URL changes (e.g. browser back)
  useEffect(() => {
    const s = searchParams.get('section') ?? 'all';
    if (SECTIONS.some(sec => sec.id === s)) {
      setActiveSection(s);
    }
  }, [searchParams]);

  const sectionCounts = SECTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s.id] = s.id === 'all'
      ? lessons.length
      : lessons.filter(l => getSectionForLesson(l.id) === s.id).length;
    return acc;
  }, {});

  const filtered = activeSection === 'all'
    ? lessons
    : lessons.filter(l => getSectionForLesson(l.id) === activeSection);

  const colors = SECTION_COLORS[activeSection] ?? SECTION_COLORS['all'];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar — hidden on mobile */}
      <aside className="w-64 shrink-0 sticky top-6 hidden md:block">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sections</p>
          </div>
          <nav className="p-2 flex flex-col gap-0.5">
            {SECTIONS.map(section => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    window.history.replaceState(null, '', section.id === 'all' ? '/' : `/?section=${section.id}`);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{SECTION_ICONS[section.id]}</span>
                    <span className="text-sm truncate">{section.label}</span>
                  </span>
                  <span className={`text-xs font-medium shrink-0 px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {sectionCounts[section.id]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile section selector */}
      <div className="md:hidden w-full">
        <select
          value={activeSection}
          onChange={e => {
            setActiveSection(e.target.value);
            window.history.replaceState(null, '', e.target.value === 'all' ? '/' : `/?section=${e.target.value}`);
          }}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
        >
          {SECTIONS.map(s => (
            <option key={s.id} value={s.id}>{s.label} ({sectionCounts[s.id]})</option>
          ))}
        </select>
      </div>

      {/* Lesson Grid */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h2>
          <span className="text-sm text-slate-500">{filtered.length} lessons</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((lesson, index) => {
            const lessonNum = getLessonNum(lesson.id);
            return (
              <Link
                href={`/lesson/${lesson.id}`}
                key={lesson.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 overflow-hidden flex flex-col h-full"
              >
                {/* Thumbnail */}
                {lesson.source && getYouTubeId(lesson.source) ? (
                  <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                    <Image
                      src={`https://img.youtube.com/vi/${getYouTubeId(lesson.source)}/mqdefault.jpg`}
                      alt={lesson.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${colors.badgeBg} ${colors.badge}`}>
                      #{lessonNum}
                    </span>
                    <PlayCircle className="absolute bottom-2 right-2 w-7 h-7 text-white drop-shadow opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badgeBg} ${colors.badge}`}>
                      #{lessonNum}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 line-clamp-3 group-hover:text-indigo-600 transition-colors">
                    {lesson.title}
                  </h3>

                  {lesson.learn_items && lesson.learn_items.length > 0 && (
                    <div className="mt-auto pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                        <Target className="w-3 h-3" />
                        <span className="font-medium">Key Takeaway</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        <InlineMarkdown text={lesson.learn_items[0]} />
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No lessons in this section yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
