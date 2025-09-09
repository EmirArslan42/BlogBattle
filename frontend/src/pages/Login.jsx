import React, { useState } from "react";
import { loginUser } from "../api/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Validasyon
  if (!email || !password) {
    setError("Email ve şifre gereklidir");
    setLoading(false);
    return;
  }

  try {
    console.log("Gönderilen veri:", { email, password });
    
    const response = await loginUser({ email, password });
    console.log("Gelen response:", response.data);

    // 1️⃣ Token'ı localStorage'a kaydet
    localStorage.setItem("token", response.data.token);

    // 2️⃣ Redux store'a user ve token bilgisi gönder
    dispatch(loginSuccess({ 
      token: response.data.token, 
      user: response.data.user 
    }));

    // 3️⃣ Anasayfaya yönlendir
    navigate("/");
  } catch (error) {
    console.error("Login hatası:", error.response?.data);
    setError(
      error.response?.data?.message || 
      error.response?.data?.error || 
      "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold">Giriş Yap</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="border p-2 rounded"
          required
        />
        <input 
          type="password" 
          placeholder="Şifre" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="border p-2 rounded"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
};

export default Login;