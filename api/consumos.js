import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id_partida, tipo_consumo, id_persona, id_pareja, id_producto, cantidad, precio_unitario } = req.body;
    try {
      const total = cantidad * precio_unitario;
      const [c] = await sql`
        INSERT INTO consumos (id_partida, tipo_consumo, id_persona, id_pareja, id_producto, cantidad, precio_unitario, total)
        VALUES (
          ${id_partida || null}, 
          ${tipo_consumo || 'directo'}, 
          ${id_persona || null}, 
          ${id_pareja || null}, 
          ${id_producto}, 
          ${cantidad}, 
          ${precio_unitario}, 
          ${total}
        )
        RETURNING *`;
        
      // Ensure inventory exists or insert 0
      const [inv] = await sql`SELECT * FROM inventario WHERE id_producto = ${id_producto}`;
      if(!inv) {
         await sql`INSERT INTO inventario (id_producto, stock_actual) VALUES (${id_producto}, 0)`;
      }
      
      await sql`
        UPDATE inventario 
        SET stock_actual = stock_actual - ${cantidad} 
        WHERE id_producto = ${id_producto}
      `;
      
      return res.status(201).json(c);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al registrar consumo' });
    }
  }

  if (req.method === 'GET') {
    const { id_partida } = req.query;
    try {
      // Get consumos for a match joined with products
      if (id_partida) {
        const data = await sql`
          SELECT c.*, p.nombre as producto_nombre 
          FROM consumos c 
          JOIN productos p ON c.id_producto = p.id
          WHERE c.id_partida = ${id_partida}
        `;
        return res.status(200).json(data);
      }
      return res.status(200).json([]);
    } catch(e) {
      console.error(e);
      return res.status(500).json({ error: 'Error' });
    }
  }

  return res.status(405).send('Método no permitido');
}
