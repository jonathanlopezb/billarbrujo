import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const mesas = await sql`SELECT * FROM mesas ORDER BY numero`;
      const partidasActivas = await sql`SELECT * FROM partidas WHERE estado = 'abierta'`;
      
      for (let t of mesas) {
        const p = partidasActivas.find(x => x.mesa_id === t.id);
        if (p) {
          t.partida_id = p.id;
          t.estado = 'ocupada';
          t.valor_chico = p.valor_chico;
          t.inicio = p.fecha_inicio;
          t.parejas = await sql`SELECT * FROM parejas WHERE id_partida = ${p.id}`;
          // Get chicos ganados
          const chicos = await sql`SELECT id_pareja_ganadora, COUNT(*) as ganados FROM resultados_partida WHERE id_partida = ${p.id} GROUP BY id_pareja_ganadora`;
          for(let pare of t.parejas) {
            const c = chicos.find(x => x.id_pareja_ganadora === pare.id);
            pare.chicos_ganados = c ? parseInt(c.ganados) : 0;
          }
        }
      }
      return res.status(200).json(mesas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener partidas' });
    }
  }

  if (req.method === 'POST') {
    const { mesaId, valorChico } = req.body; // Simplificado: crea pareja A y B genéricas
    try {
      const [partida] = await sql`
        INSERT INTO partidas (mesa_id, valor_chico) 
        VALUES (${mesaId}, ${valorChico || 1000}) 
        RETURNING *
      `;
      await sql`UPDATE mesas SET estado = 'ocupada' WHERE id = ${mesaId}`;
      const [pA] = await sql`INSERT INTO parejas (id_partida, nombre) VALUES (${partida.id}, 'A') RETURNING *`;
      const [pB] = await sql`INSERT INTO parejas (id_partida, nombre) VALUES (${partida.id}, 'B') RETURNING *`;
      
      return res.status(201).json({ partida, pA, pB });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al iniciar partida' });
    }
  }

  if (req.method === 'PATCH') {
    const { partidaId, accion, id_pareja_ganadora, valor_chico } = req.body;
    try {
      if (accion === 'registrar_chico') {
        await sql`
          INSERT INTO resultados_partida (id_partida, id_pareja_ganadora, valor_chico) 
          VALUES (${partidaId}, ${id_pareja_ganadora}, ${valor_chico || 1000})
        `;
        return res.status(200).json({ ok: true });
      } else if (accion === 'cerrar') {
        await sql`UPDATE partidas SET estado = 'cerrada', fecha_fin = CURRENT_TIMESTAMP WHERE id = ${partidaId}`;
        const [p] = await sql`SELECT mesa_id FROM partidas WHERE id = ${partidaId}`;
        await sql`UPDATE mesas SET estado = 'disponible' WHERE id = ${p.mesa_id}`;
        return res.status(200).json({ ok: true });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error actualizando partida' });
    }
  }

  return res.status(405).send('Método no permitido');
}
