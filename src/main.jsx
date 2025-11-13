import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import CreateGame from './pages/CreateGame';
import GamePage from './pages/GamePage';
import 'antd/dist/reset.css';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <ConfigProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);
