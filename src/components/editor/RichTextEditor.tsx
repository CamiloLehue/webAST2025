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
import MarkdownContent from "../content/MarkdownContent";

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
  const [mode, setMode] = useState<"markdown" | "html">("markdown");
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Paleta de colores predefinida
  const colorPalette = [
    { name: "Rojo", hex: "#ef4444", class: "text-red-500" },
    { name: "Azul", hex: "#3b82f6", class: "text-blue-500" },
    { name: "Verde", hex: "#10b981", class: "text-green-500" },
    { name: "Amarillo", hex: "#f59e0b", class: "text-yellow-500" },
    { name: "Púrpura", hex: "#8b5cf6", class: "text-purple-500" },
    { name: "Rosa", hex: "#ec4899", class: "text-pink-500" },
    { name: "Naranja", hex: "#f97316", class: "text-orange-500" },
    { name: "Índigo", hex: "#6366f1", class: "text-indigo-500" },
    { name: "Gris", hex: "#6b7280", class: "text-gray-500" },
    { name: "Negro", hex: "#000000", class: "text-black" },
    { name: "Blanco", hex: "#ffffff", class: "text-white" },
    { name: "Rojo Oscuro", hex: "#dc2626", class: "text-red-600" },
    { name: "Azul Oscuro", hex: "#2563eb", class: "text-blue-600" },
    { name: "Verde Oscuro", hex: "#059669", class: "text-green-600" },
    { name: "Cian", hex: "#06b6d4", class: "text-cyan-500" },
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
        insertText(
          `<span style="color: ${color.hex}">`,
          `</span>`,
          "texto con color"
        );
      } else {
        // Si hay texto seleccionado, aplicar color
        insertText(`<span style="color: ${color.hex}">`, `</span>`, "");
      }

      setShowColorPalette(false);
    },
    [value, insertText]
  );

  // Función para aplicar color personalizado
  const applyCustomColor = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);

    if (!selectedText) {
      // Si no hay texto seleccionado, insertar ejemplo
      insertText(
        `<span style="color: ${customColor}">`,
        `</span>`,
        "texto con color"
      );
    } else {
      // Si hay texto seleccionado, aplicar color
      insertText(`<span style="color: ${customColor}">`, `</span>`, "");
    }

    setShowColorPalette(false);
  }, [value, customColor, insertText]);

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
    [value, insertText]
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
      action: () =>
        insertText("[", "](https://ejemplo.com)", "texto del enlace"),
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
        <div className="flex items-center gap-2">
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
      </div>

      {/* Información sobre el modo HTML */}
      {supportHtml && mode === "html" && !showPreview && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>💡 Modo HTML:</strong> Puedes usar HTML con estilos inline como{" "}
            <code className="bg-blue-100 px-1 rounded">
              &lt;div style="background-color:red;"&gt;
            </code>{" "}
            o mejor aún, usa clases de Tailwind:{" "}
            <code className="bg-blue-100 px-1 rounded">
              &lt;div className="bg-red-500 p-4"&gt;
            </code>
          </p>
        </div>
      )}

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
                {"{ }"}
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
                    onClick={() => setMode("markdown")}
                    className={`px-2 py-1 text-xs rounded-l ${
                      mode === "markdown"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    MD
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("html")}
                    className={`px-2 py-1 text-xs rounded-r ${
                      mode === "html"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
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
                <h4 className="text-sm font-medium text-gray-700">
                  Seleccionar Color
                </h4>
                <button
                  type="button"
                  onClick={() => setShowColorPalette(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Colores predefinidos */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-2">
                  Colores predefinidos:
                </p>
                <div className="grid grid-cols-5 gap-2 max-w-xs">
                  {colorPalette.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applyColor(color)}
                      title={`${color.name} (${color.hex})`}
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors flex items-center justify-center text-white text-xs font-bold shadow-sm"
                      style={{
                        backgroundColor: color.hex,
                        color: color.hex === "#ffffff" ? "#000000" : "#ffffff",
                      }}
                    >
                      A
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de color personalizado */}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-600 mb-2">
                  Color personalizado:
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    title="Seleccionar color personalizado"
                  />
                  <button
                    type="button"
                    onClick={applyCustomColor}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded border border-gray-300 transition-colors"
                  >
                    Aplicar Color
                  </button>
                  <span className="text-xs text-gray-500 font-mono">
                    {customColor}
                  </span>
                </div>
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
          {/* Usar el mismo componente MarkdownContent que se usa en la página final */}
          {/* Si el modo es HTML, usar pureHtmlMode para soportar estilos inline */}
          <MarkdownContent
            content={value || "*Escribe contenido para ver la vista previa...*"}
            allowHtml={true}
            pureHtmlMode={mode === "html"}
          />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
