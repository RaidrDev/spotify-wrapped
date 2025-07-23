import React, { useEffect, useState } from 'react';

interface SpotifyAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuración de Spotify
  const CLIENT_ID = '1ec9b4491ffe4f2bbdd48597292981a7';
  const REDIRECT_URI = process.env.NODE_ENV === 'production' 
    ? 'https://spotify-wrapped-app.vercel.app'
    : 'http://127.0.0.1:3000';
  const SCOPES = [
    'user-top-read',
    'user-read-recently-played',
    'user-read-private'
  ];

  const handleLogin = () => {
    setIsLoading(true);
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}&show_dialog=true`;
    
    // Redirigir directamente
    window.location.href = authUrl;
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/spotify-token'
        : 'http://localhost:3001/api/spotify-token';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      
      if (response.ok) {
        return data.access_token;
      } else {
        throw new Error(data.error || 'Failed to exchange code for token');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Verificar si hay un código de autorización en la URL (después del login)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        console.error('Spotify Auth Error:', error, errorDescription);
        setError(`${error}: ${errorDescription}`);
        setIsLoading(false);
        return;
      }

      if (code) {
        setIsLoading(true);
        try {
          const accessToken = await exchangeCodeForToken(code);
          window.history.replaceState({}, document.title, window.location.pathname);
          onAuthSuccess(accessToken);
        } catch (error) {
          console.error('Error during authentication:', error);
          setError('Error al obtener el token de acceso');
          setIsLoading(false);
        }
      }
    };

    handleAuthCallback();
  }, [onAuthSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-green via-spotify-green-light to-spotify-green-lighter font-sans">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl max-w-lg w-[90%] animate-fade-in">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto text-spotify-green animate-pulse-slow">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gradient">Spotify Wrapped</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Descubre tu música favorita, artistas top y mucho más con tu Spotify Wrapped personalizado
        </p>
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error de autenticación:</strong> {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700 underline"
            >
              Cerrar
            </button>
          </div>
        )}
        <div className="flex justify-center">
          <button 
            className={`btn-primary ${isLoading ? 'opacity-70' : ''}`}
            onClick={handleLogin}
            disabled={isLoading}
          >
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Conectar con Spotify
            </>
          )}
        </button>
        </div>
        <div className="mt-8 text-left bg-spotify-green/10 p-6 rounded-2xl border-l-4 border-spotify-green">
          <p className="text-gray-800 font-semibold mb-4 text-base">
            Al conectar con Spotify, podrás ver:
          </p>
          <ul className="space-y-2">
            <li className="text-gray-700 text-sm flex items-center gap-2">
              <span className="text-spotify-green font-bold">✓</span>
              🎵 Tus canciones más escuchadas
            </li>
            <li className="text-gray-700 text-sm flex items-center gap-2">
              <span className="text-spotify-green font-bold">✓</span>
              🎤 Tus artistas favoritos
            </li>
            <li className="text-gray-700 text-sm flex items-center gap-2">
              <span className="text-spotify-green font-bold">✓</span>
              📊 Estadísticas de reproducción
            </li>
            <li className="text-gray-700 text-sm flex items-center gap-2">
              <span className="text-spotify-green font-bold">✓</span>
              🎧 Playlists más populares
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpotifyAuth; 