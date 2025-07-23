import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

interface RecentlyPlayedProps {
  spotifyApi: SpotifyWebApi;
}

interface RecentTrack {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    external_urls: {
      spotify: string;
    };
  };
  played_at: string;
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ spotifyApi }) => {
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      setIsLoading(true);
      try {
        const response = await spotifyApi.getMyRecentlyPlayedTracks({ 
          limit: 50 
        });
        setRecentTracks(response.body.items);
      } catch (error) {
        console.error('Error fetching recently played tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, [spotifyApi]);

  const formatPlayedAt = (playedAt: string) => {
    const date = new Date(playedAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="loading-spinner"></div>
        <p className="text-spotify-gray text-lg">Cargando tu actividad reciente...</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4 text-gradient">🕒 Reproducido Recientemente</h2>
        <p className="text-spotify-gray text-lg">Tu actividad musical más reciente</p>
      </div>

      <div className="flex flex-col gap-4">
        {recentTracks.map((item, index) => (
          <div key={`${item.track.id}-${index}`} className="card-glass p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 relative">
            <div className="absolute top-2 right-2 bg-gradient-to-r from-spotify-green to-spotify-green-light text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              #{index + 1}
            </div>
            <div className="flex-shrink-0">
              <img 
                src={item.track.album.images[0]?.url || '/default-album.png'} 
                alt={item.track.album.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold mb-1 text-white truncate">{item.track.name}</h3>
              <p className="text-spotify-gray text-sm mb-1 truncate">
                {item.track.artists.map(artist => artist.name).join(', ')}
              </p>
              <p className="text-spotify-gray-dark text-xs truncate">{item.track.album.name}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-shrink-0 text-center sm:text-right">
                <span className="bg-spotify-green/20 text-spotify-green px-2 py-1 rounded-full text-xs font-medium border border-spotify-green/30 whitespace-nowrap">
                  {formatPlayedAt(item.played_at)}
                </span>
              </div>
              <a 
                href={item.track.external_urls.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-spotify-green to-spotify-green-light rounded-full flex items-center justify-center text-white no-underline transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-spotify-green/30"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {recentTracks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🕒</div>
          <h3 className="text-2xl font-bold mb-4 text-white">No hay actividad reciente</h3>
          <p className="text-spotify-gray text-lg">Parece que no tienes actividad de reproducción reciente para mostrar.</p>
        </div>
      )}
    </div>
  );
};

export default RecentlyPlayed; 