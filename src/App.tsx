import React, { useState } from 'react';
import SpotifyAuth from './components/SpotifyAuth';
import WrappedDashboard from './components/WrappedDashboard';

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleAuthSuccess = (token: string) => {
    setAccessToken(token);
  };

  return (
    <div className="App">
      {!accessToken ? (
        <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <WrappedDashboard accessToken={accessToken} />
      )}
    </div>
  );
}

export default App;
