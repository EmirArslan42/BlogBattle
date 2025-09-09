import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex gap-6 p-4 bg-blue-600 text-white">
      <Link to="/" className="hover:underline">Anasayfa</Link>
      <Link to="/add-blog" className="hover:underline">Blog Ekle</Link>
      <Link to="/vote" className="hover:underline">Oylama</Link>
      <Link to="/login" className="hover:underline">Giriş</Link>
      <Link to="/register" className="hover:underline">Kayıt Ol</Link>
    </nav>
  );
};

export default Navbar;
