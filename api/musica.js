import sql from '../src/lib/db.js';
import { GetListByKeyword } from 'youtube-search-api';

export default async function handler(req, res) {
  // SEARCH
  if (req.method === 'GET' && req.query.q) {
    const { q } = req.query;
    try {
      const results = await GetListByKeyword(q, false, 10);
      const formattedResults = results.items.map(item => ({
        id: item.id,
        title: item.title,
        artist: item.channelTitle || 'Desconocido',
        thumbnail: item.thumbnail?.thumbnails?.[0]?.url
      }));
      return res.status(200).json(formattedResults);
    } catch (error) {
      console.error('Error YouTube:', error);
      return res.status(500).json({ error: 'Error al buscar' });
    }
  }

  // QUEUE LIST
  if (req.method === 'GET') {
    try {
      const queue = await sql`SELECT * FROM cola_musica WHERE estado = 'pendiente' ORDER BY creado_at ASC`;
      return res.status(200).json(queue);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener cola' });
    }
  }

  // ADD TO QUEUE
  if (req.method === 'POST') {
    const { titulo, video_id, solicitado_por } = req.body;
    try {
      const [song] = await sql`
        INSERT INTO cola_musica (titulo, video_id, solicitado_por)
        VALUES (${titulo}, ${video_id}, ${solicitado_por})
        RETURNING *
      `;
      return res.status(201).json(song);
    } catch (error) {
      return res.status(500).json({ error: 'Error al añadir' });
    }
  }

  // UPDATE STATUS (Played / Skip)
  if (req.method === 'PATCH') {
    const { id, action } = req.body;
    try {
      if (action === 'played') {
        await sql`UPDATE cola_musica SET estado = 'reproducida' WHERE id = ${id}`;
      } else if (action === 'skip') {
        await sql`UPDATE cola_musica SET estado = 'saltada' WHERE id = ${id}`;
      }
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar' });
    }
  }

  // DELETE
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await sql`DELETE FROM cola_musica WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al borrar' });
    }
  }

  return res.status(405).send('Método no permitido');
}
