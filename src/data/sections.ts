// Shared section definitions and lesson→section mapping.
// Used by CourseBrowser (home page) and the lesson detail page.
//
// ⚠️  Do not edit the data here directly.
//     The authoritative source is pipeline/categorize_lessons.py.
//     Run `python3 pipeline/categorize_lessons.py` to regenerate sections.json,
//     which this file imports at build time.

import sectionsData from './sections.json';

export type SectionDef = {
  id: string;
  label: string;
  color: string;
};

export const SECTIONS: SectionDef[] = sectionsData.sections as SectionDef[];

/** Map lesson number (parsed from ID prefix, e.g. "027_…" → 27) to a section id. */
export const LESSON_SECTION: Record<number, string> = Object.fromEntries(
  Object.entries(sectionsData.lesson_section).map(([k, v]) => [Number(k), v])
);

/** Badge / card color classes per section (all Tailwind-safe). */
export const SECTION_COLORS: Record<string, { badge: string; badgeBg: string; hover: string; dot: string; accent: string; text: string }> = {
  all:              { badge: 'text-indigo-700',  badgeBg: 'bg-indigo-100',  hover: 'hover:text-indigo-600',  dot: 'bg-indigo-400',  accent: 'bg-indigo-600',  text: 'text-indigo-600' },
  foundations:      { badge: 'text-blue-700',    badgeBg: 'bg-blue-100',    hover: 'hover:text-blue-600',    dot: 'bg-blue-400',    accent: 'bg-blue-600',    text: 'text-blue-600' },
  psychology:       { badge: 'text-violet-700',  badgeBg: 'bg-violet-100',  hover: 'hover:text-violet-600',  dot: 'bg-violet-400',  accent: 'bg-violet-600',  text: 'text-violet-600' },
  fundamentals:     { badge: 'text-emerald-700', badgeBg: 'bg-emerald-100', hover: 'hover:text-emerald-600', dot: 'bg-emerald-400', accent: 'bg-emerald-600', text: 'text-emerald-600' },
  technical:        { badge: 'text-cyan-700',    badgeBg: 'bg-cyan-100',    hover: 'hover:text-cyan-600',    dot: 'bg-cyan-400',    accent: 'bg-cyan-600',    text: 'text-cyan-600' },
  'buying-selling': { badge: 'text-orange-700',  badgeBg: 'bg-orange-100',  hover: 'hover:text-orange-600',  dot: 'bg-orange-400',  accent: 'bg-orange-600',  text: 'text-orange-600' },
  instruments:      { badge: 'text-pink-700',    badgeBg: 'bg-pink-100',    hover: 'hover:text-pink-600',    dot: 'bg-pink-400',    accent: 'bg-pink-600',    text: 'text-pink-600' },
  earnings:         { badge: 'text-yellow-700',  badgeBg: 'bg-yellow-100',  hover: 'hover:text-yellow-600',  dot: 'bg-yellow-400',  accent: 'bg-yellow-600',  text: 'text-yellow-600' },
  macro:            { badge: 'text-teal-700',    badgeBg: 'bg-teal-100',    hover: 'hover:text-teal-600',    dot: 'bg-teal-400',    accent: 'bg-teal-600',    text: 'text-teal-600' },
  tools:            { badge: 'text-slate-700',   badgeBg: 'bg-slate-200',   hover: 'hover:text-slate-600',   dot: 'bg-slate-400',   accent: 'bg-slate-600',   text: 'text-slate-600' },
};

/** Extract the lesson number from an ID like "027_Moving_Averages…" → 27 */
export function getLessonNum(id: string): number {
  return parseInt(id.slice(0, 3), 10);
}

/** Get the section id for a lesson id. Falls back to 'foundations'. */
export function getSectionForLesson(lessonId: string): string {
  return LESSON_SECTION[getLessonNum(lessonId)] ?? 'foundations';
}

/** Look up the Section definition by id. */
export function findSection(sectionId: string): SectionDef | undefined {
  return SECTIONS.find(s => s.id === sectionId);
}
