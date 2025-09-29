import React from 'react';
import DOMPurify from 'dompurify';

interface HtmlContentProps {
  content: string;
  className?: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ content, className }) => {
  // Sanitizar el HTML para evitar XSS
  const sanitizedHtml = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
      'img', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'br'
    ],
    ALLOWED_ATTR: [
      'class', 'id', 'href', 'src', 'alt', 'title',
      'xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width',
      'stroke-linecap', 'stroke-linejoin', 'd'
    ]
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default HtmlContent;