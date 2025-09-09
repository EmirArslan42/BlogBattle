import { useState } from "react";
import { voteMatch } from "../api/api";
//import { motion } from "framer-motion";

const Matchup = ({ match, onVoted }) => {
  const [voted, setVoted] = useState(false);

  const handleVote = async (blogId) => {
    await voteMatch(match._id, blogId);
    setVoted(true);
    if (onVoted) onVoted();
  };

  // Oy oranlarını hesapla
  const totalVotes = match.votes?.length || 0;
  const getVotePercentage = (blogId) => {
    if (totalVotes === 0) return 0;
    const votesForBlog = match.votes.filter(v => v.blog === blogId).length;
    return Math.round((votesForBlog / totalVotes) * 100);
  };

  return (
    <div className="flex gap-4 justify-center my-4 flex-col md:flex-row">
      {match.blogs.map(blog => {
        const percentage = getVotePercentage(blog._id);
        return (
          <div key={blog._id} className="border p-4 w-full md:w-1/3 rounded shadow text-center">
            {blog.image && (
              <img 
                src={`http://localhost:5000/images/${blog.image}`} 
                alt="" 
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="font-bold mt-2">{blog.title}</h3>
            <p>{blog.content.slice(0, 100)}...</p>
            
            {!voted ? (
              <button 
                onClick={() => handleVote(blog._id)} 
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Oy Ver
              </button>
            ) : (
              <div className="mt-2">
                <motion.div 
                  className="bg-green-500 h-4 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1 }}
                />
                <p className="text-sm mt-1">{percentage}%</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Matchup;
