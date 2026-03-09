import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const productos = await sql`SELECT * FROM productos ORDER BY nombre`;
      return res.status(200).json(productos);
    } catch (e) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  if (req.method === 'POST') {
    const { nombre, precio, categoria, stock } = req.body;
    try {
      const [nuevo] = await sql`
        INSERT INTO productos (nombre, precio, categoria, stock)
        VALUES (${nombre}, ${precio}, ${categoria || 'bebida'}, ${stock || 0})
        RETURNING *
      `;
      return res.status(201).json(nuevo);
    } catch (e) {
      return res.status(500).json({ error: 'Error al crear producto' });
    }
  }

  if (req.method === 'PATCH') {
    const { id, nombre, precio, categoria, stock } = req.body;
    try {
      const [actualizado] = await sql`
        UPDATE productos 
        SET nombre = ${nombre}, precio = ${precio}, categoria = ${categoria}, stock = ${stock}
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json(actualizado);
    } catch (e) {
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await sql`DELETE FROM productos WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }

  return res.status(405).send('Método no permitido');
}
