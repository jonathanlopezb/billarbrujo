import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Monitor, History, Music, LogOut, ChevronRight, Clock, 
  DollarSign, Play, Plus, Search, Table as TableIcon, CreditCard, 
  Settings, Lock, User, Key, ChevronUp, ChevronDown, Trash2, 
  CheckCircle, X, Trophy, Package, ShoppingCart, Beer, Utensils,
  Minus, Save, Edit3, Trash
} from 'lucide-react';
import QRCode from 'react-qr-code';
import YouTube from 'react-youtube';

// Constants
const ROLES = { OWNER: 'dueño', ADMIN: 'admin', WAITRESS: 'mesero' };

// --- UI Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${
      active ? 'bg-billar-neon/10 border-r-4 border-billar-neon text-billar-neon' : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
      <div className="w-10 h-10 bg-billar-neon rounded-lg flex items-center justify-center shadow-neon-glow"><span className="text-2xl">🎱</span></div>
      <h1 className="text-xl font-black tracking-tighter uppercase italic">El Divino <span className="text-billar-neon">Niño</span></h1>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-white leading-tight">{user?.nombre}</p>
        <p className="text-xs text-slate-400 uppercase tracking-widest leading-tight">{user?.rol}</p>
      </div>
      <button onClick={onLogout} className="p-2 rounded-full bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"><LogOut size={20} /></button>
    </div>
  </header>
);

const StatsGrid = ({ tables = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    {[
      { label: 'Ingresos Hoy', value: '$0', icon: DollarSign, color: 'text-emerald-400' },
      { label: 'Mesas Ocupadas', value: `${tables.filter(t => t.estado === 'ocupada').length}/${tables.length}`, icon: TableIcon, color: 'text-billar-neon' },
      { label: 'Fiados Hoy', value: '$0', icon: CreditCard, color: 'text-amber-400' },
      { label: 'Pedidos Bar', value: '0', icon: Beer, color: 'text-purple-400' },
    ].map((stat, i) => (
      <div key={i} className="glass-card p-6 flex items-center justify-between">
        <div><p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">{stat.label}</p><p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p></div>
        <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}><stat.icon size={24} /></div>
      </div>
    ))}
  </div>
);

const Timer = ({ start }) => {
  const [elapsed, setElapsed] = useState('00:00:00');
  useEffect(() => {
    if (!start) return;
    const update = () => {
      const diff = Math.floor((new Date() - new Date(start)) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setElapsed(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [start]);
  return <span className="font-mono">{elapsed}</span>;
};

const TableCard = ({ table, onStartMatch, onFinishMatch, onAddConsumo }) => {
  const isPlaying = table?.estado === 'ocupada';
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden">
      <div className={`h-1.5 w-full ${isPlaying ? 'bg-billar-neon animate-pulse' : 'bg-slate-700'}`} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">{table.nombre}</h3>
          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${isPlaying ? 'bg-billar-neon/20 text-billar-neon' : 'bg-white/5 text-slate-500'}`}>
            {isPlaying ? 'En Juego' : 'Disponible'}
          </span>
        </div>
        {isPlaying ? (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-black">{table.jugador1} VS {table.jugador2}</p>
              <div className="flex justify-center gap-4 mt-2">
                <div className="text-center"><p className="text-2xl font-black">{table.score1 || 0}</p></div>
                <div className="text-center"><p className="text-2xl font-black">{table.score2 || 0}</p></div>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-black">{table.jugador1} VS {table.jugador2}</p>
              <div className="flex justify-center gap-4 mt-2">
                <div className="text-center"><p className="text-2xl font-black">{table.score1 || 0}</p></div>
                <div className="text-center"><p className="text-2xl font-black">{table.score2 || 0}</p></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-slate-600 opacity-50"><TableIcon size={48} className="mb-2" /><p className="text-xs font-bold uppercase tracking-widest">Lista para jugar</p></div>
        )}
        <div className="mt-6 flex flex-col gap-2">
          {isPlaying ? (
            <>
              <button onClick={() => onAddConsumo(table)} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-lg text-xs transition-all uppercase flex items-center justify-center gap-2"><Beer size={14} /> AGREGAR CONSUMO</button>
              <button onClick={() => onFinishMatch(table.partida_id, table.score1, table.score2)} className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold py-2 rounded-lg text-xs transition-all uppercase">FINALIZAR Y COBRAR</button>
            </>
          ) : (
            <button onClick={() => onStartMatch(table.id)} className="w-full neon-button flex items-center justify-center gap-2 text-sm uppercase italic font-black"><Play size={16} /> INICIAR PARTIDA</button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- View Components ---

const DashboardView = ({ tables, onStartMatch, onFinishMatch, onAddConsumo, onNewSale }) => (
  <div className="p-8">
    <div className="flex justify-between items-end mb-8">
      <div><h2 className="text-3xl font-black italic uppercase tracking-tighter">EL DIVINO <span className="text-billar-neon">NIÑO</span></h2><p className="text-slate-500 font-bold uppercase text-[10px]">Panel de Control en vivo</p></div>
      <button onClick={onNewSale} className="neon-button flex items-center gap-2"><ShoppingCart size={18} /> NUEVA VENTA</button>
    </div>
    <StatsGrid tables={tables} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tables.map(t => (
        <TableCard key={t.id} table={t} onStartMatch={onStartMatch} onFinishMatch={onFinishMatch} onAddConsumo={onAddConsumo} />
      ))}
    </div>
  </div>
);

const ProductsView = ({ products, onUpdate }) => {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: 'bebida', stock: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing ? 'PATCH' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    await fetch('/api/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setEditing(null); setForm({ nombre: '', precio: '', categoria: 'bebida', stock: '' });
    onUpdate();
  };

  const handleEdit = (p) => { setEditing(p.id); setForm({ nombre: p.nombre, precio: p.precio, categoria: p.categoria, stock: p.stock }); };
  const handleDelete = async (id) => { if (window.confirm('¿Borrar producto?')) { await fetch(`/api/products?id=${id}`, { method: 'DELETE' }); onUpdate(); } };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div><h2 className="text-3xl font-black uppercase italic tracking-tighter">Inventario y <span className="text-emerald-400">Precios</span></h2><p className="text-slate-500 text-xs font-bold uppercase">Control de stock y ventas de bar.</p></div>
        {!editing && <button onClick={() => setEditing('new')} className="neon-button flex items-center gap-2"><Plus size={18} /> NUEVO PRODUCTO</button>}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleSave} className="glass-card p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre</label><input type="text" className="w-full neon-input py-2" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
            <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Precio</label><input type="number" className="w-full neon-input py-2" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required /></div>
            <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Stock</label><input type="number" className="w-full neon-input py-2" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required /></div>
            <div className="flex gap-2"><button type="submit" className="flex-1 bg-emerald-500/20 text-emerald-400 p-2 rounded-lg hover:bg-emerald-500/40 transition-all flex items-center justify-center"><Save size={18} /></button><button onClick={() => setEditing(null)} type="button" className="flex-1 bg-white/5 text-slate-400 p-2 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center"><X size={18} /></button></div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="glass-card p-4 flex items-center justify-between bg-white/[0.02] border-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">{p.categoria === 'bebida' ? <Beer size={20} /> : <Utensils size={20} />}</div>
              <div><p className="font-bold text-sm">{p.nombre}</p><p className="text-xs font-black text-emerald-500">${p.precio}</p></div>
            </div>
            <div className="text-right">
              <p className={`text-[10px] font-black uppercase ${p.stock < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>Stock: {p.stock}</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-500/10 rounded text-slate-600 hover:text-red-500"><Trash size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TVControllerView = ({ tables, onUpdateScore }) => {
  const [message, setMessage] = useState('');
  
  const handleSetMessage = async () => {
    localStorage.setItem('tv_message', message);
    window.dispatchEvent(new Event('storage'));
    alert('Mensaje enviado a la TV');
  };

  const activeTables = tables.filter(t => t.estado === 'ocupada');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Control de <span className="text-billar-neon">Pantalla</span></h2>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Lo que ves aquí se refleja en la TV del negocio.</p>
        </div>
        <div className="flex gap-4">
           <input 
             type="text" className="neon-input py-2 px-4 w-64" placeholder="Mensaje para la TV..." 
             value={message} onChange={e => setMessage(e.target.value)}
           />
           <button onClick={handleSetMessage} className="bg-billar-neon text-black font-black px-6 py-2 rounded-lg text-xs uppercase italic hover:shadow-neon-glow transition-all">Enviar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activeTables.map(t => (
          <div key={t.id} className="glass-card p-8 border-billar-neon/20 bg-billar-neon/5">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-black italic">{t.nombre}</h3>
               <span className="text-[10px] font-black bg-billar-neon text-black px-2 py-1 rounded italic">EN VIVO</span>
            </div>
            
            <div className="flex items-center justify-between gap-8 mb-8">
               <div className="flex-1 text-center">
                  <p className="text-xs font-black text-slate-500 uppercase mb-2 truncate">{t.jugador1}</p>
                  <div className="flex items-center justify-center gap-4">
                     <button onClick={() => onUpdateScore(t.partida_id, Math.max(0, (t.score1 || 0) - 1), t.score2)} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all font-black text-2xl">-</button>
                     <p className="text-5xl font-black">{t.score1 || 0}</p>
                     <button onClick={() => onUpdateScore(t.partida_id, (t.score1 || 0) + 1, t.score2)} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-billar-neon hover:bg-billar-neon/10 transition-all font-black text-2xl">+</button>
                  </div>
               </div>
               <div className="text-slate-700 font-bold italic">VS</div>
               <div className="flex-1 text-center">
                  <p className="text-xs font-black text-slate-500 uppercase mb-2 truncate">{t.jugador2}</p>
                  <div className="flex items-center justify-center gap-4">
                     <button onClick={() => onUpdateScore(t.partida_id, t.score1, Math.max(0, (t.score2 || 0) - 1))} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all font-black text-2xl">-</button>
                     <p className="text-5xl font-black">{t.score2 || 0}</p>
                     <button onClick={() => onUpdateScore(t.partida_id, t.score1, (t.score2 || 0) + 1)} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-billar-neon hover:bg-billar-neon/10 transition-all font-black text-2xl">+</button>
                  </div>
               </div>
            </div>
          </div>
        ))}
        {activeTables.length === 0 && (
          <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
             <Monitor size={48} className="mx-auto text-slate-800 mb-4" />
             <p className="text-slate-600 font-black uppercase tracking-[0.2em]">No hay partidas activas para controlar</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TVView = ({ tables, queue, onSongEnd }) => {
  const [tvMsg, setTvMsg] = useState(localStorage.getItem('tv_message') || '');

  useEffect(() => {
    const handleStorage = () => setTvMsg(localStorage.getItem('tv_message') || '');
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#05060a] z-[100] flex overflow-hidden text-white font-sans relative">
      <AnimatePresence>
        {tvMsg && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="absolute top-0 left-0 right-0 bg-billar-neon text-black py-4 text-3xl text-center font-black z-[200] italic shadow-2xl">📢 {tvMsg}</motion.div>
        )}
      </AnimatePresence>
      <div className="flex-[2] p-10 flex flex-col border-r border-white/5">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-billar-neon rounded-2xl flex items-center justify-center shadow-neon-glow"><span className="text-4xl">🎱</span></div>
            <div><h1 className="text-5xl font-black italic uppercase underline decoration-billar-neon decoration-8 underline-offset-[12px]">MESAS <span className="text-billar-neon">ACTIVAS</span></h1><p className="text-xs font-bold text-slate-500 tracking-[0.4em] uppercase mt-2">Billar El Divino Niño</p></div>
        </div>
        <div className="text-right"><p className="text-3xl font-black font-mono text-billar-neon leading-none bg-white/5 py-3 px-6 rounded-2xl border border-white/5">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
      </div>
        <div className="flex-1 grid grid-cols-2 gap-8 h-full">
          {tables.map(table => (
            <div key={table.id} className={`glass-card p-8 flex flex-col relative overflow-hidden transition-all duration-500 border-none ${table.estado === 'ocupada' ? 'bg-billar-neon/[0.05] shadow-neon-glow' : 'opacity-30 bg-black/40'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-4xl font-black italic">{table.nombre}</h3>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${table.estado === 'ocupada' ? 'bg-billar-neon text-black' : 'bg-white/10 text-slate-400'}`}>{table.estado === 'ocupada' ? 'OCUPADA' : 'DISPONIBLE'}</span>
              </div>
              {table.estado === 'ocupada' ? (
                <div className="flex-1 flex flex-col justify-center gap-8">
                  <div className="flex justify-around items-center">
                    <div className="text-center space-y-2"><p className="text-8xl font-black text-white tracking-tighter">{table.score1 || 0}</p><p className="text-sm font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{table.jugador1 || '---'}</p></div>
                    <div className="text-2xl font-black text-slate-800 italic">VS</div>
                    <div className="text-center space-y-2"><p className="text-8xl font-black text-white tracking-tighter">{table.score2 || 0}</p><p className="text-sm font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{table.jugador2 || '---'}</p></div>
                  </div>
                  <div className="flex items-center justify-center gap-4 bg-white/5 py-4 rounded-3xl mt-auto"><Clock className="text-billar-neon" size={24} /><p className="text-4xl font-black font-mono tracking-tighter text-white/90"><Timer start={table.inicio} /></p></div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl"><p className="text-xl font-black text-slate-800 tracking-[0.3em]">LISTA</p></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[350px] bg-billar-card/30 p-8 flex flex-col border-l border-white/5">
         <div className="flex items-center gap-3 mb-6"><Music className="text-billar-purple" size={24} /><h2 className="text-xl font-black italic tracking-tighter">LISTA DE <span className="text-billar-purple">MÚSICA</span></h2></div>
         
         <div className="glass-card overflow-hidden bg-billar-purple/5 border-billar-purple/20 p-4 mb-8">
            <h4 className="text-sm font-black line-clamp-2 leading-tight mb-1">{queue[0]?.title || 'Esperando canción...'}</h4>
            <p className="text-[10px] font-bold text-white/40 uppercase truncate mb-4">{queue[0]?.requestedBy || 'Billar El Divino Niño'}</p>
            <div className="rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/5">
              {queue[0] ? (
                <YouTube videoId={queue[0].videoId} onEnd={() => onSongEnd(queue[0].id)} className="w-full h-full" opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, controls: 0 } }} />
              ) : ( <div className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Cola vacía</div> )}
            </div>
         </div>

         <div className="flex-1 flex flex-col gap-3 min-h-0">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 border-b border-white/5 pb-2">Próximos Temas</p>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {queue.slice(1, 8).map((song, i) => (
                <div key={song.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                   <span className="text-xs font-black text-slate-700">0{i+2}</span>
                   <div className="flex-1 min-w-0">
                      <p className="font-bold text-[11px] truncate leading-tight">{song.title}</p>
                      <p className="text-[9px] font-black text-billar-purple/60 uppercase truncate">{song.requestedBy}</p>
                   </div>
                </div>
              ))}
              {queue.length <= 1 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-10">
                  <Music size={32} className="mb-2" />
                  <p className="text-[9px] font-black uppercase">Sin temas en cola</p>
                </div>
              )}
            </div>
         </div>

         <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="bg-white p-1.5 rounded-lg"><QRCode value={window.location.origin + "/music-box"} size={54} /></div><p className="text-[10px] font-black uppercase leading-tight text-slate-500">¿PIDE TU<br/>CANCIÓN?<br/><span className="text-white text-[8px]">Escanea QR</span></p></div>
            <p className="text-[9px] font-black text-billar-neon/40 italic text-right leading-none uppercase tracking-tighter">Producido por<br/>El Brujo</p>
       </div>
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
    <div className="p-8 max-w-4xl mx-auto"><h2 className="text-4xl font-black mb-2 uppercase italic text-center text-billar-purple">Rockola</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12"><div className="glass-card p-8 flex flex-col items-center"><div className="bg-white p-4 rounded-2xl mb-6"><QRCode value={window.location.origin + "/music-box"} size={200} /></div><p className="font-black text-xl uppercase italic tracking-tighter">Toda la música!</p></div><div className="space-y-4"><h3 className="font-black uppercase text-slate-500 text-xs tracking-widest">En cola</h3>{queue.map((song, i) => (<div key={song.id} className="glass-card p-4 flex justify-between items-center bg-white/5 border-none"><div className="flex items-center gap-3"><span className="text-billar-purple font-black">{i+1}</span><p className="font-bold text-sm truncate max-w-[150px]">{song.title}</p></div>{isAdmin && (<div className="flex gap-2"><button onClick={() => handleAction(song.id, 'played')} className="text-emerald-500 hover:scale-110 transition-all cursor-pointer"><CheckCircle size={18} /></button><button onClick={() => handleAction(song.id, 'delete')} className="text-red-500 hover:scale-110 transition-all cursor-pointer"><Trash2 size={18} /></button></div>)}</div>))}</div></div></div>
  );
};

const HistoryView = () => (
  <div className="p-8"><h2 className="text-3xl font-black mb-6 uppercase italic">Historial</h2><div className="glass-card p-10 mt-6 text-center text-slate-700 font-black uppercase tracking-widest">Contabilidad próximamente.</div></div>
);

const CreditsView = () => {
  const [debtors, setDebtors] = useState([
    { name: 'Ricardo P.', debt: 45000, lastOrder: 'hace 2 días' },
    { name: 'Don Jose', debt: 12000, lastOrder: 'hace 1 hora' },
    { name: 'Andrés M.', debt: 28500, lastOrder: 'ayer' }
  ]);
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Lista de <span className="text-amber-500">Deudores</span></h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cuentas pendientes por pagar (Fiados).</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
          <p className="text-[10px] font-black text-amber-500 uppercase mb-1">Total por cobrar</p>
          <p className="text-2xl font-black text-amber-400">$85.500</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debtors.map((d, i) => (
          <div key={i} className="glass-card p-6 flex items-center justify-between bg-white/[0.03] border-none">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 font-black text-xl">{d.name[0]}</div>
              <div><p className="font-bold">{d.name}</p><p className="text-[10px] text-slate-500 font-black uppercase">Último: {d.lastOrder}</p></div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">${d.debt.toLocaleString()}</p>
              <button className="text-[10px] font-black text-amber-500 uppercase hover:underline">Saldar Cuenta</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoginView = ({ onLogin, onGoToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const resp = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await resp.json();
      if (resp.ok) onLogin(data); else setError(data.error);
    } catch (err) { setError('Error de conexión'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-billar-dark px-6">
      <div className="glass-card p-10 w-full max-w-md">
        <div className="text-center mb-8"><div className="w-16 h-16 bg-billar-neon rounded-2xl flex items-center justify-center shadow-neon-glow mx-auto mb-4"><span className="text-4xl">🎱</span></div><h2 className="text-2xl font-black italic uppercase italic">El Divino <span className="text-billar-neon">Niño</span></h2></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Usuario" className="w-full neon-input py-3 px-4" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="Contraseña" className="w-full neon-input py-3 px-4" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          {error && <p className="text-red-400 text-xs font-bold uppercase text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full neon-button py-4 mt-4 uppercase font-black">{loading ? 'Ingresando...' : 'Entrar'}</button>
        </form>
        <button onClick={onGoToRegister} className="w-full text-slate-500 text-[10px] font-black uppercase mt-6 hover:text-white">¿Registrar dueño?</button>
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
    if (resp.ok) setMsg('REGISTRO EXITOSO'); else setMsg(data.error);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-billar-dark px-6">
      <div className="glass-card p-10 w-full max-w-md"><h2 className="text-xl font-black uppercase italic mb-8 text-center text-billar-neon">Registro</h2><form onSubmit={handleSubmit} className="space-y-4"><input type="text" placeholder="Nombre" className="w-full neon-input py-3 px-4" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /><input type="text" placeholder="Usuario" className="w-full neon-input py-3 px-4" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /><input type="password" placeholder="Contraseña" className="w-full neon-input py-3 px-4" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /><input type="text" placeholder="Llave" className="w-full neon-input py-3 px-4" value={form.secretKey} onChange={e => setForm({...form, secretKey: e.target.value})} required />{msg && <p className="text-center text-xs font-black uppercase italic">{msg}</p>}<button type="submit" className="w-full neon-button py-4 font-black uppercase mt-4">Confirmar</button><button type="button" onClick={onBack} className="w-full text-slate-500 text-[10px] font-black uppercase mt-4">Volver</button></form></div>
    </div>
  );
};

// --- Modals ---

const StartMatchModal = ({ isOpen, tableId, onClose, onConfirm }) => {
  const [form, setForm] = useState({ jugador1: '', jugador2: '', precioPartida: '6000' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} /><motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-card p-8 w-full max-w-md relative z-[1001] bg-billar-dark"><button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-all"><X /></button><h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Iniciar <span className="text-billar-neon">Partida</span></h2><div className="space-y-4"><div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre Jugador 1</label><input type="text" className="w-full neon-input py-3" placeholder="Ej: Jonathan" value={form.jugador1} onChange={e => setForm({...form, jugador1: e.target.value})} /></div><div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre Jugador 2</label><input type="text" className="w-full neon-input py-3" placeholder="Ej: Miriam" value={form.jugador2} onChange={e => setForm({...form, jugador2: e.target.value})} /></div><div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Precio por Partido</label><input type="number" className="w-full neon-input py-3" placeholder="Ej: 6000" value={form.precioPartida} onChange={e => setForm({...form, precioPartida: e.target.value})} /></div><button onClick={() => onConfirm(tableId, form)} className="w-full neon-button py-4 mt-4 font-black italic text-lg">PUXAR MESA!</button></div></motion.div></div>
  );
};

const SaleModal = ({ isOpen, products, onClose, onConfirm }) => {
  const [cart, setCart] = useState([]);
  const [clienteNombre, setClienteNombre] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo'); // 'efectivo' o 'fiado'

  const addToCart = (p) => {
    const existing = cart.find(item => item.id === p.id);
    if (existing) setCart(cart.map(item => item.id === p.id ? { ...item, q: item.q + 1 } : item));
    else setCart([...cart, { ...p, q: 1 }]);
  };
  const removeFromCart = (id) => {
    const existing = cart.find(item => item.id === id);
    if (existing.q > 1) setCart(cart.map(item => item.id === id ? { ...item, q: item.q - 1 } : item));
    else setCart(cart.filter(item => item.id !== id));
  };
  if (!isOpen) return null;
  const total = cart.reduce((acc, i) => acc + (i.precio * i.q), 0);
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-4xl h-[85vh] flex flex-col relative z-[2001] overflow-hidden bg-billar-dark shadow-2xl border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Panel de <span className="text-emerald-400">Ventas Directas</span></h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-slate-500 hover:text-white"><X /></button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto bg-black/20">
            <div className="mb-6">
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre para la Cuenta</label>
              <input type="text" className="w-full neon-input py-3 px-4" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} placeholder="Ej: Mesa 4 o Nombre de cliente" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map(p => (
                <button key={p.id} onClick={() => addToCart(p)} className="glass-card p-4 text-left hover:bg-white/5 active:scale-95 transition-all group border-none bg-white/5">
                  <p className="font-bold text-sm group-hover:text-emerald-400 transition-all truncate">{p.nombre}</p>
                  <p className="text-xs font-black text-slate-500">${p.precio}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="w-96 p-8 flex flex-col bg-white/[0.03] border-l border-white/5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Detalle del Pedido</h3>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs truncate">{item.nombre}</p>
                    <p className="text-[10px] font-black text-slate-500">{item.q} x ${item.precio}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center hover:bg-red-500/20 text-red-500 transition-all"><Minus size={14} /></button>
                    <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center hover:bg-emerald-500/20 text-emerald-500 transition-all"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4 opacity-50"><ShoppingCart size={48} /><p className="text-[10px] font-black uppercase tracking-widest text-center">Selecciona productos<br/>para empezar</p></div>}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-3">Método de Pago</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setMetodoPago('efectivo')} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${metodoPago === 'efectivo' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}><DollarSign size={14} /> Contado</button>
                  <button onClick={() => setMetodoPago('fiado')} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${metodoPago === 'fiado' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}><CreditCard size={14} /> Fiado</button>
                </div>
              </div>
              <div className="flex justify-between items-end mb-6">
                <p className="text-slate-500 text-xs font-black uppercase">TOTAL A PAGAR</p>
                <p className="text-4xl font-black text-emerald-400 tracking-tighter">${total}</p>
              </div>
              <button disabled={cart.length === 0 || !clienteNombre} onClick={() => onConfirm(cart, clienteNombre, metodoPago)} className="w-full neon-button py-5 font-black italic uppercase disabled:opacity-20 transition-all text-lg tracking-tighter">Cerrar Cuenta</button>
            </div>
          </div>
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
  const [products, setProducts] = useState([]);
  const [queue, setQueue] = useState([]);
  const [isTVMode, setIsTVMode] = useState(window.location.pathname === '/tv');
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const fetchData = async () => {
    try {
      const [tRes, pRes, qRes] = await Promise.all([fetch('/api/tables'), fetch('/api/products'), fetch('/api/queue')]);
      if (tRes.ok) setTables(await tRes.json());
      if (pRes.ok) setProducts(await pRes.json());
      if (qRes.ok) {
        const qData = await qRes.json();
        if (Array.isArray(qData)) setQueue(qData.map(q => ({ id: q.id, title: q.titulo, requestedBy: q.solicitado_por, videoId: q.video_id })));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const saved = localStorage.getItem('billar_user');
    if (saved) { setUser(JSON.parse(saved)); setView('dashboard'); }
    fetchData();
    const id = setInterval(fetchData, 4000);
    return () => clearInterval(id);
  }, []);

  const handleMarkAsPlayed = async (id) => {
    await fetch('/api/queue', { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id, action: 'played' }) 
    });
    fetchData();
  };

  const handleUpdateScore = async (partidaId, score1, score2) => {
    await fetch('/api/tables', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partidaId, score1, score2 }) });
    fetchData();
  };

  const handleStartMatch = async (tableId, formData) => {
    await fetch('/api/tables', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mesaId: tableId, jugador1: formData.jugador1, jugador2: formData.jugador2, tarifaHora: parseInt(formData.precioPartida) }) });
    setMatchModalOpen(false); fetchData();
  };

  const handleFinishMatch = async (partidaId) => {
    if (window.confirm('¿Cobrar partida y liberar mesa?')) {
      await fetch('/api/tables', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partidaId, finish: true }) });
      fetchData();
    }
  };

  const handleOrderConfirm = async (cart, clienteNombre, metodoPago) => {
    const items = cart.map(i => ({ productoId: i.id, cantidad: i.q, precioUnitario: i.precio }));
    await fetch('/api/orders', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ 
        clienteNombre, 
        items, 
        usuarioId: user?.id,
        metodoPago 
      }) 
    });
    setSaleModalOpen(false); fetchData();
  };

  if (isTVMode) return <TVView tables={tables} queue={queue} onSongEnd={handleMarkAsPlayed} />;
  if (view === 'login') return <LoginView onLogin={u => { setUser(u); setView('dashboard'); localStorage.setItem('billar_user', JSON.stringify(u)); }} onGoToRegister={() => setView('register')} />;
  if (view === 'register') return <RegisterOwnerView onBack={() => setView('login')} />;

  return (
    <div className="min-h-screen bg-billar-dark flex flex-col selection:bg-billar-neon">
      <Navbar user={user} onLogout={() => { setUser(null); setView('login'); localStorage.removeItem('billar_user'); }} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-white/5 bg-billar-card/30 hidden lg:block overflow-y-auto">
          <div className="py-6 h-full flex flex-col">
            <SidebarItem icon={TableIcon} label="Gestión Mesas" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <SidebarItem icon={Monitor} label="Control TV" active={currentView === 'tv-control'} onClick={() => setCurrentView('tv-control')} />
            <SidebarItem icon={ShoppingCart} label="Venta Directa" active={currentView === 'sale'} onClick={() => { setSelectedTable(null); setSaleModalOpen(true); }} />
            <SidebarItem icon={Package} label="Inventario/Precios" active={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} />
            <SidebarItem icon={Music} label="Rockola QR" active={currentView === 'music'} onClick={() => setCurrentView('music')} />
            <SidebarItem icon={History} label="Contabilidad" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
            <SidebarItem icon={Users} label="Créditos/Fiados" active={currentView === 'credits'} onClick={() => setCurrentView('credits')} />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-white/[0.01]">
          <AnimatePresence mode="wait">
            <motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {currentView === 'dashboard' && <DashboardView tables={tables} onStartMatch={id => { setSelectedTable(id); setMatchModalOpen(true); }} onFinishMatch={handleFinishMatch} onAddConsumo={() => setSaleModalOpen(true)} onNewSale={() => setSaleModalOpen(true)} />}
              {currentView === 'tv-control' && <TVControllerView tables={tables} onUpdateScore={handleUpdateScore} />}
              {currentView === 'inventory' && <ProductsView products={products} onUpdate={fetchData} />}
              {currentView === 'music' && <MusicView queue={queue} user={user} onUpdateQueue={fetchData} />}
              {currentView === 'history' && <HistoryView />}
              {currentView === 'credits' && <CreditsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <StartMatchModal isOpen={matchModalOpen} tableId={selectedTable} onClose={() => setMatchModalOpen(false)} onConfirm={handleStartMatch} />
      <SaleModal isOpen={saleModalOpen} products={products} onClose={() => setSaleModalOpen(false)} onConfirm={handleOrderConfirm} />
    </div>
  );
}
