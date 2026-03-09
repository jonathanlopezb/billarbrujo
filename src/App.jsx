import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================
// DATOS INICIALES
// ============================================
const PRODUCTOS = [
  { id: 1, nombre: 'Cerveza', precio: 3000, emoji: '🍺', categoria: 'bebidas' },
  { id: 2, nombre: 'Gaseosa', precio: 2000, emoji: '🥤', categoria: 'bebidas' },
  { id: 3, nombre: 'Agua', precio: 1500, emoji: '💧', categoria: 'bebidas' },
  { id: 4, nombre: 'Jugo Natural', precio: 2500, emoji: '🧃', categoria: 'bebidas' },
  { id: 5, nombre: 'Café', precio: 1800, emoji: '☕', categoria: 'bebidas' },
  { id: 6, nombre: 'Aguardiente', precio: 5000, emoji: '🥃', categoria: 'bebidas' },
  { id: 7, nombre: 'Limonada', precio: 2200, emoji: '🍋', categoria: 'bebidas' },
  { id: 8, nombre: 'Empanada', precio: 2000, emoji: '🥟', categoria: 'snacks' },
  { id: 9, nombre: 'Papas', precio: 3000, emoji: '🍟', categoria: 'snacks' },
  { id: 10, nombre: 'Hamburguesa', precio: 8000, emoji: '🍔', categoria: 'snacks' },
  { id: 11, nombre: 'Perro Caliente', precio: 6000, emoji: '🌭', categoria: 'snacks' },
  { id: 12, nombre: 'Nachos', precio: 4000, emoji: '🧀', categoria: 'snacks' },
  { id: 13, nombre: 'Maní', precio: 1500, emoji: '🥜', categoria: 'snacks' },
  { id: 14, nombre: 'Chicle', precio: 500, emoji: '🍬', categoria: 'otros' },
  { id: 15, nombre: 'Cigarrillos', precio: 1000, emoji: '🚬', categoria: 'otros' },
]

const MESAS_INICIALES = [
  { id: 1, nombre: 'Mesa 1' },
  { id: 2, nombre: 'Mesa 2' },
  { id: 3, nombre: 'Mesa 3' },
  { id: 4, nombre: 'Mesa 4' },
]

const TARIFA_POR_HORA = 15000 // pesos por hora

// ============================================
// UTILIDADES
// ============================================
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function formatMoney(amount) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)
}

function calcularCostoMesa(seconds) {
  const horas = seconds / 3600
  return Math.ceil(horas * TARIFA_POR_HORA)
}

// ============================================
// ICONOS SVG INLINE
// ============================================
const Icons = {
  Table: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  ),
  ShoppingBag: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  DollarSign: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Monitor: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  ),
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  ),
  Square: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Minus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  ),
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function App() {
  // Determinar si es vista TV
  const [isTV, setIsTV] = useState(window.location.hash === '#tv')

  useEffect(() => {
    const handleHash = () => setIsTV(window.location.hash === '#tv')
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  if (isTV) return <TVView />
  return <MainApp />
}

// ============================================
// APP PRINCIPAL (CAJERA / MESERA)
// ============================================
function MainApp() {
  const [view, setView] = useState('mesas')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mesas, setMesas] = useState(() => {
    const saved = localStorage.getItem('billar_mesas')
    if (saved) return JSON.parse(saved)
    return MESAS_INICIALES.map(m => ({
      ...m,
      activa: false,
      tiempoInicio: null,
      segundos: 0,
      jugador1: '',
      jugador2: '',
      scoreJ1: 0,
      scoreJ2: 0,
      pedidos: [],
      juegos: 0,
    }))
  })
  const [barOrders, setBarOrders] = useState(() => {
    const saved = localStorage.getItem('billar_bar')
    return saved ? JSON.parse(saved) : []
  })
  const [historial, setHistorial] = useState(() => {
    const saved = localStorage.getItem('billar_historial')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedMesa, setSelectedMesa] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showBarModal, setShowBarModal] = useState(false)
  const [clock, setClock] = useState('')

  // Reloj
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Timer de mesas activas
  useEffect(() => {
    const id = setInterval(() => {
      setMesas(prev => prev.map(m => {
        if (!m.activa || !m.tiempoInicio) return m
        const elapsed = Math.floor((Date.now() - m.tiempoInicio) / 1000)
        return { ...m, segundos: elapsed }
      }))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Guardar en localStorage
  useEffect(() => { localStorage.setItem('billar_mesas', JSON.stringify(mesas)) }, [mesas])
  useEffect(() => { localStorage.setItem('billar_bar', JSON.stringify(barOrders)) }, [barOrders])
  useEffect(() => { localStorage.setItem('billar_historial', JSON.stringify(historial)) }, [historial])

  const iniciarMesa = (mesaId, j1, j2) => {
    setMesas(prev => prev.map(m =>
      m.id === mesaId
        ? { ...m, activa: true, tiempoInicio: Date.now(), segundos: 0, jugador1: j1 || 'Jugador 1', jugador2: j2 || 'Jugador 2', scoreJ1: 0, scoreJ2: 0, juegos: m.juegos + 1 }
        : m
    ))
  }

  const detenerMesa = (mesaId) => {
    const mesa = mesas.find(m => m.id === mesaId)
    if (!mesa) return
    const costoMesa = calcularCostoMesa(mesa.segundos)
    const costoProductos = mesa.pedidos.reduce((sum, p) => sum + p.precio * p.cantidad, 0)
    const registro = {
      id: Date.now(),
      mesa: mesa.nombre,
      jugador1: mesa.jugador1,
      jugador2: mesa.jugador2,
      scoreJ1: mesa.scoreJ1,
      scoreJ2: mesa.scoreJ2,
      tiempo: formatTime(mesa.segundos),
      costoMesa,
      costoProductos,
      total: costoMesa + costoProductos,
      pedidos: [...mesa.pedidos],
      fecha: new Date().toLocaleString('es-CO'),
    }
    setHistorial(prev => [registro, ...prev])
    setMesas(prev => prev.map(m =>
      m.id === mesaId
        ? { ...m, activa: false, tiempoInicio: null, segundos: 0, jugador1: '', jugador2: '', scoreJ1: 0, scoreJ2: 0, pedidos: [] }
        : m
    ))
  }

  const agregarProductoMesa = (mesaId, producto) => {
    setMesas(prev => prev.map(m => {
      if (m.id !== mesaId) return m
      const existing = m.pedidos.find(p => p.id === producto.id)
      if (existing) {
        return { ...m, pedidos: m.pedidos.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p) }
      }
      return { ...m, pedidos: [...m.pedidos, { ...producto, cantidad: 1 }] }
    }))
  }

  const quitarProductoMesa = (mesaId, productoId) => {
    setMesas(prev => prev.map(m => {
      if (m.id !== mesaId) return m
      const p = m.pedidos.find(p => p.id === productoId)
      if (p && p.cantidad > 1) {
        return { ...m, pedidos: m.pedidos.map(p => p.id === productoId ? { ...p, cantidad: p.cantidad - 1 } : p) }
      }
      return { ...m, pedidos: m.pedidos.filter(p => p.id !== productoId) }
    }))
  }

  const updateScore = (mesaId, jugador, delta) => {
    setMesas(prev => prev.map(m => {
      if (m.id !== mesaId) return m
      if (jugador === 1) return { ...m, scoreJ1: Math.max(0, m.scoreJ1 + delta) }
      return { ...m, scoreJ2: Math.max(0, m.scoreJ2 + delta) }
    }))
  }

  // Ventas de barra (personas sin mesa)
  const crearPedidoBarra = (clienteNombre) => {
    const newOrder = {
      id: Date.now(),
      cliente: clienteNombre || `Cliente ${barOrders.length + 1}`,
      pedidos: [],
      fecha: new Date().toLocaleString('es-CO'),
    }
    setBarOrders(prev => [...prev, newOrder])
    return newOrder.id
  }

  const agregarProductoBarra = (orderId, producto) => {
    setBarOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const existing = o.pedidos.find(p => p.id === producto.id)
      if (existing) {
        return { ...o, pedidos: o.pedidos.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p) }
      }
      return { ...o, pedidos: [...o.pedidos, { ...producto, cantidad: 1 }] }
    }))
  }

  const quitarProductoBarra = (orderId, productoId) => {
    setBarOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const p = o.pedidos.find(p => p.id === productoId)
      if (p && p.cantidad > 1) {
        return { ...o, pedidos: o.pedidos.map(p => p.id === productoId ? { ...p, cantidad: p.cantidad - 1 } : p) }
      }
      return { ...o, pedidos: o.pedidos.filter(p => p.id !== productoId) }
    }))
  }

  const cerrarPedidoBarra = (orderId) => {
    const order = barOrders.find(o => o.id === orderId)
    if (!order) return
    const total = order.pedidos.reduce((sum, p) => sum + p.precio * p.cantidad, 0)
    const registro = {
      id: Date.now(),
      mesa: `Barra: ${order.cliente}`,
      jugador1: '',
      jugador2: '',
      scoreJ1: 0,
      scoreJ2: 0,
      tiempo: '-',
      costoMesa: 0,
      costoProductos: total,
      total,
      pedidos: [...order.pedidos],
      fecha: order.fecha,
    }
    setHistorial(prev => [registro, ...prev])
    setBarOrders(prev => prev.filter(o => o.id !== orderId))
  }

  // Stats
  const mesasActivas = mesas.filter(m => m.activa).length
  const totalHoy = historial.reduce((sum, h) => sum + h.total, 0)
  const totalProductos = historial.reduce((sum, h) => sum + h.costoProductos, 0)
  const totalMesas = historial.reduce((sum, h) => sum + h.costoMesa, 0)

  const navItems = [
    { id: 'mesas', label: 'Mesas de Billar', icon: <Icons.Table /> },
    { id: 'barra', label: 'Ventas de Barra', icon: <Icons.ShoppingBag /> },
    { id: 'contabilidad', label: 'Contabilidad', icon: <Icons.DollarSign /> },
    { id: 'tv', label: 'Vista TV', icon: <Icons.Monitor />, action: () => window.open('#tv', '_blank') },
  ]

  return (
    <div className="app-container">
      {/* Sidebar Toggle (mobile) */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Icons.Menu />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🎱</div>
          <div>
            <h1>El Divino Niño</h1>
            <span className="subtitle">Sistema de Gestión</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Principal</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id && !item.action ? 'active' : ''}`}
              onClick={() => {
                if (item.action) { item.action(); return }
                setView(item.id)
                setSidebarOpen(false)
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Tarifa Mesa</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{formatMoney(TARIFA_POR_HORA)}/hora</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-bar">
          <h2>
            {view === 'mesas' && '🎱 Mesas de Billar'}
            {view === 'barra' && '🍺 Ventas de Barra'}
            {view === 'contabilidad' && '💰 Contabilidad'}
          </h2>
          <div className="top-bar-actions">
            <div className="clock-display">{clock}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card emerald">
            <div className="stat-label">Mesas Activas</div>
            <div className="stat-value emerald">{mesasActivas} / {mesas.length}</div>
          </div>
          <div className="stat-card cyan">
            <div className="stat-label">Pedidos Barra</div>
            <div className="stat-value cyan">{barOrders.length}</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-label">Ingresos del Día</div>
            <div className="stat-value amber">{formatMoney(totalHoy)}</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-label">Partidas Registradas</div>
            <div className="stat-value purple">{historial.length}</div>
          </div>
        </div>

        {/* Vistas */}
        {view === 'mesas' && (
          <MesasView
            mesas={mesas}
            onSelectMesa={(mesa) => { setSelectedMesa(mesa); setShowModal(true) }}
          />
        )}
        {view === 'barra' && (
          <BarraView
            barOrders={barOrders}
            onCrearPedido={crearPedidoBarra}
            onAgregarProducto={agregarProductoBarra}
            onQuitarProducto={quitarProductoBarra}
            onCerrarPedido={cerrarPedidoBarra}
          />
        )}
        {view === 'contabilidad' && (
          <ContabilidadView historial={historial} totalHoy={totalHoy} totalProductos={totalProductos} totalMesas={totalMesas} />
        )}
      </main>

      {/* Modal Mesa */}
      {showModal && selectedMesa && (
        <MesaModal
          mesa={mesas.find(m => m.id === selectedMesa.id)}
          onClose={() => { setShowModal(false); setSelectedMesa(null) }}
          onIniciar={iniciarMesa}
          onDetener={detenerMesa}
          onAgregarProducto={agregarProductoMesa}
          onQuitarProducto={quitarProductoMesa}
          onUpdateScore={updateScore}
        />
      )}
    </div>
  )
}

// ============================================
// VISTA: MESAS
// ============================================
function MesasView({ mesas, onSelectMesa }) {
  return (
    <div className="tables-grid">
      {mesas.map(mesa => (
        <div
          key={mesa.id}
          className={`table-card ${mesa.activa ? 'active' : ''}`}
          onClick={() => onSelectMesa(mesa)}
        >
          <div className="table-card-header">
            <span className="table-number">{mesa.nombre}</span>
            <span className="table-status-dot" />
          </div>
          {mesa.activa ? (
            <>
              <div className="table-timer">{formatTime(mesa.segundos)}</div>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <span className="badge badge-emerald">En Juego</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{mesa.jugador1}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: mesa.scoreJ1 > mesa.scoreJ2 ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>{mesa.scoreJ1}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700 }}>VS</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: mesa.scoreJ2 > mesa.scoreJ1 ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>{mesa.scoreJ2}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{mesa.jugador2}</span>
              </div>
              <div className="table-info">
                <span>Pedidos: {mesa.pedidos.length}</span>
                <span className="table-total">{formatMoney(calcularCostoMesa(mesa.segundos) + mesa.pedidos.reduce((s, p) => s + p.precio * p.cantidad, 0))}</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px', opacity: 0.3 }}>🎱</div>
              <span className="badge badge-cyan">Disponible</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// MODAL: DETALLE DE MESA
// ============================================
function MesaModal({ mesa, onClose, onIniciar, onDetener, onAgregarProducto, onQuitarProducto, onUpdateScore }) {
  const [j1, setJ1] = useState(mesa.jugador1 || '')
  const [j2, setJ2] = useState(mesa.jugador2 || '')
  const [tab, setTab] = useState('marcador')
  const [catFilter, setCatFilter] = useState('todas')

  const totalProductos = mesa.pedidos.reduce((s, p) => s + p.precio * p.cantidad, 0)
  const costoMesa = mesa.activa ? calcularCostoMesa(mesa.segundos) : 0
  const totalGeneral = costoMesa + totalProductos

  const productosFiltrados = catFilter === 'todas' ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === catFilter)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h3>🎱 {mesa.nombre}</h3>
          <button className="modal-close" onClick={onClose}><Icons.X /></button>
        </div>

        {!mesa.activa ? (
          /* Iniciar Partida */
          <div>
            <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Iniciar Nueva Partida</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Jugador 1</label>
                <input className="form-input" placeholder="Nombre..." value={j1} onChange={e => setJ1(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Jugador 2</label>
                <input className="form-input" placeholder="Nombre..." value={j2} onChange={e => setJ2(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => { onIniciar(mesa.id, j1, j2); }}>
              <Icons.Play /> Iniciar Partida
            </button>
          </div>
        ) : (
          /* Partida Activa */
          <div>
            {/* Timer y controles */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div className="table-timer" style={{ fontSize: '2.5rem' }}>{formatTime(mesa.segundos)}</div>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>En Juego • Partida #{mesa.juegos}</span>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button className={`tab ${tab === 'marcador' ? 'active' : ''}`} onClick={() => setTab('marcador')}>🏆 Marcador</button>
              <button className={`tab ${tab === 'pedidos' ? 'active' : ''}`} onClick={() => setTab('pedidos')}>🛒 Pedidos</button>
              <button className={`tab ${tab === 'resumen' ? 'active' : ''}`} onClick={() => setTab('resumen')}>💰 Resumen</button>
            </div>

            {tab === 'marcador' && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', padding: '20px 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{mesa.jugador1}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: mesa.scoreJ1 >= mesa.scoreJ2 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>{mesa.scoreJ1}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onUpdateScore(mesa.id, 1, -1)}><Icons.Minus /></button>
                    <button className="btn btn-primary btn-sm" onClick={() => onUpdateScore(mesa.id, 1, 1)}><Icons.Plus /></button>
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-muted)' }}>VS</div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{mesa.jugador2}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: mesa.scoreJ2 >= mesa.scoreJ1 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>{mesa.scoreJ2}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onUpdateScore(mesa.id, 2, -1)}><Icons.Minus /></button>
                    <button className="btn btn-primary btn-sm" onClick={() => onUpdateScore(mesa.id, 2, 1)}><Icons.Plus /></button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'pedidos' && (
              <div>
                {/* Category filter */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {['todas', 'bebidas', 'snacks', 'otros'].map(cat => (
                    <button key={cat} className={`btn btn-sm ${catFilter === cat ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCatFilter(cat)}>
                      {cat === 'todas' ? '🏷️ Todas' : cat === 'bebidas' ? '🍺 Bebidas' : cat === 'snacks' ? '🍟 Snacks' : '📦 Otros'}
                    </button>
                  ))}
                </div>

                <div className="product-grid">
                  {productosFiltrados.map(prod => (
                    <div key={prod.id} className="product-item" onClick={() => onAgregarProducto(mesa.id, prod)}>
                      <div className="product-emoji">{prod.emoji}</div>
                      <div className="product-name">{prod.nombre}</div>
                      <div className="product-price">{formatMoney(prod.precio)}</div>
                    </div>
                  ))}
                </div>

                {mesa.pedidos.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Pedidos en esta mesa:</h4>
                    <ul className="order-list">
                      {mesa.pedidos.map(p => (
                        <li key={p.id} className="order-item">
                          <span className="order-item-name">
                            {p.emoji} {p.nombre}
                            <span className="order-item-qty">x{p.cantidad}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="order-item-price">{formatMoney(p.precio * p.cantidad)}</span>
                            <button className="order-item-remove" onClick={() => onQuitarProducto(mesa.id, p.id)}><Icons.Trash /></button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {tab === 'resumen' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div className="stat-card amber">
                    <div className="stat-label">Alquiler Mesa</div>
                    <div className="stat-value amber" style={{ fontSize: '1.3rem' }}>{formatMoney(costoMesa)}</div>
                  </div>
                  <div className="stat-card cyan">
                    <div className="stat-label">Productos</div>
                    <div className="stat-value cyan" style={{ fontSize: '1.3rem' }}>{formatMoney(totalProductos)}</div>
                  </div>
                </div>

                <div className="total-bar">
                  <span className="total-label">Total General</span>
                  <span className="total-amount">{formatMoney(totalGeneral)}</span>
                </div>

                <button className="btn btn-danger btn-lg" style={{ width: '100%', marginTop: '16px' }} onClick={() => { onDetener(mesa.id); onClose() }}>
                  <Icons.Square /> Finalizar & Cobrar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// VISTA: VENTAS DE BARRA
// ============================================
function BarraView({ barOrders, onCrearPedido, onAgregarProducto, onQuitarProducto, onCerrarPedido }) {
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [clienteNombre, setClienteNombre] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [catFilter, setCatFilter] = useState('todas')

  const productosFiltrados = catFilter === 'todas' ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === catFilter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Pedidos de clientes sin mesa</h3>
        <button className="btn btn-primary" onClick={() => setShowNewOrder(true)}>
          <Icons.Plus /> Nuevo Pedido
        </button>
      </div>

      {/* Modal nuevo pedido */}
      {showNewOrder && (
        <div className="modal-overlay" onClick={() => setShowNewOrder(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Nuevo Pedido de Barra</h3>
              <button className="modal-close" onClick={() => setShowNewOrder(false)}><Icons.X /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre del Cliente</label>
              <input className="form-input" placeholder="Nombre o apodo..." value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { onCrearPedido(clienteNombre); setClienteNombre(''); setShowNewOrder(false) }}>
              <Icons.Plus /> Crear Pedido
            </button>
          </div>
        </div>
      )}

      {/* Modal agregar productos a orden de barra */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>🍺 Pedido: {selectedOrder.cliente}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}><Icons.X /></button>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {['todas', 'bebidas', 'snacks', 'otros'].map(cat => (
                <button key={cat} className={`btn btn-sm ${catFilter === cat ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCatFilter(cat)}>
                  {cat === 'todas' ? '🏷️ Todas' : cat === 'bebidas' ? '🍺 Bebidas' : cat === 'snacks' ? '🍟 Snacks' : '📦 Otros'}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {productosFiltrados.map(prod => (
                <div key={prod.id} className="product-item" onClick={() => onAgregarProducto(selectedOrder.id, prod)}>
                  <div className="product-emoji">{prod.emoji}</div>
                  <div className="product-name">{prod.nombre}</div>
                  <div className="product-price">{formatMoney(prod.precio)}</div>
                </div>
              ))}
            </div>

            {selectedOrder.pedidos?.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Productos agregados:</h4>
                <ul className="order-list">
                  {selectedOrder.pedidos.map(p => (
                    <li key={p.id} className="order-item">
                      <span className="order-item-name">
                        {p.emoji} {p.nombre}
                        <span className="order-item-qty">x{p.cantidad}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="order-item-price">{formatMoney(p.precio * p.cantidad)}</span>
                        <button className="order-item-remove" onClick={() => onQuitarProducto(selectedOrder.id, p.id)}><Icons.Trash /></button>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="total-bar">
                  <span className="total-label">Total</span>
                  <span className="total-amount">{formatMoney(selectedOrder.pedidos.reduce((s, p) => s + p.precio * p.cantidad, 0))}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de pedidos */}
      {barOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍺</div>
          <div className="empty-state-text">No hay pedidos de barra activos</div>
        </div>
      ) : (
        <div className="bar-orders-grid">
          {barOrders.map(order => {
            const total = order.pedidos.reduce((s, p) => s + p.precio * p.cantidad, 0)
            return (
              <div key={order.id} className="bar-order-card">
                <div className="bar-order-header">
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>👤 {order.cliente}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{order.fecha}</span>
                  </div>
                  <span className="badge badge-amber">{order.pedidos.length} items</span>
                </div>
                {order.pedidos.length > 0 && (
                  <ul className="order-list" style={{ marginBottom: '12px' }}>
                    {order.pedidos.map(p => (
                      <li key={p.id} className="order-item">
                        <span className="order-item-name">{p.emoji} {p.nombre} <span className="order-item-qty">x{p.cantidad}</span></span>
                        <span className="order-item-price">{formatMoney(p.precio * p.cantidad)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-amber)', fontSize: '1.1rem' }}>{formatMoney(total)}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedOrder(order)}>
                      <Icons.Plus /> Agregar
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => onCerrarPedido(order.id)}>
                      <Icons.Check /> Cobrar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================
// VISTA: CONTABILIDAD
// ============================================
function ContabilidadView({ historial, totalHoy, totalProductos, totalMesas }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div className="stat-card emerald">
          <div className="stat-label">Total del Día</div>
          <div className="stat-value emerald" style={{ fontSize: '1.4rem' }}>{formatMoney(totalHoy)}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Alquiler Mesas</div>
          <div className="stat-value amber" style={{ fontSize: '1.4rem' }}>{formatMoney(totalMesas)}</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-label">Venta Productos</div>
          <div className="stat-value cyan" style={{ fontSize: '1.4rem' }}>{formatMoney(totalProductos)}</div>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>📋 Historial de Cierres</h3>
        {historial.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No hay registros aún. Cierra una mesa o un pedido de barra para ver el historial.</div>
          </div>
        ) : (
          <table className="accounting-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Mesa / Cliente</th>
                <th>Tiempo</th>
                <th>Alquiler</th>
                <th>Productos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {historial.map(h => (
                <tr key={h.id}>
                  <td>{h.fecha}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.mesa}</td>
                  <td>{h.tiempo}</td>
                  <td>{formatMoney(h.costoMesa)}</td>
                  <td>{formatMoney(h.costoProductos)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{formatMoney(h.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('¿Borrar todo el historial del día?')) { localStorage.removeItem('billar_historial'); window.location.reload() } }}>
          <Icons.Trash /> Limpiar Historial
        </button>
      </div>
    </div>
  )
}

// ============================================
// VISTA: TV (PANTALLA GRANDE)
// ============================================
function TVView() {
  const [mesas, setMesas] = useState([])
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Cargar datos de localStorage cada segundo
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('billar_mesas')
      if (saved) {
        const data = JSON.parse(saved)
        // Recalcular segundos de mesas activas
        const updated = data.map(m => {
          if (m.activa && m.tiempoInicio) {
            return { ...m, segundos: Math.floor((Date.now() - m.tiempoInicio) / 1000) }
          }
          return m
        })
        setMesas(updated)
      }
    }
    load()
    const id = setInterval(load, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="tv-container">
      <div className="tv-header">
        <div className="tv-title">🎱 Billar El Divino Niño</div>
        <div className="tv-clock">{clock}</div>
      </div>

      <div className="tv-grid">
        {mesas.map(mesa => (
          <div key={mesa.id} className={`tv-table-card ${mesa.activa ? 'active' : ''}`}>
            <div className="tv-table-name">{mesa.nombre}</div>
            {mesa.activa ? (
              <>
                <div className="tv-timer">{formatTime(mesa.segundos)}</div>
                <div className="tv-scoreboard">
                  <div className={`tv-player ${mesa.scoreJ1 > mesa.scoreJ2 ? 'winning' : mesa.scoreJ1 < mesa.scoreJ2 ? 'losing' : ''}`}>
                    <div className="tv-player-name">{mesa.jugador1}</div>
                    <div className="tv-player-score">{mesa.scoreJ1}</div>
                  </div>
                  <div className="tv-vs">VS</div>
                  <div className={`tv-player ${mesa.scoreJ2 > mesa.scoreJ1 ? 'winning' : mesa.scoreJ2 < mesa.scoreJ1 ? 'losing' : ''}`}>
                    <div className="tv-player-name">{mesa.jugador2}</div>
                    <div className="tv-player-score">{mesa.scoreJ2}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.8rem' }}>🏆 Partida #{mesa.juegos}</span>
                </div>
              </>
            ) : (
              <div className="tv-status-free">
                <div style={{ fontSize: '3rem', marginBottom: '8px', opacity: 0.3 }}>🎱</div>
                Disponible
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
