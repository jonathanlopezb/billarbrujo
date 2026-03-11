-- Tablas para el Sistema de Billar El Divino Niño (NUEVA ARQUITECTURA)

-- 1. LIMPIEZA DE TABLAS OBSOLETAS
DROP TABLE IF EXISTS movimientos_inventario CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS consumos CASCADE;
DROP TABLE IF EXISTS resultados_partida CASCADE;
DROP TABLE IF EXISTS pagos_credito CASCADE;
DROP TABLE IF EXISTS creditos CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS cuentas CASCADE;
DROP TABLE IF EXISTS pareja_persona CASCADE;
DROP TABLE IF EXISTS parejas CASCADE;
DROP TABLE IF EXISTS partidas CASCADE;
DROP TABLE IF EXISTS personas CASCADE;
DROP TABLE IF EXISTS pedido_items CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS historial_creditos CASCADE;
DROP TABLE IF EXISTS clientes_credito CASCADE;

-- Mantenemos usuarios, mesas, productos, cola_musica sin borrar, ya que son base.
-- Aseguramos columnas nuevas en productos.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS control_inventario BOOLEAN DEFAULT true;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Aseguramos que existan las tablas maestras si están vacías, con Create if not exists (ya están de antes)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('dueño', 'admin', 'mesero', 'contador')),
    nombre TEXT NOT NULL,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero INTEGER UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'mantenimiento')),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla PERSONAS
CREATE TABLE IF NOT EXISTS personas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT,
    es_cliente_frecuente BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla PARTIDAS
CREATE TABLE IF NOT EXISTS partidas (
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

-- 4. Tabla PAREJAS
CREATE TABLE IF NOT EXISTS parejas (
    id SERIAL PRIMARY KEY,
    id_partida INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    nombre TEXT CHECK (nombre IN ('A', 'B'))
);

-- 5. Tabla PAREJA_PERSONA
CREATE TABLE IF NOT EXISTS pareja_persona (
    id SERIAL PRIMARY KEY,
    id_pareja INTEGER REFERENCES parejas(id) ON DELETE CASCADE,
    id_persona INTEGER REFERENCES personas(id)
);

-- 7. Tabla INVENTARIO
CREATE TABLE IF NOT EXISTS inventario (
    id_producto INTEGER PRIMARY KEY REFERENCES productos(id) ON DELETE CASCADE,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla MOVIMIENTOS_INVENTARIO
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id SERIAL PRIMARY KEY,
    id_producto INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    tipo TEXT CHECK (tipo IN ('venta', 'compra', 'ajuste')),
    referencia_id INTEGER, -- Puede referenciar id_consumo
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla CONSUMOS
CREATE TABLE IF NOT EXISTS consumos (
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

-- 10. RESULTADOS DEL CHICO
CREATE TABLE IF NOT EXISTS resultados_partida (
    id SERIAL PRIMARY KEY,
    id_partida INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    id_pareja_ganadora INTEGER REFERENCES parejas(id),
    valor_chico NUMERIC DEFAULT 1000,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabla CUENTAS
CREATE TABLE IF NOT EXISTS cuentas (
    id SERIAL PRIMARY KEY,
    tipo TEXT CHECK (tipo IN ('persona', 'pareja', 'directo')),
    id_persona INTEGER REFERENCES personas(id),
    id_pareja INTEGER REFERENCES parejas(id),
    id_partida INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    total NUMERIC DEFAULT 0,
    estado TEXT DEFAULT 'abierta' CHECK (estado IN ('abierta', 'pagada', 'credito'))
);

-- 12. Tabla PAGOS
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    id_cuenta INTEGER REFERENCES cuentas(id) ON DELETE CASCADE,
    metodo_pago TEXT CHECK (metodo_pago IN ('efectivo', 'nequi', 'transferencia', 'credito')),
    valor NUMERIC NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_registro TEXT
);

-- 13. Tabla CREDITOS
-- "Las personas individuales también pueden obtener un crédito que piden sin estar en mesa"
-- Por eso id_cuenta puede ser nulo o la cuenta ser tipo "directo"
CREATE TABLE IF NOT EXISTS creditos (
    id SERIAL PRIMARY KEY,
    id_persona INTEGER REFERENCES personas(id),
    id_cuenta INTEGER REFERENCES cuentas(id) ON DELETE CASCADE, -- Null si es directo sin cuenta referenciada
    valor NUMERIC NOT NULL,
    fecha_credito TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATE,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'vencido')),
    observaciones TEXT
);

-- 14. Tabla PAGOS_CREDITO
CREATE TABLE IF NOT EXISTS pagos_credito (
    id SERIAL PRIMARY KEY,
    id_credito INTEGER REFERENCES creditos(id) ON DELETE CASCADE,
    valor NUMERIC NOT NULL,
    metodo_pago TEXT CHECK (metodo_pago IN ('efectivo', 'nequi', 'transferencia')),
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. CAJA DIARIA
CREATE TABLE IF NOT EXISTS caja_diaria (
    id SERIAL PRIMARY KEY,
    fecha DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    ventas_efectivo NUMERIC DEFAULT 0,
    ventas_nequi NUMERIC DEFAULT 0,
    ventas_transferencia NUMERIC DEFAULT 0,
    creditos_generados NUMERIC DEFAULT 0,
    creditos_pagados NUMERIC DEFAULT 0,
    total_dia NUMERIC DEFAULT 0
);
