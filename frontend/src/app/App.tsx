import { Route, Routes } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
