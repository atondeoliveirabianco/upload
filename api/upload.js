import { put } from '@vercel/blob';

// DESATIVA O PARSER PADRÃO DA VERCEL PARA ACEITAR ARQUIVOS BINÁRIOS/GIGANTES
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filename = decodeURIComponent(req.headers['x-filename'] || 'file');
    
    // Envia a stream do arquivo diretamente para o Vercel Blob
    const blob = await put(filename, req, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error) {
    console.error('Erro no upload:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar arquivo' });
  }
}
