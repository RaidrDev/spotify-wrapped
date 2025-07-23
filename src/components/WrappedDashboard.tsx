import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import RecentlyPlayed from './RecentlyPlayed';
import UserStats from './UserStats';

interface WrappedDashboardProps {
  accessToken: string;
}

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
}

const WrappedDashboard: React.FC<WrappedDashboardProps> = ({ accessToken }) => {
  const [spotifyApi] = useState(() => new SpotifyWebApi({ accessToken }));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await spotifyApi.getMe();
        setUserProfile(profile.body as UserProfile);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [spotifyApi]);

  const sections = [
    { id: 'overview', name: 'Resumen', icon: '📊' },
    { id: 'tracks', name: 'Top Canciones', icon: '🎵' },
    { id: 'artists', name: 'Top Artistas', icon: '🎤' },
    { id: 'recent', name: 'Reproducido Recientemente', icon: '🕒' },
    { id: 'stats', name: 'Estadísticas', icon: '📈' }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="loading-spinner"></div>
        <p className="text-spotify-gray text-lg">Cargando tu Spotify Wrapped...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-dark via-spotify-dark-light to-spotify-dark text-white font-sans">
      <header className="bg-spotify-green/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/10">
        <div className="flex items-center gap-3 sm:gap-4">
          {userProfile?.images?.[0] ? (
            <img 
              src={userProfile.images[0].url} 
              alt={userProfile.display_name}
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-spotify-green object-cover"
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-spotify-green/20 border-2 border-spotify-green flex items-center justify-center">
              <span className="text-spotify-green text-lg sm:text-xl lg:text-2xl font-bold">
                {userProfile?.display_name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient">¡Hola, {userProfile?.display_name}!</h1>
            <p className="text-spotify-gray text-sm sm:text-base">Tu Spotify Wrapped personalizado</p>
          </div>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 text-spotify-green">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
      </header>

      <nav className="flex justify-center gap-2 sm:gap-4 p-2 sm:p-4 bg-black/30 border-b border-white/10 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full border font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
              activeSection === section.id 
                ? 'bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-spotify-green' 
                : 'bg-transparent text-spotify-gray border-white/20 hover:bg-spotify-green/10 hover:text-white hover:border-spotify-green'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="text-sm sm:text-lg">{section.icon}</span>
            <span className="hidden sm:inline">{section.name}</span>
          </button>
        ))}
      </nav>

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeSection === 'overview' && (
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-gradient">Tu Resumen Musical</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
              <div className="card-glass p-4 sm:p-6 lg:p-8 text-center cursor-pointer">
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">🎵</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-4 text-white">Top Canciones</h3>
                <p className="text-spotify-gray mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">Descubre tus canciones más escuchadas</p>
                <button 
                  onClick={() => setActiveSection('tracks')}
                  className="bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-none rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-spotify-green/30"
                >
                  Ver Canciones
                </button>
              </div>
              <div className="card-glass p-8 text-center cursor-pointer">
                <div className="text-5xl mb-4">🎤</div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Top Artistas</h3>
                <p className="text-spotify-gray mb-6 leading-relaxed">Conoce tus artistas favoritos</p>
                <button 
                  onClick={() => setActiveSection('artists')}
                  className="bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-none rounded-full px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-spotify-green/30"
                >
                  Ver Artistas
                </button>
              </div>
              <div className="card-glass p-8 text-center cursor-pointer">
                <div className="text-5xl mb-4">🕒</div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Reproducido Recientemente</h3>
                <p className="text-spotify-gray mb-6 leading-relaxed">Tu actividad musical reciente</p>
                <button 
                  onClick={() => setActiveSection('recent')}
                  className="bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-none rounded-full px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-spotify-green/30"
                >
                  Ver Reciente
                </button>
              </div>
              <div className="card-glass p-8 text-center cursor-pointer">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Estadísticas</h3>
                <p className="text-spotify-gray mb-6 leading-relaxed">Análisis detallado de tu música</p>
                <button 
                  onClick={() => setActiveSection('stats')}
                  className="bg-gradient-to-r from-spotify-green to-spotify-green-light text-white border-none rounded-full px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-spotify-green/30"
                >
                  Ver Estadísticas
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tracks' && (
          <TopTracks spotifyApi={spotifyApi} />
        )}

        {activeSection === 'artists' && (
          <TopArtists spotifyApi={spotifyApi} />
        )}

        {activeSection === 'recent' && (
          <RecentlyPlayed spotifyApi={spotifyApi} />
        )}

        {activeSection === 'stats' && (
          <UserStats spotifyApi={spotifyApi} />
        )}
      </main>
    </div>
  );
};

export default WrappedDashboard; 