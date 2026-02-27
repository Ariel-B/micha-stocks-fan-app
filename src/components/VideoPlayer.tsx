'use client';

import { useEffect, useState } from 'react';

interface VideoPlayerProps {
  source: string;
}

export default function VideoPlayer({ source }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState(() => source.replace('watch?v=', 'embed/'));

  useEffect(() => {
    const handleJumpToTime = (event: CustomEvent<{ timestamp: number }>) => {
      const { timestamp } = event.detail;
      const baseUrl = source.replace('watch?v=', 'embed/');
      // Add autoplay=1 and start=timestamp
      const separator = baseUrl.includes('?') ? '&' : '?';
      setVideoUrl(`${baseUrl}${separator}start=${timestamp}&autoplay=1`);
      
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('jumpToTime' as any, handleJumpToTime as any);
    return () => {
      window.removeEventListener('jumpToTime' as any, handleJumpToTime as any);
    };
  }, [source]);

  return (
    <div className="mt-8 mb-4 mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/20 aspect-video max-w-3xl">
      <iframe 
        width="100%" 
        height="100%" 
        src={videoUrl} 
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
}
