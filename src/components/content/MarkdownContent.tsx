import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownContentProps {
  content: string;
  className?: string;
  allowHtml?: boolean;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  className = "prose prose-lg max-w-none",
  allowHtml = true,
}) => {
  // Si el contenido contiene HTML y está permitido, usar ReactMarkdown con rehypeRaw
  // Esto permite HTML mezclado con Markdown
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={allowHtml ? [rehypeRaw] : []}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !className || !match;
            
            return !isInline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-lg overflow-hidden my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-bg-100 mb-6 mt-8 first:mt-0 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold text-bg-100 mb-5 mt-8 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-bg-100 mb-4 mt-6 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-medium text-bg-100 mb-3 mt-5 leading-tight">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-medium text-bg-100 mb-3 mt-4 leading-tight">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-medium text-bg-100 mb-2 mt-3 leading-tight">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-bg-300 leading-relaxed text-lg">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-bg-100">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-bg-200">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent-100 pl-6 py-4 my-6 bg-white-100 italic text-bg-200 text-lg">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-6 text-bg-300 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-6 text-bg-300 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-bg-300 leading-relaxed">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent-100 hover:text-accent-200 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-bg-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-3 text-bg-300">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-8 border-t-2 border-gray-200" />
          ),
          pre: ({ children }) => (
            <div className="my-4">{children}</div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;