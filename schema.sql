-- Tablas para el Sistema de Billar El Divino Niño

-- Roles: 'dueño', 'admin', 'mesero'
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('dueño', 'admin', 'mesero')),
    nombre TEXT NOT NULL,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mesas de billar
CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero INTEGER UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'mantenimiento')),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partidas activas o históricas
CREATE TABLE IF NOT EXISTS partidas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER REFERENCES mesas(id),
    jugador1 TEXT,
    jugador2 TEXT,
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fin TIMESTAMP WITH TIME ZONE,
    tarifa_hora NUMERIC DEFAULT 15000,
    total_mesa NUMERIC DEFAULT 0,
    pagado BOOLEAN DEFAULT FALSE,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Productos del bar
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio NUMERIC NOT NULL,
    categoria TEXT DEFAULT 'bebida',
    stock INTEGER DEFAULT 0,
    imagen_url TEXT,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos vinculados a una mesa o venta directa
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    partida_id INTEGER REFERENCES partidas(id), -- NULL si es venta directa
    cliente_nombre TEXT, -- Para ventas directas
    usuario_id INTEGER REFERENCES usuarios(id), -- Quien tomó el pedido
    total NUMERIC DEFAULT 0,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'entregado', 'pagado', 'cancelado')),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Items de cada pedido
CREATE TABLE IF NOT EXISTS pedido_items (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC NOT NULL,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios con crédito (fiado)
CREATE TABLE IF NOT EXISTS clientes_credito (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT,
    deuda_total NUMERIC DEFAULT 0,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Historial de abonos/créditos
CREATE TABLE IF NOT EXISTS historial_creditos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes_credito(id),
    monto NUMERIC NOT NULL,
    tipo TEXT CHECK (tipo IN ('consumo', 'abono')),
    descripcion TEXT,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cola de música
CREATE TABLE IF NOT EXISTS cola_musica (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    video_id TEXT NOT NULL, -- YouTube ID
    solicitado_por TEXT,
    reproducida BOOLEAN DEFAULT FALSE,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales
INSERT INTO usuarios (username, password_hash, rol, nombre) VALUES 
('admin', '$2b$10$YourHashedPasswordHere', 'dueño', 'Administrador Principal')
ON CONFLICT DO NOTHING;

INSERT INTO mesas (numero, nombre) VALUES 
(1, 'Mesa 1'),
(2, 'Mesa 2'),
(3, 'Mesa 3'),
(4, 'Mesa 4')
ON CONFLICT DO NOTHING;

INSERT INTO productos (nombre, precio, categoria) VALUES 
('Cerveza Club Colombia', 5000, 'bebida'),
('Cerveza Aguila', 4500, 'bebida'),
('Gaseosa 350ml', 3000, 'bebida'),
('Agua Mineral', 2500, 'bebida'),
('Empanada', 2000, 'comida'),
('Papas Fritas', 3500, 'comida')
ON CONFLICT DO NOTHING;
