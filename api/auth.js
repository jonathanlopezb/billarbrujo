import sql from '../src/lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { action } = req.query;

  // PUBLIC ACTIONS
  if (req.method === 'POST') {
    const { username, password, nombre, secretKey, type } = req.body;

    // LOGIN
    if (type === 'login' || action === 'login') {
      try {
        const users = await sql`SELECT * FROM usuarios WHERE username = ${username} AND password_hash = ${password} LIMIT 1`;
        if (users.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
        
        const user = users[0];
        const token = jwt.sign({ id: user.id, username: user.username, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        return res.status(200).json({ 
          token,
          user: { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol }
        });
      } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    // REGISTER OWNER
    if (type === 'register-owner' || action === 'register-owner') {
      if (secretKey !== 'DIVINO-NINO-2026') return res.status(403).json({ error: 'Llave inválida' });
      try {
        const owners = await sql`SELECT id FROM usuarios WHERE rol = 'dueño' LIMIT 1`;
        if (owners.length > 0) return res.status(400).json({ error: 'Ya existe dueño' });
        
        await sql`INSERT INTO usuarios (username, password_hash, rol, nombre) VALUES (${username}, ${password}, 'dueño', ${nombre})`;
        return res.status(201).json({ success: true });
      } catch (e) { return res.status(500).json({ error: e.message }); }
    }
  }

  // PROTECTED ACTIONS (Requires Bearer Token)
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'dueño') return res.status(403).json({ error: 'Prohibido' });

    // LIST USERS
    if (req.method === 'GET') {
      const users = await sql`SELECT id, username, rol, nombre, creado_at FROM usuarios ORDER BY creado_at DESC`;
      return res.status(200).json(users);
    }

    // CREATE USER
    if (req.method === 'POST') {
      const { username, password, rol, nombre } = req.body;
      const [existing] = await sql`SELECT id FROM usuarios WHERE username = ${username}`;
      if (existing) return res.status(400).json({ error: 'Ya existe' });
      
      const [user] = await sql`
        INSERT INTO usuarios (username, password_hash, rol, nombre)
        VALUES (${username}, ${password}, ${rol}, ${nombre})
        RETURNING id, username, rol, nombre
      `;
      return res.status(201).json(user);
    }

    // DELETE USER
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM usuarios WHERE id = ${id} AND rol != 'dueño'`;
      return res.status(200).json({ ok: true });
    }

  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  return res.status(405).send('Método no permitido');
}
