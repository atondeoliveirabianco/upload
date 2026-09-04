import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      // Força a leitura do token de ambiente do servidor
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/quicktime', 'video/webm'
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // Limite de 500MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload concluído no Blob:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Erro de autenticação no Blob:', error);
    return res.status(500).json({ error: error.message });
  }
}