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

const TableCard = ({ table, onStartMatch, onSettleMatch, onAddConsumo, onRegistrarChico }) => {
  const isPlaying = table?.estado === 'ocupada';
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden border-white/5">
      <div className={`h-1.5 w-full ${isPlaying ? 'bg-billar-neon animate-pulse shadow-neon-glow' : 'bg-slate-700'}`} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold italic uppercase tracking-tighter">{table.nombre}</h3>
          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${isPlaying ? 'bg-billar-neon/20 text-billar-neon' : 'bg-white/5 text-slate-500'}`}>
            {isPlaying ? 'En Juego' : 'Disponible'}
          </span>
        </div>
        {isPlaying ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Pareja A</p>
                <p className="text-2xl font-black text-white">{table.parejas?.find(p => p.nombre === 'A')?.chicos_ganados || 0}</p>
                <button onClick={() => onRegistrarChico(table.partida_id, table.parejas?.find(p => p.nombre === 'A')?.id)} className="mt-2 text-[9px] font-black uppercase bg-billar-neon/10 text-billar-neon px-2 py-1 rounded hover:bg-billar-neon/20">+ Ganó Chico</button>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Pareja B</p>
                <p className="text-2xl font-black text-white">{table.parejas?.find(p => p.nombre === 'B')?.chicos_ganados || 0}</p>
                <button onClick={() => onRegistrarChico(table.partida_id, table.parejas?.find(p => p.nombre === 'B')?.id)} className="mt-2 text-[9px] font-black uppercase bg-billar-neon/10 text-billar-neon px-2 py-1 rounded hover:bg-billar-neon/20">+ Ganó Chico</button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 rounded-lg">
               <Clock size={12} className="text-billar-neon" />
               <p className="text-xs font-mono font-bold"><Timer start={table.inicio} /></p>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-600 opacity-30"><TableIcon size={48} className="mb-2" /><p className="text-[10px] font-black uppercase tracking-[0.2em]">Mesa Libre</p></div>
        )}
        <div className="mt-6 flex flex-col gap-2">
          {isPlaying ? (
            <>
              <button onClick={() => onAddConsumo(table)} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-[10px] transition-all uppercase flex items-center justify-center gap-2 border border-white/5"><Beer size={14} /> REGISTRAR CONSUMO</button>
              <button onClick={() => onSettleMatch(table)} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-3 rounded-xl text-[10px] transition-all uppercase border border-red-500/20">LIQUIDAR Y CERRAR</button>
            </>
          ) : (
            <button onClick={() => onStartMatch(table.id)} className="w-full neon-button py-4 flex items-center justify-center gap-2 text-xs uppercase italic font-black"><Play size={16} /> NUEVA PARTIDA</button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DashboardView = ({ tables, onStartMatch, onSettleMatch, onAddConsumo, onNewSale, onRegistrarChico }) => (
  <div className="p-8">
    <div className="flex justify-between items-end mb-10">
      <div><h2 className="text-4xl font-black italic uppercase tracking-tighter">SALA DE <span className="text-billar-neon">BILLAR</span></h2><p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Gestión de mesas y partidas en tiempo real</p></div>
      <button onClick={onNewSale} className="neon-button flex items-center gap-2 italic uppercase font-black text-xs px-6"><ShoppingCart size={18} /> VENTA DIRECTA</button>
    </div>
    <StatsGrid tables={tables} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tables.map(t => (
        <TableCard key={t.id} table={t} onStartMatch={onStartMatch} onSettleMatch={onSettleMatch} onAddConsumo={onAddConsumo} onRegistrarChico={onRegistrarChico} />
      ))}
    </div>
  </div>
);

const ProductsView = ({ products, onUpdate }) => {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: 'bebida', stock: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing && editing !== 'new' ? 'PATCH' : 'POST';
    const body = editing === 'new' ? form : { ...form, id: editing };
    await fetch('/api/negocio?type=products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setEditing(null); setForm({ nombre: '', precio: '', categoria: 'bebida', stock: '' });
    onUpdate();
  };

  const handleEdit = (p) => { setEditing(p.id); setForm({ nombre: p.nombre, precio: p.precio, categoria: p.categoria, stock: p.stock }); };
  const handleDelete = async (id) => { if (window.confirm('¿Borrar?')) { await fetch(`/api/negocio?type=products&id=${id}`, { method: 'DELETE' }); onUpdate(); } };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div><h2 className="text-3xl font-black uppercase italic tracking-tighter">Inventario y <span className="text-emerald-400">Precios</span></h2></div>
        {!editing && <button onClick={() => setEditing('new')} className="neon-button flex items-center gap-2"><Plus size={18} /> NUEVO PRODUCTO</button>}
      </div>
      <AnimatePresence>
        {editing && (
          <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleSave} className="glass-card p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre</label><input className="w-full neon-input py-2" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
            <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Precio</label><input type="number" className="w-full neon-input py-2" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required /></div>
            <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Stock</label><input type="number" className="w-full neon-input py-2" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required /></div>
            <div className="flex gap-2"><button type="submit" className="flex-1 bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><Save size={18} /></button><button onClick={() => setEditing(null)} type="button" className="flex-1 bg-white/5 text-slate-400 p-2 rounded-lg"><X size={18} /></button></div>
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
  const handleSetMessage = () => { localStorage.setItem('tv_message', message); window.dispatchEvent(new Event('storage')); alert('Enviado!'); };
  const activeTables = tables.filter(t => t.estado === 'ocupada');
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div><h2 className="text-3xl font-black uppercase italic tracking-tighter">Control de <span className="text-billar-neon">Pantalla</span></h2></div>
        <div className="flex gap-4"><input className="neon-input py-2 px-4 w-64" placeholder="Mensaje..." value={message} onChange={e => setMessage(e.target.value)} /><button onClick={handleSetMessage} className="neon-button px-6 py-2 text-xs uppercase italic font-black">Enviar</button></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activeTables.map(t => (
          <div key={t.id} className="glass-card p-8 border-billar-neon/20 bg-billar-neon/5">
            <h3 className="text-2xl font-black italic mb-6">{t.nombre}</h3>
            <div className="flex items-center justify-between gap-8 mb-8">
               <div className="flex-1 text-center">
                  <p className="text-xs font-black text-slate-500 uppercase mb-2 line-clamp-1">{t.jugador1}</p>
                  <div className="flex items-center justify-center gap-4">
                     <button onClick={() => onUpdateScore(t.partida_id, Math.max(0, (t.score1 || 0) - 1), t.score2)} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-red-500">-</button>
                     <p className="text-4xl font-black">{t.score1 || 0}</p>
                     <button onClick={() => onUpdateScore(t.partida_id, (t.score1 || 0) + 1, t.score2)} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-billar-neon">+</button>
                  </div>
               </div>
               <div className="text-slate-700 font-bold italic">VS</div>
               <div className="flex-1 text-center">
                  <p className="text-xs font-black text-slate-500 uppercase mb-2 line-clamp-1">{t.jugador2}</p>
                  <div className="flex items-center justify-center gap-4">
                     <button onClick={() => onUpdateScore(t.partida_id, t.score1, Math.max(0, (t.score2 || 0) - 1))} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-red-500">-</button>
                     <p className="text-4xl font-black">{t.score2 || 0}</p>
                     <button onClick={() => onUpdateScore(t.partida_id, t.score1, (t.score2 || 0) + 1)} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-billar-neon">+</button>
                  </div>
               </div>
            </div>
          </div>
        ))}
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
      <AnimatePresence>{tvMsg && <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="absolute top-0 left-0 right-0 bg-billar-neon text-black py-4 text-3xl text-center font-black z-[200]">📢 {tvMsg}</motion.div>}</AnimatePresence>
      <div className="flex-[2] p-10 flex flex-col border-r border-white/5">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-billar-neon rounded-2xl flex items-center justify-center shadow-neon-glow"><span className="text-4xl">🎱</span></div>
            <h1 className="text-5xl font-black italic uppercase">MESAS <span className="text-billar-neon">ACTIVAS</span></h1>
          </div>
          <p className="text-3xl font-black font-mono text-billar-neon bg-white/5 py-3 px-6 rounded-2xl border border-white/5">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-8 h-full">
          {tables.map(table => (
            <div key={table.id} className={`glass-card p-8 flex flex-col relative overflow-hidden border-none ${table.estado === 'ocupada' ? 'bg-billar-neon/[0.05] shadow-neon-glow' : 'opacity-30 bg-black/40'}`}>
              <div className="flex justify-between items-center mb-6"><h3 className="text-4xl font-black italic">{table.nombre}</h3><span className={`text-[10px] font-black px-3 py-1 rounded-full ${table.estado === 'ocupada' ? 'bg-billar-neon text-black' : 'bg-white/10'}`}>{table.estado === 'ocupada' ? 'OCUPADA' : 'LIBRE'}</span></div>
              {table.estado === 'ocupada' ? (
                <div className="flex-1 flex flex-col justify-center gap-8">
                  <div className="flex justify-around items-center">
                    <div className="text-center space-y-2"><p className="text-8xl font-black text-white">{table.score1 || 0}</p><p className="text-sm font-black text-slate-400 uppercase">{table.jugador1 || '---'}</p></div>
                    <div className="text-2xl font-black text-slate-800 italic">VS</div>
                    <div className="text-center space-y-2"><p className="text-8xl font-black text-white">{table.score2 || 0}</p><p className="text-sm font-black text-slate-400 uppercase">{table.jugador2 || '---'}</p></div>
                  </div>
                  <div className="flex items-center justify-center gap-4 bg-white/5 py-4 rounded-3xl mt-auto"><Clock className="text-billar-neon" size={24} /><p className="text-4xl font-black font-mono"><Timer start={table.inicio} /></p></div>
                </div>
              ) : <div className="flex-1 flex items-center justify-center opacity-10"><TableIcon size={120} /></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[350px] bg-billar-card/30 p-8 flex flex-col border-l border-white/5">
         <div className="flex items-center gap-3 mb-6"><Music className="text-billar-purple" size={24} /><h2 className="text-xl font-black italic">ROCKOLA</h2></div>
         <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/5 mb-8">
           {queue[0] ? <YouTube videoId={queue[0].videoId} onEnd={() => onSongEnd(queue[0].id)} className="w-full h-full" opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, controls: 0 } }} /> : <Music size={40} className="text-slate-800" />}
         </div>
         <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {queue.slice(1, 8).map((song, i) => (
              <div key={song.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5"><span className="text-xs font-black text-slate-700">0{i+2}</span><p className="font-bold text-[11px] truncate">{song.title}</p></div>
            ))}
         </div>
         <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="bg-white p-2 rounded-xl"><QRCode value={window.location.origin + "/music-box"} size={80} /></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Pide tu música aquí</p>
         </div>
      </div>
    </div>
  );
};

const MusicView = ({ queue, user, onUpdateQueue }) => {
  const isAdmin = user?.rol === 'dueño' || user?.rol === 'admin';
  const handleAction = async (id, action) => {
    if (action === 'delete') await fetch(`/api/musica?id=${id}`, { method: 'DELETE' });
    else await fetch('/api/musica', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
    onUpdateQueue();
  };
  return (
    <div className="p-8 max-w-4xl mx-auto"><h2 className="text-4xl font-black mb-12 uppercase italic text-center">Rockola</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-12"><div className="glass-card p-10 flex flex-col items-center"><div className="bg-white p-4 rounded-3xl mb-6 shadow-neon-glow"><QRCode value={window.location.origin + "/music-box"} size={200} /></div><p className="font-black text-xl uppercase italic">Escanea para elegir!</p></div><div className="space-y-3">{queue.map((song, i) => (<div key={song.id} className="glass-card p-4 flex justify-between items-center bg-white/5 border-none"><div className="flex items-center gap-3"><span className="text-billar-purple font-black">{i+1}</span><p className="font-bold text-sm truncate">{song.title}</p></div>{isAdmin && (<div className="flex gap-2"><button onClick={() => handleAction(song.id, 'delete')} className="text-red-500 p-2"><Trash2 size={18} /></button></div>)}</div>))}</div></div></div>
  );
};

const HistoryView = () => {
  const [data, setData] = useState({ total_dia: 0, ventas_efectivo: 0, ventas_nequi: 0, creditos_generados: 0 });
  useEffect(() => { fetch('/api/caja').then(r => r.json()).then(d => d && setData(d)); }, []);
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter">Caja <span className="text-emerald-500">Diaria</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <div className="glass-card p-8 border-emerald-500/10 bg-emerald-500/5 text-center"><p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Efectivo</p><p className="text-4xl font-black italic tracking-tighter">${data.ventas_efectivo}</p></div>
         <div className="glass-card p-8 border-blue-500/10 bg-blue-500/5 text-center"><p className="text-[10px] font-black text-blue-500 uppercase mb-2">Nequi/Paga</p><p className="text-4xl font-black italic tracking-tighter">${data.ventas_nequi}</p></div>
         <div className="glass-card p-8 border-amber-500/10 bg-amber-500/5 text-center"><p className="text-[10px] font-black text-amber-500 uppercase mb-2">Fiados Hoy</p><p className="text-4xl font-black italic tracking-tighter">${data.creditos_generados}</p></div>
      </div>
      <div className="glass-card p-16 text-center border-emerald-500/20 bg-emerald-500/10">
         <p className="text-xs font-black text-slate-500 uppercase mb-4 tracking-[0.3em]">Total en Caja Hoy</p>
         <p className="text-8xl font-black italic text-emerald-400 tracking-tighter">${data.total_dia}</p>
      </div>
    </div>
  );
};

const CreditsView = ({ creditos, onUpdate }) => {
  const handlePay = async (id, val) => {
    await fetch('/api/caja?type=creditos', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_credito: id, valor_abono: val, metodo_pago: 'efectivo' }) });
    onUpdate();
  };
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tighter">Lista de <span className="text-amber-500">Fiados</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditos.map(c => (
          <div key={c.id} className="glass-card p-8 flex flex-col justify-between border-amber-500/10 bg-amber-500/5">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 font-black text-2xl">{c.persona_nombre[0]}</div>
              <div className="text-right"><p className="text-3xl font-black text-white italic tracking-tighter">${c.valor}</p></div>
            </div>
            <div>
               <p className="font-black text-lg italic uppercase line-clamp-1">{c.persona_nombre}</p>
               <p className="text-[10px] text-slate-500 font-black mb-6 uppercase">{new Date(c.fecha_credito).toLocaleDateString()}</p>
               <button onClick={() => handlePay(c.id, c.valor)} className="w-full bg-amber-500 text-black font-black py-3 rounded-xl text-[10px] transition-all uppercase tracking-widest hover:scale-105 active:scale-95 shadow-neon-glow">COBRAR DEUDA</button>
            </div>
          </div>
        ))}
        {creditos.length === 0 && <div className="col-span-3 py-20 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-widest">Sin deudas pendientes</p></div>}
      </div>
    </div>
  );
};

const UsersView = ({ user }) => {
  const [userList, setUserList] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', rol: 'mesero', nombre: '' });
  const refresh = async () => {
    const res = await fetch('/api/auth', { headers: { 'Authorization': `Bearer ${localStorage.getItem('billar_token') || ''}` } });
    if (res.ok) setUserList(await res.json());
  };
  useEffect(() => { refresh(); }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('/api/auth', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('billar_token') || ''}` },
      body: JSON.stringify(form)
    });
    setForm({ username: '', password: '', rol: 'mesero', nombre: '' }); refresh();
  };
  const handleDelete = async (id) => { if (window.confirm('Delete?')) { await fetch(`/api/auth?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('billar_token') || ''}` } }); refresh(); } };
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-black uppercase italic mb-10 tracking-tighter">Personal del <span className="text-billar-neon">Negocio</span></h2>
      <form onSubmit={handleCreate} className="glass-card p-8 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end border-white/5 bg-white/[0.01]">
         <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre</label><input className="w-full neon-input py-2" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
         <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Pass</label><input type="password" className="w-full neon-input py-2" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
         <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Rol</label><select className="w-full neon-input py-2" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}><option value="mesero">Mesero</option><option value="admin">Administrador</option><option value="contador">Contador</option></select></div>
         <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Username</label><input className="w-full neon-input py-2" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div>
         <button className="md:col-span-2 neon-button py-3 uppercase font-black italic tracking-tighter">AGREGAR PERSONAL</button>
      </form>
      <div className="space-y-3">
        {userList.map(u => (
          <div key={u.id} className="glass-card p-5 flex justify-between items-center bg-white/[0.03] border-white/5">
             <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500"><User size={20} /></div><div><p className="font-bold text-lg italic uppercase leading-none">{u.nombre}</p><p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{u.username} • {u.rol}</p></div></div>
             {u.rol !== 'dueño' && <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"><Trash size={18} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
};

const SettlementModal = ({ isOpen, table, onClose, onConfirm, personas }) => {
  const [data, setData] = useState(null);
  const [payouts, setPayouts] = useState([]);
  useEffect(() => {
    if (isOpen && table) {
      fetch(`/api/partidas?action=summary&id_partida=${table.partida_id}`).then(res => res.json()).then(d => {
           setData(d);
           const initial = [];
           d.parejas?.forEach(p => {
              const subConsumo = d.consumos?.find(c => c.id_pareja === p.id)?.subtotal || 0;
              const gano = d.resultados?.find(r => r.id_pareja_ganadora === p.id)?.chicos_ganados || 0;
              const totalChicos = d.resultados?.reduce((acc, r) => acc + parseInt(r.chicos_ganados || 0), 0) || 0;
              const lost = totalChicos - gano;
              const total = parseFloat(subConsumo) + (lost * (d.valor_chico || 1000));
              initial.push({ tipo: 'pareja', id_pareja: p.id, nombre: `Pareja ${p.nombre}`, total, estado: 'pagada', metodo_pago: 'efectivo', id_persona: null });
           });
           d.consumos?.filter(c => c.tipo_consumo === 'persona').forEach(c => {
              initial.push({ tipo: 'persona', id_persona: c.id_persona, nombre: `Jugador ${c.id_persona}`, total: parseFloat(c.subtotal), estado: 'pagada', metodo_pago: 'efectivo' });
           });
           setPayouts(initial);
      });
    }
  }, [isOpen, table]);
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-4xl max-h-[90vh] bg-billar-dark overflow-hidden flex flex-col border-white/5">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5"><h2 className="text-3xl font-black italic uppercase italic tracking-tighter underline decoration-billar-neon decoration-4">Cierre de <span className="text-billar-neon">Cuenta</span></h2>{table.nombre}<button onClick={onClose}><X /></button></div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {payouts.map((p, i) => (
                <div key={i} className="glass-card p-6 bg-white/[0.03] border-white/10">
                   <div className="flex justify-between items-start mb-6"><div><p className="text-[9px] font-black text-slate-600 uppercase mb-1">{p.tipo === 'pareja' ? 'Cuenta Pareja' : 'Individual'}</p><h4 className="text-xl font-black italic uppercase">{p.nombre}</h4></div><p className="text-3xl font-black text-billar-neon">${p.total}</p></div>
                   <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setPayouts(payouts.map((x, j) => i === j ? {...x, estado: 'pagada'} : x))} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${p.estado === 'pagada' ? 'bg-emerald-500 text-black' : 'bg-white/5'}`}>PAGAR HOY</button>
                        <button onClick={() => setPayouts(payouts.map((x, j) => i === j ? {...x, estado: 'credito'} : x))} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${p.estado === 'credito' ? 'bg-amber-500 text-black' : 'bg-white/5'}`}>DEJAR FIADO</button>
                      </div>
                      {p.estado === 'pagada' && <div className="grid grid-cols-3 gap-2">{['efectivo', 'nequi', 'paga'].map(m => (<button key={m} onClick={() => setPayouts(payouts.map((x, j) => i === j ? {...x, metodo_pago: m} : x))} className={`py-2 rounded-lg text-[8px] font-black uppercase ${p.metodo_pago === m ? 'bg-white/20 text-white' : 'bg-white/5'}`}>{m}</button>))}</div>}
                      {p.estado === 'credito' && <select className="w-full neon-input py-2 text-[10px]" value={p.id_persona || ''} onChange={e => setPayouts(payouts.map((x, j) => i === j ? {...x, id_persona: e.target.value} : x))}><option value="">¿A nombre de quién?</option>{personas.map(pers => <option key={pers.id} value={pers.id}>{pers.nombre}</option>)}</select>}
                   </div>
                </div>
              ))}
           </div>
        </div>
        <div className="p-8 border-t border-white/5 bg-white/5 flex items-center justify-between"><div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total PARTIDA</p><p className="text-4xl font-black italic tracking-tighter">${payouts.reduce((acc, p) => acc + p.total, 0)}</p></div><button onClick={() => onConfirm(payouts, table.partida_id)} className="neon-button py-5 px-14 text-xl font-black italic uppercase tracking-tighter shadow-neon-glow">CERRAR Y ARCHIVAR</button></div>
      </motion.div>
    </div>
  );
};

const SaleModal = ({ isOpen, products, onClose, onConfirm, selectedTable, personas }) => {
  const [cart, setCart] = useState([]);
  const [target, setTarget] = useState({ tipo: 'pareja', id_pareja: null, id_persona: null });
  useEffect(() => { if (selectedTable) setTarget({ tipo: 'pareja', id_pareja: selectedTable.parejas?.[0]?.id, id_persona: null }); else setTarget({ tipo: 'persona', id_pareja: null, id_persona: null }); }, [selectedTable]);
  const addToCart = (p) => { const existing = cart.find(item => item.id === p.id); if (existing) setCart(cart.map(item => item.id === p.id ? { ...item, q: item.q + 1 } : item)); else setCart([...cart, { ...p, q: 1, precio: parseFloat(p.precio) }]); };
  const removeFromCart = (id) => { const existing = cart.find(item => item.id === id); if (existing.q > 1) setCart(cart.map(item => item.id === id ? { ...item, q: item.q - 1 } : item)); else setCart(cart.filter(item => item.id !== id)); };
  if (!isOpen) return null;
  const total = cart.reduce((acc, i) => acc + (i.precio * i.q), 0);
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-5xl h-[85vh] flex relative bg-billar-dark overflow-hidden border-white/5">
        <div className="flex-1 flex flex-col overflow-hidden"><div className="p-6 border-b border-white/5 flex justify-between items-center"><h2 className="text-2xl font-black italic uppercase tracking-tighter">Bar & <span className="text-emerald-500">Restaurante</span></h2>{selectedTable?.nombre || 'Venta Express'}<button onClick={onClose}><X /></button></div><div className="flex-1 p-6 overflow-y-auto bg-black/20 custom-scrollbar"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.map(p => (<button key={p.id} onClick={() => addToCart(p)} className="glass-card p-6 text-center bg-white/[0.02] border-none hover:bg-white/5 transition-all"><p className="font-black text-xs uppercase mb-1">{p.nombre}</p><p className="text-[10px] font-black text-slate-600">${p.precio}</p></button>))}</div></div></div>
        <div className="w-96 flex flex-col bg-white/[0.03] border-l border-white/5 p-8">
           <div className="space-y-4 mb-8">
              <p className="text-[10px] font-black text-slate-500 uppercase">¿Quién consume?</p>
              <div className="grid grid-cols-2 gap-2"><button onClick={() => setTarget({...target, tipo: 'pareja'})} className={`py-2 rounded-xl text-[10px] font-black uppercase ${target.tipo === 'pareja' ? 'bg-billar-neon text-black' : 'bg-white/5'}`}>Pareja</button><button onClick={() => setTarget({...target, tipo: 'persona'})} className={`py-2 rounded-xl text-[10px] font-black uppercase ${target.tipo === 'persona' ? 'bg-billar-neon text-black' : 'bg-white/5'}`}>Persona</button></div>
              {target.tipo === 'pareja' && selectedTable && <select className="neon-input w-full py-2 text-xs" value={target.id_pareja || ''} onChange={e => setTarget({...target, id_pareja: e.target.value})}>{selectedTable.parejas?.map(p => <option key={p.id} value={p.id}>Pareja {p.nombre}</option>)}</select>}
              <select className="neon-input w-full py-2 text-xs" value={target.id_persona || ''} onChange={e => setTarget({...target, id_persona: e.target.value})}><option value="">Seleccionar Jugador...</option>{personas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select>
           </div>
           <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar border-t border-white/5 pt-6">{cart.map(item => (<div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl"><div><p className="font-black text-[10px] uppercase">{item.nombre}</p><p className="text-[9px] font-black text-slate-500">{item.q} X ${item.precio}</p></div><div className="flex gap-2"><button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-red-500 transition-all">-</button><button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-emerald-500 transition-all">+</button></div></div>))}</div>
           <div className="mt-8 pt-6 border-t border-white/10"><div className="flex justify-between items-end mb-6"><p className="text-slate-500 text-[10px] font-black uppercase">Subtotal</p><p className="text-4xl font-black text-billar-neon italic tracking-tighter">${total}</p></div><button disabled={cart.length === 0} onClick={() => onConfirm(cart, target)} className="w-full neon-button py-5 text-xl font-black italic uppercase shadow-neon-glow">CONFIRMAR PEDIDO</button></div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Modals & Global Views ---

const StartMatchModal = ({ isOpen, tableId, onClose, onConfirm }) => {
  const [precioChico, setPrecioChico] = useState(1000);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 w-full max-w-md border-billar-neon/20">
        <h2 className="text-3xl font-black italic uppercase italic tracking-tighter mb-8 text-center text-billar-neon underline decoration-4 underline-offset-8">Abrir Mesa</h2>
        <div className="space-y-6">
          <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Precio por Chico ($)</label><input type="number" className="w-full neon-input py-4 text-center text-2xl" value={precioChico} onChange={e => setPrecioChico(e.target.value)} /></div>
          <button onClick={() => onConfirm(tableId, { precioChico })} className="w-full neon-button py-5 text-xl font-black italic uppercase tracking-tighter shadow-neon-glow">EMPEZAR PARTIDA</button>
          <button onClick={onClose} className="w-full py-2 text-xs font-black text-slate-500 uppercase hover:text-white transition-all">Cancelar</button>
        </div>
      </motion.div>
    </div>
  );
};

const LoginView = ({ onLogin, onGoToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form }) });
      const data = await res.json();
      if (res.ok) onLogin(data); else setError(data.error || 'Error de acceso');
    } catch (e) { setError('Error de conexión'); } finally { setLoading(false); }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-billar-dark p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-billar-neon/5 blur-[120px] rounded-full" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-12 w-full max-w-md relative z-10 border-white/5 bg-white/[0.02]">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-billar-neon rounded-2xl flex items-center justify-center shadow-neon-glow mb-6 text-5xl">🎱</div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">BILLAR <span className="text-billar-neon">BRUJO</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Point of Sale Professional</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Usuario</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} /><input className="w-full neon-input py-3 pl-12" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div></div>
          <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Contraseña</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} /><input type="password" className="w-full neon-input py-3 pl-12" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div></div>
          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
          <button disabled={loading} className="w-full neon-button py-5 text-xl font-black italic uppercase tracking-tighter shadow-neon-glow">{loading ? 'Entrando...' : 'Iniciar Sesión'}</button>
        </form>
        <button onClick={onGoToRegister} className="w-full mt-8 text-[9px] font-black text-slate-600 uppercase hover:text-billar-neon transition-all">¿Eres el dueño? Regístrate aquí</button>
      </motion.div>
    </div>
  );
};

const RegisterOwnerView = ({ onBack }) => {
  const [form, setForm] = useState({ username: '', password: '', nombre: '', secretKey: '' });
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth?action=register-owner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form }) });
      if (res.ok) { alert('Exito! Ahora inicia sesión'); onBack(); } else { const d = await res.json(); setError(d.error); }
    } catch (e) { setError('Error de registro'); }
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-billar-dark p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 w-full max-w-md border-emerald-500/20 bg-emerald-500/[0.02]">
        <h2 className="text-3xl font-black uppercase italic text-center mb-8">Registro de <span className="text-emerald-400">Dueño</span></h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full neon-input py-3 px-4" placeholder="Nombre Completo" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input className="w-full neon-input py-3 px-4" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" className="w-full neon-input py-3 px-4" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <input type="password" className="w-full neon-input py-3 px-4" placeholder="Llave de Seguridad" value={form.secretKey} onChange={e => setForm({...form, secretKey: e.target.value})} required />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl uppercase tracking-widest italic shadow-lg shadow-emerald-500/20">Registrar Dueño</button>
          <button type="button" onClick={onBack} className="w-full py-2 text-[10px] font-black text-slate-500 uppercase">Volver</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- App ---

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [currentView, setCurrentView] = useState('dashboard');
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [queue, setQueue] = useState([]);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [settlementModalOpen, setSettlementModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isTVMode] = useState(window.location.pathname === '/tv');

  const fetchData = async () => {
    try {
      const [pRes, prodRes, qRes, persRes, credRes] = await Promise.all([
        fetch('/api/partidas'), 
        fetch('/api/negocio?type=products'), 
        fetch('/api/musica'), 
        fetch('/api/negocio?type=personas'), 
        fetch('/api/caja?type=creditos')
      ]);
      if (pRes.ok) setTables(await pRes.ok ? await pRes.json() : []);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (persRes.ok) setPersonas(await persRes.json());
      if (credRes.ok) setCreditos(await credRes.json());
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

  const handleUpdateScore = async (partidaId, score1, score2) => {
    await fetch('/api/partidas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partidaId, accion: 'update_score', score1, score2 }) });
    fetchData();
  };

  const handleStartMatch = async (tableId, formData) => {
    await fetch('/api/partidas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'start', mesaId: tableId, valorChico: parseInt(formData.precioChico || 1000) }) });
    setMatchModalOpen(false); fetchData();
  };

  const handleRegistrarChico = async (partidaId, id_pareja_ganadora) => {
    await fetch('/api/partidas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partidaId, accion: 'registrar_chico', id_pareja_ganadora }) });
    fetchData();
  };

  const handleAddConsumo = async (consumo) => {
    await fetch('/api/partidas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...consumo, type: 'consumo' }) });
    fetchData();
  };

  const handleOrderConfirm = async (payouts, partidaId) => {
    await fetch('/api/partidas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'settle', id_partida: partidaId, pagos: payouts }) });
    setSettlementModalOpen(false); fetchData();
  };

  if (isTVMode) return <TVView tables={tables} queue={queue} onSongEnd={id => fetch('/api/musica', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'played' }) }).then(fetchData)} />;
  if (view === 'login') return <LoginView onLogin={u => { setUser(u.user); setView('dashboard'); localStorage.setItem('billar_user', JSON.stringify(u.user)); localStorage.setItem('billar_token', u.token); }} onGoToRegister={() => setView('register')} />;
  if (view === 'register') return <RegisterOwnerView onBack={() => setView('login')} />;

  const isOwner = user?.rol === 'dueño';

  return (
    <div className="min-h-screen bg-billar-dark flex flex-col selection:bg-billar-neon font-sans text-white">
      <Navbar user={user} onLogout={() => { setUser(null); setView('login'); localStorage.removeItem('billar_user'); localStorage.removeItem('billar_token'); }} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-white/5 bg-billar-card/30 hidden lg:block overflow-y-auto">
          <div className="py-6 h-full flex flex-col">
            <SidebarItem icon={TableIcon} label="Mesas" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <SidebarItem icon={Monitor} label="TV Control" active={currentView === 'tv-control'} onClick={() => setCurrentView('tv-control')} />
            <SidebarItem icon={ShoppingCart} label="Venta Express" onClick={() => { setSelectedTable(null); setSaleModalOpen(true); }} />
            <SidebarItem icon={Package} label="Inventario" active={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} />
            <SidebarItem icon={Music} label="Rockola" active={currentView === 'music'} onClick={() => setCurrentView('music')} />
            <SidebarItem icon={History} label="Caja Diaria" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
            <SidebarItem icon={Users} label="Deudores" active={currentView === 'credits'} onClick={() => setCurrentView('credits')} />
            {isOwner && <SidebarItem icon={Settings} label="Personal" active={currentView === 'users'} onClick={() => setCurrentView('users')} />}
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-white/[0.01] custom-scrollbar">
          <AnimatePresence mode="wait"><motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {currentView === 'dashboard' && <DashboardView tables={tables} onStartMatch={id => { setSelectedTable(id); setMatchModalOpen(true); }} onSettleMatch={t => { setSelectedTable(t); setSettlementModalOpen(true); }} onAddConsumo={t => { setSelectedTable(t); setSaleModalOpen(true); }} onNewSale={() => { setSelectedTable(null); setSaleModalOpen(true); }} onRegistrarChico={handleRegistrarChico} />}
              {currentView === 'tv-control' && <TVControllerView tables={tables} onUpdateScore={handleUpdateScore} />}
              {currentView === 'inventory' && <ProductsView products={products} onUpdate={fetchData} />}
              {currentView === 'music' && <MusicView queue={queue} user={user} onUpdateQueue={fetchData} />}
              {currentView === 'history' && <HistoryView />}
              {currentView === 'credits' && <CreditsView creditos={creditos} onUpdate={fetchData} />}
              {currentView === 'users' && <UsersView user={user} />}
          </motion.div></AnimatePresence>
        </main>
      </div>
      <StartMatchModal isOpen={matchModalOpen} tableId={selectedTable} onClose={() => setMatchModalOpen(false)} onConfirm={handleStartMatch} />
      <SaleModal isOpen={saleModalOpen} products={products} onClose={() => setSaleModalOpen(false)} onConfirm={(cart, target) => { cart.forEach(item => { handleAddConsumo({ id_partida: selectedTable?.partida_id, tipo_consumo: target.tipo, id_persona: target.id_persona, id_pareja: target.id_pareja, id_producto: item.id, cantidad: item.q, precio_unitario: item.precio }); }); setSaleModalOpen(false); }} selectedTable={selectedTable} personas={personas} />
      <SettlementModal isOpen={settlementModalOpen} table={selectedTable} onClose={() => setSettlementModalOpen(false)} onConfirm={handleOrderConfirm} personas={personas} />
    </div>
  );
}
