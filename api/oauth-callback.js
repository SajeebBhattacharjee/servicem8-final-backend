import axios from 'axios';

let TOKEN_STORE = {}; // TEMP storage (replace with DB later)

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const response = await axios.post(
      'https://go.servicem8.com/oauth/access_token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.SERVICEM8_APP_ID,
        client_secret: process.env.SERVICEM8_APP_SECRET,
        code,
        redirect_uri: `${process.env.BASE_URL}/api/oauth-callback`
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const tokens = response.data;

    // ⚠️ TEMP: store tokens in memory
    TOKEN_STORE['default'] = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000
    };

    res.send(`
      <h2>ServiceM8 Connected Successfully ✅</h2>
      <p>You can now close this window.</p>
    `);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('OAuth failed');
  }
}
