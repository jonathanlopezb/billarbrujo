import { GetListByKeyword } from 'youtube-search-api';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda q' });
  }

  try {
    const results = await GetListByKeyword(q, false, 10);
    // Transform results to match the frontend expectations
    const formattedResults = results.items.map(item => ({
      id: item.id,
      title: item.title,
      artist: item.channelTitle || 'Desconocido',
      thumbnail: item.thumbnail?.thumbnails?.[0]?.url
    }));
    
    return res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error en búsqueda de YouTube:', error);
    return res.status(500).json({ error: 'Error al buscar en YouTube' });
  }
}
