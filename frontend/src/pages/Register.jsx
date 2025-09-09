import React, { useState } from "react";
import { registerUser } from "../api/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    // Validasyon
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    try {
      const { data } = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      console.log("Gönderilen veri:", data); // ← BURAYI EKLEYİN
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Kayıt başarısız");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold">Kayıt Ol</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <input 
        type="text" 
        name="username"
        placeholder="Kullanıcı Adı" 
        value={formData.username} 
        onChange={handleChange}
        className="border p-2 rounded w-full max-w-md"
      />
      
      <input 
        type="email" 
        name="email"
        placeholder="Email" 
        value={formData.email} 
        onChange={handleChange}
        className="border p-2 rounded w-full max-w-md"
      />
      
      <input 
        type="password" 
        name="password"
        placeholder="Şifre" 
        value={formData.password} 
        onChange={handleChange}
        className="border p-2 rounded w-full max-w-md"
      />
      
      <input 
        type="password" 
        name="confirmPassword"
        placeholder="Şifre Tekrar" 
        value={formData.confirmPassword} 
        onChange={handleChange}
        className="border p-2 rounded w-full max-w-md"
      />
      
      <button 
        onClick={handleRegister} 
        className="bg-green-500 text-white px-4 py-2 rounded w-full max-w-md hover:bg-green-600"
      >
        Kayıt Ol
      </button>

      <p className="text-gray-600">
        Zaten hesabınız var mı?{" "}
        <span 
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Giriş Yap
        </span>
      </p>
    </div>
  );
};

export default Register;