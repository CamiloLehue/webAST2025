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
  FiLayers,
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
  const [showTemplates, setShowTemplates] = useState(false);
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

  // Plantillas HTML predefinidas
  const htmlTemplates = [
    {
      name: "Lista Simple",
      icon: "📝",
      description: "Lista con viñetas básica",
      code: `<ul class="list-disc list-inside space-y-2">
  <li>Primer elemento</li>
  <li>Segundo elemento</li>
  <li>Tercer elemento</li>
  <li>Cuarto elemento</li>
</ul>`,
    },
    {
      name: "Lista Numerada",
      icon: "🔢",
      description: "Lista ordenada con números",
      code: `<ol class="list-decimal list-inside space-y-2">
  <li>Primer paso</li>
  <li>Segundo paso</li>
  <li>Tercer paso</li>
  <li>Cuarto paso</li>
</ol>`,
    },
    {
      name: "Grid 2 Columnas",
      icon: "⚏",
      description: "Grid de 2 columnas responsive",
      code: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="p-4 bg-gray-100 rounded-lg">
    <h3 class="font-bold text-lg mb-2">Columna 1</h3>
    <p>Contenido de la primera columna</p>
  </div>
  <div class="p-4 bg-gray-100 rounded-lg">
    <h3 class="font-bold text-lg mb-2">Columna 2</h3>
    <p>Contenido de la segunda columna</p>
  </div>
</div>`,
    },
    {
      name: "Grid 3 Columnas",
      icon: "⚏⚏",
      description: "Grid de 3 columnas responsive",
      code: `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="p-4 bg-blue-50 rounded-lg text-center">
    <h3 class="font-bold text-lg mb-2">Columna 1</h3>
    <p>Contenido aquí</p>
  </div>
  <div class="p-4 bg-blue-50 rounded-lg text-center">
    <h3 class="font-bold text-lg mb-2">Columna 2</h3>
    <p>Contenido aquí</p>
  </div>
  <div class="p-4 bg-blue-50 rounded-lg text-center">
    <h3 class="font-bold text-lg mb-2">Columna 3</h3>
    <p>Contenido aquí</p>
  </div>
</div>`,
    },
    {
      name: "Flex Horizontal",
      icon: "↔",
      description: "Elementos en fila horizontal",
      code: `<div class="flex flex-wrap gap-4 items-center justify-center">
  <div class="p-4 bg-green-100 rounded-lg">
    <p class="font-bold">Elemento 1</p>
  </div>
  <div class="p-4 bg-green-100 rounded-lg">
    <p class="font-bold">Elemento 2</p>
  </div>
  <div class="p-4 bg-green-100 rounded-lg">
    <p class="font-bold">Elemento 3</p>
  </div>
</div>`,
    },
    {
      name: "Tarjeta",
      icon: "🎴",
      description: "Tarjeta con borde y sombra",
      code: `<div class="border border-gray-200 rounded-lg shadow-lg p-6 bg-white">
  <h3 class="text-xl font-bold mb-3">Título de la Tarjeta</h3>
  <p class="text-gray-600 mb-4">
    Descripción o contenido de la tarjeta. Puedes agregar lo que necesites aquí.
  </p>
  <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Acción
  </button>
</div>`,
    },
    {
      name: "Alert/Aviso",
      icon: "⚠",
      description: "Cuadro de aviso o alerta",
      code: `<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-yellow-700">
        <strong>Atención:</strong> Mensaje importante que debes leer.
      </p>
    </div>
  </div>
</div>`,
    },
    {
      name: "Box Destacado",
      icon: "📦",
      description: "Caja con fondo de color",
      code: `<div class="bg-blue-500 text-white p-6 rounded-lg">
  <h3 class="text-2xl font-bold mb-2">Título Destacado</h3>
  <p class="text-lg">
    Contenido importante que quieres resaltar con un fondo de color.
  </p>
</div>`,
    },
    {
      name: "Dos Columnas",
      icon: "⚏",
      description: "Texto en dos columnas",
      code: `<div class="flex flex-col md:flex-row gap-6">
  <div class="flex-1">
    <h3 class="font-bold text-lg mb-3">Columna Izquierda</h3>
    <p>
      Contenido de la columna izquierda. Puedes poner texto, imágenes o lo que necesites.
    </p>
  </div>
  <div class="flex-1">
    <h3 class="font-bold text-lg mb-3">Columna Derecha</h3>
    <p>
      Contenido de la columna derecha. También puedes personalizar el contenido aquí.
    </p>
  </div>
</div>`,
    },
    {
      name: "Botón",
      icon: "🔘",
      description: "Botón con estilo",
      code: `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Haz clic aquí
</button>`,
    },
    {
      name: "Lista con Check",
      icon: "✓",
      description: "Lista de verificación con iconos",
      code: `<ul class="space-y-2">
  <li class="flex items-center">
    <span class="text-green-500 mr-2">✓</span>
    Primera característica incluida
  </li>
  <li class="flex items-center">
    <span class="text-green-500 mr-2">✓</span>
    Segunda característica incluida
  </li>
  <li class="flex items-center">
    <span class="text-green-500 mr-2">✓</span>
    Tercera característica incluida
  </li>
  <li class="flex items-center">
    <span class="text-green-500 mr-2">✓</span>
    Cuarta característica incluida
  </li>
</ul>`,
    },
    {
      name: "Tabla Básica",
      icon: "⊞",
      description: "Tabla simple con estilos",
      code: `<table class="min-w-full border-collapse border border-gray-300">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-4 py-2">Encabezado 1</th>
      <th class="border border-gray-300 px-4 py-2">Encabezado 2</th>
      <th class="border border-gray-300 px-4 py-2">Encabezado 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Celda 1</td>
      <td class="border border-gray-300 px-4 py-2">Celda 2</td>
      <td class="border border-gray-300 px-4 py-2">Celda 3</td>
    </tr>
    <tr class="bg-gray-50">
      <td class="border border-gray-300 px-4 py-2">Celda 4</td>
      <td class="border border-gray-300 px-4 py-2">Celda 5</td>
      <td class="border border-gray-300 px-4 py-2">Celda 6</td>
    </tr>
  </tbody>
</table>`,
    },
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

  // Función para insertar plantilla
  const insertTemplate = useCallback(
    (templateCode: string) => {
      insertAtCursor("\n" + templateCode + "\n");
      setShowTemplates(false);
    },
    [insertAtCursor]
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
      icon: FiLayers,
      title: "Plantillas",
      action: () => setShowTemplates(!showTemplates),
    },
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

          {/* Panel de Plantillas */}
          {showTemplates && (
            <div className="border border-gray-300 rounded-md p-4 mt-2 bg-white shadow-lg relative max-h-96 overflow-y-auto">
              <div className="flex relative  items-center justify-between mb-3  bg-white pb-2 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">
                   Plantillas HTML Listas para Usar
                </h4>
                <button
                  type="button"
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                Haz clic en una plantilla para insertarla en tu contenido:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {htmlTemplates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertTemplate(template.code)}
                    className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{template.icon}</span>
                      <h5 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600">
                        {template.name}
                      </h5>
                    </div>
                    <p className="text-xs text-gray-500 leading-tight">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                 <strong>Tip:</strong> Todas las plantillas usan clases de Tailwind CSS.
                  Puedes personalizar colores, tamaños y espaciados cambiando las clases.
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
