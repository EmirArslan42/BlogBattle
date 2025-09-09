import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { getTopBlogs } from "../api/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [topBlogs, setTopBlogs] = useState([]);

  useEffect(() => {
    const fetchTop = async () => {
      const { data } = await getTopBlogs();
      setTopBlogs(data);
    };
    fetchTop();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">En Çok Oy Alan Bloglar</h1>
      <div className="flex gap-4 overflow-x-auto">
        {topBlogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
      </div>
      <div className="mt-8">
        <Link to="/match" className="bg-blue-500 text-white px-4 py-2 rounded">Maçlara Git</Link>
      </div>
    </div>
  );
};

export default Home;
