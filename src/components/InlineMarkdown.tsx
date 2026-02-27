/**
 * Renders a string that may contain **bold** markdown as inline HTML.
 * Converts **text** → <strong>text</strong>.
 */
export default function InlineMarkdown({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
