import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      console.log("FormData içeriği:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // HEADERS KULLANMAYIN - Axios otomatik ayarlar
      await API.post("/blogs", formData);
      
      alert("Blog başarıyla eklendi!");
      navigate("/");
    } catch (error) {
      console.error("Hata detayı:", error);
      alert(error.response?.data?.message || "Blog ekleme başarısız!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Yeni Blog Ekle</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="İçerik"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded h-32"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Kategori Seç</option>
          <option value="Teknoloji">Teknoloji</option>
          <option value="Seyahat">Seyahat</option>
          <option value="Eğitim">Eğitim</option>
        </select>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded"
          accept="image/*"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Ekleniyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;