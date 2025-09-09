import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Vote = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Token kontrolü
      const storedToken = localStorage.getItem("token");
      if (!storedToken && !token) {
        setError("Lütfen giriş yapın");
        navigate("/login");
        return;
      }

      const response = await API.get("/blogs/match");
      console.log("Match response:", response.data);
      
      if (response.data && response.data.blogs) {
        setMatch(response.data);
      } else {
        setError("Eşleşme bulunamadı");
      }
    } catch (error) {
      console.error("Match fetch error:", error);
      if (error.response?.status === 401) {
        setError("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Eşleşme yüklenirken hata oluştu: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (blogId) => {
    try {
      const response = await API.post("/blogs/vote", { 
        matchId: match._id, 
        blogId 
      });
      alert("Oyunuz kaydedildi!");
      fetchMatch(); // Yeni eşleşme için
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Oy verme başarısız");
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!match || !match.blogs) return <div className="p-8 text-center">Eşleşme bulunamadı</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Hangi Blog Daha İyi?</h1>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {match.blogs.map((blog) => (
          <div key={blog._id} className="border p-6 rounded-lg shadow-md w-full max-w-md">
            {blog.image && (
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-64 object-cover mb-4 rounded"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            {blog.content && (
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
              </p>
            )}
            <button 
              onClick={() => handleVote(blog._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded w-full transition-colors"
            >
              Bu Bloga Oy Ver
            </button>
          </div>
        ))}
      </div>

      {/* Eğer oy verilmişse veya match completed ise */}
      {match.completed && (
        <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
          Bu eşleşme tamamlandı. Kazanan: {match.winner?.title}
        </div>
      )}
    </div>
  );
};

export default Vote;