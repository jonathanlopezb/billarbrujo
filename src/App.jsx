import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Monitor, 
  History, 
  Music, 
  LogOut, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Play, 
  Plus, 
  Search, 
  Table as TableIcon,
  CreditCard,
  Settings,
  Lock,
  User,
  Key,
  ChevronUp,
  ChevronDown,
  Trash2,
  CheckCircle,
  X,
  Trophy
} from 'lucide-react';
import QRCode from 'react-qr-code';
import YouTube from 'react-youtube';

// Constants
const ROLES = {
  OWNER: 'dueño',
  ADMIN: 'admin',
  WAITRESS: 'mesero'
};

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${
      active 
      ? 'bg-billar-neon/10 border-r-4 border-billar-neon text-billar-neon' 
      : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-semibold">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </button>
);

const Navbar = ({ user, onLogout }) => (
  <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-billar-dark/50 backdrop-blur-xl sticky top-0 z-50">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-billar-neon rounded-lg flex items-center justify-center shadow-neon-glow">
        <span className="text-2xl">🎱</span>
      </div>
      <h1 className="text-xl font-black tracking-tighter uppercase italic">
        El Divino <span className="text-billar-neon">Niño</span>
      </h1>
    </div>

    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-white leading-tight">{user?.nombre}</p>
        <p className="text-xs text-slate-400 uppercase tracking-widest leading-tight">{user?.rol}</p>
      </div>
      <button 
        onClick={onLogout}
        className="p-2 rounded-full bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
      >
        <LogOut size={20} />
      </button>
    </div>
  </header>
);

const StatsGrid = ({ tables = [] }) => {
  const occupiedCount = tables.filter(t => t.estado === 'ocupada').length;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Ingresos Hoy', value: '$0', icon: DollarSign, color: 'text-emerald-400' },
        { label: 'Mesas Ocupadas', value: `${occupiedCount}/${tables.length}`, icon: TableIcon, color: 'text-billar-neon' },
        { label: 'Fiados Pendientes', value: '$0', icon: CreditCard, color: 'text-amber-400' },
        { label: 'En Cola', value: '0', icon: Music, color: 'text-purple-400' },
      ].map((stat, i) => (
        <div key={i} className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
            <stat.icon size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

const TableCard = ({ table, onStartMatch, onUpdateScore, onFinishMatch }) => {
  const isPlaying = table?.estado === 'ocupada';
  if (!table) return null;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card overflow-hidden"
    >
      <div className={`h-1.5 w-full ${isPlaying ? 'bg-billar-neon animate-pulse' : 'bg-slate-700'}`} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">{table.nombre}</h3>
          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
            isPlaying ? 'bg-billar-neon/20 text-billar-neon' : 'bg-white/5 text-slate-500'
          }`}>
            {isPlaying ? 'En Juego' : 'Disponible'}
          </span>
        </div>

        {isPlaying ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-500 uppercase font-black truncate">{table.jugador1 || 'Jugador 1'}</p>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => onUpdateScore(table.partida_id, (table.score1 || 0) + 1, table.score2)} className="w-6 h-6 rounded bg-white/5 hover:bg-billar-neon/20 text-billar-neon text-xs font-bold">+</button>
                  <p className="text-2xl font-black">{table.score1 || 0}</p>
                  <button onClick={() => onUpdateScore(table.partida_id, Math.max(0, (table.score1 || 0) - 1), table.score2)} className="w-6 h-6 rounded bg-white/5 hover:bg-red-500/20 text-red-500 text-xs font-bold">-</button>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 mx-2" />
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-500 uppercase font-black truncate">{table.jugador2 || 'Jugador 2'}</p>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => onUpdateScore(table.partida_id, table.score1, (table.score2 || 0) + 1)} className="w-6 h-6 rounded bg-white/5 hover:bg-billar-neon/20 text-billar-neon text-xs font-bold">+</button>
                  <p className="text-2xl font-black">{table.score2 || 0}</p>
                  <button onClick={() => onUpdateScore(table.partida_id, table.score1, Math.max(0, (table.score2 || 0) - 1))} className="w-6 h-6 rounded bg-white/5 hover:bg-red-500/20 text-red-500 text-xs font-bold">-</button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-billar-neon" />
                <span className="text-sm font-mono tracking-tighter">00:00:00</span>
              </div>
              <p className="text-[10px] font-black text-billar-purple">${table.tarifa_hora}/hr</p>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-slate-600 opacity-50">
            <TableIcon size={48} className="mb-2" />
            <p className="text-xs font-bold">LISTA PARA JUGAR</p>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          {isPlaying ? (
            <>
              <button 
                onClick={() => onFinishMatch(table.partida_id, table.score1, table.score2)}
                className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold py-2 rounded-lg text-xs transition-all uppercase"
              >
                FINALIZAR
              </button>
            </>
          ) : (
            <button 
              onClick={() => onStartMatch(table.id)}
              className="w-full neon-button flex items-center justify-center gap-2 text-sm"
            >
              <Play size={16} /> INICIAR
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StartMatchModal = ({ isOpen, tableId, onClose, onConfirm }) => {
  const [form, setForm] = useState({ jugador1: '', jugador2: '', tarifa: '15000' });
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md relative z-[1001] bg-billar-dark"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-all"><X /></button>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Iniciar <span className="text-billar-neon">Partida</span></h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre Jugador 1</label>
            <input 
              type="text" className="w-full neon-input py-3" placeholder="Ej: Jonathan" 
              value={form.jugador1} onChange={e => setForm({...form, jugador1: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre Jugador 2</label>
            <input 
              type="text" className="w-full neon-input py-3" placeholder="Ej: Miriam" 
              value={form.jugador2} onChange={e => setForm({...form, jugador2: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Tarifa por Hora</label>
            <select 
              className="w-full neon-input py-3 appearance-none"
              value={form.tarifa} onChange={e => setForm({...form, tarifa: e.target.value})}
            >
              <option value="15000">$15,000 / hr (Estándar)</option>
              <option value="20000">$20,000 / hr (Premium)</option>
              <option value="12000">$12,000 / hr (Promoción)</option>
            </select>
          </div>
          
          <button 
            onClick={() => onConfirm(tableId, form)}
            className="w-full neon-button py-4 mt-4 font-black italic text-lg"
          >
            PUXAR MESA!
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [currentView, setCurrentView] = useState('dashboard');
  const [tables, setTables] = useState([]);
  const [queue, setQueue] = useState([]);
  const [isTVMode, setIsTVMode] = useState(window.location.pathname === '/tv');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/queue');
      const data = await res.json();
      if (Array.isArray(data)) {
        setQueue(data.map(q => ({
          id: q.id,
          title: q.titulo,
          requestedBy: q.solicitado_por,
          videoId: q.video_id
        })));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const saved = localStorage.getItem('billar_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setView('dashboard');
    }
    fetchTables();
    fetchQueue();
    const tableInterval = setInterval(fetchTables, 5000);
    const queueInterval = setInterval(fetchQueue, 2000);
    return () => {
      clearInterval(tableInterval);
      clearInterval(queueInterval);
    };
  }, []);

  const handleStartMatch = (tableId, formData) => {
    fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mesaId: tableId,
        jugador1: formData.jugador1,
        jugador2: formData.jugador2,
        tarifaHora: parseInt(formData.tarifa)
      })
    }).then(res => {
      if (res.ok) {
        setModalOpen(false);
        fetchTables();
      }
    });
  };

  const handleUpdateScore = (partidaId, score1, score2) => {
    fetch('/api/tables', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partidaId, score1, score2 })
    }).then(() => fetchTables());
  };

  const handleFinishMatch = (partidaId, score1, score2) => {
    if (window.confirm('¿Finalizar partida y liberar mesa?')) {
      fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partidaId, score1, score2, finish: true })
      }).then(() => fetchTables());
    }
  };

  if (isTVMode) {
    return (
      <div onClick={() => console.log('Interacción detectada')}>
        <TVView tables={tables} queue={queue} onSongEnd={fetchQueue} />
      </div>
    );
  }

  if (view === 'login') return <LoginView onLogin={(u) => { setUser(u); setView('dashboard'); localStorage.setItem('billar_user', JSON.stringify(u)); }} onGoToRegister={() => setView('register')} />;
  if (view === 'register') return <RegisterOwnerView onBack={() => setView('login')} />;

  return (
    <div className="min-h-screen bg-billar-dark flex flex-col selection:bg-billar-neon selection:text-black">
      <Navbar user={user} onLogout={() => { setUser(null); setView('login'); localStorage.removeItem('billar_user'); }} />
      
      <div className="flex flex-1">
        <aside className="w-64 border-r border-white/5 bg-billar-card/30 hidden lg:block">
          <div className="py-6 h-full flex flex-col">
            <SidebarItem icon={TableIcon} label="Gestión Mesas" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <SidebarItem icon={Music} label="Rockola QR" active={currentView === 'music'} onClick={() => setCurrentView('music')} />
            <SidebarItem icon={History} label="Contabilidad" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
            <SidebarItem icon={Users} label="Créditos/Fiados" active={currentView === 'credits'} onClick={() => setCurrentView('credits')} />
            
            <div className="mt-auto px-6 py-8 bg-billar-purple/5 mx-4 rounded-2xl border border-billar-purple/10 mb-6">
               <div onClick={() => window.open('/tv', '_blank')} className="flex items-center gap-2 text-billar-purple font-black text-xs uppercase tracking-widest mb-2 cursor-pointer hover:underline">
                  <Monitor size={14} /> Vista TV FullScreen
               </div>
               <p className="text-[10px] text-slate-500">Ideal para proyectar en pantallas grandes.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {currentView === 'dashboard' && (
                <div className="p-8">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-3xl font-black mb-1 uppercase italic tracking-tighter">GESTIÓN DE <span className="text-billar-neon">MESAS</span></h2>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest text-[10px]">Control total de partidas y tiempos.</p>
                    </div>
                    <button onClick={() => { setSelectedTableId(null); setModalOpen(true); }} className="neon-button flex items-center gap-2">
                       <Plus size={20} /> NUEVO CLIENTE
                    </button>
                  </div>
                  <StatsGrid tables={tables} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tables.map(table => (
                      <TableCard 
                        key={table.id} table={table} 
                        onStartMatch={(id) => { setSelectedTableId(id); setModalOpen(true); }}
                        onUpdateScore={handleUpdateScore}
                        onFinishMatch={handleFinishMatch}
                      />
                    ))}
                  </div>
                </div>
              )}
              {currentView === 'music' && <MusicView queue={queue} user={user} onUpdateQueue={fetchQueue} />}
              {currentView === 'history' && <HistoryView />}
              {currentView === 'credits' && <CreditsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <StartMatchModal 
        isOpen={modalOpen} 
        tableId={selectedTableId} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleStartMatch} 
      />
    </div>
  );
}

const TVView = ({ tables, queue, onSongEnd }) => {
  // Use the same TVView component as before but ensure it's defined
  // ... (keeping the previous TVView logic but making sure it's accessible)
  return (
    <div className="h-screen w-screen bg-[#05060a] z-[100] flex overflow-hidden text-white font-sans">
      <div className="flex-[2] p-6 flex flex-col border-r border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-billar-neon rounded-xl flex items-center justify-center shadow-neon-glow">
              <span className="text-3xl">🎱</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter italic uppercase underline decoration-billar-neon decoration-4 underline-offset-4">
                MESAS <span className="text-billar-neon">ACTIVAS</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Billar El Divino Niño</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black font-mono text-billar-neon leading-none">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 h-full">
          {tables.map(table => (
            <div key={table.id} className={`glass-card p-4 flex flex-col relative overflow-hidden transition-all duration-500 ${table.estado === 'ocupada' ? 'bg-billar-neon/[0.03] border-billar-neon/30 shadow-neon-glow' : 'opacity-40 border-white/5'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-black flex items-center gap-2">{table.nombre}</h3>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${table.estado === 'ocupada' ? 'bg-billar-neon text-black' : 'bg-white/10 text-slate-400'}`}>
                  {table.estado === 'ocupada' ? 'EN JUEGO' : 'DISPONIBLE'}
                </span>
              </div>
              {table.estado === 'ocupada' ? (
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <div className="flex justify-around items-center">
                    <div className="text-center">
                      <p className="text-5xl font-black text-white">{table.score1 || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{table.jugador1 || '---'}</p>
                    </div>
                    <div className="text-lg font-black text-slate-800 italic">VS</div>
                    <div className="text-center">
                      <p className="text-5xl font-black text-white">{table.score2 || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{table.jugador2 || '---'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 bg-white/5 py-2 rounded-xl border border-white/5 mt-auto">
                     <Clock className="text-billar-neon" size={16} />
                     <p className="text-2xl font-black font-mono tracking-tighter text-white/90">00:00:00</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-xl">
                  <p className="text-sm font-black text-slate-700 tracking-[0.2em]">LISTA PARA JUGAR</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-billar-card/30 p-6 flex flex-col">
         <div className="flex items-center gap-3 mb-6">
            <Music className="text-billar-purple" size={24} />
            <h2 className="text-xl font-black italic tracking-tighter">LISTA DE <span className="text-billar-purple">MÚSICA</span></h2>
         </div>
         <div className="glass-card overflow-hidden bg-billar-purple/5 border-billar-purple/20 p-4 mb-6">
            <h4 className="text-lg font-black line-clamp-1 leading-tight">{queue[0]?.title || 'Esperando canción...'}</h4>
            <p className="text-[10px] font-bold text-white/40 uppercase truncate">{queue[0]?.requestedBy || 'Billar El Divino Niño'}</p>
            <div className="mt-3 rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/5">
              {queue[0] ? (
                <YouTube videoId={queue[0].videoId} onEnd={() => onSongEnd(queue[0].id)} className="w-full h-full" opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, controls: 0 } }} />
              ) : (
                <div className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Cola vacía</div>
              )}
            </div>
         </div>
         <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Siguientes</p>
            {queue.slice(1, 6).map((song, i) => (
              <div key={song.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                 <span className="text-xs font-black text-slate-800">0{i+2}</span>
                 <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">{song.title}</p>
                    <p className="text-[8px] font-black text-billar-purple/60 uppercase truncate">{song.requestedBy}</p>
                 </div>
              </div>
            ))}
         </div>
         <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg"><QRCode value={window.location.origin + "/music-box"} size={54} /></div>
              <p className="text-[10px] font-black uppercase leading-tight text-slate-500">¿TU CANCIÓN?<br/><span className="text-white">Escanea QR</span></p>
            </div>
            <p className="text-[9px] font-black text-billar-neon">BILLAR v2.0</p>
         </div>
      </div>
    </div>
  );
};

const HistoryView = () => (
  <div className="p-8">
     <h2 className="text-3xl font-black mb-1 uppercase">Historial</h2>
     <div className="glass-card p-10 mt-6 text-center text-slate-600">No hay registros hoy.</div>
  </div>
);

const CreditsView = () => (
  <div className="p-8 text-center py-20">
    <CreditCard size={64} className="mx-auto text-amber-500/20 mb-4" />
    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Próximamente</h2>
    <p className="text-slate-500 text-sm">El sistema de créditos estará disponible pronto.</p>
  </div>
);

const LoginView = ({ onLogin, onGoToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await resp.json();
      if (resp.ok) onLogin(data);
      else setError(data.error);
    } catch (err) { setError('Error de conexión'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-billar-dark px-6">
      <div className="glass-card p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-billar-neon rounded-2xl flex items-center justify-center shadow-neon-glow mx-auto mb-4"><span className="text-4xl">🎱</span></div>
          <h2 className="text-2xl font-black italic uppercase">El Divino <span className="text-billar-neon">Niño</span></h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Usuario" className="w-full neon-input py-3 px-4" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="Contraseña" className="w-full neon-input py-3 px-4" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          {error && <p className="text-red-400 text-xs font-bold uppercase text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full neon-button py-4 mt-4 uppercase font-black">{loading ? 'Ingresando...' : 'Entrar'}</button>
        </form>
        <button onClick={onGoToRegister} className="w-full text-slate-500 text-[10px] font-black uppercase mt-6 hover:text-white">¿Nuevo dueño? Regístrate</button>
      </div>
    </div>
  );
};

const RegisterOwnerView = ({ onBack }) => {
  const [form, setForm] = useState({ username: '', password: '', nombre: '', secretKey: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await fetch('/api/register-owner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await resp.json();
    if (resp.ok) setMsg('REGISTRO EXITOSO');
    else setMsg(data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-billar-dark px-6">
      <div className="glass-card p-10 w-full max-w-md">
        <h2 className="text-xl font-black uppercase italic mb-8 text-center">Registro de <span className="text-billar-neon">Dueño</span></h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre" className="w-full neon-input py-3 px-4" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input type="text" placeholder="Usuario" className="w-full neon-input py-3 px-4" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="Contraseña" className="w-full neon-input py-3 px-4" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <input type="text" placeholder="Llave Secreta" className="w-full neon-input py-3 px-4" value={form.secretKey} onChange={e => setForm({...form, secretKey: e.target.value})} required />
          {msg && <p className="text-center text-xs font-black uppercase text-billar-neon">{msg}</p>}
          <button type="submit" className="w-full neon-button py-4 font-black uppercase">Registrar</button>
          <button type="button" onClick={onBack} className="w-full text-slate-500 text-[10px] font-black uppercase mt-4">Volver</button>
        </form>
      </div>
    </div>
  );
};

const MusicView = ({ queue, user, onUpdateQueue }) => {
  const isAdmin = user?.rol === 'dueño' || user?.rol === 'admin';
  const handleAction = async (id, action) => {
    if (action === 'delete') await fetch(`/api/queue?id=${id}`, { method: 'DELETE' });
    else await fetch('/api/queue', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
    onUpdateQueue();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-black mb-2 uppercase italic text-center">Rockola <span className="text-billar-purple">Digital</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div className="glass-card p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl mb-6"><QRCode value={window.location.origin + "/music-box"} size={200} /></div>
          <p className="font-black text-xl uppercase italic">Escanea y pide!</p>
        </div>
        <div className="space-y-4">
          <h3 className="font-black uppercase text-slate-500 text-xs tracking-widest">Cola de reproducción</h3>
          {queue.map((song, i) => (
            <div key={song.id} className="glass-card p-4 flex justify-between items-center bg-white/5 border-none">
              <div className="flex items-center gap-3">
                <span className="text-billar-purple font-black">{i+1}</span>
                <p className="font-bold text-sm truncate max-w-[150px]">{song.title}</p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => handleAction(song.id, 'played')} className="text-emerald-500"><CheckCircle size={18} /></button>
                  <button onClick={() => handleAction(song.id, 'delete')} className="text-red-500"><Trash2 size={18} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
