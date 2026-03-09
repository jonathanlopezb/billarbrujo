import React, { useState } from 'react';
import { Search, Music, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MusicBox() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [requested, setRequested] = useState([]);

  // Real search using our serverless API
  const handleSearch = async () => {
    if (!search.trim()) return;
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
      }
    } catch (error) {
      console.error('Error buscando canciones:', error);
    }
  };

  const requestSong = async (song) => {
    try {
      await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: song.title,
          video_id: song.id,
          solicitado_por: 'Celular Cliente' // Could be refined later
        })
      });
      setRequested([...requested, song.id]);
    } catch (error) {
      console.error('Error solicitando canción:', error);
    }
  };

  return (
    <div className="min-h-screen bg-billar-dark p-6 text-white font-sans">
      <header className="fixed top-0 left-0 right-0 p-6 bg-billar-dark/80 backdrop-blur-md z-50 border-b border-white/5">
        <h1 className="text-2xl font-black italic tracking-tighter mb-4 text-center">
          PIDE TU <span className="text-billar-neon">MÚSICA</span>
        </h1>
        <div className="relative">
          <input 
            type="text"
            placeholder="Busca tu canción o artista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full neon-input py-3 pl-12"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-billar-neon text-billar-dark px-4 py-1.5 rounded-md font-bold text-xs"
          >
            BUSCAR
          </button>
        </div>
      </header>

      <main className="pt-36 pb-20 space-y-4">
        {results.length > 0 ? (
          results.map((song) => (
            <div key={song.id} className="glass-card p-4 flex items-center justify-between border-none bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-billar-neon">
                  <Music size={24} />
                </div>
                <div>
                  <h4 className="font-bold">{song.title}</h4>
                  <p className="text-xs text-slate-500 uppercase font-black">{song.artist}</p>
                </div>
              </div>
              <button 
                onClick={() => requestSong(song)}
                className={`p-2 rounded-full transition-all ${
                  requested.includes(song.id) 
                  ? 'bg-billar-neon text-billar-dark scale-110' 
                  : 'bg-white/10 text-white hover:bg-billar-neon hover:text-billar-dark'
                }`}
              >
                {requested.includes(song.id) ? <Check size={20} /> : <Plus size={20} />}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-600">
            <Search size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest">Busca algo para sonar en el billar</p>
          </div>
        )}
      </main>

      {requested.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 bg-billar-neon p-4 rounded-xl shadow-neon-glow flex items-center justify-between text-billar-dark"
        >
          <p className="font-black text-xs uppercase tracking-tighter">¡Canción solicitada correctamente!</p>
          <Check size={20} />
        </motion.div>
      )}
    </div>
  );
}
