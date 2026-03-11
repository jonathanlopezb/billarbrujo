import sql from '../src/lib/db.js';

export default async function handler(req, res) {
  const { type } = req.query;

  // CREDITS (Deudores)
  if (type === 'creditos') {
    if (req.method === 'GET') {
      try {
        const c = await sql`SELECT c.*, p.nombre as persona_nombre FROM creditos c LEFT JOIN personas p ON c.id_persona = p.id WHERE c.estado = 'pendiente' OR c.estado = 'vencido' ORDER BY c.fecha_credito DESC`;
        return res.status(200).json(c);
      } catch (e) { return res.status(500).json({ error: e.message }); }
    }
    if (req.method === 'PATCH') {
       const { id_credito, valor_abono, metodo_pago } = req.body;
       try {
           await sql`INSERT INTO pagos_credito (id_credito, valor, metodo_pago) VALUES (${id_credito}, ${valor_abono}, ${metodo_pago})`;
           const [credito] = await sql`SELECT valor FROM creditos WHERE id = ${id_credito}`;
           const pagos = await sql`SELECT sum(valor) as total_pagado FROM pagos_credito WHERE id_credito = ${id_credito}`;
           if (parseFloat(pagos[0].total_pagado || 0) >= parseFloat(credito.valor)) {
               await sql`UPDATE creditos SET estado = 'pagado' WHERE id = ${id_credito}`;
           }
           return res.status(200).json({ ok: true });
       } catch (e) { return res.status(500).json({ error: e.message }); }
    }
  }

  // CAJA (Daily Accounting)
  if (req.method === 'GET' && (!type || type === 'caja')) {
    try {
      const [caja] = await sql`SELECT * FROM caja_diaria WHERE fecha = CURRENT_DATE`;
      return res.status(200).json(caja || { ventas_efectivo: 0, ventas_nequi: 0, creditos_generados: 0, total_dia: 0 });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(405).send('Método no permitido');
}
