
import React, { createContext, useEffect, useState } from 'react';
import { addPlayer, getPlayers, deletePlayer, updatePlayer } from '../services/playerService';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Тоглогчдын жагсаалтыг татах
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/api/users`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      var data = await response.json();

      console.log('📥 AUTH ➤ Backend хариу:', response.status, data);
      setPlayers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ➕ Нэмэх
  const addPlayerToFirestore = async (player) => {
    const newPlayer = await addPlayer(player);
    setPlayers((prev) => [...prev, newPlayer]);
  };

  // 🗑️ Устгах
  const deletePlayerFromFirestore = async (id) => {
    await deletePlayer(id);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  // 🔁 Засах
  const updatePlayerInFirestore = async (id, updatedData) => {
    await updatePlayer(id, updatedData);
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  // 🌟 Favorite toggle (локал)
  const toggleFavorite = (id) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      )
    );
  };

  return (
    <PlayerContext.Provider
      value={{
        players,
        loading,
        addPlayer: addPlayerToFirestore,
        deletePlayer: deletePlayerFromFirestore,
        updatePlayer: updatePlayerInFirestore,
        toggleFavorite,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};