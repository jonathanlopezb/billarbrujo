-- Tablas para el Sistema de Billar El Divino Niño (NUEVA ARQUITECTURA)

-- 1. LIMPIEZA DE TABLAS OBSOLETAS
DROP TABLE IF EXISTS cola_musica CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS caja_diaria CASCADE;
DROP TABLE IF EXISTS pagos_credito CASCADE;
DROP TABLE IF EXISTS creditos CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS cuentas CASCADE;
DROP TABLE IF EXISTS resultados_partida CASCADE;
DROP TABLE IF EXISTS consumos CASCADE;
DROP TABLE IF EXISTS movimientos_inventario CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS pareja_persona CASCADE;
DROP TABLE IF EXISTS parejas CASCADE;
DROP TABLE IF EXISTS partidas CASCADE;
DROP TABLE IF EXISTS mesas CASCADE;
DROP TABLE IF EXISTS personas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 2. Tabla USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('dueño', 'admin', 'mesero', 'contador')),
    nombre TEXT NOT NULL,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla MESAS
CREATE TABLE mesas (
    id SERIAL PRIMARY KEY,
    numero INTEGER UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'mantenimiento')),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla PERSONAS
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT,
    es_cliente_frecuente BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla PRODUCTOS
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio NUMERIC NOT NULL,
    categoria TEXT DEFAULT 'bebida',
    stock INTEGER DEFAULT 0,
    control_inventario BOOLEAN DEFAULT true,
    activo BOOLEAN DEFAULT true,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla PARTIDAS
CREATE TABLE partidas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER REFERENCES mesas(id),
    valor_chico NUMERIC DEFAULT 1000,
    estado TEXT DEFAULT 'abierta' CHECK (estado IN ('abierta', 'cerrada')),
    jugador1 TEXT,
    jugador2 TEXT,
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP WITH TIME ZONE
);

-- 7. Tabla PAREJAS
CREATE TABLE parejas (
    id SERIAL PRIMARY KEY,
    id_partida INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    nombre TEXT CHECK (nombre IN ('A', 'B'))
);

-- 8. Tabla CONSUMOS
CREATE TABLE consumos (
    id SERIAL PRIMARY KEY,
    id_partida INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    tipo_consumo TEXT CHECK (tipo_consumo IN ('persona', 'pareja', 'directo')),
    id_persona INTEGER REFERENCES personas(id),
    id_pareja INTEGER REFERENCES parejas(id),
    id_producto INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla RESULTADOS DEL CHICO
CREATE TABLE resultados_partida (
    id SERIAL PRIMARY KEY,
    id_partida INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    id_pareja_ganadora INTEGER REFERENCES parejas(id),
    valor_chico NUMERIC DEFAULT 1000,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabla CUENTAS
CREATE TABLE cuentas (
    id SERIAL PRIMARY KEY,
    tipo TEXT CHECK (tipo IN ('persona', 'pareja', 'directo')),
    id_persona INTEGER REFERENCES personas(id),
    id_pareja INTEGER REFERENCES parejas(id),
    id_partida INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    total NUMERIC DEFAULT 0,
    estado TEXT DEFAULT 'abierta' CHECK (estado IN ('abierta', 'pagada', 'credito'))
);

-- 11. Tabla PAGOS
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    id_cuenta INTEGER REFERENCES cuentas(id) ON DELETE CASCADE,
    metodo_pago TEXT CHECK (metodo_pago IN ('efectivo', 'nequi', 'transferencia', 'credito', 'paga')),
    valor NUMERIC NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_registro TEXT
);

-- 12. Tabla CREDITOS
CREATE TABLE creditos (
    id SERIAL PRIMARY KEY,
    id_persona INTEGER REFERENCES personas(id),
    id_cuenta INTEGER REFERENCES cuentas(id) ON DELETE CASCADE,
    valor NUMERIC NOT NULL,
    fecha_credito TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'vencido')),
    observaciones TEXT
);

-- 13. Tabla PAGOS_CREDITO
CREATE TABLE pagos_credito (
    id SERIAL PRIMARY KEY,
    id_credito INTEGER REFERENCES creditos(id) ON DELETE CASCADE,
    valor NUMERIC NOT NULL,
    metodo_pago TEXT CHECK (metodo_pago IN ('efectivo', 'nequi', 'paga')),
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. CAJA DIARIA
CREATE TABLE caja_diaria (
    id SERIAL PRIMARY KEY,
    fecha DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    ventas_efectivo NUMERIC DEFAULT 0,
    ventas_nequi NUMERIC DEFAULT 0,
    ventas_transferencia NUMERIC DEFAULT 0,
    creditos_generados NUMERIC DEFAULT 0,
    creditos_pagados NUMERIC DEFAULT 0,
    total_dia NUMERIC DEFAULT 0
);

-- 15. COLA DE MUSICA
CREATE TABLE cola_musica (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    video_id TEXT NOT NULL,
    solicitado_por TEXT,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'reproducida', 'saltada')),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DATA INICIAL BASE
INSERT INTO mesas (numero, nombre) VALUES 
(1, 'Mesa de Billar 1'), 
(2, 'Mesa de Billar 2'), 
(3, 'Mesa de Billar 3'), 
(4, 'Mesa de Billar 4');

INSERT INTO productos (nombre, precio, categoria, stock) VALUES 
('Cerveza Club Colombia', 5000, 'bebida', 50),
('Cerveza Aguila', 4000, 'bebida', 100),
('Gaseosa 350ml', 2500, 'bebida', 24);

