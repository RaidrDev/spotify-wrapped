export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const CLIENT_ID = '1ec9b4491ffe4f2bbdd48597292981a7';
  const CLIENT_SECRET = 'b343c762659c4e6eb9af620bee36b213';
  const REDIRECT_URI = 'https://spotify-wrapped-app.vercel.app';

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ access_token: data.access_token });
    } else {
      console.error('Spotify API error:', data);
      return res.status(response.status).json({ 
        error: data.error_description || 'Failed to exchange code for token',
        details: data
      });
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 