import { useEffect, useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import Home from './screens/Home';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <Home/>;
}