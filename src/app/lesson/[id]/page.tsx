import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import courseDataRaw from '@/data/course.json';
import { ArrowLeft, PlayCircle, Target, BookOpen, CheckCircle2, List, ChevronRight, LayoutList } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import VideoPlayer from '@/components/VideoPlayer';
import InlineMarkdown from '@/components/InlineMarkdown';
import { getSectionForLesson, findSection, SECTION_COLORS, getLessonNum } from '@/data/sections';

type Takeaway = { text: string; level: number };

type Lesson = {
  id: string;
  title: string;
  source?: string;
  learn_items?: string[];
  concepts: { title: string; body: string; timestamp?: number }[];
  takeaways?: Takeaway[];
  glossary?: { term: string; definition: string }[];
  important_context?: string | null;
};

const courseData = courseDataRaw as Lesson[];

export async function generateStaticParams() {
  return courseData.map((lesson) => ({
    id: lesson.id,
  }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = courseData.find((l) => l.id === id);

  if (!lesson) {
    notFound();
  }

  // Section info
  const sectionId = getSectionForLesson(id);
  const section = findSection(sectionId);
  const colors = SECTION_COLORS[sectionId] ?? SECTION_COLORS['all'];

  // Lessons in the same section (in course order)
  const sectionLessons = courseData.filter(l => getSectionForLesson(l.id) === sectionId);
  const indexInSection = sectionLessons.findIndex(l => l.id === id);
  const prevLesson = indexInSection > 0 ? sectionLessons[indexInSection - 1] : null;
  const nextLesson = indexInSection < sectionLessons.length - 1 ? sectionLessons[indexInSection + 1] : null;
  const lessonNum = getLessonNum(id);

  function getYouTubeId(url: string): string | null {
    try {
      const u = new URL(url);
      return u.searchParams.get('v');
    } catch {
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/?section=${sectionId}`}
              className={`font-medium transition-colors ${colors.hover}`}
            >
              {section?.label}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400 truncate max-w-[200px]">#{lessonNum}</span>
          </div>

          {/* Prev / Counter / Next */}
          <div className="flex items-center justify-center gap-4">
            {prevLesson ? (
              <Link
                href={`/lesson/${prevLesson.id}`}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                title={`Previous: ${prevLesson.title}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline">Prev</span>
              </Link>
            ) : (
              <div className="w-16 md:w-20"></div>
            )}

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badgeBg} ${colors.badge}`}>
                {section?.label}
              </span>
              <span className="text-sm font-bold text-slate-500">
                {indexInSection + 1} / {sectionLessons.length}
              </span>
            </div>

            {nextLesson ? (
              <Link
                href={`/lesson/${nextLesson.id}`}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                title={`Next: ${nextLesson.title}`}
              >
                <span className="hidden md:inline">Next</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            ) : (
              <div className="w-16 md:w-20"></div>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-indigo-600 text-white py-16 px-6 shadow-lg text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {lesson.title}
          </h1>
          
          {lesson.source && (
            <VideoPlayer source={lesson.source} />
          )}
        </div>
      </header>

      <div className="px-6 -mt-8 flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Agenda */}
        <aside className="w-full lg:w-[480px] lg:shrink-0 lg:sticky lg:top-24 bg-white rounded-2xl shadow-md p-6 border border-slate-100 z-10">
          <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
            <List className="w-6 h-6 text-indigo-600 shrink-0" />
            Lesson Agenda
          </h3>
          <nav className="space-y-1">
            {lesson.important_context && (
              <a href="#important-context" className="block px-3 py-2.5 rounded-lg text-lg font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Important Context
              </a>
            )}
            {lesson.learn_items && lesson.learn_items.length > 0 && (
              <a href="#what-you-will-learn" className="block px-3 py-2.5 rounded-lg text-lg font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                What You'll Learn
              </a>
            )}
            {lesson.concepts.length > 0 && (
              <div className="pt-2 pb-1">
                <span className="px-3 text-base font-bold text-slate-400 uppercase tracking-wider">Key Concepts</span>
              </div>
            )}
            {lesson.concepts.map((concept, idx) => (
              <a 
                key={idx} 
                href={`#concept-${idx}`} 
                className="block px-3 py-2.5 rounded-lg text-lg font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors line-clamp-2"
              >
                {concept.title.replace(/^#+\s*/, '')}
              </a>
            ))}
            {lesson.takeaways && lesson.takeaways.length > 0 && (
              <a href="#takeaways" className="block px-3 py-2.5 rounded-lg text-lg font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors mt-2">
                Key Takeaways
              </a>
            )}
            {lesson.glossary && lesson.glossary.length > 0 && (
              <a href="#glossary" className="block px-3 py-2.5 rounded-lg text-lg font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors mt-2">
                Glossary
              </a>
            )}
          </nav>

        </aside>

        <main className="w-full lg:flex-1 min-w-0 flex flex-col lg:flex-row gap-6 items-start">
          {/* Lesson Content */}
          <div className="flex-1 min-w-0">
          {/* Important Context Section */}
          {lesson.important_context && (
            <div id="important-context" className="bg-blue-50 rounded-2xl shadow-sm p-8 mb-8 border border-blue-100 relative overflow-hidden scroll-mt-24">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Important Context</h2>
              </div>
              <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-relaxed">
                <p><InlineMarkdown text={lesson.important_context} /></p>
              </div>
            </div>
          )}

          {/* What You'll Learn Section */}
          {lesson.learn_items && lesson.learn_items.length > 0 && (
            <div id="what-you-will-learn" className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-slate-100 relative overflow-hidden scroll-mt-24">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-emerald-500" />
              <h2 className="text-2xl font-bold text-slate-800">What You'll Learn</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.learn_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <InlineMarkdown text={item} className="text-slate-700 leading-relaxed" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Concepts Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8 px-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-800">Key Concepts</h2>
          </div>

          <div className="space-y-8">
            {lesson.concepts.map((concept, idx) => (
              <ConceptCard 
                key={idx} 
                id={`concept-${idx}`}
                title={concept.title} 
                body={concept.body} 
                index={idx} 
                timestamp={concept.timestamp}
              />
            ))}
          </div>
        </div>

        {/* Key Takeaways Section */}
        {lesson.takeaways && lesson.takeaways.length > 0 && (
          <div id="takeaways" className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-slate-100 relative overflow-hidden scroll-mt-24">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <h2 className="text-2xl font-bold text-slate-800">Key Takeaways</h2>
            </div>
            <ul className="space-y-2">
              {lesson.takeaways.map((takeaway, idx) => {
                const cleanText = takeaway.text.replace(/^\[[ xX-]\]\s*/, '');
                if (takeaway.level === 0) {
                  return (
                    <li key={idx} className="flex items-start gap-3 mt-3 first:mt-0">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <InlineMarkdown text={cleanText} className="prose prose-slate max-w-none prose-p:m-0 text-slate-700 font-medium" />
                    </li>
                  );
                } else {
                  return (
                    <li key={idx} className="flex items-start gap-2 ml-9">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></span>
                      <InlineMarkdown text={cleanText} className="prose prose-slate max-w-none prose-p:m-0 text-slate-600 text-sm" />
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        )}

        {/* Glossary Section */}
        {lesson.glossary && lesson.glossary.length > 0 && (
          <div id="glossary" className="bg-slate-900 rounded-2xl shadow-lg p-8 mb-12 border border-slate-800 relative overflow-hidden scroll-mt-24 text-slate-50">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Glossary</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {lesson.glossary.map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold text-indigo-300 mb-2">{item.term}</h3>
                  <InlineMarkdown text={item.definition.replace(/\n---$/, '')} className="text-slate-300 text-sm leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200">
          {prevLesson ? (
            <Link 
              href={`/lesson/${prevLesson.id}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="truncate max-w-[200px]">Prev in {section?.label}</span>
            </Link>
          ) : (
            <Link
              href={`/?section=${sectionId}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to {section?.label}
            </Link>
          )}
          
          {nextLesson ? (
            <Link 
              href={`/lesson/${nextLesson.id}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              <span className="truncate max-w-[200px]">Next in {section?.label}</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          ) : (
            <Link
              href={`/?section=${sectionId}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              Back to {section?.label}
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          )}
        </div>
        </div>

        {/* Right Sidebar: Other lessons in this section */}
        <aside className="w-full lg:w-[480px] lg:shrink-0 bg-white rounded-2xl shadow-md border border-slate-100 z-10 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <LayoutList className="w-6 h-6 text-indigo-500 shrink-0" />
            <Link
              href={`/?section=${sectionId}`}
              className={`text-lg font-bold uppercase tracking-wider ${colors.badge} ${colors.hover} transition-colors truncate`}
            >
              {section?.label} &middot; {sectionLessons.length} lessons
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {sectionLessons.map((sl) => {
              const isCurrent = sl.id === id;
              const ytId = sl.source ? getYouTubeId(sl.source) : null;
              return (
                <Link
                  key={sl.id}
                  href={`/lesson/${sl.id}`}
                  className={`flex flex-col p-3 transition-colors group ${
                    isCurrent
                      ? `${colors.badgeBg}`
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 mb-2.5">
                    {ytId ? (
                      <Image
                        src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                        alt={sl.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="w-5 h-5 text-slate-300" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <PlayCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Title */}
                  <div>
                    <span className={`text-base font-semibold ${isCurrent ? colors.badge : 'text-slate-400'}`}>
                      #{getLessonNum(sl.id)}
                    </span>
                    <p className={`text-lg leading-snug mt-0.5 line-clamp-2 ${
                      isCurrent ? `font-semibold ${colors.badge}` : 'text-slate-600 group-hover:text-slate-900'
                    }`}>
                      {sl.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </main>
      </div>
    </div>
  );
}
