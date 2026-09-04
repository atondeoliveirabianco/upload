import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/quicktime', 'video/webm'
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // Limite de 500 MB por vídeo
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload concluído com sucesso:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Erro na autenticação de upload:', error);
    return res.status(400).json({ error: error.message });
  }
}