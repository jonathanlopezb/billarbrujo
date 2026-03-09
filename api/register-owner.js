import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, nombre, secretKey } = req.body;
    
    // Simple secret check for the first owner account creation
    if (secretKey !== 'DIVINO-NINO-2026') {
      return res.status(403).json({ error: 'Llave secreta de registro inválida' });
    }

    try {
      // Check if any owner exists
      const owners = await sql`SELECT id FROM usuarios WHERE rol = 'dueño' LIMIT 1`;
      
      if (owners.length > 0) {
        return res.status(400).json({ error: 'Ya existe una cuenta de dueño.' });
      }

      await sql`
        INSERT INTO usuarios (username, password_hash, rol, nombre)
        VALUES (${username}, ${password}, 'dueño', ${nombre})
      `;
      
      return res.status(201).json({ success: true, message: 'Dueño registrado' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
