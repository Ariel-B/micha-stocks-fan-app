export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
      <div className="mx-auto max-w-3xl space-y-3">
        <p>
          This is an <strong>unofficial fan site</strong> and is not affiliated
          with, sponsored by, or endorsed by Micha Stocks.
        </p>
        <p>
          All original video content © Micha Stocks. Transcripts and lesson
          summaries are AI-generated from the original videos for educational,
          non-commercial purposes.{" "}
          <a
            href="https://www.youtube.com/@Micha.Stocks"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            Watch the original channel →
          </a>
        </p>
        <p className="font-medium text-amber-600">
          ⚠ Nothing on this site constitutes financial advice. Always do your
          own research and consult a qualified financial professional before
          making any investment decisions.
        </p>
        <p className="text-xs text-gray-400">© {year} Micha Stocks Fan Site</p>
      </div>
    </footer>
  );
}
