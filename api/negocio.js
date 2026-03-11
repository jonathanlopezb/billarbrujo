import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  const { type } = req.query;

  // PRODUCTS (Default if no type)
  if (!type || type === 'products') {
    if (req.method === 'GET') {
      try {
        const prod = await sql`SELECT * FROM productos WHERE activo = true ORDER BY nombre ASC`;
        return res.status(200).json(prod);
      } catch (e) { return res.status(500).json({ error: 'Error prod' }); }
    }
    if (req.method === 'POST') {
      const { nombre, precio, categoria, stock } = req.body;
      try {
        const [p] = await sql`INSERT INTO productos (nombre, precio, categoria, stock) VALUES (${nombre}, ${precio}, ${categoria}, ${stock || 0}) RETURNING *`;
        return res.status(201).json(p);
      } catch (e) { return res.status(500).json({ error: 'Error create prod' }); }
    }
    if (req.method === 'PATCH') {
      const { id, nombre, precio, categoria, stock } = req.body;
      try {
        const [p] = await sql`UPDATE productos SET nombre=${nombre}, precio=${precio}, categoria=${categoria}, stock=${stock} WHERE id=${id} RETURNING *`;
        return res.status(200).json(p);
      } catch (e) { return res.status(500).json({ error: 'Error update prod' }); }
    }
    if (req.method === 'DELETE') {
      const { id } = req.query;
      try {
        await sql`UPDATE productos SET activo = false WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      } catch (e) { return res.status(500).json({ error: 'Error delete prod' }); }
    }
  }

  // PERSONAS
  if (type === 'personas') {
    if (req.method === 'GET') {
      try {
        const p = await sql`SELECT * FROM personas WHERE activo = true ORDER BY nombre ASC`;
        return res.status(200).json(p);
      } catch (e) { return res.status(500).json({ error: 'Error personas' }); }
    }
    if (req.method === 'POST') {
      const { nombre, telefono } = req.body;
      try {
        const [p] = await sql`INSERT INTO personas (nombre, telefono) VALUES (${nombre}, ${telefono}) RETURNING *`;
        return res.status(201).json(p);
      } catch (e) { return res.status(500).json({ error: 'Error create persona' }); }
    }
  }

  return res.status(405).send('Método no permitido');
}
