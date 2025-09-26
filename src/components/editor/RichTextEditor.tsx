import React, { useState, useRef, useCallback } from "react";
import {
  FiBold,
  FiItalic,
  FiLink,
  FiList,
  FiCode,
  FiEye,
  FiEyeOff,
  FiType,
  FiEdit,
  FiDroplet,
  FiTag,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  supportHtml?: boolean; // Nueva prop para habilitar HTML
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe el contenido...",
  rows = 20,
  supportHtml = true, // Por defecto habilitado
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [mode, setMode] = useState<'markdown' | 'html'>('markdown');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Paleta de colores predefinida
  const colorPalette = [
    { name: 'Rojo', hex: '#ef4444', class: 'text-red-500' },
    { name: 'Azul', hex: '#3b82f6', class: 'text-blue-500' },
    { name: 'Verde', hex: '#10b981', class: 'text-green-500' },
    { name: 'Amarillo', hex: '#f59e0b', class: 'text-yellow-500' },
    { name: 'Púrpura', hex: '#8b5cf6', class: 'text-purple-500' },
    { name: 'Rosa', hex: '#ec4899', class: 'text-pink-500' },
    { name: 'Naranja', hex: '#f97316', class: 'text-orange-500' },
    { name: 'Índigo', hex: '#6366f1', class: 'text-indigo-500' },
    { name: 'Gris', hex: '#6b7280', class: 'text-gray-500' },
    { name: 'Negro', hex: '#000000', class: 'text-black' },
  ];

  const insertText = useCallback(
    (before: string, after: string = "", placeholder: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.slice(start, end);
      const textToInsert = selectedText || placeholder;
      
      const newText =
        value.slice(0, start) +
        before +
        textToInsert +
        after +
        value.slice(end);

      onChange(newText);

      // Reposicionar cursor
      setTimeout(() => {
        textarea.focus();
        if (selectedText) {
          textarea.setSelectionRange(
            start + before.length,
            start + before.length + textToInsert.length
          );
        } else {
          textarea.setSelectionRange(
            start + before.length,
            start + before.length + placeholder.length
          );
        }
      }, 0);
    },
    [value, onChange]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const newText = value.slice(0, start) + text + value.slice(start);
      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    },
    [value, onChange]
  );

  // Función para aplicar color al texto seleccionado
  const applyColor = useCallback(
    (color: { hex: string; class: string }) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.slice(start, end);
      
      if (!selectedText) {
        // Si no hay texto seleccionado, insertar ejemplo
        insertText(`<span style="color: ${color.hex}">`, `</span>`, "texto con color");
      } else {
        // Si hay texto seleccionado, aplicar color
        insertText(`<span style="color: ${color.hex}">`, `</span>`, "");
      }
      
      setShowColorPalette(false);
    },
    [value, onChange, insertText]
  );

  // Función para insertar HTML
  const insertHtmlTag = useCallback(
    (tag: string, attributes: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.slice(start, end);
      
      const openTag = attributes ? `<${tag} ${attributes}>` : `<${tag}>`;
      const closeTag = `</${tag}>`;
      
      if (!selectedText) {
        insertText(openTag, closeTag, `contenido ${tag}`);
      } else {
        insertText(openTag, closeTag, "");
      }
    },
    [value, onChange, insertText]
  );

  const formatButtons = [
    {
      icon: FiBold,
      title: "Negrita",
      action: () => insertText("**", "**", "texto en negrita"),
    },
    {
      icon: FiItalic,
      title: "Cursiva",
      action: () => insertText("*", "*", "texto en cursiva"),
    },
    {
      icon: FiCode,
      title: "Código",
      action: () => insertText("`", "`", "código"),
    },
    {
      icon: FiLink,
      title: "Enlace",
      action: () => insertText("[", "](https://ejemplo.com)", "texto del enlace"),
    },
    {
      icon: FiList,
      title: "Lista",
      action: () => insertAtCursor("\n- Elemento de lista\n- Otro elemento\n"),
    },
  ];

  // Botones HTML adicionales
  const htmlButtons = [
    {
      icon: FiTag,
      title: "Span",
      action: () => insertHtmlTag("span", 'class="highlight"'),
    },
    {
      icon: FiEdit,
      title: "Div",
      action: () => insertHtmlTag("div", 'class="container"'),
    },
    {
      icon: FiDroplet,
      title: "Colores",
      action: () => setShowColorPalette(!showColorPalette),
    },
  ];

  const headingButtons = [
    {
      label: "H1",
      action: () => insertText("# ", "", "Encabezado 1"),
    },
    {
      label: "H2",
      action: () => insertText("## ", "", "Encabezado 2"),
    },
    {
      label: "H3",
      action: () => insertText("### ", "", "Encabezado 3"),
    },
    {
      label: "H4",
      action: () => insertText("#### ", "", "Encabezado 4"),
    },
  ];

  const insertBlockquote = () => insertText("> ", "", "cita o texto destacado");
  const insertCodeBlock = () => insertText("\n```\n", "\n```\n", "código aquí");
  const insertTable = () => {
    const table = `
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Celda 1   | Celda 2   | Celda 3   |
| Celda 4   | Celda 5   | Celda 6   |
`;
    insertAtCursor(table);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-bg-300">
          Contenido
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          {showPreview ? (
            <>
              <FiEyeOff className="mr-1 h-4 w-4" />
              Editor
            </>
          ) : (
            <>
              <FiEye className="mr-1 h-4 w-4" />
              Vista Previa
            </>
          )}
        </button>
      </div>

      {!showPreview && (
        <>
          {/* Toolbar */}
          <div className="border border-gray-300 rounded-t-md p-3 bg-gray-50 flex flex-wrap gap-2">
            {/* Formato básico */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              {formatButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  title={button.title}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                >
                  <button.icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Encabezados */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
              <FiType className="h-4 w-4 text-gray-400 self-center mr-1" />
              {headingButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors font-medium"
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* Elementos especiales */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={insertBlockquote}
                title="Cita"
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              >
                &ldquo;&rdquo;
              </button>
              <button
                type="button"
                onClick={insertCodeBlock}
                title="Bloque de código"
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors font-mono"
              >
                {'{ }'}
              </button>
              <button
                type="button"
                onClick={insertTable}
                title="Tabla"
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              >
                ⊞
              </button>
            </div>

            {/* Botones HTML */}
            {supportHtml && (
              <div className="flex gap-1 border-l border-gray-300 pl-2 ml-2">
                {htmlButtons.map((button, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={button.action}
                    title={button.title}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                  >
                    <button.icon className="h-4 w-4" />
                  </button>
                ))}
                
                {/* Selector de modo */}
                <div className="flex border border-gray-300 rounded ml-2">
                  <button
                    type="button"
                    onClick={() => setMode('markdown')}
                    className={`px-2 py-1 text-xs rounded-l ${
                      mode === 'markdown' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    MD
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('html')}
                    className={`px-2 py-1 text-xs rounded-r ${
                      mode === 'html' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    HTML
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Paleta de colores */}
          {showColorPalette && (
            <div className="border border-gray-300 rounded-md p-3 mt-2 bg-white shadow-lg relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Seleccionar Color</h4>
                <button
                  type="button"
                  onClick={() => setShowColorPalette(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {colorPalette.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyColor(color)}
                    title={`${color.name} (${color.hex})`}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  >
                    A
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Selecciona texto y luego elige un color para aplicarlo
                </p>
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="w-full px-3 py-2 border-x border-b border-gray-300 rounded-b-md focus:outline-none focus:ring-accent-100 focus:border-accent-100 resize-y font-mono text-sm"
            placeholder={placeholder}
          />
        </>
      )}

      {showPreview && (
        <div className="border border-gray-300 rounded-md p-4 min-h-[400px] bg-white">
          {mode === 'html' ? (
            /* Vista previa HTML */
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: value || "<p><em>Escribe contenido HTML para ver la vista previa...</em></p>" }}
            />
          ) : (
            /* Vista previa Markdown */
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
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
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-bg-100 mb-4 mt-8 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-bg-100 mb-3 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-bg-100 mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-medium text-bg-100 mb-2 mt-3">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-bg-300 leading-relaxed">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-bg-100">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-bg-200">{children}</em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent-100 pl-4 py-2 my-4 bg-white-100 italic text-bg-200">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 text-bg-300 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 text-bg-300 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-bg-300">{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-accent-100 hover:text-accent-200 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <table className="w-full border-collapse border border-gray-300 mb-4">
                      {children}
                    </table>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-bg-100">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2 text-bg-300">
                      {children}
                    </td>
                  ),
                }}
              >
                {value || "*Escribe contenido para ver la vista previa...*"}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p>
          <strong>Ayuda rápida:</strong> **negrita**, *cursiva*, `código`,
          [enlace](url)
        </p>
        <p>
          Encabezados: # H1, ## H2, ### H3. Listas: - item. Citas: {'>'}
        </p>
        {supportHtml && (
          <p>
            <strong>HTML:</strong> Usa los botones de colores para destacar texto o cambia a modo HTML para escribir código HTML directamente.
          </p>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;