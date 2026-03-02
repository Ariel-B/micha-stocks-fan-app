'use client';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import ReportMarkdown from './ReportMarkdown';

interface PrintableReportContentProps {
  content: string;
  title: string;
}

export default function PrintableReportContent({
  content,
  title,
}: PrintableReportContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: title,
  });

  return (
    <>
      {/* Print button — hidden when actually printing */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={() => handlePrint()}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-lg px-3 py-1.5 transition-colors shadow-sm"
          type="button"
        >
          <Printer className="w-4 h-4" />
          Save as PDF
        </button>
      </div>

      {/* Content card — ref'd for printing */}
      <div
        ref={contentRef}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10"
      >
        <ReportMarkdown content={content} />
      </div>
    </>
  );
}
