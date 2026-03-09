import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await sql`SELECT * FROM cola_musica WHERE reproducida = false ORDER BY creado_at ASC`;
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { titulo, video_id, solicitado_por } = req.body;
    try {
      await sql`
        INSERT INTO cola_musica (titulo, video_id, solicitado_por)
        VALUES (${titulo}, ${video_id}, ${solicitado_por})
      `;
      return res.status(201).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await sql`DELETE FROM cola_musica WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PATCH') {
    const { id, action } = req.body;
    try {
      if (action === 'played') {
        await sql`UPDATE cola_musica SET reproducida = true WHERE id = ${id}`;
      } else if (action === 'move_up') {
        // Implementation for moving up (swap timestamps with previous song)
        const current = await sql`SELECT creado_at FROM cola_musica WHERE id = ${id}`;
        const previous = await sql`
          SELECT id, creado_at FROM cola_musica 
          WHERE creado_at < ${current[0].creado_at} AND reproducida = false 
          ORDER BY creado_at DESC LIMIT 1
        `;
        if (previous.length > 0) {
          await sql`UPDATE cola_musica SET creado_at = ${previous[0].creado_at} WHERE id = ${id}`;
          await sql`UPDATE cola_musica SET creado_at = ${current[0].creado_at} WHERE id = ${previous[0].id}`;
        }
      } else if (action === 'move_down') {
        // Implementation for moving down (swap timestamps with next song)
        const current = await sql`SELECT creado_at FROM cola_musica WHERE id = ${id}`;
        const next = await sql`
          SELECT id, creado_at FROM cola_musica 
          WHERE creado_at > ${current[0].creado_at} AND reproducida = false 
          ORDER BY creado_at ASC LIMIT 1
        `;
        if (next.length > 0) {
          await sql`UPDATE cola_musica SET creado_at = ${next[0].creado_at} WHERE id = ${id}`;
          await sql`UPDATE cola_musica SET creado_at = ${current[0].creado_at} WHERE id = ${next[0].id}`;
        }
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
