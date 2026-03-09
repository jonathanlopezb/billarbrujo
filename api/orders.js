import sql from '../src/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { partidaId, clienteNombre, items, usuarioId } = req.body;
    try {
      // items logic: [{productoId, cantidad, precioUnitario}]
      const total = items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
      
      const [pedido] = await sql`
        INSERT INTO pedidos (partida_id, cliente_nombre, usuario_id, total, estado)
        VALUES (${partidaId || null}, ${clienteNombre || null}, ${usuarioId || null}, ${total}, 'pagado')
        RETURNING *
      `;

      for (const item of items) {
        await sql`
          INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
          VALUES (${pedido.id}, ${item.productoId}, ${item.cantidad}, ${item.precioUnitario})
        `;
        
        // Update stock
        await sql`
          UPDATE productos SET stock = stock - ${item.cantidad} WHERE id = ${item.productoId}
        `;
      }

      return res.status(201).json(pedido);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al procesar pedido' });
    }
  }

  if (req.method === 'GET') {
    // Get orders for a specific match or all orders
    const { partidaId } = req.query;
    try {
      if (partidaId) {
        const ordenes = await sql`
          SELECT p.*, ui.nombre as mesero
          FROM pedidos p
          LEFT JOIN usuarios ui ON p.usuario_id = ui.id
          WHERE p.partida_id = ${partidaId}
        `;
        return res.status(200).json(ordenes);
      } else {
        const ordenes = await sql`SELECT * FROM pedidos ORDER BY creado_at DESC LIMIT 50`;
        return res.status(200).json(ordenes);
      }
    } catch (e) {
      return res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  }

  return res.status(405).send('Método no permitido');
}
