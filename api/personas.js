import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const personas = await sql`SELECT * FROM personas ORDER BY nombre`;
      return res.status(200).json(personas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener personas' });
    }
  }

  if (req.method === 'POST') {
    const { nombre, telefono } = req.body;
    try {
      const [p] = await sql`
        INSERT INTO personas (nombre, telefono) 
        VALUES (${nombre}, ${telefono}) 
        RETURNING *
      `;
      return res.status(201).json(p);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al crear persona' });
    }
  }

  return res.status(405).send('Método no permitido');
}
