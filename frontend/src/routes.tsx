import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TimerConfigPage from './pages/TimerConfigPage';
import Layout from './components/layout/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'config', element: <TimerConfigPage /> },
    ],
  },
]);
