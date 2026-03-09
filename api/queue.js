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

  return res.status(405).json({ error: 'Método no permitido' });
}
