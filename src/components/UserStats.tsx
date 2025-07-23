import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

interface UserStatsProps {
  spotifyApi: SpotifyWebApi;
}

interface Stats {
  topTracks: any[];
  topArtists: any[];
  totalTracks: number;
  totalArtists: number;
  averagePopularity: number;
  topGenres: { [key: string]: number };
  timeRanges: {
    short_term: { tracks: any[], artists: any[] };
    medium_term: { tracks: any[], artists: any[] };
    long_term: { tracks: any[], artists: any[] };
  };
}

const UserStats: React.FC<UserStatsProps> = ({ spotifyApi }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Obtener datos para diferentes rangos de tiempo
        const [shortTermTracks, mediumTermTracks, longTermTracks] = await Promise.all([
          spotifyApi.getMyTopTracks({ limit: 50, time_range: 'short_term' }),
          spotifyApi.getMyTopTracks({ limit: 50, time_range: 'medium_term' }),
          spotifyApi.getMyTopTracks({ limit: 50, time_range: 'long_term' })
        ]);

        const [shortTermArtists, mediumTermArtists, longTermArtists] = await Promise.all([
          spotifyApi.getMyTopArtists({ limit: 50, time_range: 'short_term' }),
          spotifyApi.getMyTopArtists({ limit: 50, time_range: 'medium_term' }),
          spotifyApi.getMyTopArtists({ limit: 50, time_range: 'long_term' })
        ]);

        // Calcular estadísticas
        const allTracks = longTermTracks.body.items;
        const allArtists = longTermArtists.body.items;
        
        // Calcular géneros más populares
        const genreCount: { [key: string]: number } = {};
        allArtists.forEach(artist => {
          artist.genres.forEach((genre: string) => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        });

        // Ordenar géneros por frecuencia
        const topGenres = Object.entries(genreCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {} as { [key: string]: number });

        // Calcular popularidad promedio
        const totalPopularity = allArtists.reduce((sum, artist) => sum + artist.popularity, 0);
        const averagePopularity = Math.round(totalPopularity / allArtists.length);

        setStats({
          topTracks: allTracks.slice(0, 10),
          topArtists: allArtists.slice(0, 10),
          totalTracks: allTracks.length,
          totalArtists: allArtists.length,
          averagePopularity,
          topGenres,
          timeRanges: {
            short_term: { 
              tracks: shortTermTracks.body.items, 
              artists: shortTermArtists.body.items 
            },
            medium_term: { 
              tracks: mediumTermTracks.body.items, 
              artists: mediumTermArtists.body.items 
            },
            long_term: { 
              tracks: longTermTracks.body.items, 
              artists: longTermArtists.body.items 
            }
          }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [spotifyApi]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="loading-spinner"></div>
        <p className="text-spotify-gray text-lg">Calculando tus estadísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold mb-4 text-white">No hay datos disponibles</h3>
        <p className="text-spotify-gray text-lg">No se pudieron cargar las estadísticas.</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4 text-gradient">📊 Tus Estadísticas Musicales</h2>
        <p className="text-spotify-gray text-lg">Análisis detallado de tu actividad en Spotify</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
        <div className="card-glass p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">🎵</div>
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 sm:mb-4 text-spotify-gray">Total de Canciones</h3>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-gradient">{stats.totalTracks}</div>
          <p className="text-xs sm:text-sm text-spotify-gray-dark">canciones en tu top</p>
        </div>

        <div className="card-glass p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">🎤</div>
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 sm:mb-4 text-spotify-gray">Total de Artistas</h3>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-gradient">{stats.totalArtists}</div>
          <p className="text-xs sm:text-sm text-spotify-gray-dark">artistas favoritos</p>
        </div>

        <div className="card-glass p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">⭐</div>
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 sm:mb-4 text-spotify-gray">Popularidad Promedio</h3>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-gradient">{stats.averagePopularity}%</div>
          <p className="text-xs sm:text-sm text-spotify-gray-dark">de tus artistas</p>
        </div>

        <div className="card-glass p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">🎧</div>
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 sm:mb-4 text-spotify-gray">Géneros Favoritos</h3>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-gradient">{Object.keys(stats.topGenres).length}</div>
          <p className="text-xs sm:text-sm text-spotify-gray-dark">diferentes géneros</p>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-gradient">🎼 Tus Géneros Favoritos</h3>
        <div className="flex flex-col gap-3 sm:gap-4">
          {Object.entries(stats.topGenres).map(([genre, count], index) => (
            <div key={genre} className="card-glass p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-spotify-green to-spotify-green-light text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold flex-shrink-0">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base sm:text-xl font-semibold text-white capitalize truncate">{genre}</div>
              </div>
              <div className="text-spotify-gray text-xs sm:text-sm mr-2 sm:mr-4 flex-shrink-0">
                {count} artista{count > 1 ? 's' : ''}
              </div>
              <div className="w-20 sm:w-32 lg:w-40 h-2 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                <div 
                  className="h-full bg-gradient-to-r from-spotify-green to-spotify-green-light rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(count / Math.max(...Object.values(stats.topGenres))) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-gradient">📈 Comparación por Períodos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="card-glass p-4 sm:p-6 lg:p-8">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-white text-center">Últimas 4 Semanas</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
                <span className="text-xs sm:text-sm text-spotify-gray">Canciones:</span>
                <span className="text-lg sm:text-xl font-bold text-spotify-green">{stats.timeRanges.short_term.tracks.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
                <span className="text-xs sm:text-sm text-spotify-gray">Artistas:</span>
                <span className="text-lg sm:text-xl font-bold text-spotify-green">{stats.timeRanges.short_term.artists.length}</span>
              </div>
            </div>
          </div>

          <div className="card-glass p-4 sm:p-6 lg:p-8">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-white text-center">Últimos 6 Meses</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
                <span className="text-xs sm:text-sm text-spotify-gray">Canciones:</span>
                <span className="text-lg sm:text-xl font-bold text-spotify-green">{stats.timeRanges.medium_term.tracks.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
                <span className="text-xs sm:text-sm text-spotify-gray">Artistas:</span>
                <span className="text-lg sm:text-xl font-bold text-spotify-green">{stats.timeRanges.medium_term.artists.length}</span>
              </div>
            </div>
          </div>

          <div className="card-glass p-4 sm:p-6 lg:p-8">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-white text-center">Todo el Tiempo</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
                <span className="text-xs sm:text-sm text-spotify-gray">Canciones:</span>
                <span className="text-lg sm:text-xl font-bold text-spotify-green">{stats.timeRanges.long_term.tracks.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
                <span className="text-xs sm:text-sm text-spotify-gray">Artistas:</span>
                <span className="text-lg sm:text-xl font-bold text-spotify-green">{stats.timeRanges.long_term.artists.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats; 