import fs from 'fs';
import path from 'path';

export type ReportMeta = {
  date: string;   // e.g. '2026-03-01'
  time: string;   // e.g. '03-30'  — the HH-MM directory name
  videoId: string;
  title: string;
  published: string; // ISO 8601
  url: string;
};

export type ReportDetail = ReportMeta & {
  content: string; // Raw markdown content of report.md
};

function getReportsDir(): string {
  return (
    process.env.REPORTS_DIR ??
    path.join(process.cwd(), '..', 'micha-stocks-fan', 'content', 'reports')
  );
}

/** Returns all reports sorted newest-first. */
export function getAllReports(): ReportMeta[] {
  const dir = getReportsDir();
  if (!fs.existsSync(dir)) return [];

  const reports: ReportMeta[] = [];

  const dateDirs = fs
    .readdirSync(dir)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();

  for (const date of dateDirs) {
    const dateDir = path.join(dir, date);
    const timeDirs = fs
      .readdirSync(dateDir)
      .filter((d) => /^\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse();

    for (const time of timeDirs) {
      const videoPath = path.join(dateDir, time, 'video.json');
      if (!fs.existsSync(videoPath)) continue;

      const video = JSON.parse(fs.readFileSync(videoPath, 'utf-8')) as {
        video_id: string;
        title: string;
        published: string;
        url: string;
      };

      reports.push({
        date,
        time,
        videoId: video.video_id,
        title: video.title,
        published: video.published,
        url: video.url,
      });
    }
  }

  return reports;
}

/** Returns a single report detail, or null if not found. */
export function getReport(date: string, time: string): ReportDetail | null {
  const dir = getReportsDir();
  const reportDir = path.join(dir, date, time);
  const videoPath = path.join(reportDir, 'video.json');
  const reportPath = path.join(reportDir, 'report.md');

  if (!fs.existsSync(videoPath) || !fs.existsSync(reportPath)) return null;

  const video = JSON.parse(fs.readFileSync(videoPath, 'utf-8')) as {
    video_id: string;
    title: string;
    published: string;
    url: string;
  };
  const content = fs.readFileSync(reportPath, 'utf-8');

  return {
    date,
    time,
    videoId: video.video_id,
    title: video.title,
    published: video.published,
    url: video.url,
    content,
  };
}

/** Returns all [date, time] pairs for generateStaticParams. */
export function getAllReportParams(): { date: string; time: string }[] {
  const dir = getReportsDir();
  if (!fs.existsSync(dir)) return [];

  const params: { date: string; time: string }[] = [];

  const dateDirs = fs
    .readdirSync(dir)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

  for (const date of dateDirs) {
    const dateDir = path.join(dir, date);
    const timeDirs = fs
      .readdirSync(dateDir)
      .filter((d) => /^\d{2}-\d{2}$/.test(d));

    for (const time of timeDirs) {
      params.push({ date, time });
    }
  }

  return params;
}

/** Formats a date string (YYYY-MM-DD) as a human-readable date. */
export function formatReportDate(date: string): string {
  return new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
