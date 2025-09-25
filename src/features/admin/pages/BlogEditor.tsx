import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { FiSave, FiEye, FiArrowLeft } from "react-icons/fi";
import { useBlogManagement } from "../blog-management";
import RichTextEditor from "../../../components/editor/RichTextEditor";

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { blogPosts, createBlogPost, updateBlogPost } = useBlogManagement();

  const isEditing = !!id;
  const existingPost = isEditing
    ? blogPosts.find((post) => post.id === id)
    : null;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: [] as string[],
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt,
        content: existingPost.content,
        featuredImage: existingPost.featuredImage || "",
        category: existingPost.category,
        tags: existingPost.tags,
        isPublished: existingPost.isPublished,
      });
    }
  }, [existingPost]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (publish = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("El título y el contenido son obligatorios");
      return;
    }

    setIsSaving(true);

    const postData = {
      ...formData,
      isPublished: publish,
      publishedAt: publish
        ? new Date().toISOString()
        : existingPost?.publishedAt,
      author: user?.name || "Admin",
    };

    try {
      if (isEditing && existingPost) {
        updateBlogPost({
          ...existingPost,
          ...postData,
        });
      } else {
        createBlogPost(postData);
      }

      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error al guardar el post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/blog")}
            className="p-2 text-gray-400 hover:text-bg-200"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-bg-100">
              {isEditing ? "Editar Post" : "Nuevo Post"}
            </h2>
            <p className="text-bg-200">
              {isEditing
                ? "Modifica tu post existente"
                : "Crea un nuevo artículo para el blog"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-bg-300 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <FiSave className="mr-2 h-4 w-4" />
            Guardar Borrador
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-md hover:bg-accent-200 disabled:opacity-50"
          >
            <FiEye className="mr-2 h-4 w-4" />
            {formData.isPublished ? "Actualizar" : "Publicar"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Título del Post
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Escribe el título de tu post..."
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Slug (URL)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                /blog/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="url-del-post"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Resumen
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Escribe un breve resumen del post..."
            />
          </div>

          {/* Contenidoo */}
          <RichTextEditor
            value={formData.content}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
            placeholder="Escribe el contenido de tu post..."
            rows={20}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Imagen Destacada
            </label>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  featuredImage: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.featuredImage && (
              <div className="mt-3">
                <img
                  src={formData.featuredImage}
                  alt="Vista previa"
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Categoría
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Tecnología, Noticias, etc."
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Etiquetas
            </label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="Agregar etiqueta"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-r-md hover:bg-accent-200"
              >
                +
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-bg-300 mb-3">Estado</h3>
            <div className="space-y-2">
              <div
                className={`p-3 rounded-md ${
                  formData.isPublished
                    ? "bg-green-50 border border-green-200"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      formData.isPublished ? "bg-green-400" : "bg-yellow-400"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {formData.isPublished ? "Publicado" : "Borrador"}
                  </span>
                </div>
                {existingPost?.publishedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Publicado el{" "}
                    {new Date(existingPost.publishedAt).toLocaleDateString(
                      "es-ES"
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
