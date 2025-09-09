import React from "react";

const BlogCard = ({ blog }) => (
  <div className="border p-4 rounded shadow w-72">
    {blog.image && <img src={`http://localhost:5000/images/${blog.image}`} alt="" className="h-40 w-full object-cover rounded"/>}
    {blog.isWinner && (
  <span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">
    🏆 Kazanan
  </span>
)}

    <h3 className="font-bold mt-2">{blog.title}</h3>
    <p>{blog.content.slice(0, 100)}...</p>
    <p className="text-sm text-gray-500 mt-1">Kategori: {blog.category}</p>
  </div>
);

export default BlogCard;
