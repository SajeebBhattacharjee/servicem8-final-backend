import axios from 'axios';

let TOKEN_STORE = {}; // same temp store

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { jobUUID, imageBase64 } = req.body;

  if (!jobUUID || !imageBase64) {
    return res.status(400).json({ error: 'Missing jobUUID or image' });
  }

  const tokenData = TOKEN_STORE['default'];

  if (!tokenData) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const buffer = Buffer.from(
      imageBase64.replace(/^data:image\/png;base64,/, ''),
      'base64'
    );

    await axios.post(
      `https://api.servicem8.com/api_1.0/jobattachment.json`,
      buffer,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'image/png',
          'x-job-uuid': jobUUID,
          'x-filename': 'signature.png'
        }
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
}
