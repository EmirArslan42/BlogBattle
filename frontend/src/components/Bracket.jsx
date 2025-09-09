import React, { useEffect, useState } from "react";
import { getMatches } from "../api/api";
import Matchup from "./Matchup";

const Bracket = () => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    const { data } = await getMatches();
    setMatches(data);
  };

  useEffect(() => { fetchMatches(); }, []);

  return (
    <div className="space-y-8">
      {matches.map(match => (
        <div key={match._id}>
          <Matchup match={match} onVoted={fetchMatches}/>
          {match.completed && match.winner && (
            <p className="text-center text-green-600 font-bold mt-2">
              Kazanan: {match.blogs.find(b => b._id === match.winner)?.title}
            </p>
          )}
        </div>
      ))}
      {matches.completed && matches.winner && (
  <p className="text-center text-green-600 font-bold mt-2">
    🏆 Kazanan: {matches.blogs.find(b => b._id === matches.winner)?.title}
  </p>
)}

    </div>
  );
};

export default Bracket;
