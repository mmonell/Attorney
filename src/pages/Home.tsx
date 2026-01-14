import React from 'react';
    import DecisionTunnel from '../components/DecisionTunnel';
    import Dashboard from './Dashboard';

    export default function Home() {
      const [isLoggedIn, setIsLoggedIn] = React.useState(false);

      React.useEffect(() => {
        try {
          const raw = localStorage.getItem('defense_user');
          setIsLoggedIn(Boolean(raw));
        } catch (err) {
          setIsLoggedIn(false);
        }
      }, []);

      return isLoggedIn ? <Dashboard /> : <DecisionTunnel />;
    }