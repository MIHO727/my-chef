import ReactMarkdown from 'react-markdown';

interface MarkdownTextProps {
  text: string;
}

export function MarkdownText({ text }: MarkdownTextProps) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="my-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-stone-800">{children}</strong>,
        h1: ({ children }) => <h1 className="mb-2 mt-3 text-base font-bold text-stone-800">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-2 mt-3 text-sm font-bold text-stone-800">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold text-stone-800">{children}</h3>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
