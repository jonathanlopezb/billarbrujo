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
  CheckCircle
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
        <p className="text-sm font-bold text-white leading-tight">{user.nombre}</p>
        <p className="text-xs text-slate-400 uppercase tracking-widest leading-tight">{user.rol}</p>
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

const StatsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    {[
      { label: 'Ingresos Hoy', value: '$0', icon: DollarSign, color: 'text-emerald-400' },
      { label: 'Mesas Ocupadas', value: '0/4', icon: TableIcon, color: 'text-billar-neon' },
      { label: 'Fiados Pendientes', value: '$0', icon: CreditCard, color: 'text-amber-400' },
      { label: 'Canciones en Cola', value: '0', icon: Music, color: 'text-purple-400' },
    ].map((stat, i) => ( stat &&
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

const TableCard = ({ table }) => {
  const isPlaying = table?.status === 'playing';
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
          <h3 className="text-lg font-bold">{table.name}</h3>
          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
            isPlaying ? 'bg-billar-neon/20 text-billar-neon' : 'bg-white/5 text-slate-500'
          }`}>
            {isPlaying ? 'En Juego' : 'Disponible'}
          </span>
        </div>

        {isPlaying ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black">{table.players?.[0] || 'Jugador 1'}</p>
                <p className="text-2xl font-black">{table.score?.[0] || 0}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black">{table.players?.[1] || 'Jugador 2'}</p>
                <p className="text-2xl font-black">{table.score?.[1] || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={14} className="text-billar-neon" />
              <span className="text-sm font-mono tracking-tighter">00:00:00</span>
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
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-lg text-xs transition-all">GESTIONAR</button>
              <button className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold py-2 rounded-lg text-xs transition-all">COBRAR</button>
            </>
          ) : (
            <button className="w-full neon-button flex items-center justify-center gap-2 text-sm">
              <Play size={16} /> INICIAR
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Views ---

const LoginView = ({ onLogin, onGoToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await resp.json();
      if (resp.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-billar-dark px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-billar-neon rounded-2xl flex items-center justify-center shadow-neon-glow mx-auto mb-4">
            <span className="text-4xl">🎱</span>
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Bienvenido a <span className="text-billar-neon">El Divino Niño</span></h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Usuario" 
              className="w-full neon-input pl-12 py-3" 
              value={form.username} 
              onChange={e => setForm({...form, username: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full neon-input pl-12 py-3" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>
          {error && <p className="text-red-400 text-xs font-bold uppercase text-center">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full neon-button py-4 mt-4 disabled:opacity-50"
          >
            {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-8">
          ¿Eres el dueño y no tienes cuenta? <button onClick={onGoToRegister} className="text-billar-neon font-black hover:underline uppercase">Regístrate aquí</button>
        </p>
      </motion.div>
    </div>
  );
};

const RegisterOwnerView = ({ onBack }) => {
  const [form, setForm] = useState({ username: '', password: '', nombre: '', secretKey: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const resp = await fetch('/api/register-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await resp.json();
      if (resp.ok) {
        setMessage({ type: 'success', text: '¡Dueño registrado! Ya puedes iniciar sesión.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al registrar' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-billar-dark px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 w-full max-w-md">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center mb-8">Registro del <span className="text-billar-neon">Dueño</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Nombre completo" className="w-full neon-input py-3" 
            value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required
          />
          <input 
            type="text" placeholder="Usuario" className="w-full neon-input py-3" 
            value={form.username} onChange={e => setForm({...form, username: e.target.value})} required
          />
          <input 
            type="password" placeholder="Contraseña" className="w-full neon-input py-3" 
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
          />
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" placeholder="Llave Secreta" className="w-full neon-input pl-12 py-3" 
              value={form.secretKey} onChange={e => setForm({...form, secretKey: e.target.value})} required
            />
          </div>
          <p className="text-[10px] text-slate-500 text-center uppercase">Pide la llave secreta al desarrollador.</p>

          {message.text && (
            <p className={`text-xs font-bold uppercase text-center ${message.type === 'success' ? 'text-billar-neon' : 'text-red-400'}`}>
              {message.text}
            </p>
          )}

          <button type="submit" disabled={loading} className="w-full neon-button py-4 mt-4">
            {loading ? 'REGISTRANDO...' : 'REGISTRAR CUENTA'}
          </button>
          <button type="button" onClick={onBack} className="w-full text-slate-500 text-xs font-black uppercase hover:underline mt-4">Volver al Login</button>
        </form>
      </motion.div>
    </div>
  );
};

const DashboardView = ({ tables }) => (
  <div className="p-8">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-3xl font-black mb-1">GESTIÓN DE <span className="text-billar-neon">MESAS</span></h2>
        <p className="text-slate-400 text-sm">Control en tiempo real de partidas y consumos.</p>
      </div>
      <button className="neon-button flex items-center gap-2">
        <Plus size={20} /> NUEVO CLIENTE
      </button>
    </div>
    
    <StatsGrid />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {tables.map(table => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  </div>
);

const MusicView = ({ queue, user, onUpdateQueue }) => {
  const isAdmin = user?.rol === 'dueño' || user?.rol === 'admin';

  const handleAction = async (id, action) => {
    try {
      if (action === 'delete') {
        await fetch(`/api/queue?id=${id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/queue', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action })
        });
      }
      onUpdateQueue(); // Refresh the list
    } catch (e) {
      console.error('Error actualizando cola:', e);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">
          Rockola <span className="text-billar-purple">Digital</span>
        </h2>
        <p className="text-slate-400">Tus clientes piden la música desde su celular.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass-card p-8 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-neon-glow mb-6">
            <QRCode 
              value={window.location.origin + "/music-box"} 
              size={200}
              fgColor="#0a0b10"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black text-xl">ESCANEAME</p>
            <div className="w-12 h-1 bg-billar-purple mx-auto rounded-full" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">PARA ESCOGER CANCIÓN</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Music className="text-billar-purple" /> COLA DE REPRODUCCIÓN
          </h3>
          <div className="space-y-3">
            {queue.length > 0 ? queue.map((song, i) => (
              <div key={song.id} className="glass-card p-4 flex items-center justify-between bg-white/5 border-none">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-billar-purple/20 flex items-center justify-center rounded-lg text-billar-purple font-black">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-sm line-clamp-1">{song.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">{song.requestedBy}</p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleAction(song.id, 'move_up')}
                      className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-all"
                      title="Subir"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(song.id, 'move_down')}
                      className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-all"
                      title="Bajar"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(song.id, 'played')}
                      className="p-1.5 hover:bg-white/10 rounded-md text-emerald-500 hover:bg-emerald-500/20 transition-all"
                      title="Marcar como sonada"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(song.id, 'delete')}
                      className="p-1.5 hover:bg-white/10 rounded-md text-red-500 hover:bg-red-500/20 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <p className="text-center text-slate-600 py-10 font-bold uppercase text-xs">No hay canciones en cola</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TVView = ({ tables, queue, onSongEnd }) => (
  <div className="min-h-screen bg-[#05060a] z-[100] flex flex-col lg:flex-row overflow-x-hidden">
    <div className="flex-1 lg:w-2/3 p-4 md:p-8 lg:p-12 overflow-y-auto lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-16 gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-3xl md:text-5xl">🎱</span>
          <h1 className="text-2xl md:text-5xl font-black tracking-tighter italic uppercase underline decoration-billar-neon decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">
            MESAS ACTIVAS
          </h1>
        </div>
        <div className="text-left md:text-right">
          <p className="text-4xl md:text-6xl font-black font-mono text-billar-neon leading-none">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-[10px] md:text-sm font-bold text-slate-500 tracking-[0.2em] md:tracking-[0.5em] uppercase">Billar El Divino Niño</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
        {tables.slice(0, 4).map(table => (
          <div key={table.id} className={`glass-card p-6 md:p-10 relative overflow-hidden ${table.status === 'playing' ? 'bg-billar-neon/5 border-billar-neon/20 shadow-neon-glow' : 'opacity-40'}`}>
            <h3 className="text-xl md:text-3xl font-black mb-4 md:mb-8 flex items-center gap-3">
              {table.name}
              {table.status === 'playing' && <div className="w-2 h-2 md:w-3 md:h-3 bg-billar-neon rounded-full animate-ping" />}
            </h3>

            {table.status === 'playing' ? (
              <div className="space-y-6 md:space-y-10">
                <div className="flex justify-between items-center gap-4 md:gap-8">
                  <div className="flex-1 text-center space-y-1 md:space-y-2">
                    <p className="text-4xl md:text-6xl font-black">{table.score?.[0] || 0}</p>
                    <p className="text-xs md:text-xl font-bold text-slate-400 uppercase tracking-widest truncate">{table.players?.[0] || '---'}</p>
                  </div>
                  <div className="text-lg md:text-2xl font-black text-slate-700 italic">VS</div>
                  <div className="flex-1 text-center space-y-1 md:space-y-2">
                    <p className="text-4xl md:text-6xl font-black">{table.score?.[1] || 0}</p>
                    <p className="text-xs md:text-xl font-bold text-slate-400 uppercase tracking-widest truncate">{table.players?.[1] || '---'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:gap-4 bg-white/5 py-2 md:py-3 rounded-xl md:rounded-2xl">
                   <Clock className="text-billar-neon" size={20} />
                   <p className="text-2xl md:text-4xl font-black font-mono tracking-tighter text-white/80">00:00:00</p>
                </div>
              </div>
            ) : (
              <div className="h-32 md:h-48 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-lg md:text-2xl font-black text-slate-600 tracking-widest">DISPONIBLE</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <div className="w-full lg:w-1/3 bg-billar-card/80 p-6 md:p-8 lg:p-12 flex flex-col">
       <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-6 md:mb-8 flex items-center gap-3">
             <Music className="text-billar-purple" size={32} />
             LISTA DE <span className="text-billar-purple">MÚSICA</span>
          </h2>
          
          <div className="glass-card overflow-hidden bg-billar-purple/10 border-billar-purple/20 p-6 md:p-8 mb-8 md:mb-12">
             <p className="text-[10px] font-black text-billar-purple uppercase tracking-[0.3em] mb-2">Suena Ahora</p>
             <h4 className="text-xl md:text-2xl font-black mb-2 md:mb-4 line-clamp-2 leading-tight">{queue[0]?.title || 'Esperando canción...'}</h4>
             <p className="text-xs md:text-sm font-bold text-white/40 uppercase truncate">{queue[0]?.requestedBy || 'Billar El Divino Niño'}</p>
             
             <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                {queue[0] ? (
                  <YouTube 
                    videoId={queue[0].videoId} 
                    onEnd={() => onSongEnd(queue[0].id)}
                    className="w-full h-full"
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        modestbranding: 1
                      }
                    }}
                  />
                ) : (
                  <div className="text-slate-700 text-xs font-bold uppercase tracking-widest">Listo para reproducir</div>
                )}
             </div>
          </div>
       </div>

       <div className="flex-1 space-y-3 md:space-y-4 mb-8 overflow-y-auto">
          <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Siguientes Canciones</p>
          {queue.slice(1, 4).length > 0 ? queue.slice(1, 4).map((song, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02]">
               <span className="text-xl md:text-2xl font-black text-slate-700">0{i+2}</span>
               <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm md:text-lg truncate">{song.title}</p>
                  <p className="text-[10px] font-black text-billar-purple/60 uppercase truncate">{song.requestedBy}</p>
               </div>
            </div>
          )) : (
            <p className="text-[10px] font-bold text-slate-700 uppercase p-4 text-center border border-dashed border-white/5 rounded-xl">Cola vacía</p>
          )}
       </div>

       <div className="mt-auto pt-6 md:pt-8 border-t border-white/5 flex items-center gap-4 md:gap-6">
          <div className="bg-white p-2 rounded-lg shrink-0">
             <QRCode value={window.location.origin + "/music-box"} size={60} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-black uppercase tracking-tighter">¿Quieres tu canción?</p>
            <p className="text-[10px] md:text-xs text-slate-500">Escanea el código QR.</p>
          </div>
       </div>
    </div>
  </div>
);

const HistoryView = () => (
  <div className="p-8">
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black mb-1 italic">HISTORIAL Y <span className="text-billar-neon">CONTABILIDAD</span></h2>
        <p className="text-slate-400 text-sm">Registros detallados con fecha y hora exacta.</p>
      </div>
      <div className="flex gap-2">
         <button className="bg-white/5 text-xs font-bold px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all">EXPORTAR EXCEL</button>
         <button className="bg-billar-neon/10 text-billar-neon text-xs font-bold px-4 py-2 rounded-lg border border-billar-neon/20 hover:bg-billar-neon/20 transition-all">CIERRE DE CAJA</button>
      </div>
    </div>

    <div className="glass-card overflow-hidden border-none bg-white/5 h-64 flex items-center justify-center">
       <p className="text-slate-600 font-black uppercase tracking-widest text-sm">No hay registros hoy</p>
    </div>
  </div>
);

const CreditsView = () => (
  <div className="p-8 text-center py-20">
    <CreditCard size={64} className="mx-auto text-amber-500/20 mb-4" />
    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Próximamente</h2>
    <p className="text-slate-500 text-sm">El sistema de créditos estará disponible pronto.</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard
  const [currentView, setCurrentView] = useState('dashboard');
  const [tables, setTables] = useState([
    { id: 1, name: 'Mesa 1', status: 'available' },
    { id: 2, name: 'Mesa 2', status: 'available' },
    { id: 3, name: 'Mesa 3', status: 'available' },
    { id: 4, name: 'Mesa 4', status: 'available' },
  ]);
  const [queue, setQueue] = useState([]);
  const [isTVMode, setIsTVMode] = useState(window.location.pathname === '/tv');

  // Fetch session on startup
  useEffect(() => {
    const saved = localStorage.getItem('billar_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setView('dashboard');
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem('billar_user', JSON.stringify(u));
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('billar_user');
    setView('login');
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

  // Poll queue
  useEffect(() => {
    fetchQueue();
    const id = setInterval(fetchQueue, 5000);
    return () => clearInterval(id);
  }, []);

  const handleSongEnd = async (id) => {
    try {
      await fetch('/api/queue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'played' })
      });
      fetchQueue();
    } catch (e) { console.error('Error al terminar canción:', e); }
  };

  if (isTVMode) {
    return <TVView tables={tables} queue={queue} onSongEnd={handleSongEnd} />;
  }

  if (view === 'login') return <LoginView onLogin={handleLogin} onGoToRegister={() => setView('register')} />;
  if (view === 'register') return <RegisterOwnerView onBack={() => setView('login')} />;

  return (
    <div className="min-h-screen bg-billar-dark flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="flex flex-1">
        <aside className="w-64 border-r border-white/5 bg-billar-card/30 hidden lg:block">
          <div className="py-6">
            <SidebarItem 
              icon={TableIcon} 
              label="Gestión Mesas" 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')} 
            />
            <SidebarItem 
              icon={Music} 
              label="Rockola QR" 
              active={currentView === 'music'} 
              onClick={() => setCurrentView('music')} 
            />
            <SidebarItem 
              icon={History} 
              label="Contabilidad" 
              active={currentView === 'history'} 
              onClick={() => setCurrentView('history')} 
            />
            <SidebarItem 
              icon={Users} 
              label="Créditos/Fiados" 
              active={currentView === 'credits'} 
              onClick={() => setCurrentView('credits')} 
            />
            <div className="px-6 py-8 mt-12 bg-billar-purple/5 mx-4 rounded-2xl border border-billar-purple/10">
               <div onClick={() => window.open('/tv', '_blank')}
                 className="flex items-center gap-2 text-billar-purple font-black text-xs uppercase tracking-widest mb-2 cursor-pointer hover:underline">
                  <Monitor size={14} /> Abrir Vista TV
               </div>
               <p className="text-[10px] text-slate-500">Configura la pantalla grande para tus clientes.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-white/[0.02]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && <DashboardView tables={tables} />}
              {currentView === 'music' && <MusicView queue={queue} user={user} onUpdateQueue={fetchQueue} />}
              {currentView === 'credits' && <CreditsView />}
              {currentView === 'history' && <HistoryView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
