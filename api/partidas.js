import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  const { id_partida, action } = req.query;

  // GET: Tables status or Match details
  if (req.method === 'GET') {
    try {
      if (action === 'summary') {
          // Summary for settlement (Logic from cuentas.js)
          const consumos = await sql`SELECT tipo_consumo, id_persona, id_pareja, sum(total) as subtotal FROM consumos WHERE id_partida = ${id_partida} GROUP BY tipo_consumo, id_persona, id_pareja`;
          const resultados = await sql`SELECT id_pareja_ganadora, COUNT(*) as chicos_ganados FROM resultados_partida WHERE id_partida = ${id_partida} GROUP BY id_pareja_ganadora`;
          const [partida] = await sql`SELECT valor_chico FROM partidas WHERE id = ${id_partida}`;
          const parejas = await sql`SELECT * FROM parejas WHERE id_partida = ${id_partida}`;
          return res.status(200).json({ consumos, resultados, parejas, valor_chico: partida.valor_chico });
      }

      // Default: List tables and active matches
      const mesas = await sql`SELECT * FROM mesas ORDER BY numero`;
      const partidasActivas = await sql`SELECT * FROM partidas WHERE estado = 'abierta'`;
      for (let t of mesas) {
        const p = partidasActivas.find(x => x.mesa_id === t.id);
        if (p) {
          t.partida_id = p.id;
          t.estado = 'ocupada';
          t.valor_chico = p.valor_chico;
          t.inicio = p.fecha_inicio;
          t.score1 = p.score1;
          t.score2 = p.score2;
          t.jugador1 = p.jugador1;
          t.jugador2 = p.jugador2;
          t.parejas = await sql`SELECT * FROM parejas WHERE id_partida = ${p.id}`;
          const chicos = await sql`SELECT id_pareja_ganadora, COUNT(*) as ganados FROM resultados_partida WHERE id_partida = ${p.id} GROUP BY id_pareja_ganadora`;
          for(let pare of t.parejas) {
            const c = chicos.find(x => x.id_pareja_ganadora === pare.id);
            pare.chicos_ganados = c ? parseInt(c.ganados) : 0;
          }
        }
      }
      return res.status(200).json(mesas);
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // POST: Start Match, Add Consumo, or Settlement
  if (req.method === 'POST') {
    const { type } = req.body;

    // START MATCH
    if (type === 'start') {
      const { mesaId, valorChico } = req.body;
      try {
        const [partida] = await sql`INSERT INTO partidas (mesa_id, valor_chico) VALUES (${mesaId}, ${valorChico || 1000}) RETURNING *`;
        await sql`UPDATE mesas SET estado = 'ocupada' WHERE id = ${mesaId}`;
        await sql`INSERT INTO parejas (id_partida, nombre) VALUES (${partida.id}, 'A'), (${partida.id}, 'B')`;
        return res.status(201).json(partida);
      } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    // ADD CONSUMO
    if (type === 'consumo') {
      const { id_partida, tipo_consumo, id_persona, id_pareja, id_producto, cantidad, precio_unitario, metodo_pago } = req.body;
      try {
        const total = cantidad * precio_unitario;
        const [c] = await sql`INSERT INTO consumos (id_partida, tipo_consumo, id_persona, id_pareja, id_producto, cantidad, precio_unitario, total) VALUES (${id_partida || null}, ${tipo_consumo}, ${id_persona || null}, ${id_pareja || null}, ${id_producto}, ${cantidad}, ${precio_unitario}, ${total}) RETURNING *`;
        await sql`UPDATE productos SET stock = stock - ${cantidad} WHERE id = ${id_producto}`;
        
        // Registrar en caja si es venta directa pagada enseguida
        if (tipo_consumo === 'directo' && metodo_pago && metodo_pago !== 'cuenta') {
          const col = metodo_pago === 'efectivo' ? 'ventas_efectivo' : (metodo_pago === 'nequi' ? 'ventas_nequi' : 'ventas_transferencia');
          await sql`INSERT INTO caja_diaria (fecha, ${sql(col)}, total_dia) VALUES (CURRENT_DATE, ${total}, ${total}) ON CONFLICT (fecha) DO UPDATE SET ${sql(col)} = caja_diaria.${sql(col)} + ${total}, total_dia = caja_diaria.total_dia + ${total}`;
        }

        return res.status(201).json(c);
      } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    // SETTLEMENT
    if (type === 'settle') {
      const { id_partida, pagos } = req.body;
      try {
        for (const p of pagos) {
          const [cuenta] = await sql`INSERT INTO cuentas (tipo, id_persona, id_pareja, id_partida, total, estado) VALUES (${p.tipo}, ${p.id_persona || null}, ${p.id_pareja || null}, ${id_partida}, ${p.total}, ${p.estado}) RETURNING *`;
          if (p.estado === 'pagada') {
            await sql`INSERT INTO pagos (id_cuenta, metodo_pago, valor, usuario_registro) VALUES (${cuenta.id}, ${p.metodo_pago}, ${p.total}, 'admin')`;
            const col = p.metodo_pago === 'efectivo' ? 'ventas_efectivo' : (p.metodo_pago === 'nequi' ? 'ventas_nequi' : 'ventas_transferencia');
            await sql`INSERT INTO caja_diaria (fecha, ${sql(col)}, total_dia) VALUES (CURRENT_DATE, ${p.total}, ${p.total}) ON CONFLICT (fecha) DO UPDATE SET ${sql(col)} = caja_diaria.${sql(col)} + ${p.total}, total_dia = caja_diaria.total_dia + ${p.total}`;
          } else if (p.estado === 'credito') {
            await sql`INSERT INTO creditos (id_persona, id_cuenta, valor, estado) VALUES (${p.id_persona}, ${cuenta.id}, ${p.total}, 'pendiente')`;
            await sql`INSERT INTO caja_diaria (fecha, creditos_generados) VALUES (CURRENT_DATE, ${p.total}) ON CONFLICT (fecha) DO UPDATE SET creditos_generados = caja_diaria.creditos_generados + ${p.total}`;
          }
        }
        await sql`UPDATE partidas SET estado = 'cerrada', fecha_fin = CURRENT_TIMESTAMP WHERE id = ${id_partida}`;
        const [part] = await sql`SELECT mesa_id FROM partidas WHERE id = ${id_partida}`;
        await sql`UPDATE mesas SET estado = 'disponible' WHERE id = ${part.mesa_id}`;
        return res.status(200).json({ ok: true });
      } catch (e) { return res.status(500).json({ error: e.message }); }
    }
  }

  // PATCH: Registrar Chico, Update Score
  if (req.method === 'PATCH') {
    const { partidaId, accion, id_pareja_ganadora, score1, score2 } = req.body;
    try {
      if (accion === 'registrar_chico') {
        await sql`INSERT INTO resultados_partida (id_partida, id_pareja_ganadora, valor_chico) VALUES (${partidaId}, ${id_pareja_ganadora}, 1000)`;
        return res.status(200).json({ ok: true });
      } else if (accion === 'update_score') {
        await sql`UPDATE partidas SET score1 = ${score1 || 0}, score2 = ${score2 || 0} WHERE id = ${partidaId}`;
        return res.status(200).json({ ok: true });
      }
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(405).send('Método no permitido');
}
