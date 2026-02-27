'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle2, Info, PlayCircle } from 'lucide-react';

interface ConceptCardProps {
  title: string;
  body: string;
  index: number;
  id?: string;
  timestamp?: number | null;
}

export default function ConceptCard({ title, body, index, id, timestamp }: ConceptCardProps) {
  // Strip leading markdown heading markers (e.g. "### 1) Title" → "1) Title")
  const cleanTitle = title.replace(/^#+\s*/, '');

  // Determine icon and color based on title keywords
  let Icon = Lightbulb;
  let colorClass = 'text-amber-500';
  let bgClass = 'bg-amber-50';
  let borderClass = 'border-amber-200';

  const lowerTitle = cleanTitle.toLowerCase();
  if (lowerTitle.includes('risk') || lowerTitle.includes('problem') || lowerTitle.includes('mistake')) {
    Icon = AlertCircle;
    colorClass = 'text-rose-500';
    bgClass = 'bg-rose-50';
    borderClass = 'border-rose-200';
  } else if (lowerTitle.includes('growth') || lowerTitle.includes('return') || lowerTitle.includes('profit')) {
    Icon = TrendingUp;
    colorClass = 'text-emerald-500';
    bgClass = 'bg-emerald-50';
    borderClass = 'border-emerald-200';
  } else if (lowerTitle.includes('how to') || lowerTitle.includes('step') || lowerTitle.includes('guide')) {
    Icon = CheckCircle2;
    colorClass = 'text-blue-500';
    bgClass = 'bg-blue-50';
    borderClass = 'border-blue-200';
  } else if (lowerTitle.includes('what is') || lowerTitle.includes('definition')) {
    Icon = Info;
    colorClass = 'text-indigo-500';
    bgClass = 'bg-indigo-50';
    borderClass = 'border-indigo-200';
  }

  const handleJumpToTime = () => {
    if (timestamp != null) {
      const event = new CustomEvent('jumpToTime', { detail: { timestamp } });
      window.dispatchEvent(event);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div 
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-2xl shadow-sm hover:shadow-md transition-all p-6 md:p-8 border ${borderClass} bg-white relative overflow-hidden group scroll-mt-24`}
    >
      {/* Decorative background element */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${bgClass} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-in-out`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">
                Concept {index + 1}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                {cleanTitle}
              </h3>
            </div>
          </div>
          
          {timestamp != null && (
            <button 
              onClick={handleJumpToTime}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors shrink-0 ${bgClass} ${colorClass} hover:bg-opacity-80`}
              title="Jump to this part in the video"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Watch ({formatTime(timestamp)})</span>
            </button>
          )}
        </div>
        
        <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-700 prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
