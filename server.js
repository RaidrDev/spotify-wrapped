const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CLIENT_ID = '1ec9b4491ffe4f2bbdd48597292981a7';
const CLIENT_SECRET = 'b343c762659c4e6eb9af620bee36b213';
const REDIRECT_URI = 'http://127.0.0.1:3000';

app.post('/api/spotify-token', async (req, res) => {
  const { code } = req.body;
  
  console.log('Received request with code:', code ? 'present' : 'missing');

  if (!code) {
    console.log('No code provided');
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    console.log('Making request to Spotify API...');
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
    console.log('Spotify API response status:', response.status);
    console.log('Spotify API response:', data);

    if (response.ok) {
      console.log('Token exchange successful');
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
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 