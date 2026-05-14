import { BrowserRouter } from 'react-router-dom';

import './styles/globals.css';
import './styles/animations.css';
import './styles/background.css';
import './styles/auth.css';

import { AuthProvider } from './auth/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
