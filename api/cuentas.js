import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  const { id_partida } = req.query;

  if (req.method === 'GET') {
    if (!id_partida) return res.status(400).json({ error: 'Falta id_partida' });

    try {
      // 1. Get consumos grouped by persona/pareja
      const consumos = await sql`
        SELECT 
          tipo_consumo, id_persona, id_pareja, sum(total) as subtotal
        FROM consumos 
        WHERE id_partida = ${id_partida}
        GROUP BY tipo_consumo, id_persona, id_pareja
      `;

      // 2. Get chicos results
      const resultados = await sql`
        SELECT id_pareja_ganadora, COUNT(*) as chicos_ganados
        FROM resultados_partida
        WHERE id_partida = ${id_partida}
        GROUP BY id_pareja_ganadora
      `;

      // 3. Get generic partida info to see valor_chico
      const [partida] = await sql`SELECT valor_chico FROM partidas WHERE id = ${id_partida}`;
      
      // 4. Get couples of the match to know who lost
      const parejas = await sql`SELECT * FROM parejas WHERE id_partida = ${id_partida}`;
      
      return res.status(200).json({ consumos, resultados, parejas, valor_chico: partida.valor_chico });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al calcular cuenta' });
    }
  }

  // POST to finalize accounts
  if (req.method === 'POST') {
    const { id_partida, pagos } = req.body; 
    // pagos logic: [{ tipo, id_persona, id_pareja, total, estado, metodo_pago }]
    try {
      for (const p of pagos) {
        const [cuenta] = await sql`
          INSERT INTO cuentas (tipo, id_persona, id_pareja, id_partida, total, estado)
          VALUES (${p.tipo}, ${p.id_persona || null}, ${p.id_pareja || null}, ${id_partida}, ${p.total}, ${p.estado})
          RETURNING *
        `;

        if (p.estado === 'pagada') {
          await sql`
            INSERT INTO pagos (id_cuenta, metodo_pago, valor, usuario_registro)
            VALUES (${cuenta.id}, ${p.metodo_pago}, ${p.total}, 'admin')
          `;
          // Update daily caja (simplified)
          const col = p.metodo_pago === 'efectivo' ? 'ventas_efectivo' : (p.metodo_pago === 'nequi' ? 'ventas_nequi' : 'ventas_transferencia');
          await sql`
            INSERT INTO caja_diaria (fecha, ${sql(col)}, total_dia)
            VALUES (CURRENT_DATE, ${p.total}, ${p.total})
            ON CONFLICT (fecha) DO UPDATE 
            SET ${sql(col)} = caja_diaria.${sql(col)} + ${p.total},
                total_dia = caja_diaria.total_dia + ${p.total}
          `;
        } else if (p.estado === 'credito') {
            await sql`
              INSERT INTO creditos (id_persona, id_cuenta, valor, estado)
              VALUES (${p.id_persona}, ${cuenta.id}, ${p.total}, 'pendiente')
            `;
            await sql`
              INSERT INTO caja_diaria (fecha, creditos_generados)
              VALUES (CURRENT_DATE, ${p.total})
              ON CONFLICT (fecha) DO UPDATE SET creditos_generados = caja_diaria.creditos_generados + ${p.total}
            `;
        }
      }

      await sql`UPDATE partidas SET estado = 'cerrada', fecha_fin = CURRENT_TIMESTAMP WHERE id = ${id_partida}`;
      const [part] = await sql`SELECT mesa_id FROM partidas WHERE id = ${id_partida}`;
      await sql`UPDATE mesas SET estado = 'disponible' WHERE id = ${part.mesa_id}`;

      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al procesar pagos' });
    }
  }

  return res.status(405).send('Método no permitido');
}
