import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

interface TopArtistsProps {
  spotifyApi: SpotifyWebApi;
}

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  genres: string[];
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

const TopArtists: React.FC<TopArtistsProps> = ({ spotifyApi }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopArtists = async () => {
      setIsLoading(true);
      try {
        const response = await spotifyApi.getMyTopArtists({ 
          limit: 20, 
          time_range: timeRange 
        });
        setArtists(response.body.items);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopArtists();
  }, [spotifyApi, timeRange]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="loading-spinner"></div>
        <p className="text-spotify-gray text-lg">Cargando tus artistas favoritos...</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4 text-gradient">🎤 Tus Artistas Favoritos</h2>
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            className={`px-4 py-2 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
              timeRange === 'short_term' 
                ? 'bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-spotify-green' 
                : 'bg-transparent text-spotify-gray border-white/20 hover:bg-spotify-green/10 hover:text-white hover:border-spotify-green'
            }`}
            onClick={() => setTimeRange('short_term')}
          >
            Últimas 4 semanas
          </button>
          <button
            className={`px-4 py-2 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
              timeRange === 'medium_term' 
                ? 'bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-spotify-green' 
                : 'bg-transparent text-spotify-gray border-white/20 hover:bg-spotify-green/10 hover:text-white hover:border-spotify-green'
            }`}
            onClick={() => setTimeRange('medium_term')}
          >
            Últimos 6 meses
          </button>
          <button
            className={`px-4 py-2 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
              timeRange === 'long_term' 
                ? 'bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-spotify-green' 
                : 'bg-transparent text-spotify-gray border-white/20 hover:bg-spotify-green/10 hover:text-white hover:border-spotify-green'
            }`}
            onClick={() => setTimeRange('long_term')}
          >
            Todo el tiempo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist, index) => (
          <div key={artist.id} className="card-glass p-4 relative flex items-center gap-3">
            <div className="absolute top-2 right-2 bg-gradient-to-r from-spotify-green to-spotify-green-light text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              #{index + 1}
            </div>
            <div className="flex-shrink-0">
              <img 
                src={artist.images[0]?.url || '/default-artist.png'} 
                alt={artist.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-spotify-green"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold mb-2 text-white truncate">{artist.name}</h3>
              <div className="mb-2">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-gradient-to-r from-spotify-green to-spotify-green-light rounded-full transition-all duration-300"
                    style={{ width: `${artist.popularity}%` }}
                  ></div>
                </div>
                <span className="text-xs text-spotify-gray">{artist.popularity}% popularidad</span>
              </div>
              {artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {artist.genres.slice(0, 3).map((genre, idx) => (
                    <span key={idx} className="bg-spotify-green/20 text-spotify-green px-2 py-1 rounded-full text-xs font-medium border border-spotify-green/30">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <a 
              href={artist.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-spotify-green to-spotify-green-light rounded-full flex items-center justify-center text-white no-underline transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-spotify-green/30"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </a>
          </div>
        ))}
      </div>

      {artists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎤</div>
          <h3 className="text-2xl font-bold mb-4 text-white">No hay datos disponibles</h3>
          <p className="text-spotify-gray text-lg">Parece que no tienes suficientes datos de reproducción para mostrar tus artistas favoritos.</p>
        </div>
      )}
    </div>
  );
};

export default TopArtists; 