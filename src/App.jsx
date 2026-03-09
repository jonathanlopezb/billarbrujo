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
  Settings
} from 'lucide-react';
import QRCode from 'react-qr-code';

// Constants
const ROLES = {
  OWNER: 'dueño',
  ADMIN: 'admin',
  WAITRESS: 'mesero'
};

// --- Mock Data (Replace with DB calls) ---
const INITIAL_TABLES = [
  { id: 1, name: 'Mesa 1', status: 'available', players: [], startTime: null },
  { id: 2, name: 'Mesa 2', status: 'playing', players: ['Juan', 'Pedro'], startTime: Date.now() - 3600000, score: [15, 12] },
  { id: 3, name: 'Mesa 3', status: 'available', players: [], startTime: null },
  { id: 4, name: 'Mesa 4', status: 'playing', players: ['Carlos', 'Ana'], startTime: Date.now() - 1800000, score: [8, 10] },
];

const INITIAL_QUEUE = [
  { id: 1, title: 'La Bilirrubina - Juan Luis Guerra', requestedBy: 'Mesa 2' },
  { id: 2, title: 'Cali Pachanguero - Grupo Niche', requestedBy: 'Barra' },
];

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
      { label: 'Ingresos Hoy', value: '$450.000', icon: DollarSign, color: 'text-emerald-400' },
      { label: 'Mesas Ocupadas', value: '3/4', icon: TableIcon, color: 'text-billar-neon' },
      { label: 'Fiados Pendientes', value: '$85.000', icon: CreditCard, color: 'text-amber-400' },
      { label: 'Canciones en Cola', value: '12', icon: Music, color: 'text-purple-400' },
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

const TableCard = ({ table }) => {
  const isPlaying = table.status === 'playing';
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
                <p className="text-[10px] text-slate-500 uppercase font-black">{table.players[0]}</p>
                <p className="text-2xl font-black">{table.score[0]}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black">{table.players[1]}</p>
                <p className="text-2xl font-black">{table.score[1]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={14} className="text-billar-neon" />
              <span className="text-sm font-mono tracking-tighter">01:45:22</span>
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

const MusicView = ({ queue }) => (
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
          {queue.map((song, i) => (
            <div key={song.id} className="glass-card p-4 flex items-center gap-4 bg-white/5 border-none">
              <div className="w-10 h-10 bg-billar-purple/20 flex items-center justify-center rounded-lg text-billar-purple font-black">
                {i + 1}
              </div>
              <div>
                <p className="font-bold text-sm">{song.title}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Pedido por: {song.requestedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TVView = ({ tables, queue }) => (
  <div className="fixed inset-0 bg-[#05060a] z-[100] flex overflow-hidden">
    {/* Left Side: Games */}
    <div className="w-2/3 p-12 overflow-hidden border-r border-white/5">
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🎱</span>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase underline decoration-billar-neon decoration-8 underline-offset-8">
            MESAS ACTIVAS
          </h1>
        </div>
        <div className="text-right">
          <p className="text-6xl font-black font-mono text-billar-neon">17:45</p>
          <p className="text-sm font-bold text-slate-500 tracking-[0.5em] uppercase">Lunes 09 Mar</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {tables.filter(t => t.status === 'playing').concat(tables.filter(t => t.status !== 'playing')).slice(0, 4).map(table => (
          <div key={table.id} className={`glass-card p-10 relative overflow-hidden ${table.status === 'playing' ? 'bg-billar-neon/5 border-billar-neon/20 shadow-neon-glow' : 'opacity-40'}`}>
            <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
              {table.name}
              {table.status === 'playing' && <div className="w-3 h-3 bg-billar-neon rounded-full animate-ping" />}
            </h3>

            {table.status === 'playing' ? (
              <div className="space-y-10">
                <div className="flex justify-between items-center gap-8">
                  <div className="flex-1 text-center space-y-2">
                    <p className="text-6xl font-black">{table.score[0]}</p>
                    <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{table.players[0]}</p>
                  </div>
                  <div className="text-2xl font-black text-slate-700">VS</div>
                  <div className="flex-1 text-center space-y-2">
                    <p className="text-6xl font-black">{table.score[1]}</p>
                    <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{table.players[1]}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 bg-white/5 py-3 rounded-2xl">
                   <Clock className="text-billar-neon" size={32} />
                   <p className="text-4xl font-black font-mono tracking-tighter text-white/80">01:45:22</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-2xl font-black text-slate-600 tracking-widest">DISPONIBLE</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Right Side: Music */}
    <div className="w-1/3 bg-billar-card/80 p-12 flex flex-col">
       <div className="mb-12">
          <h2 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-3">
             <Music className="text-billar-purple" size={32} />
             LISTA DE <span className="text-billar-purple">MÚSICA</span>
          </h2>
          
          <div className="glass-card overflow-hidden bg-billar-purple/10 border-billar-purple/20 p-8 mb-12">
             <p className="text-[10px] font-black text-billar-purple uppercase tracking-[0.3em] mb-2">Suena Ahora</p>
             <h4 className="text-2xl font-black mb-4">Cali Pachanguero</h4>
             <p className="text-sm font-bold text-white/40 uppercase">Grupo Niche</p>
          </div>
       </div>

       <div className="flex-1 space-y-4">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Siguientes Canciones</p>
          {queue.map((song, i) => (
            <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all">
               <span className="text-2xl font-black text-slate-700">0{i+2}</span>
               <div className="flex-1">
                  <p className="font-bold text-lg">{song.title}</p>
                  <p className="text-[10px] font-black text-billar-purple/60 uppercase">Mesa 4</p>
               </div>
            </div>
          ))}
       </div>

       <div className="mt-auto pt-8 border-t border-white/5 flex items-center gap-6">
          <div className="bg-white p-2 rounded-lg">
             <QRCode value={window.location.origin + "/music-box"} size={80} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-tighter">¿Quieres tu canción?</p>
            <p className="text-xs text-slate-500">Escanea el código para pedirla gratis.</p>
          </div>
       </div>
    </div>
  </div>
);

const CreditsView = () => (
  <div className="p-8">
    <div className="mb-8">
      <h2 className="text-3xl font-black mb-1 italic">SISTEMA DE <span className="text-amber-400">CRÉDITOS</span></h2>
      <p className="text-slate-400 text-sm">Registro de fiados y abonos de clientes frecuentes.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Client List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="relative mb-6">
          <input type="text" placeholder="Buscar cliente..." className="w-full neon-input pl-12 bg-white/5" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        </div>
        
        {[
          { name: 'Don Roberto', debt: 45000, lastOrder: 'hace 2 días' },
          { name: 'Andrés "El Flaco"', debt: 12000, lastOrder: 'hace 4 horas' },
          { name: 'Ricardo Gómez', debt: 28000, lastOrder: 'hace 1 día' },
        ].map((client, i) => (
          <div key={i} className="glass-card p-6 flex items-center justify-between border-none bg-white/5 hover:bg-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center font-black">
                {client.name[0]}
              </div>
              <div>
                <h4 className="font-bold">{client.name}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Último consumo: {client.lastOrder}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-amber-400 tracking-tighter">${client.debt.toLocaleString()}</p>
              <button className="text-[10px] font-black text-billar-neon uppercase hover:underline">Ver Historial</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Summary & Action */}
      <div className="space-y-6">
        <div className="glass-card p-6 bg-amber-400/5 border-amber-400/20">
          <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-4">Resumen de deuda</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total por cobrar:</span>
              <span className="font-bold text-white">$85.000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Clientes activos:</span>
              <span className="font-bold text-white">14</span>
            </div>
          </div>
          <button className="w-full bg-amber-400 text-billar-dark font-black py-3 rounded-lg mt-6 shadow-lg shadow-amber-400/20 hover:scale-[1.02] transition-all">
            REGISTRAR ABONO
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState({ nombre: 'Jonathan Lopez', rol: ROLES.OWNER });
  const [currentView, setCurrentView] = useState('dashboard');
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [isTVMode, setIsTVMode] = useState(false);

  // Check URL hash or query for TV mode
  useEffect(() => {
    if (window.location.pathname === '/tv') {
      setIsTVMode(true);
    }
  }, []);

  if (isTVMode) {
    return <TVView tables={tables} queue={queue} />;
  }

  return (
    <div className="min-h-screen bg-billar-dark flex flex-col">
      <Navbar user={user} onLogout={() => console.log('Logout')} />
      
      <div className="flex flex-1">
        {/* Sidebar */}
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
               <div                     onClick={() => window.open('/tv', '_blank')}
 className="flex items-center gap-2 text-billar-purple font-black text-xs uppercase tracking-widest mb-2 cursor-pointer hover:underline">
                  <Monitor size={14} /> Abrir Vista TV
               </div>
               <p className="text-[10px] text-slate-500">Configura la pantalla grande para tus clientes.</p>
            </div>
          </div>
        </aside>

        {/* View Content */}
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
              {currentView === 'music' && <MusicView queue={queue} />}
              {currentView === 'credits' && <CreditsView />}
              {/* Other views would be here */}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
