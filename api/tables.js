import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all tables and their latest active match
      const tables = await sql`
        SELECT 
          m.id, 
          m.numero, 
          m.nombre, 
          m.estado,
          p.id as partida_id,
          p.jugador1,
          p.jugador2,
          p.score1,
          p.score2,
          p.inicio,
          p.tarifa_hora
        FROM mesas m
        LEFT JOIN partidas p ON m.id = p.mesa_id AND p.fin IS NULL
        ORDER BY m.numero
      `;
      return res.status(200).json(tables);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener mesas' });
    }
  }

  if (req.method === 'POST') {
    const { mesaId, jugador1, jugador2, tarifaHora } = req.body;
    try {
      // Check if table is available
      const [table] = await sql`SELECT estado FROM mesas WHERE id = ${mesaId}`;
      if (table.estado !== 'disponible') {
        return res.status(400).json({ error: 'La mesa no está disponible' });
      }

      // Start transaction (Neon/serverless doesn't support multi-statement sql`...` transactions easily, 
      // but we can do consecutive calls)
      
      const [partida] = await sql`
        INSERT INTO partidas (mesa_id, jugador1, jugador2, tarifa_hora)
        VALUES (${mesaId}, ${jugador1}, ${jugador2}, ${tarifaHora || 15000})
        RETURNING *
      `;

      await sql`
        UPDATE mesas SET estado = 'ocupada' WHERE id = ${mesaId}
      `;

      return res.status(201).json(partida);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al iniciar partida' });
    }
  }

  if (req.method === 'PATCH') {
    const { partidaId, score1, score2, finish } = req.body;
    try {
      if (finish) {
        const [partida] = await sql`
          UPDATE partidas 
          SET fin = CURRENT_TIMESTAMP, 
              score1 = ${score1 || 0}, 
              score2 = ${score2 || 0}
          WHERE id = ${partidaId}
          RETURNING *
        `;

        // Calculate total based on time (simple version)
        // For now just update mesa status
        await sql`UPDATE mesas SET estado = 'disponible' WHERE id = ${partida.mesa_id}`;
        
        return res.status(200).json(partida);
      } else {
        const [partida] = await sql`
          UPDATE partidas 
          SET score1 = ${score1 || 0}, 
              score2 = ${score2 || 0}
          WHERE id = ${partidaId}
          RETURNING *
        `;
        return res.status(200).json(partida);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar partida' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
