import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const users = await sql`SELECT * FROM usuarios WHERE username = ${username} AND password_hash = ${password} LIMIT 1`;
      
      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = users[0];
      // Note: In a production app, we would return a JWT here. 
      // For this implementation, we return user data for frontend management.
      return res.status(200).json({ 
        id: user.id, 
        username: user.username, 
        nombre: user.nombre, 
        rol: user.rol 
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
