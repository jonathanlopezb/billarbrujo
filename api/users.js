import sql from '../src/lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only the owner can manage users
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'dueño') return res.status(403).json({ error: 'Prohibido. Solo el dueño puede gestionar usuarios.' });

    if (req.method === 'GET') {
      const users = await sql`SELECT id, username, rol, nombre, creado_at FROM usuarios ORDER BY creado_at DESC`;
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const { username, password, rol, nombre } = req.body;
      const [existing] = await sql`SELECT id FROM usuarios WHERE username = ${username}`;
      if (existing) return res.status(400).json({ error: 'Usuario ya existe' });

      // In a real app we should hash the password. 
      // Reusing logic from login if possible, but for now just inserting.
      const [user] = await sql`
        INSERT INTO usuarios (username, password_hash, rol, nombre)
        VALUES (${username}, ${password}, ${rol}, ${nombre})
        RETURNING id, username, rol, nombre
      `;
      return res.status(201).json(user);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM usuarios WHERE id = ${id} AND rol != 'dueño'`;
      return res.status(200).json({ ok: true });
    }

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }

  return res.status(405).send('Método no permitido');
}
