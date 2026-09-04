import { list } from '@vercel/blob';

export default async function handler(req, res) {
  const { blobs } = await list();
  return res.status(200).json(blobs);
}