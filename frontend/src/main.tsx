import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './styles/globals.css';
import { ThemeProvider } from './context/ThemeContext';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster position="top-right" richColors />
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
