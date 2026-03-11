import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const creditos = await sql`
        SELECT c.*, p.nombre as persona_nombre 
        FROM creditos c
        LEFT JOIN personas p ON c.id_persona = p.id
        WHERE c.estado = 'pendiente' OR c.estado = 'vencido'
        ORDER BY c.fecha_credito DESC
      `;
      return res.status(200).json(creditos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener creditos' });
    }
  }

  if (req.method === 'POST') {
    const { id_persona, valor, observaciones } = req.body;
    try {
      let f_limite = new Date();
      f_limite.setDate(f_limite.getDate() + 7); // Default 1 week
      
      const [c] = await sql`
        INSERT INTO creditos (id_persona, valor, fecha_limite, estado, observaciones)
        VALUES (${id_persona}, ${valor}, ${f_limite}, 'pendiente', ${observaciones})
        RETURNING *
      `;
      return res.status(201).json(c);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al crear credito' });
    }
  }
  
  if (req.method === 'PATCH') {
    const { id_credito, valor_abono, metodo_pago } = req.body;
    try {
        await sql`
            INSERT INTO pagos_credito (id_credito, valor, metodo_pago)
            VALUES (${id_credito}, ${valor_abono}, ${metodo_pago})
        `;
        // Check remaining balance
        const [credito] = await sql`SELECT valor FROM creditos WHERE id = ${id_credito}`;
        const pagos = await sql`SELECT sum(valor) as total_pagado FROM pagos_credito WHERE id_credito = ${id_credito}`;
        
        const total = parseFloat(credito.valor);
        const pagado = parseFloat(pagos[0].total_pagado || 0);
        
        if (pagado >= total) {
            await sql`UPDATE creditos SET estado = 'pagado' WHERE id = ${id_credito}`;
        }
        return res.status(200).json({ ok: true, saldoReflejado: total - pagado });
    } catch(e) {
        console.error(e);
        return res.status(500).json({ error: 'Error pagando credito' });
    }
  }

  return res.status(405).send('Método no permitido');
}
